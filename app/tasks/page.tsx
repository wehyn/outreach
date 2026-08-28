import type { Metadata } from "next";
import Link from "next/link";

import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { TaskList } from "@/components/tasks/task-list";
import { DEMO_WORKSPACE_ID, listTasks } from "@/lib/tasks/demo-repository";

export const metadata: Metadata = {
  title: "Tasks — Outreach",
  description: "Keep the next follow-up visible across the workspace.",
};

export const dynamic = "force-dynamic";

export default function TasksPage() {
  const tasks = listTasks(DEMO_WORKSPACE_ID);
  const openTasks = tasks.filter((task) => task.status === "open");
  const completedTasks = tasks.length - openTasks.length;
  const leadCount = new Set(tasks.map((task) => task.leadId)).size;

  return (
    <WorkspaceShell breadcrumb="Tasks" currentRoute="tasks">
      <div className="page-wrap">
        <section className="page-heading leads-page-heading">
          <div>
            <p className="eyebrow">Follow-ups · Demo workspace</p>
            <h1>Keep the next touch visible.</h1>
            <p>Tasks stay attached to the lead context, so completion never loses the reason behind the action.</p>
          </div>
          <Link className="button button-secondary" href="/">
            Dashboard
          </Link>
        </section>

        <section aria-label="Task summary" className="lead-summary-strip">
          <div>
            <strong>{openTasks.length}</strong>
            <span>open follow-ups</span>
          </div>
          <div>
            <strong>{completedTasks}</strong>
            <span>completed in this demo</span>
          </div>
          <div>
            <strong>{leadCount}</strong>
            <span>leads with tasks</span>
          </div>
          <p>Complete a task here or open its lead to review the full context before the next touch.</p>
        </section>

        <section aria-labelledby="tasks-heading" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Current view</p>
              <h2 id="tasks-heading">All follow-ups</h2>
            </div>
            <span className="read-only-note">Editable local demo data</span>
          </div>
          <div className="panel task-page-panel">
            <TaskList tasks={tasks} />
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
