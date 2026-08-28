"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { PIPELINE_STAGES, type LeadStage } from "@/lib/leads/pipeline";

type FormState = Record<string, string>;

type CreateLeadResponse = {
  error?: string;
  lead?: {
    id: string;
  };
};

const initialForm: FormState = {
  companyDomain: "",
  companyLocation: "",
  companyName: "",
  contactEmail: "",
  contactName: "",
  contactTitle: "",
  estimatedValue: "",
  nextAction: "",
  nextActionDate: "",
  observedPainPoint: "",
  personalizationHook: "",
  priority: "medium",
  recommendedOffer: "",
  researchNotes: "",
  serviceInterest: "",
  source: "Manual entry",
  stage: "New",
};

function getErrorMessage(payload: CreateLeadResponse) {
  return payload.error || "The lead could not be created. Try again.";
}

export function CreateLeadForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({
          company: {
            domain: form.companyDomain,
            location: form.companyLocation,
            name: form.companyName,
          },
          contact: {
            email: form.contactEmail,
            name: form.contactName,
            title: form.contactTitle,
          },
          lead: {
            estimatedValue: form.estimatedValue,
            nextAction: form.nextAction,
            nextActionDate: form.nextActionDate,
            observedPainPoint: form.observedPainPoint,
            personalizationHook: form.personalizationHook,
            priority: form.priority,
            recommendedOffer: form.recommendedOffer,
            researchNotes: form.researchNotes,
            serviceInterest: form.serviceInterest,
            source: form.source,
            stage: form.stage as LeadStage,
          },
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as CreateLeadResponse;

      if (!response.ok || !payload.lead?.id) {
        setError(getErrorMessage(payload));
        return;
      }

      router.push(`/leads/${payload.lead.id}`);
    } catch {
      setError("The server could not be reached. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="create-lead-form" onSubmit={handleSubmit}>
      <div className="create-lead-form-section">
        <div className="create-lead-form-heading">
          <p className="eyebrow">Relationship</p>
          <h3>Who are you researching?</h3>
        </div>
        <div className="create-lead-form-grid">
          <label className="create-lead-field">
            <span>Company name</span>
            <input name="companyName" onChange={handleChange} required value={form.companyName} />
          </label>
          <label className="create-lead-field">
            <span>Company domain</span>
            <input name="companyDomain" onChange={handleChange} placeholder="northwind.example" required value={form.companyDomain} />
          </label>
          <label className="create-lead-field">
            <span>Company location</span>
            <input name="companyLocation" onChange={handleChange} required value={form.companyLocation} />
          </label>
          <label className="create-lead-field">
            <span>Contact name</span>
            <input name="contactName" onChange={handleChange} required value={form.contactName} />
          </label>
          <label className="create-lead-field">
            <span>Contact title</span>
            <input name="contactTitle" onChange={handleChange} required value={form.contactTitle} />
          </label>
          <label className="create-lead-field">
            <span>Contact email</span>
            <input name="contactEmail" onChange={handleChange} required type="email" value={form.contactEmail} />
          </label>
        </div>
      </div>

      <div className="create-lead-form-section">
        <div className="create-lead-form-heading">
          <p className="eyebrow">Context</p>
          <h3>What makes this worth a conversation?</h3>
        </div>
        <div className="create-lead-form-grid">
          <label className="create-lead-field">
            <span>Stage</span>
            <select name="stage" onChange={handleChange} value={form.stage}>
              {PIPELINE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label className="create-lead-field">
            <span>Priority</span>
            <select name="priority" onChange={handleChange} value={form.priority}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="create-lead-field">
            <span>Service interest</span>
            <input name="serviceInterest" onChange={handleChange} required value={form.serviceInterest} />
          </label>
          <label className="create-lead-field">
            <span>Estimated value</span>
            <input name="estimatedValue" onChange={handleChange} placeholder="$12k" required value={form.estimatedValue} />
          </label>
          <label className="create-lead-field create-lead-field-wide">
            <span>Observed pain point</span>
            <textarea name="observedPainPoint" onChange={handleChange} required rows={3} value={form.observedPainPoint} />
          </label>
          <label className="create-lead-field create-lead-field-wide">
            <span>Recommended offer</span>
            <textarea name="recommendedOffer" onChange={handleChange} required rows={3} value={form.recommendedOffer} />
          </label>
          <label className="create-lead-field create-lead-field-wide">
            <span>Personalization hook</span>
            <textarea name="personalizationHook" onChange={handleChange} required rows={3} value={form.personalizationHook} />
          </label>
          <label className="create-lead-field create-lead-field-wide">
            <span>Research notes</span>
            <textarea name="researchNotes" onChange={handleChange} required rows={3} value={form.researchNotes} />
          </label>
        </div>
      </div>

      <div className="create-lead-form-section">
        <div className="create-lead-form-heading">
          <p className="eyebrow">Follow-through</p>
          <h3>Leave the next move clear.</h3>
        </div>
        <div className="create-lead-form-grid">
          <label className="create-lead-field create-lead-field-wide">
            <span>Next action</span>
            <input name="nextAction" onChange={handleChange} required value={form.nextAction} />
          </label>
          <label className="create-lead-field">
            <span>Next action date</span>
            <input name="nextActionDate" onChange={handleChange} required type="date" value={form.nextActionDate} />
          </label>
          <label className="create-lead-field">
            <span>Source</span>
            <input name="source" onChange={handleChange} required value={form.source} />
          </label>
        </div>
      </div>

      {error ? (
        <p aria-live="polite" className="form-error" id="lead-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="create-lead-form-footer">
        <p>Creates one company, one contact, and one lead in this workspace.</p>
        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating…" : "Create lead"}
        </button>
      </div>
    </form>
  );
}
