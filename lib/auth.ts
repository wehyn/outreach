import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDatabase, withTransaction } from "./db";
import { DEMO_WORKSPACE_ID, ensureDemoLeads } from "./leads/demo-repository";

export const SESSION_COOKIE_NAME = "outreach_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

type UserRow = {
  email: string;
  id: string;
  name: string;
  password_hash: string;
};

type SessionRow = {
  email: string;
  expires_at: string;
  session_id: string;
  user_id: string;
  user_name: string;
  workspace_id: string;
  workspace_name: string;
};

export type AuthIdentity = {
  email: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
};

export type AuthSession = AuthIdentity & {
  expiresAt: string;
  sessionId: string;
};

export type WorkspaceContext = {
  email: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
};

function configuredCredentials() {
  const email = process.env.OUTREACH_AUTH_EMAIL?.trim().toLowerCase();
  const password = process.env.OUTREACH_AUTH_PASSWORD;

  if (!email || !password || password.length < 12) {
    return null;
  }

  return {
    email,
    name: process.env.OUTREACH_AUTH_NAME?.trim() || email.split("@", 1)[0] || "Workspace owner",
    password,
  };
}

export function isAuthConfigured() {
  return configuredCredentials() !== null;
}

export function hasRegisteredUser() {
  const database = getDatabase();
  const row = database.prepare("SELECT 1 AS registered FROM users LIMIT 1").get() as
    | { registered: number }
    | undefined;

  return row?.registered === 1;
}

function hashPassword(password: string, salt: string) {
  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH, {
    maxmem: 32 * 1024 * 1024,
    N: 16_384,
    p: 1,
    r: 8,
  });

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function createPasswordHash(password: string) {
  return hashPassword(password, randomBytes(PASSWORD_SALT_LENGTH).toString("hex"));
}

function verifyPassword(password: string, encodedHash: string) {
  const [, salt, encodedKey] = encodedHash.split("$");

  if (!salt || !encodedKey) {
    return false;
  }

  const expectedKey = Buffer.from(encodedKey, "hex");
  const actualKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH, {
    maxmem: 32 * 1024 * 1024,
    N: 16_384,
    p: 1,
    r: 8,
  });

  return expectedKey.length === actualKey.length && timingSafeEqual(expectedKey, actualKey);
}

function matchesConfiguredPassword(password: string, configuredPassword: string) {
  const actualPassword = Buffer.from(password);
  const expectedPassword = Buffer.from(configuredPassword);

  return actualPassword.length === expectedPassword.length && timingSafeEqual(actualPassword, expectedPassword);
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function identityForUser(user: UserRow): AuthIdentity | null {
  const database = getDatabase();
  const workspace = database
    .prepare(
      `SELECT w.id, w.name
       FROM workspace_members wm
       JOIN workspaces w ON w.id = wm.workspace_id
       WHERE wm.user_id = ?
       ORDER BY wm.created_at ASC, w.id ASC
       LIMIT 1`,
    )
    .get(user.id) as { id: string; name: string } | undefined;

  if (!workspace) {
    return null;
  }

  return {
    email: user.email,
    userId: user.id,
    userName: user.name,
    workspaceId: workspace.id,
    workspaceName: workspace.name,
  };
}

function getUserByEmail(email: string) {
  return getDatabase()
    .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
    .get(email) as UserRow | undefined;
}

function createFirstUser(email: string, name: string, password: string) {
  let userId: string | null = null;

  withTransaction((database) => {
    const existingUser = database.prepare("SELECT 1 AS registered FROM users LIMIT 1").get();

    if (existingUser) {
      return;
    }

    userId = `user-${randomUUID()}`;
    database
      .prepare("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(userId, email, name, createPasswordHash(password), new Date().toISOString());
    database
      .prepare(
        `INSERT INTO workspace_members (workspace_id, user_id, role, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(DEMO_WORKSPACE_ID, userId, "owner", new Date().toISOString());
  });

  return userId ? getUserByEmail(email) : null;
}

export function registerCredentials(email: string, password: string, name: string): AuthIdentity | null {
  ensureDemoLeads();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const user = createFirstUser(normalizedEmail, normalizedName, password);

  return user ? identityForUser(user) : null;
}

export function authenticateCredentials(email: string, password: string): AuthIdentity | null {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUserByEmail(normalizedEmail);

  if (user) {
    const identity = identityForUser(user);

    return identity && verifyPassword(password, user.password_hash) ? identity : null;
  }

  const credentials = configuredCredentials();

  if (!credentials || credentials.email !== normalizedEmail || !matchesConfiguredPassword(password, credentials.password)) {
    return null;
  }

  ensureDemoLeads();
  const configuredUser = createFirstUser(credentials.email, credentials.name, credentials.password);

  if (configuredUser) {
    return identityForUser(configuredUser);
  }

  const racedUser = getUserByEmail(normalizedEmail);
  const identity = racedUser ? identityForUser(racedUser) : null;

  return identity && racedUser && verifyPassword(password, racedUser.password_hash) ? identity : null;
}

export function createSession(identity: AuthIdentity) {
  const token = randomBytes(32).toString("base64url");
  const sessionId = `session-${randomUUID()}`;
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  withTransaction((database) => {
    database
      .prepare(
        `INSERT INTO sessions (id, user_id, workspace_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        sessionId,
        identity.userId,
        identity.workspaceId,
        hashSessionToken(token),
        expiresAt,
        new Date().toISOString(),
      );
  });

  return {
    session: {
      ...identity,
      expiresAt,
      sessionId,
    },
    token,
  };
}

export function getSessionFromToken(token: string): AuthSession | null {
  if (!token) {
    return null;
  }

  const database = getDatabase();
  const now = new Date().toISOString();
  database.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
  const row = database
    .prepare(
      `SELECT
         s.id AS session_id,
         s.expires_at,
         u.id AS user_id,
         u.email,
         u.name AS user_name,
         w.id AS workspace_id,
         w.name AS workspace_name
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN workspace_members wm ON wm.user_id = s.user_id AND wm.workspace_id = s.workspace_id
       JOIN workspaces w ON w.id = s.workspace_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(hashSessionToken(token), now) as SessionRow | undefined;

  if (!row) {
    return null;
  }

  return {
    email: row.email,
    expiresAt: row.expires_at,
    sessionId: row.session_id,
    userId: row.user_id,
    userName: row.user_name,
    workspaceId: row.workspace_id,
    workspaceName: row.workspace_name,
  };
}

function cookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");

    if (separator < 0 || cookie.slice(0, separator).trim() !== name) {
      continue;
    }

    const value = cookie.slice(separator + 1).trim();

    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  return null;
}

async function tokenFromRequest(request?: Request) {
  if (request) {
    return cookieValue(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  }

  return (await cookies()).get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function getSession(request?: Request) {
  const token = await tokenFromRequest(request);
  return token ? getSessionFromToken(token) : null;
}

export async function getWorkspaceContext(request?: Request): Promise<WorkspaceContext | null> {
  const session = await getSession(request);

  if (!session) {
    return null;
  }

  return {
    email: session.email,
    userId: session.userId,
    userName: session.userName,
    workspaceId: session.workspaceId,
    workspaceName: session.workspaceName,
  };
}

export async function requireWorkspace() {
  const workspace = await getWorkspaceContext();

  if (!workspace) {
    redirect("/login");
  }

  return workspace;
}

export async function revokeSession(request?: Request) {
  const token = await tokenFromRequest(request);

  if (!token) {
    return;
  }

  getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashSessionToken(token));
}

function sessionCookie(token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function setSessionCookie(response: Response, token: string) {
  response.headers.set("Set-Cookie", sessionCookie(token, SESSION_MAX_AGE_SECONDS));
}

export function clearSessionCookie(response: Response) {
  response.headers.set("Set-Cookie", sessionCookie("", 0));
}
