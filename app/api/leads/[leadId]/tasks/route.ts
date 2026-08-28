import { createTask, DEMO_WORKSPACE_ID } from "@/lib/tasks/demo-repository";
import { createTaskSchema } from "@/lib/validation/task";
import { getLeadById } from "@/lib/leads/demo-repository";

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

  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid task.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const task = createTask(leadId, DEMO_WORKSPACE_ID, parsed.data);

  if (!task) {
    return Response.json({ error: "Lead not found." }, { status: 404 });
  }

  return Response.json({ task }, { status: 201 });
}
