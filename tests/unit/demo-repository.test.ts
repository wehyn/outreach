import { describe, expect, it } from "vitest";

import {
  DEMO_WORKSPACE_ID,
  getLeadById,
  groupLeadsByStage,
  listLeads,
} from "../../lib/leads/demo-repository";

const [firstLead] = listLeads(DEMO_WORKSPACE_ID);

describe("demo lead repository", () => {
  it("returns leads for the requested workspace", () => {
    const leads = listLeads(DEMO_WORKSPACE_ID);

    expect(leads.length).toBeGreaterThan(0);
    expect(leads.every((lead) => lead.workspaceId === DEMO_WORKSPACE_ID)).toBe(true);
  });

  it("does not return a lead across workspace boundaries", () => {
    expect(getLeadById(firstLead.id, "another-workspace")).toBeNull();
  });

  it("finds a lead with the context needed by its detail view", () => {
    const lead = getLeadById(firstLead.id, DEMO_WORKSPACE_ID);

    expect(lead).not.toBeNull();
    expect(lead).toMatchObject({
      company: expect.objectContaining({ name: expect.any(String) }),
      contact: expect.objectContaining({ name: expect.any(String) }),
      observedPainPoint: expect.any(String),
      nextAction: expect.any(String),
      activity: expect.arrayContaining([
        expect.objectContaining({ type: expect.any(String), body: expect.any(String) }),
      ]),
    });
  });

  it("groups leads into the ordered active pipeline", () => {
    const columns = groupLeadsByStage(listLeads(DEMO_WORKSPACE_ID));

    expect(columns.map((column) => column.title)).toEqual([
      "Ready to Contact",
      "Contacted",
      "Replied",
      "Meeting Booked",
    ]);
    expect(columns.flatMap((column) => column.leads)).toHaveLength(listLeads(DEMO_WORKSPACE_ID).length);
  });
});
