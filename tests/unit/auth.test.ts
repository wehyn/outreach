import { beforeEach, describe, expect, it } from "vitest";

import {
  authenticateCredentials,
  createSession,
  getSessionFromToken,
  getWorkspaceContext,
  hasRegisteredUser,
  registerCredentials,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from "../../lib/auth";
import { getDatabase } from "../../lib/db";
import { DEMO_WORKSPACE_ID } from "../../lib/leads/demo-repository";

const AUTH_EMAIL = "wayne@example.com";
const AUTH_PASSWORD = "test-password-1234";

beforeEach(() => {
  process.env.OUTREACH_AUTH_EMAIL = AUTH_EMAIL;
  process.env.OUTREACH_AUTH_PASSWORD = AUTH_PASSWORD;
  process.env.OUTREACH_AUTH_NAME = "Wayne";
});

describe("local session authentication", () => {
  it("registers the first local account and resolves it to the demo workspace", async () => {
    expect(await hasRegisteredUser()).toBe(false);

    const identity = await registerCredentials("new-owner@example.com", AUTH_PASSWORD, "New Owner");

    expect(identity).toMatchObject({
      email: "new-owner@example.com",
      userName: "New Owner",
      workspaceId: DEMO_WORKSPACE_ID,
    });
    expect(await hasRegisteredUser()).toBe(true);
    expect(await authenticateCredentials("new-owner@example.com", AUTH_PASSWORD)).toMatchObject({
      email: "new-owner@example.com",
      userName: "New Owner",
    });
  });

  it("does not replace the existing first account during a second registration", async () => {
    expect(await registerCredentials(AUTH_EMAIL, AUTH_PASSWORD, "Wayne")).not.toBeNull();

    expect(await registerCredentials("second-owner@example.com", AUTH_PASSWORD, "Second Owner")).toBeNull();
    expect(await authenticateCredentials("second-owner@example.com", AUTH_PASSWORD)).toBeNull();
  });

  it("does not provision the configured account after a failed first login", async () => {
    expect(await hasRegisteredUser()).toBe(false);

    expect(await authenticateCredentials(AUTH_EMAIL, "wrong-password")).toBeNull();

    expect(await hasRegisteredUser()).toBe(false);
  });

  it("enforces the single-account invariant at the database boundary", () => {
    const database = getDatabase();
    const insertUser = database.prepare(
      "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    );

    insertUser.run("user-one", "one@example.com", "One", "hash-one", "2026-01-01T00:00:00.000Z");

    expect(() => {
      insertUser.run("user-two", "two@example.com", "Two", "hash-two", "2026-01-01T00:00:00.000Z");
    }).toThrow();
  });

  it("accepts configured credentials and rejects an invalid password", async () => {
    expect(await authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD)).toMatchObject({
      email: AUTH_EMAIL,
      workspaceId: DEMO_WORKSPACE_ID,
    });
    expect(await authenticateCredentials(AUTH_EMAIL, "wrong-password")).toBeNull();
  });

  it("resolves a session to its workspace membership without trusting client workspace input", async () => {
    const identity = await authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    expect(identity).not.toBeNull();

    const session = await createSession(identity!);
    const resolved = await getSessionFromToken(session.token);

    expect(resolved).toMatchObject({
      email: AUTH_EMAIL,
      workspaceId: DEMO_WORKSPACE_ID,
      workspaceName: "Wayne's workspace",
    });
    expect(await getSessionFromToken("not-a-session-token")).toBeNull();
  });

  it("reads the workspace from the HttpOnly session cookie", async () => {
    const identity = await authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    const session = await createSession(identity!);
    const request = new Request("http://localhost/", {
      headers: { cookie: `${SESSION_COOKIE_NAME}=${session.token}` },
    });

    await expect(getWorkspaceContext(request)).resolves.toMatchObject({
      workspaceId: DEMO_WORKSPACE_ID,
    });
  });

  it("sets a secure session cookie without exposing the token to client JavaScript", async () => {
    const identity = await authenticateCredentials(AUTH_EMAIL, AUTH_PASSWORD);
    const session = await createSession(identity!);
    const response = new Response(null);

    setSessionCookie(response, session.token);

    expect(response.headers.get("set-cookie")).toEqual(
      expect.stringContaining(`${SESSION_COOKIE_NAME}=${session.token}`),
    );
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("HttpOnly"));
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("SameSite=Lax"));
  });
});
