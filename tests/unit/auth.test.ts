import { beforeEach, describe, expect, it } from "vitest";

import {
  authenticateCredentials,
  createSession,
  getSessionFromToken,
  getWorkspaceContext,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from "../../lib/auth";
import { DEMO_WORKSPACE_ID } from "../../lib/leads/demo-repository";

const AUTH_EMAIL = "wayne@example.com";
const AUTH_PASSWORD = "test-password-1234";

beforeEach(() => {
  process.env.OUTREACH_AUTH_EMAIL = AUTH_EMAIL;
  process.env.OUTREACH_AUTH_PASSWORD = AUTH_PASSWORD;
  process.env.OUTREACH_AUTH_NAME = "Wayne";
});

describe("local session authentication", () => {
  it("accepts configured credentials and rejects an invalid password", () => {
    expect(authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD)).toMatchObject({
      email: AUTH_EMAIL,
      workspaceId: DEMO_WORKSPACE_ID,
    });
    expect(authenticateCredentials(AUTH_EMAIL, "wrong-password")).toBeNull();
  });

  it("resolves a session to its workspace membership without trusting client workspace input", () => {
    const identity = authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    expect(identity).not.toBeNull();

    const session = createSession(identity!);
    const resolved = getSessionFromToken(session.token);

    expect(resolved).toMatchObject({
      email: AUTH_EMAIL,
      workspaceId: DEMO_WORKSPACE_ID,
      workspaceName: "Wayne's workspace",
    });
    expect(getSessionFromToken("not-a-session-token")).toBeNull();
  });

  it("reads the workspace from the HttpOnly session cookie", async () => {
    const identity = authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    const session = createSession(identity!);
    const request = new Request("http://localhost/", {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${session.token}` },
    });

    await expect(getWorkspaceContext(request)).resolves.toMatchObject({
      workspaceId: DEMO_WORKSPACE_ID,
    });
  });

  it("sets a secure session cookie without exposing the token to client JavaScript", () => {
    const identity = authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    const session = createSession(identity!);
    const response = new Response(null);

    setSessionCookie(response, session.token);

    expect(response.headers.get("set-cookie")).toEqual(
      expect.stringContaining(`${SESSION_COOKIE_NAME}=${session.token}`),
    );
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("HttpOnly"));
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("SameSite=Lax"));
  });
});
