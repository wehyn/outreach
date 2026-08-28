import { describe, expect, it } from "vitest";

import { DEMO_WORKSPACE_ID, addLeadActivity, getLeadById } from "../../lib/leads/demo-repository";

describe("lead activity mutations", () => {
  it("appends a manual activity and updates last contacted time", () => {
    const before = getLeadById("lead-maya-chen", DEMO_WORKSPACE_ID);

    expect(before).not.toBeNull();

    const updated = addLeadActivity("lead-maya-chen", DEMO_WORKSPACE_ID, {
      body: "Sent the audit outline and asked for a short discovery call.",
      occurredAt: "2026-08-30T10:15:00Z",
      type: "email",
    });

    expect(updated?.lastContactedAt).toBe("2026-08-30T10:15:00Z");
    expect(updated?.activity.at(-1)).toMatchObject({
      body: "Sent the audit outline and asked for a short discovery call.",
      occurredAt: "2026-08-30T10:15:00Z",
      type: "email",
    });
  });

  it("keeps last contacted time unchanged for a research note", () => {
    const before = getLeadById("lead-sofia-patel", DEMO_WORKSPACE_ID);

    expect(before).not.toBeNull();

    const updated = addLeadActivity("lead-sofia-patel", DEMO_WORKSPACE_ID, {
      body: "Confirmed that the founder owns the content budget.",
      occurredAt: "2026-08-30T11:00:00Z",
      type: "note",
    });

    expect(updated?.lastContactedAt).toBe(before?.lastContactedAt);
    expect(updated?.activity.at(-1)?.type).toBe("note");
  });

  it("does not append activity across workspace boundaries", () => {
    expect(
      addLeadActivity("lead-rina-kim", "another-workspace", {
        body: "Should not be recorded.",
        type: "call",
      }),
    ).toBeNull();
  });
});
