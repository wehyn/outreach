import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPersistence } from "./persistence";
import { DEMO_WORKSPACE_ID } from "./workspace";
import type { StoredUser } from "./persistence";

export const SESSION_COOKIE_NAME = "outreach_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_SALT_LENGTH = 16;

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

export async function hasRegisteredUser() {
  return getPersistence().auth.hasRegisteredUser();
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

async function identityForUser(user: StoredUser): Promise<AuthIdentity | null> {
  const workspace = await getPersistence().auth.getWorkspaceForUser(user.id);

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

async function getUserByEmail(email: string) {
  return getPersistence().auth.getUserByEmail(email);
}

async function createFirstUser(email: string, name: string, password: string) {
  const userId = `user-${randomUUID()}`;
  const createdAt = new Date().toISOString();

  return getPersistence().auth.createFirstUser({
    createdAt,
    email,
    id: userId,
    name,
    passwordHash: createPasswordHash(password),
    workspaceId: DEMO_WORKSPACE_ID,
  });
}

export async function registerCredentials(email: string, password: string, name: string): Promise<AuthIdentity | null> {
  await getPersistence().leads.ensureDemoLeads();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const user = await createFirstUser(normalizedEmail, normalizedName, password);

  return user ? await identityForUser(user) : null;
}

export async function authenticateCredentials(email: string, password: string): Promise<AuthIdentity | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);

  if (user) {
    const identity = await identityForUser(user);

    return identity && verifyPassword(password, user.passwordHash) ? identity : null;
  }

  const credentials = configuredCredentials();

  if (!credentials || credentials.email !== normalizedEmail || !matchesConfiguredPassword(password, credentials.password)) {
    return null;
  }

  await getPersistence().leads.ensureDemoLeads();
  const configuredUser = await createFirstUser(credentials.email, credentials.name, credentials.password);

  if (configuredUser) {
    return identityForUser(configuredUser);
  }

  const racedUser = await getUserByEmail(normalizedEmail);
  const identity = racedUser ? await identityForUser(racedUser) : null;

  return identity && racedUser && verifyPassword(password, racedUser.passwordHash) ? identity : null;
}

export async function createSession(identity: AuthIdentity) {
  const token = randomBytes(32).toString("base64url");
  const sessionId = `session-${randomUUID()}`;
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  await getPersistence().auth.createSession({
    createdAt: new Date().toISOString(),
    expiresAt,
    id: sessionId,
    tokenHash: hashSessionToken(token),
    userId: identity.userId,
    workspaceId: identity.workspaceId,
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

export async function getSessionFromToken(token: string): Promise<AuthSession | null> {
  if (!token) {
    return null;
  }

  const now = new Date().toISOString();
  const authRepository = getPersistence().auth;
  await authRepository.deleteExpiredSessions(now);

  return (await authRepository.getSessionByTokenHash(hashSessionToken(token), now)) ?? null;
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
  return token ? await getSessionFromToken(token) : null;
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

  await getPersistence().auth.revokeSession(hashSessionToken(token));
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
