import { afterEach, describe, expect, it, vi } from "vitest";

import { getPersistence } from "../../lib/persistence";
import {
  addLeadActivity,
  createLead,
  getLeadById,
  listLeads,
  updateLead,
} from "../../lib/leads/repository";
import { DEMO_WORKSPACE_ID } from "../../lib/leads/demo-repository";
import { completeTask, createTask, getTaskById, listTasks } from "../../lib/tasks/repository";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("persistence provider boundary", () => {
  it("exposes existing lead and task behavior through one provider", async () => {
    const persistence = getPersistence();

    expect(await persistence.leads.listLeads(DEMO_WORKSPACE_ID)).not.toHaveLength(0);
    expect(await persistence.tasks.listTasks(DEMO_WORKSPACE_ID)).not.toHaveLength(0);
  });

  it("routes public lead and task repositories through the provider", async () => {
    expect(await listLeads(DEMO_WORKSPACE_ID)).toEqual(await getPersistence().leads.listLeads(DEMO_WORKSPACE_ID));
    expect(await listTasks(DEMO_WORKSPACE_ID)).toEqual(await getPersistence().tasks.listTasks(DEMO_WORKSPACE_ID));
  });

  it("dispatches every public lead and task operation through its provider port", async () => {
    const persistence = getPersistence();
    const leadOperations = [
      vi.spyOn(persistence.leads, "addLeadActivity"),
      vi.spyOn(persistence.leads, "createLead"),
      vi.spyOn(persistence.leads, "getLeadById"),
      vi.spyOn(persistence.leads, "listLeads"),
      vi.spyOn(persistence.leads, "updateLead"),
    ];
    const taskOperations = [
      vi.spyOn(persistence.tasks, "completeTask"),
      vi.spyOn(persistence.tasks, "createTask"),
      vi.spyOn(persistence.tasks, "getTaskById"),
      vi.spyOn(persistence.tasks, "listTasks"),
    ];

    await listLeads(DEMO_WORKSPACE_ID);
    await getLeadById("lead-maya-chen", DEMO_WORKSPACE_ID);
    await createLead(DEMO_WORKSPACE_ID, {
      company: { domain: "dispatch.example", location: "Remote", name: "Dispatch Co" },
      contact: { email: "owner@dispatch.example", name: "Dispatch Owner", title: "Founder" },
      lead: {
        estimatedValue: "$4,000",
        nextAction: "Send a discovery note",
        nextActionDate: "2026-09-10",
        observedPainPoint: "The marketing site is difficult to find.",
        personalizationHook: "Their recent launch needs a stronger search presence.",
        priority: "medium",
        recommendedOffer: "Technical SEO audit",
        researchNotes: "Public launch notes mention organic growth goals.",
        serviceInterest: "SEO",
        source: "Research",
        stage: "New",
      },
    });
    await updateLead("lead-maya-chen", DEMO_WORKSPACE_ID, { nextAction: "Send an updated audit note" });
    await addLeadActivity("lead-maya-chen", DEMO_WORKSPACE_ID, { body: "Boundary test note.", type: "note" });

    await listTasks(DEMO_WORKSPACE_ID);
    await getTaskById("task-maya-audit", DEMO_WORKSPACE_ID);
    await createTask("lead-maya-chen", DEMO_WORKSPACE_ID, {
      dueDate: "2026-09-11",
      priority: "medium",
      title: "Boundary test follow-up",
    });
    await completeTask("task-maya-audit", DEMO_WORKSPACE_ID);

    expect(leadOperations.every((operation) => operation.mock.calls.length > 0)).toBe(true);
    expect(taskOperations.every((operation) => operation.mock.calls.length > 0)).toBe(true);
  });
});
