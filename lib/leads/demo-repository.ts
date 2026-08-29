import { randomUUID } from "node:crypto";

import { getDatabase, withTransaction } from "../db";
import { DEMO_WORKSPACE_ID, DEMO_WORKSPACE_NAME } from "../workspace";
import { ACTIVE_PIPELINE_STAGES } from "./pipeline";
import type { LeadStage } from "./pipeline";
import type { CreateLeadInput } from "../validation/lead";
import type {
  Lead,
  LeadActivityInput,
  LeadActivityType,
  LeadPriority,
  LeadUpdate,
  PipelineColumn,
} from "./types";

export { ACTIVE_PIPELINE_STAGES, PIPELINE_STAGES } from "./pipeline";
export type { ActivePipelineStage, LeadStage } from "./pipeline";
export type {
  Lead,
  LeadActivity,
  LeadActivityInput,
  LeadActivityType,
  LeadCompany,
  LeadContact,
  LeadPriority,
  LeadUpdate,
  PipelineColumn,
} from "./types";

export { DEMO_WORKSPACE_ID } from "../workspace";

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

type LeadRow = {
  company_domain: string;
  company_id: string;
  company_location: string;
  company_name: string;
  contact_email: string;
  contact_id: string;
  contact_initials: string;
  contact_name: string;
  contact_title: string;
  engagement_score: number;
  estimated_value: string;
  fit_score: number;
  id: string;
  initials: string;
  last_contacted_at: string | null;
  name: string;
  next_action: string;
  next_action_date: string;
  personalization_hook: string;
  priority: LeadPriority;
  research_notes: string;
  recommended_offer: string;
  service_interest: string;
  source: string;
  stage: LeadStage;
  status: Lead["status"];
  observed_pain_point: string;
  workspace_id: string;
};

type ActivityRow = {
  actor: string;
  body: string;
  id: string;
  occurred_at: string;
  type: LeadActivityType;
};

function seedDemoLeads() {
  const database = getDatabase();
  const insertWorkspace = database.prepare("INSERT OR IGNORE INTO workspaces (id, name) VALUES (?, ?)");
  const insertCompany = database.prepare(
    "INSERT OR IGNORE INTO companies (id, workspace_id, name, domain, location) VALUES (?, ?, ?, ?, ?)",
  );
  const insertContact = database.prepare(
    "INSERT OR IGNORE INTO contacts (id, workspace_id, company_id, name, title, email, initials) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const insertLead = database.prepare(
    `INSERT OR IGNORE INTO leads (
      id, workspace_id, company_id, primary_contact_id, name, initials, stage, status, priority,
      service_interest, observed_pain_point, recommended_offer, personalization_hook, research_notes,
      estimated_value, source, next_action, next_action_date, last_contacted_at, fit_score, engagement_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertActivity = database.prepare(
    "INSERT OR IGNORE INTO activities (id, workspace_id, lead_id, type, body, occurred_at, actor) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  insertWorkspace.run(DEMO_WORKSPACE_ID, DEMO_WORKSPACE_NAME);

  for (const lead of DEMO_LEADS) {
    insertCompany.run(
      lead.company.id,
      lead.workspaceId,
      lead.company.name,
      lead.company.domain,
      lead.company.location,
    );
    insertContact.run(
      lead.contact.id,
      lead.workspaceId,
      lead.company.id,
      lead.contact.name,
      lead.contact.title,
      lead.contact.email,
      lead.contact.initials,
    );
    insertLead.run(
      lead.id,
      lead.workspaceId,
      lead.company.id,
      lead.contact.id,
      lead.name,
      lead.initials,
      lead.stage,
      lead.status,
      lead.priority,
      lead.serviceInterest,
      lead.observedPainPoint,
      lead.recommendedOffer,
      lead.personalizationHook,
      lead.researchNotes,
      lead.estimatedValue,
      lead.source,
      lead.nextAction,
      lead.nextActionDate,
      lead.lastContactedAt,
      lead.fitScore,
      lead.engagementScore,
    );

    for (const activity of lead.activity) {
      insertActivity.run(
        activity.id,
        lead.workspaceId,
        lead.id,
        activity.type,
        activity.body,
        activity.occurredAt,
        activity.actor,
      );
    }
  }
}

export function ensureDemoLeads() {
  seedDemoLeads();
}

function activitiesForLead(id: string, workspaceId: string) {
  const database = getDatabase();
  const rows = database
    .prepare(
      `SELECT id, type, body, occurred_at, actor
       FROM activities
       WHERE lead_id = ? AND workspace_id = ?
       ORDER BY occurred_at ASC, id ASC`,
    )
    .all(id, workspaceId) as ActivityRow[];

  return rows.map((activity) => ({
    actor: activity.actor,
    body: activity.body,
    id: activity.id,
    occurredAt: activity.occurred_at,
    type: activity.type,
  }));
}

function leadFromRow(row: LeadRow): Lead {
  return {
    activity: activitiesForLead(row.id, row.workspace_id),
    company: {
      domain: row.company_domain,
      id: row.company_id,
      location: row.company_location,
      name: row.company_name,
    },
    contact: {
      email: row.contact_email,
      id: row.contact_id,
      initials: row.contact_initials,
      name: row.contact_name,
      title: row.contact_title,
    },
    engagementScore: row.engagement_score,
    estimatedValue: row.estimated_value,
    fitScore: row.fit_score,
    id: row.id,
    initials: row.initials,
    lastContactedAt: row.last_contacted_at,
    name: row.name,
    nextAction: row.next_action,
    nextActionDate: row.next_action_date,
    personalizationHook: row.personalization_hook,
    priority: row.priority,
    researchNotes: row.research_notes,
    recommendedOffer: row.recommended_offer,
    serviceInterest: row.service_interest,
    source: row.source,
    stage: row.stage,
    status: row.status,
    observedPainPoint: row.observed_pain_point,
    workspaceId: row.workspace_id,
  };
}

const leadSelect = `
  SELECT
    l.id, l.workspace_id, l.name, l.initials, l.stage, l.status, l.priority,
    l.service_interest, l.observed_pain_point, l.recommended_offer, l.personalization_hook,
    l.research_notes, l.estimated_value, l.source, l.next_action, l.next_action_date,
    l.last_contacted_at, l.fit_score, l.engagement_score,
    c.id AS company_id, c.name AS company_name, c.domain AS company_domain, c.location AS company_location,
    p.id AS contact_id, p.name AS contact_name, p.title AS contact_title,
    p.email AS contact_email, p.initials AS contact_initials
  FROM leads l
  JOIN companies c ON c.id = l.company_id AND c.workspace_id = l.workspace_id
  JOIN contacts p ON p.id = l.primary_contact_id AND p.workspace_id = l.workspace_id
`;

export function listLeads(workspaceId: string): Lead[] {
  ensureDemoLeads();
  const database = getDatabase();
  const rows = database
    .prepare(`${leadSelect} WHERE l.workspace_id = ? ORDER BY l.id`)
    .all(workspaceId) as LeadRow[];

  return rows.map(leadFromRow);
}

export function getLeadById(id: string, workspaceId: string): Lead | null {
  ensureDemoLeads();
  const database = getDatabase();
  const row = database
    .prepare(`${leadSelect} WHERE l.id = ? AND l.workspace_id = ?`)
    .get(id, workspaceId) as LeadRow | undefined;

  return row ? leadFromRow(row) : null;
}

function initialsForName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0]}${parts.at(-1)?.[0]}`.toUpperCase();
  }

  return name.trim().slice(0, 2).toUpperCase();
}

export function createLead(workspaceId: string, input: CreateLeadInput): Lead | null {
  ensureDemoLeads();
  const database = getDatabase();
  const workspace = database.prepare("SELECT id FROM workspaces WHERE id = ?").get(workspaceId);

  if (!workspace) {
    return null;
  }

  const companyName = input.company.name.trim();
  const companyDomain = input.company.domain.trim().toLowerCase();
  const companyLocation = input.company.location.trim();
  const contactName = input.contact.name.trim();
  const contactTitle = input.contact.title.trim();
  const contactEmail = input.contact.email.trim();
  const leadName = contactName;
  const leadInitials = initialsForName(leadName);
  const existingCompany = database
    .prepare(
      `SELECT id
       FROM companies
       WHERE workspace_id = ? AND lower(domain) = ?
       ORDER BY id ASC
       LIMIT 1`,
    )
    .get(workspaceId, companyDomain) as { id: string } | undefined;
  const companyId = existingCompany?.id ?? `company-${randomUUID()}`;
  const contactId = `contact-${randomUUID()}`;
  const leadId = `lead-${randomUUID()}`;

  withTransaction((transactionDatabase) => {
    if (!existingCompany) {
      transactionDatabase
        .prepare(
          "INSERT INTO companies (id, workspace_id, name, domain, location) VALUES (?, ?, ?, ?, ?)",
        )
        .run(companyId, workspaceId, companyName, companyDomain, companyLocation);
    }

    transactionDatabase
      .prepare(
        "INSERT INTO contacts (id, workspace_id, company_id, name, title, email, initials) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(contactId, workspaceId, companyId, contactName, contactTitle, contactEmail, initialsForName(contactName));

    transactionDatabase
      .prepare(
        `INSERT INTO leads (
          id, workspace_id, company_id, primary_contact_id, name, initials, stage, status, priority,
          service_interest, observed_pain_point, recommended_offer, personalization_hook, research_notes,
          estimated_value, source, next_action, next_action_date, last_contacted_at, fit_score, engagement_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        leadId,
        workspaceId,
        companyId,
        contactId,
        leadName,
        leadInitials,
        input.lead.stage,
        statusForStage(input.lead.stage, "active"),
        input.lead.priority,
        input.lead.serviceInterest.trim(),
        input.lead.observedPainPoint.trim(),
        input.lead.recommendedOffer.trim(),
        input.lead.personalizationHook.trim(),
        input.lead.researchNotes.trim(),
        input.lead.estimatedValue.trim(),
        input.lead.source.trim(),
        input.lead.nextAction.trim(),
        input.lead.nextActionDate,
        null,
        0,
        0,
      );
  });

  return getLeadById(leadId, workspaceId);
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
  const currentLead = getLeadById(id, workspaceId);

  if (!currentLead) {
    return null;
  }

  const nextStage = input.stage ?? currentLead.stage;
  const stageChanged = nextStage !== currentLead.stage;
  const occurredAt = new Date().toISOString();
  const nextAction = input.nextAction === undefined ? currentLead.nextAction : input.nextAction.trim();
  const nextActionDate = input.nextActionDate ?? currentLead.nextActionDate;

  withTransaction((database) => {
    database
      .prepare(
        `UPDATE leads
         SET stage = ?, status = ?, next_action = ?, next_action_date = ?
         WHERE id = ? AND workspace_id = ?`,
      )
      .run(
        nextStage,
        statusForStage(nextStage, currentLead.status),
        nextAction,
        nextActionDate,
        id,
        workspaceId,
      );

    if (stageChanged) {
      database
        .prepare(
          "INSERT INTO activities (id, workspace_id, lead_id, type, body, occurred_at, actor) VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .run(
          `activity-${id}-stage-${randomUUID()}`,
          workspaceId,
          id,
          "stage_change",
          `Moved from ${currentLead.stage} to ${nextStage}.`,
          occurredAt,
          "Wayne",
        );
    }
  });

  return getLeadById(id, workspaceId);
}

export function addLeadActivity(id: string, workspaceId: string, input: LeadActivityInput): Lead | null {
  const currentLead = getLeadById(id, workspaceId);

  if (!currentLead) {
    return null;
  }

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const body = input.body.trim();

  withTransaction((database) => {
    database
      .prepare("INSERT INTO activities (id, workspace_id, lead_id, type, body, occurred_at, actor) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(`activity-${id}-${randomUUID()}`, workspaceId, id, input.type, body, occurredAt, "Wayne");

    if (input.type !== "note") {
      database
        .prepare("UPDATE leads SET last_contacted_at = ? WHERE id = ? AND workspace_id = ?")
        .run(occurredAt, id, workspaceId);
    }
  });

  return getLeadById(id, workspaceId);
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
