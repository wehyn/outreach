import { describe, expect, it } from "vitest";

import { updateLeadSchema } from "../../lib/validation/lead";

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
});
