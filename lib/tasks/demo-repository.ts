import { DEMO_WORKSPACE_ID, getLeadById } from "../leads/demo-repository";
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

type DemoTaskGlobalState = typeof globalThis & {
  __outreachDemoTasks?: Task[];
};

function cloneTask(task: Task): Task {
  return { ...task };
}

const demoTaskGlobalState = globalThis as DemoTaskGlobalState;
const demoTasks =
  demoTaskGlobalState.__outreachDemoTasks ?? (demoTaskGlobalState.__outreachDemoTasks = INITIAL_TASKS.map(cloneTask));

export function listTasks(workspaceId: string): Task[] {
  return demoTasks
    .filter((task) => task.workspaceId === workspaceId)
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "open" ? -1 : 1;
      }

      return left.dueDate.localeCompare(right.dueDate);
    })
    .map(cloneTask);
}

export function getTaskById(id: string, workspaceId: string): Task | null {
  const task = demoTasks.find((candidate) => candidate.id === id && candidate.workspaceId === workspaceId);

  return task ? cloneTask(task) : null;
}

export function createTask(leadId: string, workspaceId: string, input: CreateTaskInput): Task | null {
  const lead = getLeadById(leadId, workspaceId);

  if (!lead) {
    return null;
  }

  const task: Task = {
    companyName: lead.company.name,
    completedAt: null,
    createdAt: new Date().toISOString(),
    dueDate: input.dueDate,
    id: `task-${leadId}-${demoTasks.length + 1}`,
    leadId,
    leadName: lead.name,
    priority: input.priority,
    status: "open",
    title: input.title.trim(),
    workspaceId,
  };

  demoTasks.push(task);

  return cloneTask(task);
}

export function completeTask(id: string, workspaceId: string): Task | null {
  const index = demoTasks.findIndex((candidate) => candidate.id === id && candidate.workspaceId === workspaceId);

  if (index === -1) {
    return null;
  }

  const currentTask = demoTasks[index];
  const completedTask: Task =
    currentTask.status === "completed"
      ? currentTask
      : {
          ...currentTask,
          completedAt: new Date().toISOString(),
          status: "completed",
        };

  demoTasks[index] = completedTask;

  return cloneTask(completedTask);
}
