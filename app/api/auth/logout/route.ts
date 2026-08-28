import { clearSessionCookie, revokeSession } from "@/lib/auth";

export async function POST(request: Request) {
  await revokeSession(request);

  const response = Response.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
