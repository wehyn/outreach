import { getPersistence } from "../persistence";
import type { CreateTaskInput, Task } from "./task";

export type { CreateTaskInput, Task, TaskPriority, TaskStatus } from "./task";

export async function listTasks(workspaceId: string): Promise<Task[]> {
  return getPersistence().tasks.listTasks(workspaceId);
}

export async function getTaskById(id: string, workspaceId: string): Promise<Task | null> {
  return getPersistence().tasks.getTaskById(id, workspaceId);
}

export async function createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Promise<Task | null> {
  return getPersistence().tasks.createTask(leadId, workspaceId, input);
}

export async function completeTask(id: string, workspaceId: string): Promise<Task | null> {
  return getPersistence().tasks.completeTask(id, workspaceId);
}
