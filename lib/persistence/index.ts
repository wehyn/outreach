import { createSqlitePersistence } from "./sqlite";
import type { PersistenceProvider } from "./types";

const persistence = createSqlitePersistence();

export function getPersistence(): PersistenceProvider {
  return persistence;
}

export type {
  AuthRepository,
  CreateSessionRecord,
  CreateUserRecord,
  LeadRepository,
  PersistenceProvider,
  StoredSession,
  StoredUser,
  StoredWorkspace,
  TaskRepository,
} from "./types";
