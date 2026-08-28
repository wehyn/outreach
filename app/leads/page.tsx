import type { Metadata } from "next";
import Link from "next/link";

import { LeadPipeline } from "@/components/leads/lead-pipeline";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import {
  ACTIVE_PIPELINE_STAGES,
  DEMO_WORKSPACE_ID,
  groupLeadsByStage,
  listLeads,
} from "@/lib/leads/demo-repository";

export const metadata: Metadata = {
  title: "Leads — Outreach",
  description: "Review active leads and open their outreach context.",
};

export const dynamic = "force-dynamic";

export default function LeadsPage() {
  const leads = listLeads(DEMO_WORKSPACE_ID);
  const columns = groupLeadsByStage(leads);
  const highFitLeads = leads.filter((lead) => lead.fitScore >= 85).length;

  return (
    <WorkspaceShell breadcrumb="Leads" currentRoute="leads">
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
