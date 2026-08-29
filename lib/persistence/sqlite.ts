import * as sqliteLeads from "../leads/demo-repository";
import * as sqliteTasks from "../tasks/demo-repository";
import { createSqliteAuthRepository } from "./sqlite-auth";
import type { PersistenceProvider } from "./types";

export function createSqlitePersistence(): PersistenceProvider {
  return {
    auth: createSqliteAuthRepository(),
    leads: {
      async addLeadActivity(id, workspaceId, input) {
        return sqliteLeads.addLeadActivity(id, workspaceId, input);
      },
      async createLead(workspaceId, input) {
        return sqliteLeads.createLead(workspaceId, input);
      },
      async getLeadById(id, workspaceId) {
        return sqliteLeads.getLeadById(id, workspaceId);
      },
      async listLeads(workspaceId) {
        return sqliteLeads.listLeads(workspaceId);
      },
      async updateLead(id, workspaceId, input) {
        return sqliteLeads.updateLead(id, workspaceId, input);
      },
    },
    tasks: {
      async completeTask(id, workspaceId) {
        return sqliteTasks.completeTask(id, workspaceId);
      },
      async createTask(leadId, workspaceId, input) {
        return sqliteTasks.createTask(leadId, workspaceId, input);
      },
      async getTaskById(id, workspaceId) {
        return sqliteTasks.getTaskById(id, workspaceId);
      },
      async listTasks(workspaceId) {
        return sqliteTasks.listTasks(workspaceId);
      },
    },
  };
}
