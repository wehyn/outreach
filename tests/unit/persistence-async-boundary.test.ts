import { describe, expect, it } from "vitest";

import { hasRegisteredUser } from "../../lib/auth";
import { DEMO_WORKSPACE_ID } from "../../lib/workspace";
import { listLeads } from "../../lib/leads/repository";

describe("async persistence contract", () => {
  it("keeps public persistence operations awaitable for remote providers", async () => {
    await expect(listLeads(DEMO_WORKSPACE_ID)).resolves.not.toHaveLength(0);
    await expect(hasRegisteredUser()).resolves.toBe(false);
  });
});
