import { notFound } from "next/navigation";

import { LeadDetail } from "@/components/leads/lead-detail";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { DEMO_WORKSPACE_ID, getLeadById } from "@/lib/leads/demo-repository";

export default async function LeadPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const lead = getLeadById(leadId, DEMO_WORKSPACE_ID);

  if (!lead) {
    notFound();
  }

  return (
    <WorkspaceShell breadcrumb={lead.name} currentRoute="leads">
      <div className="page-wrap">
        <LeadDetail lead={lead} />
      </div>
    </WorkspaceShell>
  );
}
