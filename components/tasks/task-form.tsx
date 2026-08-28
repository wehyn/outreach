"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { TASK_PRIORITIES, type TaskPriority } from "@/lib/tasks/task";

type FormState = "idle" | "saving" | "saved" | "error";

function getErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "Task could not be created.";
}

export function TaskForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/leads/${leadId}/tasks`, {
        body: JSON.stringify({ dueDate, priority, title }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(payload));
      }

      setTitle("");
      setDueDate("");
      setPriority("medium");
      setState("saved");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Task could not be created.");
      setState("error");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="form-field form-field-grow">
        <span>New follow-up</span>
        <input
          maxLength={160}
          onChange={(event) => {
            setTitle(event.target.value);
            if (state !== "idle") {
              setState("idle");
            }
          }}
          placeholder="Name the next useful action."
          required
          type="text"
          value={title}
        />
      </label>
      <div className="task-form-row">
        <label className="form-field">
          <span>Due date</span>
          <input required type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <label className="form-field">
          <span>Priority</span>
          <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            {TASK_PRIORITIES.map((taskPriority) => (
              <option key={taskPriority} value={taskPriority}>
                {taskPriority}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="task-form-footer">
        <button className="button button-primary" disabled={state === "saving"} type="submit">
          {state === "saving" ? "Adding…" : "Add task"}
        </button>
        <p aria-live="polite" className={`form-status form-status-${state}`}>
          {state === "saved" ? "Task added to follow-ups." : ""}
          {state === "error" ? errorMessage : ""}
        </p>
      </div>
    </form>
  );
}
