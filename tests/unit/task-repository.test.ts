import { describe, expect, it } from "vitest";

import {
  completeTask,
  createTask,
  DEMO_WORKSPACE_ID,
  getTaskById,
  listTasks,
} from "../../lib/tasks/demo-repository";

describe("demo task mutations", () => {
  it("creates a task for a lead and completes it", () => {
    const created = createTask("lead-rina-kim", DEMO_WORKSPACE_ID, {
      dueDate: "2026-09-02",
      priority: "medium",
      title: "Send the analytics comparison",
    });

    expect(created).toMatchObject({
      dueDate: "2026-09-02",
      leadId: "lead-rina-kim",
      priority: "medium",
      status: "open",
      title: "Send the analytics comparison",
    });

    const completed = completeTask(created?.id ?? "missing-task", DEMO_WORKSPACE_ID);

    expect(completed).toMatchObject({
      id: created?.id,
      status: "completed",
    });
    expect(completed?.completedAt).toEqual(expect.any(String));
  });

  it("lists only tasks from the requested workspace", () => {
    expect(listTasks("another-workspace")).toEqual([]);
  });

  it("returns a task by id only inside its workspace", () => {
    const task = listTasks(DEMO_WORKSPACE_ID)[0];

    expect(task).toBeDefined();
    expect(getTaskById(task?.id ?? "missing-task", "another-workspace")).toBeNull();
  });
});
