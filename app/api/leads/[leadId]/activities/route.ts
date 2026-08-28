import { addLeadActivity, DEMO_WORKSPACE_ID, getLeadById } from "@/lib/leads/demo-repository";
import { createActivitySchema } from "@/lib/validation/activity";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const { leadId } = await params;
  const lead = getLeadById(leadId, DEMO_WORKSPACE_ID);

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

  const updatedLead = addLeadActivity(leadId, DEMO_WORKSPACE_ID, parsed.data);

  if (!updatedLead) {
    return Response.json({ error: "Lead not found." }, { status: 404 });
  }

  return Response.json({ lead: updatedLead }, { status: 201 });
}
