import type { ReactNode } from "react";

type IconName =
  | "activity"
  | "arrow"
  | "building"
  | "check"
  | "chevron"
  | "grid"
  | "layers"
  | "plus"
  | "search"
  | "settings"
  | "users";

function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const sharedProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  const paths: Record<IconName, ReactNode> = {
    activity: (
      <>
        <path {...sharedProps} d="M3.5 12.5h3l1.7-5 3.2 8 1.7-4h3.4" />
      </>
    ),
    arrow: <path {...sharedProps} d="M4 9h10m-4-4 4 4-4 4" />,
    building: (
      <>
        <path {...sharedProps} d="M4 15.5h12M5.5 15.5V5.2L10 3.5l4.5 1.7v10.3" />
        <path {...sharedProps} d="M8 7.5h.01M12 7.5h.01M8 10.5h.01M12 10.5h.01" />
      </>
    ),
    check: (
      <>
        <path {...sharedProps} d="M5 9.5 8 12l6-6" />
        <rect {...sharedProps} height="12" rx="2" width="12" x="2" y="2" />
      </>
    ),
    chevron: <path {...sharedProps} d="m6 8 3 3 3-3" />,
    grid: (
      <>
        <rect {...sharedProps} height="5" rx="1" width="5" x="2.5" y="2.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="10.5" y="2.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="2.5" y="10.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="10.5" y="10.5" />
      </>
    ),
    layers: (
      <>
        <path {...sharedProps} d="m9 3 6 3-6 3-6-3 6-3Z" />
        <path {...sharedProps} d="m3 9 6 3 6-3M3 12l6 3 6-3" />
      </>
    ),
    plus: <path {...sharedProps} d="M9 3v12M3 9h12" />,
    search: (
      <>
        <circle {...sharedProps} cx="8" cy="8" r="4.8" />
        <path {...sharedProps} d="m11.5 11.5 3.5 3.5" />
      </>
    ),
    settings: (
      <>
        <circle {...sharedProps} cx="9" cy="9" r="2.4" />
        <path {...sharedProps} d="m14 10.5 1.2 1.1-1.6 2.7-1.6-.6a6 6 0 0 1-1.6.9L10 16.2H7l-.4-1.6a6 6 0 0 1-1.6-.9l-1.6.6-1.6-2.7L3 10.5a6 6 0 0 1 0-3L1.8 6.4 3.4 3.7l1.6.6a6 6 0 0 1 1.6-.9L7 1.8h3l.4 1.6a6 6 0 0 1 1.6.9l1.6-.6 1.6 2.7L14 7.5a6 6 0 0 1 0 3Z" />
      </>
    ),
    users: (
      <>
        <circle {...sharedProps} cx="9" cy="6" r="2.5" />
        <path {...sharedProps} d="M4 15c.4-2.2 2.1-3.5 5-3.5s4.6 1.3 5 3.5" />
        <path {...sharedProps} d="M4.2 8.7a2.1 2.1 0 0 0-2 2.2M13.8 8.7a2.1 2.1 0 0 1 2 2.2" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 18 18" width={size}>
      {paths[name]}
    </svg>
  );
}

const navItems: Array<{ label: string; icon: IconName; href?: string; active?: boolean }> = [
  { label: "Dashboard", icon: "grid", href: "#overview", active: true },
  { label: "Leads", icon: "layers", href: "#pipeline" },
  { label: "Tasks", icon: "check", href: "#tasks" },
  { label: "Companies", icon: "building" },
  { label: "Contacts", icon: "users" },
];

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
      { initials: "MC", name: "Maya Chen", company: "Brightline Studio", tag: "SEO", value: "$12k", due: "Today", score: "86 fit" },
      { initials: "SP", name: "Sofia Patel", company: "Common Thread", tag: "Content", value: "$8k", due: "Tue", score: "79 fit" },
    ],
  },
  {
    title: "Contacted",
    count: "09",
    leads: [
      { initials: "EB", name: "Evan Brooks", company: "Northstar Labs", tag: "Paid ads", value: "$18k", due: "Today", score: "91 fit" },
      { initials: "JB", name: "Jon Bell", company: "Fieldwork Co.", tag: "Branding", value: "$6k", due: "Wed", score: "73 fit" },
    ],
  },
  {
    title: "Replied",
    count: "04",
    leads: [
      { initials: "AL", name: "Ari Lopez", company: "Good Common", tag: "Web dev", value: "$14k", due: "Today", score: "94 fit" },
    ],
  },
  {
    title: "Meeting booked",
    count: "03",
    leads: [
      { initials: "RK", name: "Rina Kim", company: "Arc & Pine", tag: "Analytics", value: "$22k", due: "Oct 18", score: "88 fit" },
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
    <div className="workspace">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Outreach dashboard">
          <span className="brand-mark">o</span>
          <span>outreach</span>
          <span className="brand-dot">.</span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">W</span>
          <span className="workspace-copy">
            <span className="workspace-name">Wayne&apos;s workspace</span>
            <span className="workspace-plan">Personal</span>
          </span>
          <Icon name="chevron" size={15} />
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-section-label">Workspace</p>
          <ul className="nav-list">
            {navItems.map((item) =>
              item.href ? (
                <li key={item.label}>
                  <a className={`nav-item${item.active ? " nav-item-active" : ""}`} href={item.href}>
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ) : (
                <li key={item.label}>
                  <span className="nav-item nav-item-disabled" aria-disabled="true">
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    <span className="nav-item-status">soon</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <nav aria-label="Secondary navigation">
            <ul className="nav-list">
              <li>
                <span className="nav-item nav-item-disabled" aria-disabled="true">
                  <Icon name="settings" />
                  <span>Settings</span>
                  <span className="nav-item-status">soon</span>
                </span>
              </li>
            </ul>
          </nav>
          <div className="privacy-note">
            <strong>Thoughtful outreach</strong>
            <span>Keep the reason, context, and next step close to every lead.</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs" aria-label="Breadcrumb">
            <span>Workspace</span>
            <Icon name="chevron" size={14} />
            <strong>Dashboard</strong>
          </div>
          <div className="topbar-actions">
            <button className="search-trigger" type="button" disabled aria-label="Search workspace coming soon">
              <Icon name="search" size={15} />
              <span>Search workspace</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="user-avatar" aria-label="Wayne">W</span>
          </div>
        </header>

        <div className="page-wrap">
          <section className="page-heading" id="overview">
            <div>
              <p className="eyebrow">Overview · Demo workspace</p>
              <h1>Good morning, Wayne.</h1>
              <p>Keep your next conversation visible, useful, and easy to act on.</p>
            </div>
            <a className="button button-primary" href="#pipeline">
              <Icon name="plus" size={15} />
              View pipeline
            </a>
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
              <a className="text-link" href="#pipeline">
                Open full pipeline <Icon name="arrow" size={15} />
              </a>
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
                      <article className="lead-card" key={lead.name}>
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
                      </article>
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
      </main>
    </div>
  );
}
