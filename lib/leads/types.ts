import type { ManualActivityType } from "./activity";
import type { ActivePipelineStage, LeadStage } from "./pipeline";

export type { ActivePipelineStage, LeadStage } from "./pipeline";

export type LeadPriority = "high" | "medium" | "low";
export type LeadActivityType = "email" | "note" | "call" | "meeting" | "stage_change";

export type LeadActivity = {
  id: string;
  type: LeadActivityType;
  body: string;
  occurredAt: string;
  actor: string;
};

export type LeadCompany = {
  id: string;
  name: string;
  domain: string;
  location: string;
};

export type LeadContact = {
  id: string;
  name: string;
  title: string;
  email: string;
  initials: string;
};

export type Lead = {
  id: string;
  workspaceId: string;
  name: string;
  initials: string;
  stage: LeadStage;
  status: "active" | "won" | "lost" | "nurture";
  priority: LeadPriority;
  company: LeadCompany;
  contact: LeadContact;
  serviceInterest: string;
  observedPainPoint: string;
  recommendedOffer: string;
  personalizationHook: string;
  researchNotes: string;
  estimatedValue: string;
  source: string;
  nextAction: string;
  nextActionDate: string;
  lastContactedAt: string | null;
  fitScore: number;
  engagementScore: number;
  activity: LeadActivity[];
};

export type PipelineColumn = {
  title: ActivePipelineStage;
  count: number;
  leads: Lead[];
};

export type LeadUpdate = {
  stage?: LeadStage;
  nextAction?: string;
  nextActionDate?: string;
};

export type LeadActivityInput = {
  type: ManualActivityType;
  body: string;
  occurredAt?: string;
};
