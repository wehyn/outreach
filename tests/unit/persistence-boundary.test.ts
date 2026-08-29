import { describe, expect, it } from "vitest";

import { getPersistence } from "../../lib/persistence";
import { listLeads } from "../../lib/leads/repository";
import { DEMO_WORKSPACE_ID } from "../../lib/leads/demo-repository";
import { listTasks } from "../../lib/tasks/repository";

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
});
