import { describe, expect, it } from "vitest";

import { buildDashboardData } from "../../lib/dashboard/dashboard";
import { addLeadActivity, DEMO_WORKSPACE_ID, listLeads, updateLead } from "../../lib/leads/demo-repository";
import { completeTask, listTasks } from "../../lib/tasks/demo-repository";

describe("dashboard data", () => {
  it("derives pipeline, follow-up, and activity state from the shared repositories", () => {
    const before = buildDashboardData(listLeads(DEMO_WORKSPACE_ID), listTasks(DEMO_WORKSPACE_ID), new Date("2026-08-30T12:00:00Z"));

    expect(before.activeLeadCount).toBe(6);
    expect(before.openTaskCount).toBe(4);
    expect(before.pipeline.find((column) => column.title === "Ready to Contact")?.leads).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "lead-maya-chen" })]),
    );

    updateLead("lead-maya-chen", DEMO_WORKSPACE_ID, { stage: "Contacted" });
    completeTask("task-maya-audit", DEMO_WORKSPACE_ID);
    addLeadActivity("lead-maya-chen", DEMO_WORKSPACE_ID, {
      body: "Sent the audit outline.",
      occurredAt: "2026-08-30T10:15:00Z",
      type: "email",
    });

    const after = buildDashboardData(listLeads(DEMO_WORKSPACE_ID), listTasks(DEMO_WORKSPACE_ID), new Date("2026-08-30T12:00:00Z"));

    expect(after.openTaskCount).toBe(3);
    expect(after.pipeline.find((column) => column.title === "Ready to Contact")?.leads).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "lead-maya-chen" })]),
    );
    expect(after.pipeline.find((column) => column.title === "Contacted")?.leads).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "lead-maya-chen" })]),
    );
    expect(after.recentActivities).toEqual(
      expect.arrayContaining([expect.objectContaining({ detail: expect.stringContaining("Sent the audit outline.") })]),
    );
  });
});
