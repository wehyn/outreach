import { test, expect } from "@playwright/test";

const authEmail = process.env.E2E_AUTH_EMAIL ?? "wayne@example.com";
const authPassword = process.env.E2E_AUTH_PASSWORD ?? "e2e-fixture-password-1234";

const createdLead = {
  companyDomain: "summit-ops.example",
  companyLocation: "Denver, CO",
  companyName: "Summit Ops",
  contactEmail: "alex@summit-ops.example",
  contactName: "Alex Morgan",
  contactTitle: "VP Operations",
  estimatedValue: "$9k",
  nextAction: "Send a tailored audit outline",
  nextActionDate: "2026-09-15",
  observedPainPoint: "Manual handoffs are slowing down expansion.",
  personalizationHook: "Their Denver team is expanding into two new markets.",
  recommendedOffer: "A focused workflow audit and implementation sprint.",
  researchNotes: "Hiring plans point to a near-term systems review.",
  serviceInterest: "RevOps systems",
  source: "Manual entry",
};

const activityBody = "Alex confirmed that the Denver expansion is the priority this quarter.";
const taskTitle = "Send the Summit Ops audit outline";

test("carries a new lead through the core outreach workflow", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await expect(page.getByText("No account is registered in this local database yet.", { exact: false })).toBeVisible();
  await page.getByLabel("Email").fill("unregistered@example.com");
  await page.getByLabel("Password").fill("e2e-fixture-password-1234");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("No account is registered yet. Create a local account to get started.", { exact: true })).toBeVisible();
  expect(browserErrors.filter((error) => error.includes("409 (Conflict)")).length).toBe(1);
  browserErrors.length = 0;
  await page.getByRole("link", { name: "Register", exact: true }).click();

  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Create your Outreach account.", exact: true })).toBeVisible();
  await page.getByLabel("Name").fill("Wayne");
  await page.getByLabel("Email").fill(authEmail);
  await page.getByLabel("Password", { exact: true }).fill(authPassword);
  await page.getByLabel("Confirm password", { exact: true }).fill(authPassword);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Good morning, Wayne." })).toBeVisible();

  await page.goto("/login");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/leads");
  await page.locator("summary").filter({ hasText: "Add a lead" }).click();
  await page.getByLabel("Company name").fill(createdLead.companyName);
  await page.getByLabel("Company domain").fill(createdLead.companyDomain);
  await page.getByLabel("Company location").fill(createdLead.companyLocation);
  await page.getByLabel("Contact name").fill(createdLead.contactName);
  await page.getByLabel("Contact title").fill(createdLead.contactTitle);
  await page.getByLabel("Contact email").fill(createdLead.contactEmail);
  await page.getByLabel("Stage").selectOption("Ready to Contact");
  await page.getByLabel("Priority").selectOption("high");
  await page.getByLabel("Service interest").fill(createdLead.serviceInterest);
  await page.getByLabel("Estimated value").fill(createdLead.estimatedValue);
  await page.getByLabel("Observed pain point").fill(createdLead.observedPainPoint);
  await page.getByLabel("Recommended offer").fill(createdLead.recommendedOffer);
  await page.getByLabel("Personalization hook").fill(createdLead.personalizationHook);
  await page.getByLabel("Research notes").fill(createdLead.researchNotes);
  await page.getByLabel("Next action", { exact: true }).fill(createdLead.nextAction);
  await page.getByLabel("Next action date", { exact: true }).fill(createdLead.nextActionDate);
  await page.getByLabel("Source").fill(createdLead.source);
  await page.getByRole("button", { name: "Create lead" }).click();

  await expect(page).toHaveURL(/\/leads\/lead-/);
  const leadUrl = page.url();
  const leadStatus = page.getByLabel("Lead status");
  await expect(page.getByRole("heading", { name: createdLead.contactName, exact: true })).toBeVisible();
  await expect(page.getByText(createdLead.companyName, { exact: true })).toBeVisible();
  await expect(page.getByText(createdLead.contactEmail, { exact: true })).toBeVisible();
  await expect(page.getByText(createdLead.observedPainPoint, { exact: true })).toBeVisible();
  await expect(leadStatus.getByText("Ready to Contact", { exact: true })).toBeVisible();

  await page.locator("#lead-stage").selectOption("Contacted");
  await page.locator("#lead-next-action").fill("Confirm the audit scope with Alex");
  await page.locator("#lead-next-action-date").fill("2026-09-16");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Saved to the local SQLite workspace.", { exact: true })).toBeVisible();
  await expect(leadStatus.getByText("Contacted", { exact: true })).toBeVisible();

  await page.getByLabel("What happened?").fill(activityBody);
  await page.getByRole("button", { name: "Log activity" }).click();
  await expect(page.getByText("Activity added to the timeline.", { exact: true })).toBeVisible();
  await expect(page.getByText(activityBody, { exact: true })).toBeVisible();

  const taskForm = page.locator(".task-form");
  await taskForm.getByLabel("New follow-up").fill(taskTitle);
  await taskForm.getByLabel("Due date").fill("2026-09-20");
  await taskForm.getByRole("button", { name: "Add task" }).click();
  await expect(page.getByText("Task added to follow-ups.", { exact: true })).toBeVisible();
  await expect(page.getByText(taskTitle, { exact: true })).toBeVisible();

  await page.goto("/");
  await expect(page.getByText(taskTitle, { exact: true })).toBeVisible();

  await page.goto(leadUrl);
  await page.getByRole("button", { name: `Complete ${taskTitle}` }).click();
  await expect(page.getByRole("button", { name: `${taskTitle} completed` })).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Lead status").getByText("Contacted", { exact: true })).toBeVisible();
  await expect(page.getByText(activityBody, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: `${taskTitle} completed` })).toBeVisible();

  await page.goto("/tasks");
  await expect(page.getByText(taskTitle, { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: `${taskTitle} completed` })).toBeVisible();

  await page.setViewportSize({ height: 800, width: 375 });
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Active opportunities." })).toBeVisible();
  await expect(page.getByText(createdLead.companyName, { exact: true })).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasHorizontalOverflow).toBe(false);
  await page.screenshot({ fullPage: true, path: "test-results/core-workflow-mobile.png" });

  expect(browserErrors).toEqual([]);
});
