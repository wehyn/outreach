import { getDatabase, withTransaction } from "../db";
import type {
  AuthRepository,
  CreateSessionRecord,
  CreateUserRecord,
  StoredSession,
  StoredUser,
  StoredWorkspace,
} from "./types";

export function createSqliteAuthRepository(): AuthRepository {
  return {
    async createFirstUser(input: CreateUserRecord) {
      let createdUser: StoredUser | null = null;

      withTransaction((database) => {
        const existingUser = database.prepare("SELECT 1 AS registered FROM users LIMIT 1").get();

        if (existingUser) {
          return;
        }

        database
          .prepare("INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
          .run(input.id, input.email, input.name, input.passwordHash, input.createdAt);
        database
          .prepare(
            `INSERT INTO workspace_members (workspace_id, user_id, role, created_at)
             VALUES (?, ?, ?, ?)`,
          )
          .run(input.workspaceId, input.id, "owner", input.createdAt);

        createdUser = {
          email: input.email,
          id: input.id,
          name: input.name,
          passwordHash: input.passwordHash,
        };
      });

      return createdUser;
    },

    async createSession(input: CreateSessionRecord) {
      withTransaction((database) => {
        database
          .prepare(
            `INSERT INTO sessions (id, user_id, workspace_id, token_hash, expires_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .run(
            input.id,
            input.userId,
            input.workspaceId,
            input.tokenHash,
            input.expiresAt,
            input.createdAt,
          );
      });
    },

    async deleteExpiredSessions(now: string) {
      getDatabase().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
    },

    async getSessionByTokenHash(tokenHash: string, now: string) {
      const row = getDatabase()
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
        .get(tokenHash, now) as
        | {
            email: string;
            expires_at: string;
            session_id: string;
            user_id: string;
            user_name: string;
            workspace_id: string;
            workspace_name: string;
          }
        | undefined;

      return row
        ? ({
            email: row.email,
            expiresAt: row.expires_at,
            sessionId: row.session_id,
            userId: row.user_id,
            userName: row.user_name,
            workspaceId: row.workspace_id,
            workspaceName: row.workspace_name,
          } satisfies StoredSession)
        : undefined;
    },

    async getUserByEmail(email: string) {
      const row = getDatabase()
        .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
        .get(email) as
        | {
            email: string;
            id: string;
            name: string;
            password_hash: string;
          }
        | undefined;

      return row
        ? {
            email: row.email,
            id: row.id,
            name: row.name,
            passwordHash: row.password_hash,
          }
        : undefined;
    },

    async getWorkspaceForUser(userId: string) {
      return getDatabase()
        .prepare(
          `SELECT w.id, w.name
           FROM workspace_members wm
           JOIN workspaces w ON w.id = wm.workspace_id
           WHERE wm.user_id = ?
           ORDER BY wm.created_at ASC, w.id ASC
           LIMIT 1`,
        )
        .get(userId) as StoredWorkspace | undefined;
    },

    async hasRegisteredUser() {
      const row = getDatabase().prepare("SELECT 1 AS registered FROM users LIMIT 1").get() as
        | { registered: number }
        | undefined;

      return row?.registered === 1;
    },

    async revokeSession(tokenHash: string) {
      getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
    },
  };
}
