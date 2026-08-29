import { getWorkspaceContext } from "@/lib/auth";
import { createLead } from "@/lib/leads/repository";
import { createLeadSchema } from "@/lib/validation/lead";

export async function POST(request: Request) {
  const workspace = await getWorkspaceContext(request);

  if (!workspace) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createLeadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Lead details need attention.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const lead = createLead(workspace.workspaceId, parsed.data);

  if (!lead) {
    return Response.json({ error: "Workspace could not be found." }, { status: 404 });
  }

  return Response.json({ lead }, { status: 201 });
}
