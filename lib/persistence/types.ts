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
  workspaceName: string;
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
  createFirstUser(input: CreateUserRecord): Promise<StoredUser | null>;
  createSession(input: CreateSessionRecord): Promise<void>;
  deleteExpiredSessions(now: string): Promise<void>;
  getSessionByTokenHash(tokenHash: string, now: string): Promise<StoredSession | undefined>;
  getUserByEmail(email: string): Promise<StoredUser | undefined>;
  getWorkspaceForUser(userId: string): Promise<StoredWorkspace | undefined>;
  hasRegisteredUser(): Promise<boolean>;
  revokeSession(tokenHash: string): Promise<void>;
}

export interface LeadRepository {
  addLeadActivity(id: string, workspaceId: string, input: LeadActivityInput): Promise<Lead | null>;
  createLead(workspaceId: string, input: CreateLeadInput): Promise<Lead | null>;
  getLeadById(id: string, workspaceId: string): Promise<Lead | null>;
  listLeads(workspaceId: string): Promise<Lead[]>;
  updateLead(id: string, workspaceId: string, input: LeadUpdate): Promise<Lead | null>;
}

export interface TaskRepository {
  completeTask(id: string, workspaceId: string): Promise<Task | null>;
  createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Promise<Task | null>;
  getTaskById(id: string, workspaceId: string): Promise<Task | null>;
  listTasks(workspaceId: string): Promise<Task[]>;
}

export type PersistenceProvider = {
  auth: AuthRepository;
  leads: LeadRepository;
  tasks: TaskRepository;
};
