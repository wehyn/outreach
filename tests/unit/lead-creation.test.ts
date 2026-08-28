import { describe, expect, it } from "vitest";

import { createLead, DEMO_WORKSPACE_ID, getLeadById } from "../../lib/leads/demo-repository";

const leadInput = {
  company: {
    domain: "northwind.example",
    location: "Denver, CO",
    name: "Northwind Analytics",
  },
  contact: {
    email: "alex@northwind.example",
    name: "Alex Morgan",
    title: "Founder",
  },
  lead: {
    estimatedValue: "$9k",
    nextAction: "Send a tailored audit outline",
    nextActionDate: "2026-09-10",
    observedPainPoint: "Their service pages are difficult to compare.",
    personalizationHook: "Mention the new analytics product launch.",
    priority: "high" as const,
    recommendedOffer: "A focused information architecture review.",
    researchNotes: "Manual research completed before first contact.",
    serviceInterest: "SEO",
    source: "Manual entry",
    stage: "Ready to Contact" as const,
  },
};

describe("lead creation repository", () => {
  it("creates a normalized company, contact, and lead in the workspace", () => {
    const created = createLead(DEMO_WORKSPACE_ID, leadInput);

    expect(created).toMatchObject({
      company: {
        domain: "northwind.example",
        name: "Northwind Analytics",
      },
      contact: {
        email: "alex@northwind.example",
        name: "Alex Morgan",
      },
      name: "Alex Morgan",
      stage: "Ready to Contact",
      fitScore: 0,
      engagementScore: 0,
      workspaceId: DEMO_WORKSPACE_ID,
    });
    expect(created?.id).toMatch(/^lead-/);
    expect(created?.company.id).toMatch(/^company-/);
    expect(created?.contact.id).toMatch(/^contact-/);
    expect(getLeadById(created?.id ?? "missing-lead", DEMO_WORKSPACE_ID)).toMatchObject({
      company: { id: created?.company.id },
      contact: { id: created?.contact.id },
    });
  });

  it("reuses a matching company domain without crossing workspace boundaries", () => {
    const first = createLead(DEMO_WORKSPACE_ID, leadInput);
    const second = createLead(DEMO_WORKSPACE_ID, {
      ...leadInput,
      contact: { ...leadInput.contact, email: "sam@northwind.example", name: "Sam Rivera" },
      lead: { ...leadInput.lead, nextAction: "Invite Sam to a discovery call" },
    });

    expect(second?.company.id).toBe(first?.company.id);
    expect(second?.contact.id).not.toBe(first?.contact.id);
    expect(createLead("another-workspace", leadInput)).toBeNull();
  });
});
