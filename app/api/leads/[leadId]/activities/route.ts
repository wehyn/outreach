import { getWorkspaceContext } from "@/lib/auth";
import { addLeadActivity, getLeadById } from "@/lib/leads/demo-repository";
import { createActivitySchema } from "@/lib/validation/activity";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const workspace = await getWorkspaceContext(request);

  if (!workspace) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { leadId } = await params;
  const lead = getLeadById(leadId, workspace.workspaceId);

  if (!lead) {
    return Response.json({ error: "Lead not found." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = createActivitySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid activity.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const updatedLead = addLeadActivity(leadId, workspace.workspaceId, parsed.data);

  if (!updatedLead) {
    return Response.json({ error: "Lead not found." }, { status: 404 });
  }

  return Response.json({ lead: updatedLead }, { status: 201 });
}
