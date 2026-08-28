# Outreach & Lead Management Web App Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a focused CRM and outreach workspace for marketing-solution sellers to research prospects, manage company/contact relationships, track conversations, and always know the next follow-up action.

**Architecture:** Greenfield full-stack web app with a Next.js App Router frontend and server-side route handlers. PostgreSQL stores workspaces, companies, contacts, leads, activities, tasks, and outreach data; the domain model keeps a contact separate from a lead so one person can be associated with multiple opportunities over time. Start with manual activity logging and drafts, then add mailbox integrations and automated sequences after the core workflow is reliable.

**Tech Stack:** Next.js + TypeScript, Tailwind CSS + shadcn/ui, PostgreSQL + Drizzle ORM, Auth.js or the repository's existing auth solution, Zod validation, Vitest for unit/integration tests, and Playwright for critical browser flows.

---

## 1. Product direction

### Primary user

A freelancer, agency, or small sales/marketing team selling services such as SEO, paid ads, web development, content, branding, analytics, or marketing automation.

### Core workflow

1. Add or import a company and one or more contacts.
2. Record why the company may be a good fit and what problem it appears to have.
3. Qualify the opportunity and place it in a pipeline stage.
4. Send or log outreach.
5. Record replies, calls, meetings, and notes in one timeline.
6. Create a clear next action with a due date.
7. Move the opportunity toward won, lost, or nurture.
8. Review funnel and outreach performance.

### Product differentiator

Do not make this a generic address book. Optimize the product around personalized marketing outreach:

- observed marketing pain points;
- current marketing channels and tools;
- recommended service or offer;
- personalization hook and research notes;
- proof/case-study angle;
- next action and follow-up discipline.

---

## 2. Recommended scope

### MVP: must have

- Single-user workspace with authentication.
- Company records and contact records with a clear relationship between them.
- Lead/opportunity records with a simple configurable pipeline.
- Search, filters, tags, sorting, and saved views.
- Activity timeline for notes, emails, calls, meetings, and status changes.
- Tasks and follow-up reminders, including overdue and due-today views.
- Qualification fields and transparent fit/priority scoring.
- CSV import, duplicate detection, and CSV export.
- Dashboard showing pipeline, follow-up workload, and basic conversion metrics.
- Privacy controls: source, consent/status, do-not-contact flag, unsubscribe/suppression list.
- Responsive desktop-first interface with usable tablet layouts.

### MVP plus, after the core workflow is validated

- Gmail/Outlook connection for sending and automatically logging email.
- Reusable email templates with personalization variables.
- Outreach campaigns/sequences with explicit approval before sending.
- Team members, ownership, assignment, and permissions.
- Webhook or form intake for inbound leads.

### Later, not in the first build

- Automatic contact scraping or LinkedIn automation.
- Broad third-party enrichment with unclear data rights.
- Fully autonomous AI outreach.
- Complex multi-object CRM customization.
- Predictive black-box lead scoring.
- Large marketing automation features before the basic follow-up loop is proven.

---

## 3. Features to add beyond basic contact storage

The requested feature set is explicitly included in this plan:

- Company → contact → lead relationships
- Marketing-specific qualification fields
- Personalization notes and recommended offer
- Pipeline/kanban stages
- Activity timeline for emails, calls, meetings, and notes
- Next actions, reminders, and overdue follow-ups
- Tags, filters, saved views, and search
- CSV import/export with deduplication
- Lead source and campaign attribution
- Transparent fit/engagement scoring
- Dashboard analytics
- Do-not-contact and suppression controls
- Email templates and Gmail/Outlook integration later

These are the highest-value additions for this product, in priority order:

1. **Next action and follow-up system** — every active lead should show its next action, owner, and due date. This is more valuable than simply storing contact details.
2. **Company/contact/lead relationship model** — store a company once, attach multiple people to it, and maintain an opportunity record separately.
3. **Activity timeline** — consolidate notes, email attempts, calls, meetings, stage changes, and outcomes.
4. **Marketing-specific qualification** — service interest, observed pain point, current channels, budget range, urgency, decision role, and fit.
5. **Personalization workspace** — research notes, opening hook, relevant case study, and a recommended offer.
6. **Pipeline views** — table view for research and a kanban view for progression.
7. **Tasks and reminders** — due today, upcoming, overdue, snooze, and recurring follow-up options.
8. **Import/export and deduplication** — make it easy to start from a spreadsheet and retain ownership of data.
9. **Source and campaign attribution** — identify whether a lead came from referral, cold research, event, inbound form, campaign, or another source.
10. **Privacy and suppression controls** — prevent accidental outreach to people who opted out or should not be contacted.
11. **Transparent lead scoring** — use explainable fit and engagement signals rather than an opaque AI score.
12. **Basic analytics** — measure stage conversion, time in stage, reply rate, follow-up completion, and source quality.

---

## 4. Domain model

Start with the following entities. Keep the first schema deliberately small and add custom fields only after real usage identifies the need.

### Workspace and access

- `users`: authenticated user profile.
- `workspaces`: account/container for data.
- `workspace_members`: user role and ownership, even if the initial UI exposes only one user.

### Prospect data

- `companies`
  - `id`, `workspace_id`, `name`, `domain`, `website_url`;
  - `industry`, `size_range`, `location`, `description`;
  - `current_marketing_channels`, `marketing_stack`;
  - `source`, `owner_id`, `status`, `notes`;
  - `created_at`, `updated_at`.
- `contacts`
  - `id`, `workspace_id`, `company_id`;
  - `first_name`, `last_name`, `job_title`, `email`, `phone`;
  - `linkedin_url`, `location`, `timezone`, `preferred_channel`;
  - `decision_role`, `do_not_contact`, `unsubscribe_reason`;
  - `created_at`, `updated_at`.
- `leads`
  - `id`, `workspace_id`, `company_id`, `primary_contact_id`;
  - `name`, `stage`, `status`, `priority`, `owner_id`;
  - `service_interest`, `observed_pain_point`, `recommended_offer`;
  - `personalization_hook`, `research_notes`, `case_study_angle`;
  - `estimated_value`, `urgency`, `fit_score`, `engagement_score`;
  - `source`, `campaign_id` when campaigns exist;
  - `last_contacted_at`, `next_action_at`, `won_at`, `lost_at`;
  - `created_at`, `updated_at`.

Use a separate `leads` table instead of treating a contact as the lead. This preserves the history of multiple offers or sales opportunities involving the same person/company.

### Workflow data

- `pipeline_stages`: workspace-specific stage name, order, color, and terminal/won/lost flags.
- `activities`: type (`note`, `email`, `call`, `meeting`, `stage_change`, `task_completed`), body, occurred-at timestamp, outcome, and linked company/contact/lead.
- `tasks`: title, due-at, completed-at, linked lead/contact/company, owner, priority, and reminder state.
- `tags` and join tables: reusable segmentation without prematurely building arbitrary custom fields.
- `imports`: source file, status, row counts, error report, and created-by user.
- `suppression_entries`: email/domain, reason, source, and created-at.
- `audit_events`: add later if team access or compliance requirements make it necessary.

### Outreach entities for phase two

- `email_accounts`: connected provider, encrypted token reference, sync status.
- `templates`: subject/body, variables, version, and ownership.
- `campaigns`: name, goal, audience filters, status, and owner.
- `sequence_steps`: delay, channel, template, and manual-approval requirement.
- `enrollments`: lead, campaign, current step, state, and stop reason.
- `message_events`: sent, delivered, replied, bounced, or unsubscribed.

Never store provider access tokens in plain text. Do not automatically enroll opted-out contacts.

---

## 5. Proposed application structure

These paths assume a new Next.js application; remap them to the existing repository if one already exists.

### Pages and UI

- Create: `app/(auth)/login/page.tsx`
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `app/(dashboard)/companies/page.tsx`
- Create: `app/(dashboard)/companies/[companyId]/page.tsx`
- Create: `app/(dashboard)/contacts/page.tsx`
- Create: `app/(dashboard)/leads/page.tsx`
- Create: `app/(dashboard)/leads/[leadId]/page.tsx`
- Create: `app/(dashboard)/tasks/page.tsx`
- Create: `app/(dashboard)/settings/page.tsx`
- Create: `components/companies/company-form.tsx`
- Create: `components/contacts/contact-form.tsx`
- Create: `components/leads/lead-form.tsx`
- Create: `components/leads/lead-pipeline.tsx`
- Create: `components/leads/lead-timeline.tsx`
- Create: `components/tasks/task-list.tsx`
- Create: `components/shared/filter-bar.tsx`
- Create: `components/shared/empty-state.tsx`

### Server, database, and validation

- Create: `db/schema.ts`
- Create: `db/migrations/`
- Create: `lib/db.ts`
- Create: `lib/auth.ts`
- Create: `lib/lead-scoring.ts`
- Create: `lib/dedupe.ts`
- Create: `lib/permissions.ts`
- Create: `lib/validation/company.ts`
- Create: `lib/validation/contact.ts`
- Create: `lib/validation/lead.ts`
- Create: `lib/validation/import.ts`
- Create: `app/api/companies/route.ts`
- Create: `app/api/contacts/route.ts`
- Create: `app/api/leads/route.ts`
- Create: `app/api/activities/route.ts`
- Create: `app/api/tasks/route.ts`
- Create: `app/api/imports/route.ts`
- Create: `app/api/exports/leads/route.ts`

### Tests

- Create: `tests/unit/lead-scoring.test.ts`
- Create: `tests/unit/dedupe.test.ts`
- Create: `tests/unit/validation.test.ts`
- Create: `tests/integration/leads-api.test.ts`
- Create: `tests/integration/import-api.test.ts`
- Create: `tests/e2e/lead-workflow.spec.ts`
- Create: `tests/e2e/follow-up-workflow.spec.ts`

---

## 6. Implementation sequence

### Task 1: Confirm product rules and acceptance criteria

**Objective:** Turn the product idea into explicit rules before schema work.

Decide and document:

- initial pipeline stages: `New`, `Researching`, `Ready to Contact`, `Contacted`, `Replied`, `Meeting Booked`, `Proposal`, `Won`, `Lost`, `Nurture`;
- which stages are active versus terminal;
- required fields for creating a lead;
- whether a contact may exist without a company;
- whether the initial release is single-user or team-ready;
- which outreach actions are manual versus sent from the application.

**Files:**

- Create: `docs/product-decisions.md`
- Create: `docs/mvp-acceptance-criteria.md`

**Verification:** A new developer can describe the happy path and the meaning of every pipeline stage without making product assumptions.

### Task 2: Scaffold the application and environment contract

**Objective:** Establish the Next.js application, linting, formatting, environment variables, and test commands.

**Files:**

- Modify: `package.json`
- Create: `.env.example`
- Create: `DESIGN.md`
- Create: `README.md`
- Create or modify: `app/layout.tsx`
- Create: `lib/env.ts`

**Verification:** Run the documented install, development, lint, typecheck, and test commands from a clean checkout. Validate the design tokens with `npx -y @google/design.md lint DESIGN.md` and resolve any contrast errors before implementation continues.

### Task 3: Add authentication and workspace isolation

**Objective:** Ensure each request has a known user and every query is scoped to a workspace.

**Files:**

- Create: `lib/auth.ts`
- Create: `middleware.ts`
- Create: `db/schema.ts`
- Create: `lib/permissions.ts`
- Test: `tests/integration/auth-and-scope.test.ts`

**Verification:** Unauthenticated users cannot access dashboard routes, and a user cannot read another workspace's companies, contacts, leads, tasks, or activities.

### Task 4: Implement the initial database schema and seed data

**Objective:** Create the minimum relational model and useful local demo data.

**Files:**

- Modify: `db/schema.ts`
- Create: `db/seed.ts`
- Create: `db/migrations/`
- Test: `tests/integration/schema.test.ts`

**Verification:** Migrations apply to an empty database, seed data loads successfully, foreign keys and workspace scoping are enforced, and unique indexes prevent obvious duplicates such as repeated company domains within one workspace.

### Task 5: Build company CRUD and company detail view

**Objective:** Let users create, edit, search, archive, and inspect companies.

**Files:**

- Create: `app/(dashboard)/companies/page.tsx`
- Create: `app/(dashboard)/companies/[companyId]/page.tsx`
- Create: `components/companies/company-form.tsx`
- Create: `app/api/companies/route.ts`
- Create: `app/api/companies/[companyId]/route.ts`
- Create: `lib/validation/company.ts`
- Test: `tests/integration/companies-api.test.ts`

**Verification:** A company can be created and edited with validation; the detail page shows its contacts, leads, activities, and open tasks; archive is reversible and does not delete history.

### Task 6: Build contact CRUD and contact-company relationships

**Objective:** Store people and their roles without duplicating company data.

**Files:**

- Create: `app/(dashboard)/contacts/page.tsx`
- Create: `components/contacts/contact-form.tsx`
- Create: `app/api/contacts/route.ts`
- Create: `app/api/contacts/[contactId]/route.ts`
- Create: `lib/validation/contact.ts`
- Test: `tests/integration/contacts-api.test.ts`

**Verification:** A contact can be created, edited, linked to a company, and marked do-not-contact; invalid email values are rejected; deleting or archiving a company does not silently destroy contact history.

### Task 7: Build lead records and pipeline progression

**Objective:** Make the lead/opportunity the main unit of outreach work.

**Files:**

- Create: `app/(dashboard)/leads/page.tsx`
- Create: `app/(dashboard)/leads/[leadId]/page.tsx`
- Create: `components/leads/lead-form.tsx`
- Create: `components/leads/lead-pipeline.tsx`
- Create: `app/api/leads/route.ts`
- Create: `app/api/leads/[leadId]/route.ts`
- Create: `app/api/leads/[leadId]/stage/route.ts`
- Create: `lib/validation/lead.ts`
- Test: `tests/integration/leads-api.test.ts`
- Test: `tests/e2e/lead-workflow.spec.ts`

**Verification:** The user can create a lead from a company/contact, move it through the pipeline by table or kanban, set priority and service interest, and mark it won/lost with a reason. Stage changes appear in the activity timeline.

### Task 8: Add explainable qualification and personalization fields

**Objective:** Capture the information needed to write relevant marketing outreach.

**Files:**

- Modify: `components/leads/lead-form.tsx`
- Create: `components/leads/qualification-panel.tsx`
- Create: `lib/lead-scoring.ts`
- Test: `tests/unit/lead-scoring.test.ts`

**Verification:** Fit and engagement scores are reproducible from documented rules; the UI explains why a lead received its score; changing a qualification field updates the score without hiding the underlying inputs.

Suggested first scoring inputs:

- fit: target industry, company size, geography, budget/estimated value;
- intent: recent response, booked meeting, inbound source, explicit need;
- negative signals: opt-out, invalid email, closed-lost reason, no-fit flag.

### Task 9: Add activity timeline, notes, and outreach logging

**Objective:** Give every lead a chronological, auditable history.

**Files:**

- Create: `components/leads/lead-timeline.tsx`
- Create: `components/activities/activity-form.tsx`
- Create: `app/api/activities/route.ts`
- Create: `app/api/activities/[activityId]/route.ts`
- Test: `tests/integration/activities-api.test.ts`
- Test: `tests/e2e/lead-workflow.spec.ts`

**Verification:** Users can log a note, email attempt, call, or meeting; activities show author, timestamp, type, body, and outcome; an activity updates `last_contacted_at` when appropriate.

### Task 10: Add tasks, reminders, and next-action views

**Objective:** Prevent active leads from losing their next step.

**Files:**

- Create: `components/tasks/task-list.tsx`
- Create: `components/tasks/task-form.tsx`
- Create: `app/(dashboard)/tasks/page.tsx`
- Create: `app/api/tasks/route.ts`
- Create: `app/api/tasks/[taskId]/route.ts`
- Test: `tests/integration/tasks-api.test.ts`
- Test: `tests/e2e/follow-up-workflow.spec.ts`

**Verification:** A lead can have a next action and due date; tasks can be completed, snoozed, and filtered by overdue/today/upcoming; the dashboard and lead detail show the same task state.

### Task 11: Add global search, filters, tags, and saved views

**Objective:** Make the app useful once the user has more than a few dozen prospects.

**Files:**

- Create: `components/shared/filter-bar.tsx`
- Create: `components/shared/tag-picker.tsx`
- Create: `app/api/search/route.ts`
- Create: `app/api/tags/route.ts`
- Create: `app/api/views/route.ts`
- Test: `tests/integration/search-and-filters.test.ts`

**Verification:** Search finds companies, contacts, and leads by name, domain, email, title, and notes; filters combine without dropping workspace boundaries; saved views reopen with identical criteria.

### Task 12: Add CSV import, deduplication, and export

**Objective:** Make onboarding from an existing spreadsheet safe and reversible.

**Files:**

- Create: `components/import/import-wizard.tsx`
- Create: `app/api/imports/route.ts`
- Create: `lib/dedupe.ts`
- Create: `lib/validation/import.ts`
- Create: `app/api/exports/leads/route.ts`
- Test: `tests/unit/dedupe.test.ts`
- Test: `tests/integration/import-api.test.ts`

**Verification:** The import flow previews mapped rows, reports invalid rows before writing, detects duplicates by normalized domain/email, shows created/skipped/error counts, and allows export of the user's workspace data.

### Task 13: Build the dashboard and basic analytics

**Objective:** Show the user what needs attention and which sources/outreach patterns are working.

**Files:**

- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `components/dashboard/pipeline-summary.tsx`
- Create: `components/dashboard/follow-up-summary.tsx`
- Create: `components/dashboard/source-performance.tsx`
- Create: `app/api/analytics/summary/route.ts`
- Test: `tests/integration/analytics.test.ts`

**Verification:** Dashboard counts match filtered source data for pipeline totals, overdue/today tasks, leads by source, stage conversion, and recent activity. Empty states are useful and do not show misleading zero-value charts.

### Task 14: Add privacy, safety, and operational safeguards

**Objective:** Make outreach data safe to use in real business workflows.

**Files:**

- Modify: `lib/permissions.ts`
- Create: `lib/suppression.ts`
- Create: `app/(dashboard)/settings/privacy/page.tsx`
- Create: `app/api/suppression/route.ts`
- Create: `docs/privacy-and-outreach.md`
- Test: `tests/integration/privacy-and-suppression.test.ts`

**Verification:** Do-not-contact contacts cannot be enrolled in future outreach; suppressed emails/domains are checked before sending or importing; exports are workspace-scoped; sensitive provider credentials are never logged; destructive actions require confirmation.

### Task 15: Add email templates and provider integration only after MVP validation

**Objective:** Enable faster outreach without turning the first release into an unreliable automation platform.

**Files:**

- Create: `components/outreach/template-editor.tsx`
- Create: `app/(dashboard)/outreach/templates/page.tsx`
- Create: `lib/email/provider.ts`
- Create: `app/api/email/send/route.ts`
- Create: `app/api/email/webhook/route.ts`
- Create: `tests/integration/email-suppression.test.ts`
- Create: `tests/integration/email-provider.test.ts`

**Verification:** Sending requires an explicit user action, records provider message IDs, handles failure states, respects suppression entries, and updates the activity timeline only after the provider confirms acceptance. Use provider test mode or mocks; never test by sending unsolicited real email.

---

## 7. UX requirements

### Visual direction

**Primary surface:** Operate — this is a working CRM workspace where the user takes action on leads and follow-ups. The dashboard is a secondary Monitor surface; do not use a marketing landing-page composition.

The visual system should use a charcoal-first, minimal, clean aesthetic:

- dark charcoal canvas rather than pure black;
- restrained neutral surfaces, warm off-white primary text, muted secondary text, and low-contrast borders;
- one restrained brand accent, with semantic success/warning/danger colors used only when they communicate status;
- Geist Sans for interface text and Geist Mono for compact metadata, scores, dates, and IDs, or the closest existing project font;
- a 4px base spacing unit with a deliberate 8/12/16/24/32px rhythm;
- modest 8px component radii, thin borders, and subtle elevation only for dialogs and popovers;
- typography, alignment, and whitespace should create hierarchy before cards, icons, or color;
- no glassmorphism, glossy gradients, decorative background effects, or icon-heavy feature cards;
- clear hover, keyboard-focus, loading, empty, success, error, and destructive-confirmation states;
- WCAG AA contrast, minimum 44px mobile hit targets, and `prefers-reduced-motion` support;
- dark charcoal is the MVP default; a light theme can follow after the core workflow is validated.

Create `DESIGN.md` as the machine-readable source of truth for the palette, typography, spacing, shapes, elevation, and component tokens. The initial recommended accent is a muted amber/brass, but this is still an open decision until confirmed.

### Navigation

Use a small, stable navigation surface:

- Dashboard
- Leads
- Companies
- Contacts
- Tasks
- Outreach/templates, when phase two exists
- Settings

### Lead detail should be the central screen

The lead detail page should show, above the fold:

- company and primary contact;
- pipeline stage and priority;
- recommended service/offer;
- observed pain point and personalization hook;
- next action and due date;
- last contact date;
- fit/engagement score explanation;
- prominent log-activity and create-task actions.

### Useful default filters

- Follow-up due today
- Overdue
- No next action
- Ready to contact
- Replied but not booked
- High-fit leads
- Nurture
- Do not contact

### Empty states

Every empty list should explain what the user can do next, with a primary action such as `Add company`, `Import CSV`, or `Create lead`.

---

## 8. Testing and validation strategy

### Unit tests

- input validation for companies, contacts, leads, tasks, and imports;
- email/domain normalization;
- duplicate detection;
- fit and engagement scoring;
- pipeline transition rules;
- suppression checks.

### Integration tests

- workspace scoping on every read and write;
- CRUD API behavior and error responses;
- relationships and cascading/archive behavior;
- activity and task side effects;
- CSV preview/import/export;
- analytics totals compared with fixture data.

### End-to-end tests

1. Sign in, create a company, create a contact, create a lead, and move it through two stages.
2. Add a research note, log an outreach attempt, create a next-action task, complete it, and confirm the timeline/dashboard update.
3. Import a CSV containing valid rows, malformed rows, and duplicates; verify the preview and final counts.
4. Mark a contact do-not-contact and verify a later email/send or enrollment action is blocked.

### Manual acceptance pass

- keyboard navigation for forms, dialogs, filters, and kanban actions;
- mobile/tablet layout at common breakpoints;
- timezone-safe due dates and reminders;
- clear loading, empty, success, and error states;
- no accidental duplicate submissions;
- destructive actions require confirmation;
- audit browser network requests for leaked credentials or cross-workspace data.

Suggested commands once scaffolded:

```bash
npm run lint
npm run typecheck
npm run test -- --run
npm run test:e2e
npm run build
```

All commands should be documented in `README.md` and should pass against a clean local database before launch.

---

## 9. Risks and tradeoffs

### Email automation risk

Sending email introduces provider limits, bounce handling, unsubscribe requirements, credential storage, and deliverability concerns. Build the activity model first and require explicit approval before adding sequences.

### Data quality risk

Imported contact data may be incomplete, stale, or duplicated. Preserve original import values, show a preview, normalize only for matching, and never silently overwrite an existing record.

### CRM complexity risk

Custom fields, advanced permissions, and many pipeline configurations can consume the project. Start with a small set of marketing-specific fields, tags, and one pipeline per workspace.

### AI risk

AI-generated personalization can invent facts or create inappropriate claims. If added later, show the source notes used to generate a draft, label it as a draft, and require human approval.

### Compliance risk

Do-not-contact and suppression behavior must be first-class. Avoid scraping or automated social messaging unless the user has verified the legal and platform-policy requirements for the target market.

### Analytics risk

Do not call metrics "conversion rate" unless the event definitions are explicit. Document whether rates use leads created, leads contacted, replies, meetings, or closed opportunities as the denominator.

---

## 10. Launch milestones

### Milestone A: usable lead tracker

Authentication, companies, contacts, leads, pipeline, activities, tasks, and lead detail page.

### Milestone B: reliable data operations

Search, filters, tags, import preview/deduplication, export, privacy flags, and workspace isolation tests.

### Milestone C: decision-support dashboard

Follow-up workload, pipeline summary, source attribution, transparent scoring, and basic funnel analytics.

### Milestone D: assisted outreach

Templates, mailbox connection, manual-send confirmation, provider events, suppression checks, and email activity sync.

### Milestone E: measured automation

Sequences, enrollment rules, approval gates, pause-on-reply behavior, deliverability monitoring, and only then optional AI-assisted drafting.

---

## 11. Success metrics for the first release

Track product usage before optimizing outreach automation:

- time from sign-up to first lead created;
- percentage of active leads with a next action;
- overdue task count per active user;
- leads progressed to a second pipeline stage;
- activity logged per active lead;
- import completion/error/duplicate rates;
- stage conversion and time-in-stage;
- reply and meeting rates only once sent-message tracking is trustworthy.

The most important early signal is whether the user opens the app to answer “who should I contact next, why, and what should I say?”

---

## 12. Open decisions before implementation

### Visual decisions

These should be locked before the first polished UI pass:

- **Accent color:** use a muted amber/brass by default; choose a different single accent only if it better fits the product identity.
- **Theme scope:** ship dark charcoal first; defer a light theme unless it is needed for the first users.
- **Typography:** use Geist Sans plus Geist Mono unless the repository already has an established type system.
- **Density:** use compact tables and lead lists, with more comfortable spacing in forms and dialogs.
- **Product identity:** choose the app name, wordmark treatment, and whether the initial release needs a logo beyond a typographic mark.

### Product decisions

1. Is the first release single-user, or should team roles be implemented immediately?
2. Which outreach channel is primary: email, phone, LinkedIn research, or a mix?
3. Should email sending be in the MVP, or should MVP only draft/log outreach?
4. What type of marketing solution is being sold first? This should determine the initial qualification fields and templates.
5. Which countries/markets will be targeted? This affects privacy, consent, and outreach rules.
6. Where will prospect data come from initially: manual entry, CSV, inbound forms, or an existing CRM?
7. Which pipeline stages and lead score inputs match the user's actual sales process?

Until these are answered, implement the MVP with one workspace, manual data entry/CSV import, manual outreach logging, a configurable-but-small pipeline, dark charcoal as the default theme, and no automated scraping or bulk sending.
