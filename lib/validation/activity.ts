import { z } from "zod";

import { MANUAL_ACTIVITY_TYPES } from "../leads/activity";

export const createActivitySchema = z.object({
  body: z.string().trim().min(1, "Activity details cannot be empty.").max(2000, "Activity details are too long."),
  occurredAt: z.string().datetime({ offset: true }).optional(),
  type: z.enum(MANUAL_ACTIVITY_TYPES),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
