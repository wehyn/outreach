import { getPersistence } from "../persistence";
import type { CreateLeadInput } from "../validation/lead";
import type { Lead, LeadActivityInput, LeadUpdate, PipelineColumn } from "./types";
import { ACTIVE_PIPELINE_STAGES } from "./pipeline";

export { ACTIVE_PIPELINE_STAGES, PIPELINE_STAGES } from "./pipeline";
export type { ActivePipelineStage, Lead, LeadActivity, LeadActivityInput, LeadActivityType, LeadCompany, LeadContact, LeadPriority, LeadUpdate, PipelineColumn } from "./types";

export async function listLeads(workspaceId: string) {
  return getPersistence().leads.listLeads(workspaceId);
}

export async function getLeadById(id: string, workspaceId: string) {
  return getPersistence().leads.getLeadById(id, workspaceId);
}

export async function createLead(workspaceId: string, input: CreateLeadInput) {
  return getPersistence().leads.createLead(workspaceId, input);
}

export async function updateLead(id: string, workspaceId: string, input: LeadUpdate) {
  return getPersistence().leads.updateLead(id, workspaceId, input);
}

export async function addLeadActivity(id: string, workspaceId: string, input: LeadActivityInput) {
  return getPersistence().leads.addLeadActivity(id, workspaceId, input);
}

export function groupLeadsByStage(leads: readonly Lead[]): PipelineColumn[] {
  return ACTIVE_PIPELINE_STAGES.map((title) => {
    const stageLeads = leads.filter((lead) => lead.stage === title);

    return {
      title,
      count: stageLeads.length,
      leads: stageLeads,
    };
  });
}
