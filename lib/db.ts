import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_DATABASE_PATH = ".data/outreach.db";

type DatabaseState = {
  database: DatabaseSync;
  path: string;
};

type DatabaseGlobalState = typeof globalThis & {
  __outreachDatabaseState?: DatabaseState;
};

const databaseGlobalState = globalThis as DatabaseGlobalState;

export function getDatabasePath() {
  const configuredPath = process.env.OUTREACH_DB_PATH?.trim();

  if (configuredPath === ":memory:") {
    return configuredPath;
  }

  return resolve(/* turbopackIgnore: true */ process.cwd(), configuredPath || DEFAULT_DATABASE_PATH);
}

function ensureDatabaseDirectory(path: string) {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
}

function initializeDatabase(database: DatabaseSync) {
  database.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspace_members (
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      role TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (workspace_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      location TEXT NOT NULL,
      UNIQUE (id, workspace_id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      company_id TEXT REFERENCES companies(id),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      email TEXT NOT NULL,
      initials TEXT NOT NULL,
      UNIQUE (id, workspace_id)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      company_id TEXT NOT NULL REFERENCES companies(id),
      primary_contact_id TEXT REFERENCES contacts(id),
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      stage TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      service_interest TEXT NOT NULL,
      observed_pain_point TEXT NOT NULL,
      recommended_offer TEXT NOT NULL,
      personalization_hook TEXT NOT NULL,
      research_notes TEXT NOT NULL,
      estimated_value TEXT NOT NULL,
      source TEXT NOT NULL,
      next_action TEXT NOT NULL,
      next_action_date TEXT NOT NULL,
      last_contacted_at TEXT,
      fit_score INTEGER NOT NULL,
      engagement_score INTEGER NOT NULL,
      UNIQUE (id, workspace_id)
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      lead_id TEXT NOT NULL REFERENCES leads(id),
      type TEXT NOT NULL,
      body TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      actor TEXT NOT NULL,
      UNIQUE (id, workspace_id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL REFERENCES workspaces(id),
      lead_id TEXT NOT NULL REFERENCES leads(id),
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      UNIQUE (id, workspace_id)
    );

    CREATE INDEX IF NOT EXISTS leads_workspace_stage_idx ON leads(workspace_id, stage);
    CREATE INDEX IF NOT EXISTS activities_workspace_occurred_idx ON activities(workspace_id, occurred_at);
    CREATE INDEX IF NOT EXISTS tasks_workspace_status_due_idx ON tasks(workspace_id, status, due_date);
    CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);
  `);
}

export function getDatabase() {
  const path = getDatabasePath();

  if (databaseGlobalState.__outreachDatabaseState?.path === path) {
    return databaseGlobalState.__outreachDatabaseState.database;
  }

  if (databaseGlobalState.__outreachDatabaseState) {
    databaseGlobalState.__outreachDatabaseState.database.close();
  }

  ensureDatabaseDirectory(path);

  const database = new DatabaseSync(path);
  initializeDatabase(database);
  databaseGlobalState.__outreachDatabaseState = { database, path };

  return database;
}

export function closeDatabase() {
  databaseGlobalState.__outreachDatabaseState?.database.close();
  databaseGlobalState.__outreachDatabaseState = undefined;
}

export function withTransaction<T>(callback: (database: DatabaseSync) => T) {
  const database = getDatabase();

  database.exec("BEGIN");

  try {
    const result = callback(database);
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export function resetDatabaseForTests() {
  const database = getDatabase();

  database.exec(`
    DELETE FROM tasks;
    DELETE FROM activities;
    DELETE FROM leads;
    DELETE FROM contacts;
    DELETE FROM companies;
    DELETE FROM sessions;
    DELETE FROM workspace_members;
    DELETE FROM users;
    DELETE FROM workspaces;
  `);
}
