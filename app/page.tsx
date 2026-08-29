import Link from "next/link";

import { Icon, WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireWorkspace } from "@/lib/auth";
import { buildDashboardData } from "@/lib/dashboard/dashboard";
import { listLeads } from "@/lib/leads/repository";
import { listTasks } from "@/lib/tasks/repository";

export const dynamic = "force-dynamic";

function formatCount(count: number) {
  return String(count).padStart(2, "0");
}

function formatPipelineValue(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return `$${value}`;
}

export default async function Home() {
  const workspace = await requireWorkspace();
  const dashboard = buildDashboardData(listLeads(workspace.workspaceId), listTasks(workspace.workspaceId));
  const summaryCards = [
    { label: "Active leads", value: String(dashboard.activeLeadCount), detail: "Across the active pipeline", tone: "positive" },
    { label: "Open follow-ups", value: formatCount(dashboard.openTaskCount), detail: `${dashboard.overdueTaskCount} overdue`, tone: "warning" },
    { label: "Activities this week", value: String(dashboard.activityCountThisWeek), detail: "Manual activity logs", tone: "positive" },
    { label: "Open pipeline", value: formatPipelineValue(dashboard.openPipelineValue), detail: `${dashboard.activeLeadCount} active opportunities`, tone: "neutral" },
  ];
  const pulseMaximum = Math.max(...dashboard.pulse.map((item) => item.value), 1);

  return (
    <WorkspaceShell breadcrumb="Dashboard" currentRoute="dashboard" workspace={workspace}>
      <div className="page-wrap">
          <section className="page-heading" id="overview">
            <div>
              <p className="eyebrow">Overview · SQLite dev workspace</p>
              <h1>Good morning, {workspace.userName}.</h1>
              <p>Keep your next conversation visible, useful, and easy to act on.</p>
            </div>
            <Link className="button button-primary" href="/leads">
              <Icon name="plus" size={15} />
              View pipeline
            </Link>
          </section>

          <section className="summary-grid" aria-label="Workspace summary">
            {summaryCards.map((card) => (
              <article className="summary-card" key={card.label}>
                <span className="summary-card-label">{card.label}</span>
                <strong className="summary-card-value">{card.value}</strong>
                <span className={`summary-card-detail summary-card-detail-${card.tone}`}>{card.detail}</span>
              </article>
            ))}
          </section>

          <section className="content-section" id="tasks">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Attention</p>
                <h2>Next up</h2>
              </div>
              <Link className="text-link" href="/tasks">
                View all tasks <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="attention-grid">
              <article className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Follow-up queue</h3>
                    <p>The next actions that keep active leads moving.</p>
                  </div>
                  <span className="panel-count">{formatCount(dashboard.openTaskCount)} open</span>
                </div>
                <div className="task-list">
                  {dashboard.followUps.length > 0 ? dashboard.followUps.map((task) => (
                    <Link className="task-row" href={`/leads/${task.leadId}`} key={task.id}>
                      <span className={`task-priority task-priority-${task.priority}`} />
                      <span className="task-copy">
                        <span className="task-title">{task.title}</span>
                        <span className="task-meta">{task.meta}</span>
                      </span>
                      <span className={`task-due${task.due === "Overdue" ? " task-due-overdue" : ""}`}>{task.due}</span>
                    </Link>
                  )) : <p className="pipeline-empty">No open follow-ups.</p>}
                </div>
              </article>

              <article className="panel pulse-panel">
                <div className="panel-header">
                  <div>
                    <h3>Activity pulse</h3>
                    <p>Signals from this week.</p>
                  </div>
                  <Icon name="activity" size={16} />
                </div>
                <div className="pulse-body">
                  <p className="pulse-intro"><strong>{dashboard.activityCountThisWeek} activities logged this week.</strong> Keep the same context close when you follow up.</p>
                  <div className="pulse-list" aria-label="Activity pulse summary">
                    {dashboard.pulse.map((item) => (
                      <div className="pulse-item" key={item.label}>
                        <span>{item.label}</span>
                        <span className="pulse-bar"><span style={{ width: `${Math.round((item.value / pulseMaximum) * 100)}%` }} /></span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="content-section" id="pipeline">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Pipeline</p>
                <h2>Active opportunities</h2>
              </div>
              <Link className="text-link" href="/leads">
                Open full pipeline <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="pipeline-board">
              {dashboard.pipeline.map((column) => (
                <section className="pipeline-column" key={column.title} aria-label={`${column.title} leads`}>
                  <div className="pipeline-column-header">
                    <span className="pipeline-column-title">{column.title}</span>
                    <span className="pipeline-column-count">{formatCount(column.count)}</span>
                  </div>
                  <div className="lead-stack">
                    {column.leads.map((lead) => (
                      <Link className="lead-card lead-card-link" href={`/leads/${lead.id}`} key={lead.name}>
                        <div className="lead-card-top">
                          <span className="lead-avatar">{lead.initials}</span>
                          <span className="lead-more" aria-hidden="true">···</span>
                        </div>
                        <p className="lead-name">{lead.name}</p>
                        <p className="lead-company">{lead.company}</p>
                        <div className="lead-card-meta">
                          <span className="lead-tag">{lead.tag}</span>
                          <span className="lead-value">{lead.value}</span>
                        </div>
                        <div className="lead-card-footer">
                          <span>Next · {lead.due}</span>
                          <strong>{lead.score}</strong>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="content-section lower-grid" id="activity">
            <article className="panel">
              <div className="panel-header">
                <div>
                  <h3>Recent activity</h3>
                  <p>A short history of what changed.</p>
                </div>
                <span className="read-only-note">Latest four</span>
              </div>
              <div className="activity-list">
                {dashboard.recentActivities.length > 0 ? dashboard.recentActivities.map((activity) => (
                  <div className="activity-row" key={activity.id}>
                    <span className="activity-icon"><Icon name={activity.icon} size={14} /></span>
                    <span className="activity-copy">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-detail">{activity.detail}</span>
                    </span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                )) : <p className="pipeline-empty">No activity logged yet.</p>}
              </div>
            </article>

            <aside className="panel note-panel">
              <div>
                <p className="eyebrow">Product principle</p>
                <h3>Know who to contact next, and why.</h3>
                <p className="note-panel-copy">Every lead should carry enough context to make the next message feel considered—not generic.</p>
              </div>
              <div className="note-panel-footer"><span /> Manual outreach first</div>
            </aside>
          </section>
      </div>
    </WorkspaceShell>
  );
}
