import { describe, expect, it } from "vitest";

import { POST as login } from "../../app/api/auth/login/route";
import { POST as logout } from "../../app/api/auth/logout/route";
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
    const response = await login(requestWithBody({ email: AUTH_EMAIL, password: "wrong-password" }));

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toBeNull();
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
