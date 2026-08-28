import { describe, expect, it } from "vitest";

import { POST as createTask } from "../../app/api/leads/[leadId]/tasks/route";
import { PATCH as updateTask } from "../../app/api/tasks/[taskId]/route";

function requestWithBody(body: unknown) {
  return new Request("http://localhost/api", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

describe("task API", () => {
  it("creates a task for a scoped lead", async () => {
    const response = await createTask(
      requestWithBody({
        dueDate: "2026-09-03",
        priority: "low",
        title: "Send the analytics comparison",
      }),
      { params: Promise.resolve({ leadId: "lead-ari-lopez" }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.task).toMatchObject({
      dueDate: "2026-09-03",
      leadId: "lead-ari-lopez",
      status: "open",
    });
  });

  it("completes an open task", async () => {
    const response = await updateTask(
      requestWithBody({ status: "completed" }),
      { params: Promise.resolve({ taskId: "task-maya-audit" }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.task).toMatchObject({ id: "task-maya-audit", status: "completed" });
  });

  it("rejects invalid creation and completion requests", async () => {
    const invalidCreation = await createTask(
      requestWithBody({ dueDate: "tomorrow", priority: "high", title: " " }),
      { params: Promise.resolve({ leadId: "lead-ari-lopez" }) },
    );
    const invalidCompletion = await updateTask(
      requestWithBody({ status: "open" }),
      { params: Promise.resolve({ taskId: "task-evan-proposal" }) },
    );

    expect(invalidCreation.status).toBe(422);
    expect(invalidCompletion.status).toBe(422);
  });
});
