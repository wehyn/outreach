import { authenticateCredentials, createSession, isAuthConfigured, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "The login could not be validated.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  if (!isAuthConfigured()) {
    return Response.json(
      { error: "Local authentication is not configured. Set OUTREACH_AUTH_EMAIL and OUTREACH_AUTH_PASSWORD." },
      { status: 503 },
    );
  }

  const identity = authenticateCredentials(parsed.data.email, parsed.data.password);

  if (!identity) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session = createSession(identity);
  const response = Response.json({
    user: {
      email: identity.email,
      name: identity.userName,
    },
    workspace: {
      id: identity.workspaceId,
      name: identity.workspaceName,
    },
  });

  setSessionCookie(response, session.token);
  return response;
}
