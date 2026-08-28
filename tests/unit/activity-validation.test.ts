import { describe, expect, it } from "vitest";

import { createActivitySchema } from "../../lib/validation/activity";

describe("activity validation", () => {
  it("accepts a manual activity with an optional timestamp", () => {
    const result = createActivitySchema.safeParse({
      body: "Sent the requested case study.",
      occurredAt: "2026-08-30T10:15:00Z",
      type: "email",
    });

    expect(result.success).toBe(true);
  });

  it("rejects stage changes, empty bodies, and invalid timestamps", () => {
    expect(createActivitySchema.safeParse({ body: "Moved", type: "stage_change" }).success).toBe(false);
    expect(createActivitySchema.safeParse({ body: "   ", type: "note" }).success).toBe(false);
    expect(createActivitySchema.safeParse({ body: "Call", occurredAt: "tomorrow", type: "call" }).success).toBe(false);
  });
});
