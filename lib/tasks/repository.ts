import { getPersistence } from "../persistence";
import type { CreateTaskInput, Task } from "./task";

export type { CreateTaskInput, Task, TaskPriority, TaskStatus } from "./task";

export function listTasks(workspaceId: string): Task[] {
  return getPersistence().tasks.listTasks(workspaceId);
}

export function getTaskById(id: string, workspaceId: string): Task | null {
  return getPersistence().tasks.getTaskById(id, workspaceId);
}

export function createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Task | null {
  return getPersistence().tasks.createTask(leadId, workspaceId, input);
}

export function completeTask(id: string, workspaceId: string): Task | null {
  return getPersistence().tasks.completeTask(id, workspaceId);
}
