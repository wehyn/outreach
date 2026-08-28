import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3210);
const databasePath = `/tmp/outreach-leads-e2e-${process.pid}.db`;
const authEmail = process.env.E2E_AUTH_EMAIL ?? "wayne@example.com";
const authPassword = process.env.E2E_AUTH_PASSWORD ?? "e2e-fixture-password-1234";
const systemChromePath = ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"].find((path) => existsSync(path));

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  outputDir: "test-results",
  reporter: "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    launchOptions: systemChromePath ? { executablePath: systemChromePath } : undefined,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `rm -f "${databasePath}" "${databasePath}-shm" "${databasePath}-wal"; trap 'rm -f "${databasePath}" "${databasePath}-shm" "${databasePath}-wal"' EXIT; npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    env: {
      OUTREACH_AUTH_EMAIL: authEmail,
      OUTREACH_AUTH_NAME: "Wayne",
      OUTREACH_AUTH_PASSWORD: authPassword,
      OUTREACH_DB_PATH: databasePath,
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: `http://127.0.0.1:${port}/login`,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
