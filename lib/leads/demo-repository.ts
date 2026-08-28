import { ACTIVE_PIPELINE_STAGES } from "./pipeline";
import type { ActivePipelineStage, LeadStage } from "./pipeline";

export { ACTIVE_PIPELINE_STAGES, PIPELINE_STAGES } from "./pipeline";
export type { ActivePipelineStage, LeadStage } from "./pipeline";

export const DEMO_WORKSPACE_ID = "workspace-wayne-demo";
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

const DEMO_LEADS: Lead[] = [
  {
    id: "lead-maya-chen",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Maya Chen",
    initials: "MC",
    stage: "Ready to Contact",
    status: "active",
    priority: "high",
    company: {
      id: "company-brightline",
      name: "Brightline Studio",
      domain: "brightline.studio",
      location: "Brooklyn, NY",
    },
    contact: {
      id: "contact-maya-chen",
      name: "Maya Chen",
      title: "Founder & Creative Director",
      email: "maya@brightline.studio",
      initials: "MC",
    },
    serviceInterest: "SEO",
    observedPainPoint: "Their portfolio is strong, but service pages are not capturing non-branded search demand.",
    recommendedOffer: "A focused technical and content SEO audit with three high-intent page opportunities.",
    personalizationHook: "Mention the recent hospitality rebrand and the gap between their case-study quality and search visibility.",
    researchNotes: "Studio works with hospitality and lifestyle brands. The site has clear case studies but thin service landing pages.",
    estimatedValue: "$12k",
    source: "Cold research",
    nextAction: "Send audit outline",
    nextActionDate: "2026-08-28",
    lastContactedAt: null,
    fitScore: 86,
    engagementScore: 42,
    activity: [
      {
        id: "activity-maya-research",
        type: "note",
        body: "Research complete: strong case studies, clear SEO opportunity on service pages.",
        occurredAt: "2026-08-27T14:20:00Z",
        actor: "Wayne",
      },
    ],
  },
  {
    id: "lead-sofia-patel",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Sofia Patel",
    initials: "SP",
    stage: "Ready to Contact",
    status: "active",
    priority: "medium",
    company: {
      id: "company-common-thread",
      name: "Common Thread",
      domain: "commonthread.co",
      location: "Austin, TX",
    },
    contact: {
      id: "contact-sofia-patel",
      name: "Sofia Patel",
      title: "Marketing Lead",
      email: "sofia@commonthread.co",
      initials: "SP",
    },
    serviceInterest: "Content",
    observedPainPoint: "Their product education is scattered across blog posts and does not guide visitors toward a clear next step.",
    recommendedOffer: "A content architecture sprint that maps educational topics to the buyer journey.",
    personalizationHook: "Open with the customer stories page and suggest turning its themes into a connected learning path.",
    researchNotes: "B2B services company with a steady publishing cadence. Content is useful but lacks a consistent conversion path.",
    estimatedValue: "$8k",
    source: "Referral",
    nextAction: "Find decision maker",
    nextActionDate: "2026-09-01",
    lastContactedAt: null,
    fitScore: 79,
    engagementScore: 28,
    activity: [
      {
        id: "activity-sofia-referral",
        type: "note",
        body: "Referral from Jordan Lee. Confirm who owns content strategy before outreach.",
        occurredAt: "2026-08-26T16:00:00Z",
        actor: "Wayne",
      },
    ],
  },
  {
    id: "lead-evan-brooks",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Evan Brooks",
    initials: "EB",
    stage: "Contacted",
    status: "active",
    priority: "medium",
    company: {
      id: "company-northstar",
      name: "Northstar Labs",
      domain: "northstarlabs.io",
      location: "Toronto, ON",
    },
    contact: {
      id: "contact-evan-brooks",
      name: "Evan Brooks",
      title: "Head of Growth",
      email: "evan@northstarlabs.io",
      initials: "EB",
    },
    serviceInterest: "Paid ads",
    observedPainPoint: "Paid acquisition is generating traffic, but landing pages are not matching campaign intent consistently.",
    recommendedOffer: "A paid acquisition and landing-page alignment review with a prioritized test plan.",
    personalizationHook: "Reference the contrast between their developer-focused ads and the broader message on the destination pages.",
    researchNotes: "Series A developer tooling company. Recent hiring suggests a push for efficient growth and clearer attribution.",
    estimatedValue: "$18k",
    source: "Cold research",
    nextAction: "Follow up on proposal",
    nextActionDate: "2026-08-28",
    lastContactedAt: "2026-08-26T15:30:00Z",
    fitScore: 91,
    engagementScore: 67,
    activity: [
      {
        id: "activity-evan-email",
        type: "email",
        body: "Sent a short landing-page alignment note and offered to share a sample test plan.",
        occurredAt: "2026-08-26T15:30:00Z",
        actor: "Wayne",
      },
    ],
  },
  {
    id: "lead-jon-bell",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Jon Bell",
    initials: "JB",
    stage: "Contacted",
    status: "active",
    priority: "low",
    company: {
      id: "company-fieldwork",
      name: "Fieldwork Co.",
      domain: "fieldwork.co",
      location: "Portland, OR",
    },
    contact: {
      id: "contact-jon-bell",
      name: "Jon Bell",
      title: "Co-founder",
      email: "jon@fieldwork.co",
      initials: "JB",
    },
    serviceInterest: "Branding",
    observedPainPoint: "The company has outgrown its original visual identity and is presenting different stories across channels.",
    recommendedOffer: "A lightweight positioning and brand-system refresh for the next stage of growth.",
    personalizationHook: "Connect the new product launch announcement to the need for a clearer, repeatable story.",
    researchNotes: "Small product studio with a thoughtful launch cadence. Their brand is personable but inconsistent between product and marketing pages.",
    estimatedValue: "$6k",
    source: "Event",
    nextAction: "Share case study",
    nextActionDate: "2026-09-02",
    lastContactedAt: "2026-08-25T18:10:00Z",
    fitScore: 73,
    engagementScore: 51,
    activity: [
      {
        id: "activity-jon-call",
        type: "call",
        body: "Brief conversation after the Portland founders meetup. Jon asked for a relevant example.",
        occurredAt: "2026-08-25T18:10:00Z",
        actor: "Wayne",
      },
    ],
  },
  {
    id: "lead-ari-lopez",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Ari Lopez",
    initials: "AL",
    stage: "Replied",
    status: "active",
    priority: "high",
    company: {
      id: "company-good-common",
      name: "Good Common",
      domain: "goodcommon.com",
      location: "Chicago, IL",
    },
    contact: {
      id: "contact-ari-lopez",
      name: "Ari Lopez",
      title: "Operations Director",
      email: "ari@goodcommon.com",
      initials: "AL",
    },
    serviceInterest: "Web development",
    observedPainPoint: "Their marketing site makes it difficult for qualified visitors to understand the right service path.",
    recommendedOffer: "A conversion-focused information architecture and web development sprint.",
    personalizationHook: "Use the recent services expansion as a reason to discuss clearer paths for returning visitors.",
    researchNotes: "Mission-driven consultancy with a broad services menu. Strong proof points, but the site makes comparison difficult.",
    estimatedValue: "$14k",
    source: "Inbound form",
    nextAction: "Confirm discovery time",
    nextActionDate: "2026-08-29",
    lastContactedAt: "2026-08-27T12:45:00Z",
    fitScore: 94,
    engagementScore: 88,
    activity: [
      {
        id: "activity-ari-reply",
        type: "email",
        body: "Ari replied with interest and asked for times next week to discuss the services-page problem.",
        occurredAt: "2026-08-27T12:45:00Z",
        actor: "Ari Lopez",
      },
    ],
  },
  {
    id: "lead-rina-kim",
    workspaceId: DEMO_WORKSPACE_ID,
    name: "Rina Kim",
    initials: "RK",
    stage: "Meeting Booked",
    status: "active",
    priority: "high",
    company: {
      id: "company-arc-pine",
      name: "Arc & Pine",
      domain: "arcandpine.com",
      location: "San Francisco, CA",
    },
    contact: {
      id: "contact-rina-kim",
      name: "Rina Kim",
      title: "VP, Marketing",
      email: "rina@arcandpine.com",
      initials: "RK",
    },
    serviceInterest: "Analytics",
    observedPainPoint: "The team has channel data but no shared view of which campaigns influence qualified opportunities.",
    recommendedOffer: "A practical measurement plan connecting campaign events to pipeline stages.",
    personalizationHook: "Tie the conversation to their multi-channel fall launch and the need for one decision-ready view.",
    researchNotes: "Growing consumer brand preparing a seasonal launch. Marketing team is adding channels faster than reporting structure.",
    estimatedValue: "$22k",
    source: "Referral",
    nextAction: "Prepare discovery notes",
    nextActionDate: "2026-10-18",
    lastContactedAt: "2026-08-27T09:00:00Z",
    fitScore: 88,
    engagementScore: 92,
    activity: [
      {
        id: "activity-rina-meeting",
        type: "meeting",
        body: "Discovery meeting booked for October 18. Rina wants to focus on campaign-to-pipeline reporting.",
        occurredAt: "2026-08-27T09:00:00Z",
        actor: "Wayne",
      },
    ],
  },
];

function cloneLead(lead: Lead): Lead {
  return {
    ...lead,
    company: { ...lead.company },
    contact: { ...lead.contact },
    activity: lead.activity.map((activity) => ({ ...activity })),
  };
}

export type LeadUpdate = {
  stage?: LeadStage;
  nextAction?: string;
  nextActionDate?: string;
};

type DemoGlobalState = typeof globalThis & {
  __outreachDemoLeads?: Lead[];
};

const demoGlobalState = globalThis as DemoGlobalState;
const demoLeads = demoGlobalState.__outreachDemoLeads ?? (demoGlobalState.__outreachDemoLeads = DEMO_LEADS.map(cloneLead));

export function listLeads(workspaceId: string): Lead[] {
  return demoLeads.filter((lead) => lead.workspaceId === workspaceId).map(cloneLead);
}

export function getLeadById(id: string, workspaceId: string): Lead | null {
  const lead = demoLeads.find((candidate) => candidate.id === id && candidate.workspaceId === workspaceId);

  return lead ? cloneLead(lead) : null;
}

function statusForStage(stage: LeadStage, currentStatus: Lead["status"]): Lead["status"] {
  if (stage === "Won") {
    return "won";
  }

  if (stage === "Lost") {
    return "lost";
  }

  if (stage === "Nurture") {
    return "nurture";
  }

  return currentStatus === "won" || currentStatus === "lost" ? "active" : currentStatus;
}

export function updateLead(id: string, workspaceId: string, input: LeadUpdate): Lead | null {
  const index = demoLeads.findIndex((candidate) => candidate.id === id && candidate.workspaceId === workspaceId);

  if (index === -1) {
    return null;
  }

  const currentLead = demoLeads[index];
  const nextStage = input.stage ?? currentLead.stage;
  const stageChanged = nextStage !== currentLead.stage;
  const nextActivity: LeadActivity | null = stageChanged
    ? {
        id: `activity-${currentLead.id}-stage-${currentLead.activity.length + 1}`,
        type: "stage_change",
        body: `Moved from ${currentLead.stage} to ${nextStage}.`,
        occurredAt: new Date().toISOString(),
        actor: "Wayne",
      }
    : null;
  const updatedLead: Lead = {
    ...currentLead,
    stage: nextStage,
    status: statusForStage(nextStage, currentLead.status),
    nextAction: input.nextAction?.trim() ?? currentLead.nextAction,
    nextActionDate: input.nextActionDate ?? currentLead.nextActionDate,
    activity: nextActivity ? [...currentLead.activity, nextActivity] : currentLead.activity,
  };

  demoLeads[index] = updatedLead;

  return cloneLead(updatedLead);
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
