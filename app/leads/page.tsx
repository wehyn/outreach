import type { Metadata } from "next";
import Link from "next/link";

import { LeadPipeline } from "@/components/leads/lead-pipeline";
import { CreateLeadForm } from "@/components/leads/create-lead-form";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireWorkspace } from "@/lib/auth";
import { ACTIVE_PIPELINE_STAGES, groupLeadsByStage, listLeads } from "@/lib/leads/repository";

export const metadata: Metadata = {
  title: "Leads — Outreach",
  description: "Review active leads and open their outreach context.",
};

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const workspace = await requireWorkspace();
  const leads = listLeads(workspace.workspaceId);
  const columns = groupLeadsByStage(leads);
  const highFitLeads = leads.filter((lead) => lead.fitScore >= 85).length;

  return (
    <WorkspaceShell breadcrumb="Leads" currentRoute="leads" workspace={workspace}>
      <div className="page-wrap">
        <section className="page-heading leads-page-heading">
          <div>
            <p className="eyebrow">Pipeline · SQLite dev workspace</p>
            <h1>Active opportunities.</h1>
            <p>Review the reason, next action, and context before you open a conversation.</p>
          </div>
          <Link className="button button-secondary" href="/">
            Dashboard
          </Link>
        </section>

        <section aria-label="Lead pipeline summary" className="lead-summary-strip">
          <div>
            <strong>{leads.length}</strong>
            <span>active leads in view</span>
          </div>
          <div>
            <strong>{highFitLeads}</strong>
            <span>high-fit opportunities</span>
          </div>
          <div>
            <strong>{ACTIVE_PIPELINE_STAGES.length}</strong>
            <span>active pipeline stages</span>
          </div>
          <p>Open a lead to keep its context, reason, and next action together.</p>
        </section>

        <details className="create-lead-disclosure">
          <summary>
            <span>
              <span className="eyebrow">New relationship</span>
              <strong>Add a lead</strong>
            </span>
            <span className="create-lead-disclosure-hint">Company · contact · context</span>
          </summary>
          <div className="create-lead-panel">
            <CreateLeadForm />
          </div>
        </details>

        <section className="content-section" aria-labelledby="pipeline-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current view</p>
              <h2 id="pipeline-heading">Active pipeline</h2>
            </div>
            <span className="read-only-note">Editable local SQLite data</span>
          </div>
          <LeadPipeline columns={columns} />
        </section>
      </div>
    </WorkspaceShell>
  );
}
