import { randomUUID } from "node:crypto";

import { getDatabase, withTransaction } from "../db";
import { DEMO_WORKSPACE_ID, ensureDemoLeads, getLeadById } from "../leads/demo-repository";
import type { CreateTaskInput, Task } from "./task";

export { DEMO_WORKSPACE_ID } from "../leads/demo-repository";

const INITIAL_TASKS: Task[] = [
  {
    companyName: "Brightline Studio",
    completedAt: null,
    createdAt: "2026-08-26T09:00:00Z",
    dueDate: "2026-08-28",
    id: "task-maya-audit",
    leadId: "lead-maya-chen",
    leadName: "Maya Chen",
    priority: "high",
    status: "open",
    title: "Send audit outline",
    workspaceId: DEMO_WORKSPACE_ID,
  },
  {
    companyName: "Northstar Labs",
    completedAt: null,
    createdAt: "2026-08-26T09:30:00Z",
    dueDate: "2026-08-28",
    id: "task-evan-proposal",
    leadId: "lead-evan-brooks",
    leadName: "Evan Brooks",
    priority: "medium",
    status: "open",
    title: "Follow up on proposal",
    workspaceId: DEMO_WORKSPACE_ID,
  },
  {
    companyName: "Common Thread",
    completedAt: null,
    createdAt: "2026-08-25T10:00:00Z",
    dueDate: "2026-08-27",
    id: "task-sofia-decision-maker",
    leadId: "lead-sofia-patel",
    leadName: "Sofia Patel",
    priority: "high",
    status: "open",
    title: "Find decision maker",
    workspaceId: DEMO_WORKSPACE_ID,
  },
  {
    companyName: "Fieldwork Co.",
    completedAt: null,
    createdAt: "2026-08-27T08:30:00Z",
    dueDate: "2026-08-29",
    id: "task-jon-case-study",
    leadId: "lead-jon-bell",
    leadName: "Jon Bell",
    priority: "low",
    status: "open",
    title: "Share case study",
    workspaceId: DEMO_WORKSPACE_ID,
  },
];

type TaskRow = {
  company_name: string;
  completed_at: string | null;
  created_at: string;
  due_date: string;
  id: string;
  lead_id: string;
  lead_name: string;
  priority: Task["priority"];
  status: Task["status"];
  title: string;
  workspace_id: string;
};

function seedDemoTasks() {
  ensureDemoLeads();
  const database = getDatabase();
  const insertTask = database.prepare(
    `INSERT OR IGNORE INTO tasks (
      id, workspace_id, lead_id, title, due_date, priority, status, created_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const task of INITIAL_TASKS) {
    insertTask.run(
      task.id,
      task.workspaceId,
      task.leadId,
      task.title,
      task.dueDate,
      task.priority,
      task.status,
      task.createdAt,
      task.completedAt,
    );
  }
}

function taskFromRow(row: TaskRow): Task {
  return {
    companyName: row.company_name,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    dueDate: row.due_date,
    id: row.id,
    leadId: row.lead_id,
    leadName: row.lead_name,
    priority: row.priority,
    status: row.status,
    title: row.title,
    workspaceId: row.workspace_id,
  };
}

const taskSelect = `
  SELECT
    t.id, t.workspace_id, t.lead_id, t.title, t.due_date, t.priority, t.status,
    t.created_at, t.completed_at, l.name AS lead_name, c.name AS company_name
  FROM tasks t
  JOIN leads l ON l.id = t.lead_id AND l.workspace_id = t.workspace_id
  JOIN companies c ON c.id = l.company_id AND c.workspace_id = l.workspace_id
`;

export function listTasks(workspaceId: string): Task[] {
  seedDemoTasks();
  const database = getDatabase();
  const rows = database
    .prepare(
      `${taskSelect}
       WHERE t.workspace_id = ?
       ORDER BY CASE WHEN t.status = 'open' THEN 0 ELSE 1 END, t.due_date ASC, t.id ASC`,
    )
    .all(workspaceId) as TaskRow[];

  return rows.map(taskFromRow);
}

export function getTaskById(id: string, workspaceId: string): Task | null {
  seedDemoTasks();
  const database = getDatabase();
  const row = database
    .prepare(`${taskSelect} WHERE t.id = ? AND t.workspace_id = ?`)
    .get(id, workspaceId) as TaskRow | undefined;

  return row ? taskFromRow(row) : null;
}

export function createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Task | null {
  seedDemoTasks();
  const lead = getLeadById(leadId, workspaceId);

  if (!lead) {
    return null;
  }

  const taskId = `task-${randomUUID()}`;
  const database = getDatabase();

  database
    .prepare(
      `INSERT INTO tasks (
        id, workspace_id, lead_id, title, due_date, priority, status, created_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(taskId, workspaceId, leadId, input.title.trim(), input.dueDate, input.priority, "open", new Date().toISOString(), null);

  return getTaskById(taskId, workspaceId);
}

export function completeTask(id: string, workspaceId: string): Task | null {
  const currentTask = getTaskById(id, workspaceId);

  if (!currentTask) {
    return null;
  }

  if (currentTask.status === "completed") {
    return currentTask;
  }

  withTransaction((database) => {
    database
      .prepare("UPDATE tasks SET status = ?, completed_at = ? WHERE id = ? AND workspace_id = ?")
      .run("completed", new Date().toISOString(), id, workspaceId);
  });

  return getTaskById(id, workspaceId);
}
