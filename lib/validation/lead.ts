import { z } from "zod";

import { PIPELINE_STAGES } from "../leads/pipeline";

const calendarDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD format.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);

    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value);
  }, "Use a real calendar date.");

export const updateLeadSchema = z
  .object({
    nextAction: z.string().trim().min(1, "Next action cannot be empty.").max(160, "Next action is too long.").optional(),
    nextActionDate: calendarDateSchema.optional(),
    stage: z.enum(PIPELINE_STAGES).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Provide at least one lead field to update.");

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
