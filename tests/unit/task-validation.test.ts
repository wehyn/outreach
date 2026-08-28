import { describe, expect, it } from "vitest";

import { createTaskSchema, updateTaskSchema } from "../../lib/validation/task";

describe("task validation", () => {
  it("accepts a titled task with a due date and priority", () => {
    const result = createTaskSchema.safeParse({
      dueDate: "2026-09-02",
      priority: "high",
      title: "Send the analytics comparison",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty titles, invalid dates, and unknown priorities", () => {
    expect(createTaskSchema.safeParse({ dueDate: "2026-09-02", priority: "high", title: " " }).success).toBe(false);
    expect(createTaskSchema.safeParse({ dueDate: "next week", priority: "high", title: "Send it" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ dueDate: "2026-09-02", priority: "urgent", title: "Send it" }).success).toBe(false);
  });

  it("accepts only the completed task transition", () => {
    expect(updateTaskSchema.safeParse({ status: "completed" }).success).toBe(true);
    expect(updateTaskSchema.safeParse({ status: "open" }).success).toBe(false);
  });
});
