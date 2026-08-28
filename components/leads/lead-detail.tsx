import Link from "next/link";

import { ActivityForm } from "@/components/leads/activity-form";
import { LeadActions } from "@/components/leads/lead-actions";
import { Icon } from "@/components/layout/workspace-shell";
import type { Lead, LeadActivityType } from "@/lib/leads/demo-repository";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";
import { listTasks } from "@/lib/tasks/demo-repository";

const activityLabels: Record<LeadActivityType, string> = {
  email: "Email logged",
  note: "Research note",
  call: "Call logged",
  meeting: "Meeting logged",
  stage_change: "Stage changed",
};

function formatCalendarDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-row">
      <div className="score-row-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div aria-label={`${label}: ${value} out of 100`} className="score-bar" role="img">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function LeadDetail({ lead }: { lead: Lead }) {
  const leadTasks = listTasks(lead.workspaceId).filter((task) => task.leadId === lead.id);

  return (
    <div className="lead-detail-wrap">
      <div className="lead-detail-toolbar">
        <Link className="back-link" href="/leads">
          <Icon name="arrow" size={14} />
          Back to leads
        </Link>
        <span className="demo-badge">Editable local demo</span>
      </div>

      <section className="lead-detail-heading">
        <div className="lead-detail-identity">
          <span className="lead-detail-avatar">{lead.initials}</span>
          <div>
            <p className="eyebrow">Lead · {lead.source}</p>
            <h1>{lead.name}</h1>
            <p className="lead-detail-subtitle">
              <strong>{lead.company.name}</strong>
              <span>·</span>
              <span>{lead.contact.title}</span>
              <span>·</span>
              <span>{lead.contact.email}</span>
            </p>
          </div>
        </div>
        <div className="lead-detail-status" aria-label="Lead status">
          <span className={`detail-stage detail-stage-${slugify(lead.stage)}`}>{lead.stage}</span>
          <span className={`detail-priority detail-priority-${lead.priority}`}>{lead.priority} priority</span>
        </div>
      </section>

      <div className="lead-detail-grid">
        <div className="lead-detail-main-column">
          <section className="panel lead-detail-panel">
            <div className="panel-header">
              <div>
                <h3>Why this lead</h3>
                <p>The context behind a thoughtful next conversation.</p>
              </div>
            </div>
            <div className="lead-context-grid">
              <div className="detail-field detail-field-wide">
                <span className="detail-field-label">Observed pain point</span>
                <p>{lead.observedPainPoint}</p>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Recommended offer</span>
                <p>{lead.recommendedOffer}</p>
              </div>
              <div className="detail-field">
                <span className="detail-field-label">Personalization hook</span>
                <p>{lead.personalizationHook}</p>
              </div>
            </div>
          </section>

          <section className="panel lead-detail-panel">
            <div className="panel-header">
              <div>
                <h3>Research notes</h3>
                <p>What is known before the next touch.</p>
              </div>
            </div>
            <p className="research-notes">{lead.researchNotes}</p>
          </section>

          <section className="panel lead-detail-panel">
            <div className="panel-header">
              <div>
                <h3>Activity timeline</h3>
                <p>{lead.activity.length} recorded change{lead.activity.length === 1 ? "" : "s"} in this demo.</p>
              </div>
              <span className="panel-count">Manual log</span>
            </div>
            <ActivityForm leadId={lead.id} />
            <ol className="lead-timeline">
              {lead.activity.map((activity) => (
                <li className="timeline-item" key={activity.id}>
                  <span aria-hidden="true" className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <strong>{activityLabels[activity.type]}</strong>
                      <time dateTime={activity.occurredAt}>{formatActivityDate(activity.occurredAt)}</time>
                    </div>
                    <p>{activity.body}</p>
                    <span className="timeline-actor">Logged by {activity.actor}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lead-detail-sidebar">
          <section className="panel next-action-panel">
            <p className="eyebrow">Next action</p>
            <h2>{lead.nextAction}</h2>
            <div className="next-action-date">
              <span className="next-action-dot" />
              Due {formatCalendarDate(lead.nextActionDate)}
            </div>
            <p className="next-action-copy">Keep this action close to the reason for reaching out.</p>
            <span className="read-only-note">Changes stay in this local demo process.</span>
          </section>

          <LeadActions
            lead={{
              id: lead.id,
              nextAction: lead.nextAction,
              nextActionDate: lead.nextActionDate,
              stage: lead.stage,
            }}
          />

          <section className="panel lead-detail-panel task-panel">
            <div className="panel-header">
              <div>
                <h3>Follow-up tasks</h3>
                <p>Keep the next useful action attached to this lead.</p>
              </div>
              <Link className="text-link" href="/tasks">
                View all
              </Link>
            </div>
            <TaskList tasks={leadTasks} />
            <div className="task-form-divider">
              <TaskForm leadId={lead.id} />
            </div>
          </section>

          <section className="panel lead-detail-panel qualification-panel">
            <div className="panel-header">
              <div>
                <h3>Qualification</h3>
                <p>Transparent signals, not a black-box score.</p>
              </div>
            </div>
            <div className="score-list">
              <ScoreBar label="Fit" value={lead.fitScore} />
              <ScoreBar label="Engagement" value={lead.engagementScore} />
            </div>
            <p className="score-explanation">Based on the available company fit, source, and engagement context.</p>
          </section>

          <section className="panel lead-detail-panel">
            <div className="panel-header">
              <div>
                <h3>Lead details</h3>
                <p>The compact facts behind this opportunity.</p>
              </div>
            </div>
            <dl className="detail-list">
              <div>
                <dt>Service interest</dt>
                <dd>{lead.serviceInterest}</dd>
              </div>
              <div>
                <dt>Estimated value</dt>
                <dd>{lead.estimatedValue}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{lead.company.domain}</dd>
              </div>
              <div>
                <dt>Last contacted</dt>
                <dd>{lead.lastContactedAt ? formatActivityDate(lead.lastContactedAt) : "Not contacted"}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
