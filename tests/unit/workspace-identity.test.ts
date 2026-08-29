import { describe, expect, it } from "vitest";

import { DEMO_WORKSPACE_ID } from "../../lib/workspace";

describe("workspace identity", () => {
  it("exposes the default workspace without importing a storage adapter", () => {
    expect(DEMO_WORKSPACE_ID).toBe("workspace-wayne-demo");
  });
});
