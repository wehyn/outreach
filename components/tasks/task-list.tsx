"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Task } from "@/lib/tasks/task";

function formatTaskDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "Task could not be completed.";
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleComplete(taskId: string) {
    setCompletingId(taskId);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        body: JSON.stringify({ status: "completed" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(payload));
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Task could not be completed.");
    } finally {
      setCompletingId(null);
    }
  }

  if (tasks.length === 0) {
    return <p className="task-empty">No follow-ups are attached to this lead yet.</p>;
  }

  return (
    <div className="task-list task-list-interactive">
      {tasks.map((task) => (
        <div className={`task-row task-row-${task.status}`} key={task.id}>
          <button
            aria-label={task.status === "completed" ? `${task.title} completed` : `Complete ${task.title}`}
            className="task-complete-button"
            disabled={task.status === "completed" || completingId !== null}
            onClick={() => handleComplete(task.id)}
            type="button"
          >
            <span aria-hidden="true" className="task-check-mark">
              {task.status === "completed" ? "✓" : ""}
            </span>
          </button>
          <div className="task-row-content">
            <div className="task-row-title-line">
              <p>{task.title}</p>
              <span className={`task-row-priority task-row-priority-${task.priority}`}>{task.priority}</span>
            </div>
            <div className="task-row-meta">
              <Link href={`/leads/${task.leadId}`}>
                {task.leadName} · {task.companyName}
              </Link>
              <time dateTime={task.dueDate}>Due {formatTaskDate(task.dueDate)}</time>
            </div>
          </div>
        </div>
      ))}
      <p aria-live="polite" className="form-status form-status-error task-list-error">
        {errorMessage}
      </p>
    </div>
  );
}
