import * as sqliteLeads from "../leads/demo-repository";
import * as sqliteTasks from "../tasks/demo-repository";
import { createSqliteAuthRepository } from "./sqlite-auth";
import type { PersistenceProvider } from "./types";

export function createSqlitePersistence(): PersistenceProvider {
  return {
    auth: createSqliteAuthRepository(),
    leads: {
      addLeadActivity: sqliteLeads.addLeadActivity,
      createLead: sqliteLeads.createLead,
      ensureDemoLeads: sqliteLeads.ensureDemoLeads,
      getLeadById: sqliteLeads.getLeadById,
      listLeads: sqliteLeads.listLeads,
      updateLead: sqliteLeads.updateLead,
    },
    tasks: {
      completeTask: sqliteTasks.completeTask,
      createTask: sqliteTasks.createTask,
      getTaskById: sqliteTasks.getTaskById,
      listTasks: sqliteTasks.listTasks,
    },
  };
}
