import type { PipelineColumn } from "@/lib/leads/repository";

import { LeadCard } from "./lead-card";

function formatCount(count: number) {
  return String(count).padStart(2, "0");
}

export function LeadPipeline({ columns }: { columns: readonly PipelineColumn[] }) {
  return (
    <div className="pipeline-board lead-pipeline-board">
      {columns.map((column) => (
        <section aria-label={`${column.title} leads`} className="pipeline-column" key={column.title}>
          <div className="pipeline-column-header">
            <span className="pipeline-column-title">{column.title}</span>
            <span className="pipeline-column-count">{formatCount(column.count)}</span>
          </div>
          <div className="lead-stack">
            {column.leads.length > 0 ? (
              column.leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
            ) : (
              <p className="pipeline-empty">No leads here yet.</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
