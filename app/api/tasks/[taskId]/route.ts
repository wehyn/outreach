import { completeTask, DEMO_WORKSPACE_ID, getTaskById } from "@/lib/tasks/demo-repository";
import { updateTaskSchema } from "@/lib/validation/task";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  const { taskId } = await params;
  const task = getTaskById(taskId, DEMO_WORKSPACE_ID);

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

  const updatedTask = completeTask(taskId, DEMO_WORKSPACE_ID);

  if (!updatedTask) {
    return Response.json({ error: "Task not found." }, { status: 404 });
  }

  return Response.json({ task: updatedTask });
}
