import { beforeEach } from "vitest";

import { resetDatabaseForTests } from "../lib/db";

process.env.OUTREACH_DB_PATH = ":memory:";

beforeEach(() => {
  resetDatabaseForTests();
});
