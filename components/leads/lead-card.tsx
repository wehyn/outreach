import Link from "next/link";

import type { Lead } from "@/lib/leads/repository";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link aria-label={`Open lead for ${lead.name} at ${lead.company.name}`} className="lead-card lead-card-link" href={`/leads/${lead.id}`}>
      <div className="lead-card-top">
        <span className="lead-avatar">{lead.initials}</span>
        <span aria-hidden="true" className="lead-more">···</span>
      </div>
      <p className="lead-name">{lead.name}</p>
      <p className="lead-company">{lead.company.name}</p>
      <div className="lead-card-meta">
        <span className="lead-tag">{lead.serviceInterest}</span>
        <span className="lead-value">{lead.estimatedValue}</span>
      </div>
      <div className="lead-card-footer">
        <span>Next · {lead.nextActionDate}</span>
        <strong>{lead.fitScore} fit</strong>
      </div>
    </Link>
  );
}
