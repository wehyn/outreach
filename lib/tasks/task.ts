export const TASK_PRIORITIES = ["high", "medium", "low"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = "open" | "completed";

export type Task = {
  id: string;
  workspaceId: string;
  leadId: string;
  leadName: string;
  companyName: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
};

export type CreateTaskInput = {
  title: string;
  dueDate: string;
  priority: TaskPriority;
};
