"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PIPELINE_STAGES, type LeadStage } from "@/lib/leads/pipeline";

type EditableLead = {
  id: string;
  stage: LeadStage;
  nextAction: string;
  nextActionDate: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

function responseError(payload: unknown) {
  if (typeof payload === "object" && payload !== null && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return "The lead could not be updated.";
}

export function LeadActions({ lead }: { lead: EditableLead }) {
  const router = useRouter();
  const [stage, setStage] = useState<LeadStage>(lead.stage);
  const [nextAction, setNextAction] = useState(lead.nextAction);
  const [nextActionDate, setNextActionDate] = useState(lead.nextActionDate);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isDirty = stage !== lead.stage || nextAction !== lead.nextAction || nextActionDate !== lead.nextActionDate;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isDirty) {
      return;
    }

    setSaveState("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, nextAction, nextActionDate }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(responseError(payload));
      }

      setSaveState("saved");
      router.refresh();
    } catch (error) {
      setSaveState("error");
      setErrorMessage(error instanceof Error ? error.message : "The lead could not be updated.");
    }
  }

  return (
    <section aria-labelledby="lead-actions-heading" className="panel lead-actions-panel">
      <div className="panel-header">
        <div>
          <h3 id="lead-actions-heading">Update lead</h3>
          <p>Keep the next conversation moving.</p>
        </div>
        <span className="panel-count">Local SQLite</span>
      </div>
      <form className="lead-actions-form" onSubmit={handleSubmit}>
        <label className="detail-input-label" htmlFor="lead-stage">
          Stage
          <select className="detail-input" id="lead-stage" onChange={(event) => setStage(event.target.value as LeadStage)} value={stage}>
            {PIPELINE_STAGES.map((pipelineStage) => (
              <option key={pipelineStage} value={pipelineStage}>
                {pipelineStage}
              </option>
            ))}
          </select>
        </label>
        <label className="detail-input-label" htmlFor="lead-next-action">
          Next action
          <input
            className="detail-input"
            id="lead-next-action"
            maxLength={160}
            minLength={1}
            onChange={(event) => setNextAction(event.target.value)}
            required
            type="text"
            value={nextAction}
          />
        </label>
        <label className="detail-input-label" htmlFor="lead-next-action-date">
          Due date
          <input
            className="detail-input"
            id="lead-next-action-date"
            onChange={(event) => setNextActionDate(event.target.value)}
            required
            type="date"
            value={nextActionDate}
          />
        </label>
        <div className="lead-actions-footer">
          <button className="button button-primary" disabled={!isDirty || saveState === "saving"} type="submit">
            {saveState === "saving" ? "Saving…" : "Save changes"}
          </button>
          <p aria-live="polite" className={`lead-save-status lead-save-status-${saveState}`}>
            {saveState === "saved" ? "Saved to the local SQLite workspace." : null}
            {saveState === "error" ? errorMessage : null}
          </p>
        </div>
      </form>
    </section>
  );
}
