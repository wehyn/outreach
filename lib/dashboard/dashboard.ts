import { groupLeadsByStage } from "../leads/repository";
import type { Lead, LeadActivity, LeadActivityType } from "../leads/repository";
import type { Task } from "../tasks/task";

export type DashboardActivityIcon = "activity" | "check" | "layers" | "plus";

export type DashboardFollowUp = {
  due: string;
  id: string;
  leadId: string;
  meta: string;
  priority: Task["priority"];
  title: string;
};

export type DashboardPipelineLead = {
  company: string;
  due: string;
  id: string;
  initials: string;
  name: string;
  score: string;
  tag: string;
  value: string;
};

export type DashboardPipelineColumn = {
  count: number;
  leads: DashboardPipelineLead[];
  title: string;
};

export type DashboardActivity = {
  detail: string;
  icon: DashboardActivityIcon;
  id: string;
  time: string;
  title: string;
};

export type DashboardPulseItem = {
  label: string;
  value: number;
};

export type DashboardData = {
  activeLeadCount: number;
  activityCountThisWeek: number;
  completedTaskCountThisWeek: number;
  followUps: DashboardFollowUp[];
  openPipelineValue: number;
  openTaskCount: number;
  overdueTaskCount: number;
  pipeline: DashboardPipelineColumn[];
  pulse: DashboardPulseItem[];
  recentActivities: DashboardActivity[];
};

function calendarDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function startOfWeek(value: Date) {
  const dayOfWeek = value.getUTCDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const start = new Date(value);

  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);

  return start;
}

function formatDueDate(value: string, now: Date) {
  const today = calendarDate(now);
  const tomorrow = new Date(`${today}T00:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowDate = calendarDate(tomorrow);

  if (value < today) {
    return "Overdue";
  }

  if (value === today) {
    return "Today";
  }

  if (value === tomorrowDate) {
    return "Tomorrow";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatActivityAge(value: string, now: Date) {
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - new Date(value).getTime()) / 60000));

  if (elapsedMinutes < 60) {
    return `${Math.max(1, elapsedMinutes)}m`;
  }

  if (elapsedMinutes < 24 * 60) {
    return `${Math.floor(elapsedMinutes / 60)}h`;
  }

  if (elapsedMinutes < 48 * 60) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

function parseEstimatedValue(value: string) {
  const match = value.replaceAll(",", "").match(/\$?([0-9]+(?:\.[0-9]+)?)\s*([km])?/i);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1]);
  const multiplier = match[2]?.toLowerCase() === "m" ? 1_000_000 : match[2] ? 1_000 : 1;

  return amount * multiplier;
}

function activityIcon(type: LeadActivityType): DashboardActivityIcon {
  if (type === "stage_change") {
    return "layers";
  }

  if (type === "note") {
    return "plus";
  }

  if (type === "email") {
    return "activity";
  }

  return "check";
}

function activityTitle(lead: Lead, activity: LeadActivity) {
  if (activity.type === "stage_change") {
    return `${lead.name} changed stage`;
  }

  if (activity.type === "note") {
    return `Research note added for ${lead.name}`;
  }

  if (activity.type === "email") {
    return `Email logged for ${lead.name}`;
  }

  if (activity.type === "call") {
    return `Call logged for ${lead.name}`;
  }

  return `Meeting logged for ${lead.name}`;
}

export function buildDashboardData(leads: readonly Lead[], tasks: readonly Task[], now = new Date()): DashboardData {
  const activeLeads = leads.filter((lead) => lead.status === "active");
  const openTasks = tasks.filter((task) => task.status === "open");
  const today = calendarDate(now);
  const weekStart = startOfWeek(now).getTime();
  const activities = leads.flatMap((lead) =>
    lead.activity.map((activity) => ({ activity, lead })),
  );
  const activityCountThisWeek = activities.filter(
    ({ activity }) => {
      const occurredAt = new Date(activity.occurredAt).getTime();
      return occurredAt >= weekStart && occurredAt <= now.getTime();
    },
  ).length;
  const completedTaskCountThisWeek = tasks.filter((task) => {
    if (task.status !== "completed" || !task.completedAt) {
      return false;
    }

    const completedAt = new Date(task.completedAt).getTime();
    return completedAt >= weekStart && completedAt <= now.getTime();
  }).length;
  const recentActivities = [...activities]
    .sort((left, right) => {
      const timeDifference = new Date(right.activity.occurredAt).getTime() - new Date(left.activity.occurredAt).getTime();
      return timeDifference || right.activity.id.localeCompare(left.activity.id);
    })
    .slice(0, 4)
    .map(({ activity, lead }) => ({
      detail: `${lead.company.name} · ${activity.body}`,
      icon: activityIcon(activity.type),
      id: activity.id,
      time: formatActivityAge(activity.occurredAt, now),
      title: activityTitle(lead, activity),
    }));
  const pipeline = groupLeadsByStage(leads).map((column) => ({
    count: column.count,
    leads: column.leads.map((lead) => ({
      company: lead.company.name,
      due: formatDueDate(lead.nextActionDate, now),
      id: lead.id,
      initials: lead.initials,
      name: lead.name,
      score: `${lead.fitScore} fit`,
      tag: lead.serviceInterest,
      value: lead.estimatedValue,
    })),
    title: column.title,
  }));
  const followUps = openTasks.map((task) => ({
    due: formatDueDate(task.dueDate, now),
    id: task.id,
    leadId: task.leadId,
    meta: `${task.leadName} · ${task.companyName}`,
    priority: task.priority,
    title: task.title,
  }));

  return {
    activeLeadCount: activeLeads.length,
    activityCountThisWeek,
    completedTaskCountThisWeek,
    followUps,
    openPipelineValue: activeLeads.reduce((total, lead) => total + parseEstimatedValue(lead.estimatedValue), 0),
    openTaskCount: openTasks.length,
    overdueTaskCount: openTasks.filter((task) => task.dueDate < today).length,
    pipeline,
    pulse: [
      { label: "Activities logged", value: activityCountThisWeek },
      { label: "Tasks completed", value: completedTaskCountThisWeek },
      { label: "Open follow-ups", value: openTasks.length },
    ],
    recentActivities,
  };
}
