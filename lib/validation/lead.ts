import { z } from "zod";

import { PIPELINE_STAGES } from "../leads/pipeline";
import { calendarDateSchema } from "./date";

const requiredText = (label: string, maximum: number) =>
  z.string().trim().min(1, `${label} cannot be empty.`).max(maximum, `${label} is too long.`);

const companyInputSchema = z.object({
  domain: requiredText("Company domain", 255),
  location: requiredText("Company location", 120),
  name: requiredText("Company name", 160),
});

const contactInputSchema = z.object({
  email: z.string().trim().email("Contact email must be valid.").max(320, "Contact email is too long."),
  name: requiredText("Contact name", 160),
  title: requiredText("Contact title", 160),
});

const leadInputSchema = z.object({
  estimatedValue: requiredText("Estimated value", 32),
  nextAction: requiredText("Next action", 160),
  nextActionDate: calendarDateSchema,
  observedPainPoint: requiredText("Observed pain point", 2000),
  personalizationHook: requiredText("Personalization hook", 2000),
  priority: z.enum(["high", "medium", "low"]),
  recommendedOffer: requiredText("Recommended offer", 2000),
  researchNotes: requiredText("Research notes", 4000),
  serviceInterest: requiredText("Service interest", 160),
  source: requiredText("Lead source", 160),
  stage: z.enum(PIPELINE_STAGES),
});

export const createLeadSchema = z.object({
  company: companyInputSchema,
  contact: contactInputSchema,
  lead: leadInputSchema,
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = z
  .object({
    nextAction: z.string().trim().min(1, "Next action cannot be empty.").max(160, "Next action is too long.").optional(),
    nextActionDate: calendarDateSchema.optional(),
    stage: z.enum(PIPELINE_STAGES).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Provide at least one lead field to update.");

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
