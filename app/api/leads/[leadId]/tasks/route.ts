import { getWorkspaceContext } from "@/lib/auth";
import { createTask } from "@/lib/tasks/repository";
import { createTaskSchema } from "@/lib/validation/task";
import { getLeadById } from "@/lib/leads/repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const workspace = await getWorkspaceContext(request);

  if (!workspace) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { leadId } = await params;
  const lead = await getLeadById(leadId, workspace.workspaceId);

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

  const task = await createTask(leadId, workspace.workspaceId, parsed.data);

  if (!task) {
    return Response.json({ error: "Lead not found." }, { status: 404 });
  }

  return Response.json({ task }, { status: 201 });
}
