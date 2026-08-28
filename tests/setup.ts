import { beforeEach } from "vitest";

import { resetDatabaseForTests } from "../lib/db";

process.env.OUTREACH_DB_PATH = ":memory:";
process.env.OUTREACH_AUTH_EMAIL = "wayne@example.com";
process.env.OUTREACH_AUTH_PASSWORD = "test-password-1234";
process.env.OUTREACH_AUTH_NAME = "Wayne";

beforeEach(() => {
  resetDatabaseForTests();
});
