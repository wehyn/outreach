import { afterEach, describe, expect, it, vi } from "vitest";

import {
  authenticateCredentials,
  createSession,
  getSessionFromToken,
  hasRegisteredUser,
  registerCredentials,
  revokeSession,
} from "../../lib/auth";
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

  it("dispatches account and session operations through the auth provider port", async () => {
    const authRepository = getPersistence().auth;
    const operations = [
      vi.spyOn(authRepository, "createFirstUser"),
      vi.spyOn(authRepository, "createSession"),
      vi.spyOn(authRepository, "deleteExpiredSessions"),
      vi.spyOn(authRepository, "getSessionByTokenHash"),
      vi.spyOn(authRepository, "getUserByEmail"),
      vi.spyOn(authRepository, "getWorkspaceForUser"),
      vi.spyOn(authRepository, "revokeSession"),
    ];

    const identity = await registerCredentials("new-owner@example.com", "test-password-1234", "New Owner");
    expect(identity).not.toBeNull();
    expect(await authenticateCredentials("new-owner@example.com", "test-password-1234")).not.toBeNull();

    const session = await createSession(identity!);
    expect(await getSessionFromToken(session.token)).not.toBeNull();
    await revokeSession(
      new Request("http://localhost/", {
        headers: { cookie: `outreach_session=${session.token}` },
      }),
    );

    expect(operations.every((operation) => operation.mock.calls.length > 0)).toBe(true);
  });
});
