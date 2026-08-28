import Link from "next/link";

import { Icon, type IconName, WorkspaceShell } from "@/components/layout/workspace-shell";

const summaryCards = [
  { label: "Active leads", value: "28", detail: "+4 this week", tone: "positive" },
  { label: "Follow-ups due", value: "07", detail: "3 overdue", tone: "warning" },
  { label: "Replies this week", value: "12", detail: "+18% vs last week", tone: "positive" },
  { label: "Weighted pipeline", value: "$84.2k", detail: "14 open opportunities", tone: "neutral" },
];

const followUps = [
  { title: "Send audit outline", meta: "Maya Chen · Brightline Studio", due: "Due today", priority: "high" },
  { title: "Follow up on proposal", meta: "Evan Brooks · Northstar Labs", due: "Due today", priority: "medium" },
  { title: "Find decision maker", meta: "Sofia Patel · Common Thread", due: "Overdue", priority: "high" },
  { title: "Share case study", meta: "Jon Bell · Fieldwork Co.", due: "Tomorrow", priority: "low" },
];

const pipelineColumns = [
  {
    title: "Ready to contact",
    count: "06",
    leads: [
      { id: "lead-maya-chen", initials: "MC", name: "Maya Chen", company: "Brightline Studio", tag: "SEO", value: "$12k", due: "Today", score: "86 fit" },
      { id: "lead-sofia-patel", initials: "SP", name: "Sofia Patel", company: "Common Thread", tag: "Content", value: "$8k", due: "Tue", score: "79 fit" },
    ],
  },
  {
    title: "Contacted",
    count: "09",
    leads: [
      { id: "lead-evan-brooks", initials: "EB", name: "Evan Brooks", company: "Northstar Labs", tag: "Paid ads", value: "$18k", due: "Today", score: "91 fit" },
      { id: "lead-jon-bell", initials: "JB", name: "Jon Bell", company: "Fieldwork Co.", tag: "Branding", value: "$6k", due: "Wed", score: "73 fit" },
    ],
  },
  {
    title: "Replied",
    count: "04",
    leads: [
      { id: "lead-ari-lopez", initials: "AL", name: "Ari Lopez", company: "Good Common", tag: "Web dev", value: "$14k", due: "Today", score: "94 fit" },
    ],
  },
  {
    title: "Meeting booked",
    count: "03",
    leads: [
      { id: "lead-rina-kim", initials: "RK", name: "Rina Kim", company: "Arc & Pine", tag: "Analytics", value: "$22k", due: "Oct 18", score: "88 fit" },
    ],
  },
];

const activities = [
  { icon: "activity" as IconName, title: "Maya Chen replied to your email", detail: "Brightline Studio · Interested in an SEO audit", time: "18m" },
  { icon: "check" as IconName, title: "You completed a follow-up", detail: "Northstar Labs · Proposal follow-up", time: "2h" },
  { icon: "layers" as IconName, title: "Ari Lopez moved to Replied", detail: "Good Common · Web development", time: "Yesterday" },
  { icon: "plus" as IconName, title: "New lead added", detail: "Rina Kim · Arc & Pine", time: "Yesterday" },
];

export default function Home() {
  return (
    <WorkspaceShell breadcrumb="Dashboard" currentRoute="dashboard">
      <div className="page-wrap">
          <section className="page-heading" id="overview">
            <div>
              <p className="eyebrow">Overview · Demo workspace</p>
              <h1>Good morning, Wayne.</h1>
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
              <a className="text-link" href="#tasks">
                View all tasks <Icon name="arrow" size={15} />
              </a>
            </div>
            <div className="attention-grid">
              <article className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Follow-up queue</h3>
                    <p>The next actions that keep active leads moving.</p>
                  </div>
                  <span className="panel-count">07 open</span>
                </div>
                <div className="task-list">
                  {followUps.map((task) => (
                    <div className="task-row" key={task.title}>
                      <span className={`task-priority task-priority-${task.priority}`} />
                      <span className="task-copy">
                        <span className="task-title">{task.title}</span>
                        <span className="task-meta">{task.meta}</span>
                      </span>
                      <span className={`task-due${task.due === "Overdue" ? " task-due-overdue" : ""}`}>{task.due}</span>
                    </div>
                  ))}
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
                  <p className="pulse-intro"><strong>Replies are moving.</strong> Keep the same context close when you follow up.</p>
                  <div className="pulse-list" aria-label="Activity pulse summary">
                    <div className="pulse-item"><span>Replies</span><span className="pulse-bar"><span style={{ width: "82%" }} /></span><strong>12</strong></div>
                    <div className="pulse-item"><span>Tasks done</span><span className="pulse-bar"><span style={{ width: "68%" }} /></span><strong>18</strong></div>
                    <div className="pulse-item"><span>New leads</span><span className="pulse-bar"><span style={{ width: "43%" }} /></span><strong>09</strong></div>
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
              {pipelineColumns.map((column) => (
                <section className="pipeline-column" key={column.title} aria-label={`${column.title} leads`}>
                  <div className="pipeline-column-header">
                    <span className="pipeline-column-title">{column.title}</span>
                    <span className="pipeline-column-count">{column.count}</span>
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
                <a className="text-link" href="#activity" aria-label="View activity history"><Icon name="arrow" size={15} /></a>
              </div>
              <div className="activity-list">
                {activities.map((activity) => (
                  <div className="activity-row" key={`${activity.title}-${activity.time}`}>
                    <span className="activity-icon"><Icon name={activity.icon} size={14} /></span>
                    <span className="activity-copy">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-detail">{activity.detail}</span>
                    </span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
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
