import { describe, expect, it } from "vitest";

import {
  DEMO_WORKSPACE_ID,
  getLeadById,
  updateLead,
} from "../../lib/leads/demo-repository";

describe("demo lead mutations", () => {
  it("updates a lead and records a stage-change activity", () => {
    const lead = getLeadById("lead-maya-chen", DEMO_WORKSPACE_ID);

    expect(lead).not.toBeNull();

    const updated = updateLead("lead-maya-chen", DEMO_WORKSPACE_ID, {
      nextAction: "Send the revised audit outline",
      nextActionDate: "2026-08-30",
      stage: "Contacted",
    });

    expect(updated).toMatchObject({
      nextAction: "Send the revised audit outline",
      nextActionDate: "2026-08-30",
      stage: "Contacted",
    });
    expect(updated?.activity.at(-1)).toMatchObject({
      body: "Moved from Ready to Contact to Contacted.",
      type: "stage_change",
    });
  });

  it("does not update a lead from another workspace", () => {
    expect(
      updateLead("lead-sofia-patel", "another-workspace", {
        nextAction: "Should not be saved",
      }),
    ).toBeNull();
  });
});
