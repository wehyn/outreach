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

export default async function Home() {
  const workspace = await requireWorkspace();
  const [leads, tasks] = await Promise.all([listLeads(workspace.workspaceId), listTasks(workspace.workspaceId)]);
  const dashboard = buildDashboardData(leads, tasks);
  const summaryCards = [
    { label: "Open follow-ups", value: formatCount(dashboard.openTaskCount), detail: `${dashboard.overdueTaskCount} overdue`, tone: "warning" },
    { label: "Active leads", value: String(dashboard.activeLeadCount), detail: "Across your pipeline", tone: "positive" },
  ];

  return (
    <WorkspaceShell breadcrumb="Home" currentRoute="dashboard" workspace={workspace}>
      <div className="page-wrap">
        <section className="page-heading" id="overview">
          <div>
            <p className="eyebrow">Today</p>
            <h1>Good morning, {workspace.userName}.</h1>
            <p>Start with the next follow-up, then open a lead when you need more context.</p>
          </div>
          <Link className="button button-primary" href="/leads">
            Review leads <Icon name="arrow" size={15} />
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

        <section className="content-section dashboard-focus" id="tasks">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your next step</p>
              <h2>Needs attention</h2>
            </div>
            <Link className="text-link" href="/tasks">
              View all tasks <Icon name="arrow" size={15} />
            </Link>
          </div>
          <article className="panel dashboard-focus-panel">
            <div className="panel-header">
              <div>
                <h3>Follow-up queue</h3>
                <p>Open a task to review the lead before you act.</p>
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
        </section>

        <section className="content-section" id="pipeline">
          <div className="section-heading">
            <div>
              <p className="eyebrow">At a glance</p>
              <h2>Pipeline</h2>
            </div>
            <Link className="text-link" href="/leads">
              View all leads <Icon name="arrow" size={15} />
            </Link>
          </div>
          <div className="pipeline-summary-list" aria-label="Pipeline summary">
            {dashboard.pipeline.map((column) => (
              <div className="pipeline-summary-row" key={column.title}>
                <span className="pipeline-summary-name"><span className="pipeline-summary-dot" />{column.title}</span>
                <span className="pipeline-column-count">{formatCount(column.count)}</span>
              </div>
            ))}
          </div>
        </section>

        <details className="dashboard-secondary" id="activity">
          <summary>
            <span>
              <span className="eyebrow">History</span>
              <strong>Recent activity</strong>
            </span>
            <span className="dashboard-secondary-hint">Show details</span>
          </summary>
          <article className="panel dashboard-secondary-panel">
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
        </details>
      </div>
    </WorkspaceShell>
  );
}
