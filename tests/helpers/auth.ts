import { POST as login } from "../../app/api/auth/login/route";

export async function getTestSessionCookie() {
  const response = await login(
    new Request("http://localhost/api/auth/login", {
      body: JSON.stringify({ email: "wayne@example.com", password: "test-password-1234" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  );
  const setCookie = response.headers.get("set-cookie");
  const cookie = setCookie?.split(";", 1)[0];

  if (response.status !== 200 || !cookie) {
    throw new Error("Test authentication did not create a session cookie.");
  }

  return cookie;
}
