export const PIPELINE_STAGES = [
  "New",
  "Researching",
  "Ready to Contact",
  "Contacted",
  "Replied",
  "Meeting Booked",
  "Proposal",
  "Won",
  "Lost",
  "Nurture",
] as const;

export const ACTIVE_PIPELINE_STAGES = [
  "Ready to Contact",
  "Contacted",
  "Replied",
  "Meeting Booked",
] as const;

export type LeadStage = (typeof PIPELINE_STAGES)[number];
export type ActivePipelineStage = (typeof ACTIVE_PIPELINE_STAGES)[number];
