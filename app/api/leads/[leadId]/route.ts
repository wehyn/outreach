import { DEMO_WORKSPACE_ID, getLeadById, updateLead } from "@/lib/leads/demo-repository";
import { updateLeadSchema } from "@/lib/validation/lead";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const { leadId } = await params;
  const existingLead = getLeadById(leadId, DEMO_WORKSPACE_ID);

  if (!existingLead) {
    return Response.json({ error: "Lead not found in this workspace." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = updateLeadSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "The lead update could not be validated.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const lead = updateLead(leadId, DEMO_WORKSPACE_ID, parsed.data);

  if (!lead) {
    return Response.json({ error: "Lead not found in this workspace." }, { status: 404 });
  }

  return Response.json({ lead });
}
