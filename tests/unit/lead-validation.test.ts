import { describe, expect, it } from "vitest";

import { createLeadSchema, updateLeadSchema } from "../../lib/validation/lead";

describe("lead update validation", () => {
  it("accepts a stage and complete next action", () => {
    const result = updateLeadSchema.safeParse({
      nextAction: "Send the audit outline",
      nextActionDate: "2026-08-30",
      stage: "Contacted",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty update and malformed next-action values", () => {
    expect(updateLeadSchema.safeParse({}).success).toBe(false);
    expect(updateLeadSchema.safeParse({ nextAction: "   " }).success).toBe(false);
    expect(updateLeadSchema.safeParse({ nextActionDate: "tomorrow" }).success).toBe(false);
  });

  it("accepts normalized company, contact, and lead creation input", () => {
    const result = createLeadSchema.safeParse({
      company: { domain: "northwind.example", location: "Denver, CO", name: "Northwind Analytics" },
      contact: { email: "alex@northwind.example", name: "Alex Morgan", title: "Founder" },
      lead: {
        estimatedValue: "$9k",
        nextAction: "Send a tailored audit outline",
        nextActionDate: "2026-09-10",
        observedPainPoint: "Their service pages are difficult to compare.",
        personalizationHook: "Mention the new analytics product launch.",
        priority: "high",
        recommendedOffer: "A focused information architecture review.",
        researchNotes: "Manual research completed before first contact.",
        serviceInterest: "SEO",
        source: "Manual entry",
        stage: "Ready to Contact",
      },
    });

    expect(result.success).toBe(true);
  });

  it("rejects incomplete relationships and malformed contact/date values", () => {
    expect(createLeadSchema.safeParse({}).success).toBe(false);
    expect(
      createLeadSchema.safeParse({
        company: { domain: "northwind.example", location: "Denver, CO", name: "Northwind Analytics" },
        contact: { email: "not-an-email", name: "Alex Morgan", title: "Founder" },
        lead: { nextAction: "Send it", nextActionDate: "tomorrow", priority: "high", stage: "New" },
      }).success,
    ).toBe(false);
  });
});
