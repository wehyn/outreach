import { describe, expect, it } from "vitest";

import { POST as login } from "../../app/api/auth/login/route";
import { POST as logout } from "../../app/api/auth/logout/route";
import { POST as register } from "../../app/api/auth/register/route";
import { PATCH as updateLead } from "../../app/api/leads/[leadId]/route";
import { getWorkspaceContext } from "../../lib/auth";
import { DEMO_WORKSPACE_ID } from "../../lib/leads/demo-repository";

const AUTH_EMAIL = "wayne@example.com";
const AUTH_PASSWORD = "test-password-1234";

function requestWithBody(body: unknown, cookie?: string) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (cookie) {
    headers.set("cookie", cookie);
  }

  return new Request("http://localhost/api", {
    body: JSON.stringify(body),
    headers,
    method: "POST",
  });
}

async function loginForCookie() {
  const response = await login(requestWithBody({ email: AUTH_EMAIL, password: AUTH_PASSWORD }));
  const setCookie = response.headers.get("set-cookie");
  const cookie = setCookie?.split(";", 1)[0];

  expect(response.status).toBe(200);
  expect(cookie).toBeTruthy();

  return cookie as string;
}

describe("authentication API", () => {
  it("explains that registration is required when no account exists", async () => {
    const response = await login(requestWithBody({ email: "new-owner@example.com", password: AUTH_PASSWORD }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      code: "ACCOUNT_NOT_REGISTERED",
      error: "No account is registered yet. Create a local account to get started.",
    });
  });

  it("registers the first account and creates a session cookie", async () => {
    const response = await register(
      requestWithBody({
        confirmPassword: AUTH_PASSWORD,
        email: AUTH_EMAIL,
        name: "Wayne",
        password: AUTH_PASSWORD,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toMatchObject({
      user: { email: AUTH_EMAIL, name: "Wayne" },
      workspace: { id: DEMO_WORKSPACE_ID, name: "Wayne's workspace" },
    });
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("outreach_session="));
  });

  it("rejects registration after the first account already exists", async () => {
    await register(
      requestWithBody({
        confirmPassword: AUTH_PASSWORD,
        email: AUTH_EMAIL,
        name: "Wayne",
        password: AUTH_PASSWORD,
      }),
    );

    const response = await register(
      requestWithBody({
        confirmPassword: AUTH_PASSWORD,
        email: "second-owner@example.com",
        name: "Second Owner",
        password: AUTH_PASSWORD,
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      code: "ACCOUNT_EXISTS",
      error: "An account is already registered. Sign in with that account.",
    });
  });

  it("creates a session cookie for valid configured credentials", async () => {
    const response = await login(requestWithBody({ email: AUTH_EMAIL, password: AUTH_PASSWORD }));
    const payload = await response.json();
    const cookie = response.headers.get("set-cookie");

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      user: { email: AUTH_EMAIL, name: "Wayne" },
      workspace: { id: DEMO_WORKSPACE_ID, name: "Wayne's workspace" },
    });
    expect(cookie).toEqual(expect.stringContaining("outreach_session="));
    expect(cookie).toEqual(expect.stringContaining("HttpOnly"));
  });

  it("rejects invalid credentials without creating a session", async () => {
    await register(
      requestWithBody({
        confirmPassword: AUTH_PASSWORD,
        email: AUTH_EMAIL,
        name: "Wayne",
        password: AUTH_PASSWORD,
      }),
    );

    const response = await login(requestWithBody({ email: AUTH_EMAIL, password: "wrong-password" }));

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("keeps first-account registration available after a failed configured login", async () => {
    const loginResponse = await login(requestWithBody({ email: AUTH_EMAIL, password: "wrong-password" }));

    expect(loginResponse.status).toBe(409);

    const registrationResponse = await register(
      requestWithBody({
        confirmPassword: AUTH_PASSWORD,
        email: AUTH_EMAIL,
        name: "Wayne",
        password: AUTH_PASSWORD,
      }),
    );

    expect(registrationResponse.status).toBe(201);
  });

  it("rejects protected lead mutations without an authenticated session", async () => {
    const response = await updateLead(
      requestWithBody({ nextAction: "Should not be saved", nextActionDate: "2026-09-04" }),
      { params: Promise.resolve({ leadId: "lead-maya-chen" }) },
    );

    expect(response.status).toBe(401);
  });

  it("allows a protected lead mutation through the authenticated workspace session", async () => {
    const cookie = await loginForCookie();
    const response = await updateLead(
      requestWithBody(
        { nextAction: "Send the revised audit outline", nextActionDate: "2026-09-04" },
        cookie,
      ),
      { params: Promise.resolve({ leadId: "lead-maya-chen" }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.lead).toMatchObject({
      nextAction: "Send the revised audit outline",
      workspaceId: DEMO_WORKSPACE_ID,
    });
    await expect(
      getWorkspaceContext(new Request("http://localhost/", { headers: { cookie } })),
    ).resolves.toMatchObject({ workspaceId: DEMO_WORKSPACE_ID });
  });

  it("invalidates the session when the user logs out", async () => {
    const cookie = await loginForCookie();
    const response = await logout(new Request("http://localhost/api/auth/logout", { headers: { cookie }, method: "POST" }));

    expect(response.status).toBe(200);
    await expect(
      getWorkspaceContext(new Request("http://localhost/", { headers: { cookie } })),
    ).resolves.toBeNull();
    expect(response.headers.get("set-cookie")).toEqual(expect.stringContaining("Max-Age=0"));
  });
});
