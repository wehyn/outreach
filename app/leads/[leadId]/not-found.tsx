import Link from "next/link";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireWorkspace } from "@/lib/auth";

export default async function LeadNotFound() {
  const workspace = await requireWorkspace();

  return (
    <WorkspaceShell breadcrumb="Lead not found" currentRoute="leads" workspace={workspace}>
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
