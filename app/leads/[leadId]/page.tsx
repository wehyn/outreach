import { notFound } from "next/navigation";

import { LeadDetail } from "@/components/leads/lead-detail";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireWorkspace } from "@/lib/auth";
import { getLeadById } from "@/lib/leads/repository";

export const dynamic = "force-dynamic";

export default async function LeadPage({ params }: { params: Promise<{ leadId: string }> }) {
  const workspace = await requireWorkspace();
  const { leadId } = await params;
  const lead = getLeadById(leadId, workspace.workspaceId);

  if (!lead) {
    notFound();
  }

  return (
    <WorkspaceShell breadcrumb={lead.name} currentRoute="leads" workspace={workspace}>
      <div className="page-wrap">
        <LeadDetail lead={lead} />
      </div>
    </WorkspaceShell>
  );
}
