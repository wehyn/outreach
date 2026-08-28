import { describe, expect, it } from "vitest";

import { POST as createLead } from "../../app/api/leads/route";
import { getTestSessionCookie } from "../helpers/auth";

const validLead = {
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
    priority: "high",
    recommendedOffer: "A focused information architecture review.",
    researchNotes: "Manual research completed before first contact.",
    serviceInterest: "SEO",
    source: "Manual entry",
    stage: "Ready to Contact",
  },
};

function requestWithBody(body: unknown, cookie?: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (cookie) {
    headers.set("cookie", cookie);
  }

  return new Request("http://localhost/api/leads", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

describe("lead creation API", () => {
  it("rejects an unauthenticated create request", async () => {
    const response = await createLead(requestWithBody(validLead));

    expect(response.status).toBe(401);
  });

  it("creates a normalized lead for the authenticated workspace", async () => {
    const response = await createLead(requestWithBody(validLead, await getTestSessionCookie()));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.lead).toMatchObject({
      company: { name: "Northwind Analytics" },
      contact: { email: "alex@northwind.example" },
      name: "Alex Morgan",
      workspaceId: "workspace-wayne-demo",
    });
  });

  it("validates the relationship payload before writing", async () => {
    const cookie = await getTestSessionCookie();
    const response = await createLead(
      requestWithBody({ ...validLead, contact: { ...validLead.contact, email: "not-an-email" } }, cookie),
    );

    expect(response.status).toBe(422);
  });
});
