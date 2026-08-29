import { authenticateCredentials, createSession, hasRegisteredUser, setSessionCookie } from "@/lib/auth";
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

  const identity = await authenticateCredentials(parsed.data.email, parsed.data.password);

  if (!identity) {
    if (!(await hasRegisteredUser())) {
      return Response.json(
        {
          code: "ACCOUNT_NOT_REGISTERED",
          error: "No account is registered yet. Create a local account to get started.",
        },
        { status: 409 },
      );
    }

    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session = await createSession(identity);
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
