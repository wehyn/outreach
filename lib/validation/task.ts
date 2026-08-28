import { z } from "zod";

import { TASK_PRIORITIES } from "../tasks/task";
import { calendarDateSchema } from "./date";

export const createTaskSchema = z.object({
  dueDate: calendarDateSchema,
  priority: z.enum(TASK_PRIORITIES),
  title: z.string().trim().min(1, "Task title cannot be empty.").max(160, "Task title is too long."),
});

export const updateTaskSchema = z.object({
  status: z.literal("completed"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
