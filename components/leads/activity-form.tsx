"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { MANUAL_ACTIVITY_TYPES, type ManualActivityType } from "@/lib/leads/activity";

const activityLabels: Record<ManualActivityType, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  note: "Research note",
};

type FormState = "idle" | "saving" | "saved" | "error";

function getErrorMessage(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "Activity could not be logged.";
}

export function ActivityForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [type, setType] = useState<ManualActivityType>("note");
  const [body, setBody] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/leads/${leadId}/activities`, {
        body: JSON.stringify({ body, type }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(payload));
      }

      setBody("");
      setState("saved");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Activity could not be logged.");
      setState("error");
    }
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <div className="activity-form-fields">
        <label className="form-field">
          <span>Activity type</span>
          <select value={type} onChange={(event) => setType(event.target.value as ManualActivityType)}>
            {MANUAL_ACTIVITY_TYPES.map((activityType) => (
              <option key={activityType} value={activityType}>
                {activityLabels[activityType]}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field form-field-grow">
          <span>What happened?</span>
          <textarea
            maxLength={2000}
            onChange={(event) => {
              setBody(event.target.value);
              if (state !== "idle") {
                setState("idle");
              }
            }}
            placeholder="Capture the useful context for the next touch."
            required
            rows={3}
            value={body}
          />
        </label>
      </div>
      <div className="activity-form-footer">
        <button className="button button-primary" disabled={state === "saving"} type="submit">
          {state === "saving" ? "Logging…" : "Log activity"}
        </button>
        <p aria-live="polite" className={`form-status form-status-${state}`}>
          {state === "saved" ? "Activity added to the timeline." : ""}
          {state === "error" ? errorMessage : ""}
        </p>
      </div>
    </form>
  );
}
