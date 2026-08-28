import { unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { closeDatabase } from "../../lib/db";
import { DEMO_WORKSPACE_ID, getLeadById, updateLead } from "../../lib/leads/demo-repository";
import { completeTask, getTaskById } from "../../lib/tasks/demo-repository";

const persistenceDatabasePath = join(tmpdir(), `outreach-leads-persistence-${process.pid}.db`);

function usePersistenceDatabase() {
  closeDatabase();
  process.env.OUTREACH_DB_PATH = persistenceDatabasePath;
}

afterEach(() => {
  closeDatabase();
  process.env.OUTREACH_DB_PATH = ":memory:";

  try {
    unlinkSync(persistenceDatabasePath);
  } catch {
    // The file may not have been opened when a test fails before setup.
  }
});

describe("SQLite persistence", () => {
  it("keeps lead changes after the database connection is reopened", () => {
    usePersistenceDatabase();

    const updated = updateLead("lead-maya-chen", DEMO_WORKSPACE_ID, {
      nextAction: "Send the revised audit outline",
      nextActionDate: "2026-09-04",
    });

    expect(updated).toMatchObject({
      nextAction: "Send the revised audit outline",
      nextActionDate: "2026-09-04",
    });

    closeDatabase();

    expect(getLeadById("lead-maya-chen", DEMO_WORKSPACE_ID)).toMatchObject({
      nextAction: "Send the revised audit outline",
      nextActionDate: "2026-09-04",
    });
  });

  it("keeps task completion after the database connection is reopened", () => {
    usePersistenceDatabase();

    const completed = completeTask("task-maya-audit", DEMO_WORKSPACE_ID);

    expect(completed).toMatchObject({ id: "task-maya-audit", status: "completed" });

    closeDatabase();

    expect(getTaskById("task-maya-audit", DEMO_WORKSPACE_ID)).toMatchObject({
      id: "task-maya-audit",
      status: "completed",
    });
  });
});
