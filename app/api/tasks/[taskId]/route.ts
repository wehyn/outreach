import { getWorkspaceContext } from "@/lib/auth";
import { completeTask, getTaskById } from "@/lib/tasks/repository";
import { updateTaskSchema } from "@/lib/validation/task";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const workspace = await getWorkspaceContext(request);

  if (!workspace) {
    return Response.json({ error: "Authentication required." }, { status: 401 });
  }

  const { taskId } = await params;
  const task = await getTaskById(taskId, workspace.workspaceId);

  if (!task) {
    return Response.json({ error: "Task not found." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid task update.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const updatedTask = await completeTask(taskId, workspace.workspaceId);

  if (!updatedTask) {
    return Response.json({ error: "Task not found." }, { status: 404 });
  }

  return Response.json({ task: updatedTask });
}
