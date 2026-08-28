import { createSession, registerCredentials, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "The registration could not be validated.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const identity = registerCredentials(parsed.data.email, parsed.data.password, parsed.data.name);

  if (!identity) {
    return Response.json(
      {
        code: "ACCOUNT_EXISTS",
        error: "An account is already registered. Sign in with that account.",
      },
      { status: 409 },
    );
  }

  const session = createSession(identity);
  const response = Response.json(
    {
      user: {
        email: identity.email,
        name: identity.userName,
      },
      workspace: {
        id: identity.workspaceId,
        name: identity.workspaceName,
      },
    },
    { status: 201 },
  );

  setSessionCookie(response, session.token);
  return response;
}
