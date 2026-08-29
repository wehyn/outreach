import type { Lead, LeadActivityInput, LeadUpdate } from "../leads/types";
import type { CreateLeadInput } from "../validation/lead";
import type { CreateTaskInput, Task } from "../tasks/task";

export type StoredUser = {
  email: string;
  id: string;
  name: string;
  passwordHash: string;
};

export type CreateUserRecord = StoredUser & {
  createdAt: string;
  workspaceId: string;
};

export type CreateSessionRecord = {
  createdAt: string;
  expiresAt: string;
  id: string;
  tokenHash: string;
  userId: string;
  workspaceId: string;
};

export type StoredSession = {
  email: string;
  expiresAt: string;
  sessionId: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
};

export type StoredWorkspace = {
  id: string;
  name: string;
};

export interface AuthRepository {
  createFirstUser(input: CreateUserRecord): StoredUser | null;
  createSession(input: CreateSessionRecord): void;
  deleteExpiredSessions(now: string): void;
  getSessionByTokenHash(tokenHash: string, now: string): StoredSession | undefined;
  getUserByEmail(email: string): StoredUser | undefined;
  getWorkspaceForUser(userId: string): StoredWorkspace | undefined;
  hasRegisteredUser(): boolean;
  revokeSession(tokenHash: string): void;
}

export interface LeadRepository {
  addLeadActivity(id: string, workspaceId: string, input: LeadActivityInput): Lead | null;
  createLead(workspaceId: string, input: CreateLeadInput): Lead | null;
  ensureDemoLeads(): void;
  getLeadById(id: string, workspaceId: string): Lead | null;
  listLeads(workspaceId: string): Lead[];
  updateLead(id: string, workspaceId: string, input: LeadUpdate): Lead | null;
}

export interface TaskRepository {
  completeTask(id: string, workspaceId: string): Task | null;
  createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Task | null;
  getTaskById(id: string, workspaceId: string): Task | null;
  listTasks(workspaceId: string): Task[];
}

export type PersistenceProvider = {
  auth: AuthRepository;
  leads: LeadRepository;
  tasks: TaskRepository;
};
