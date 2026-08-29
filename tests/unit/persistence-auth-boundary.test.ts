import { afterEach, describe, expect, it, vi } from "vitest";

import { hasRegisteredUser } from "../../lib/auth";
import { getPersistence } from "../../lib/persistence";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("authentication persistence boundary", () => {
  it("routes registered-user checks through the auth repository", async () => {
    const hasRegisteredUserInRepository = vi.spyOn(getPersistence().auth, "hasRegisteredUser");

    expect(await hasRegisteredUser()).toBe(false);
    expect(hasRegisteredUserInRepository).toHaveBeenCalledOnce();
  });
});
