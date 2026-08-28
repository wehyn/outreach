import Link from "next/link";

import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default function LeadNotFound() {
  return (
    <WorkspaceShell breadcrumb="Lead not found" currentRoute="leads">
      <div className="page-wrap">
        <section className="not-found-panel panel">
          <p className="eyebrow">Lead lookup</p>
          <h1>That lead is not in this workspace.</h1>
          <p>Open the pipeline to choose an active lead from the current workspace.</p>
          <Link className="button button-primary" href="/leads">
            Back to leads
          </Link>
        </section>
      </div>
    </WorkspaceShell>
  );
}
