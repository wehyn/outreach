# Outreach

A focused workspace for researching prospects, managing company/contact relationships, tracking outreach, and staying ahead of follow-ups.

The current slice is a responsive dashboard and lead workflow using the charcoal design system in `DESIGN.md`. The `/leads` pipeline and `/leads/[leadId]` detail route use a typed, workspace-scoped demo repository. The detail view can update a lead's stage and next action through a validated `PATCH` route, log manual notes, emails, calls, and meetings through a validated `POST` route, and keep the timeline plus last-contacted state in sync. This adapter is process-local demo state; durable persistence, authentication, and production workspace authorization are implemented in later vertical slices.

## Local development

Requirements:

- Node.js 24+
- npm
- PostgreSQL for the data layer that follows the initial shell

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The design-token spec can be validated with:

```bash
npx -y @google/design.md lint DESIGN.md
```

## Project direction

The product is an Operate surface: the user should quickly answer who to contact next, why the lead is a fit, and what action is due. The MVP prioritizes manual entry, CSV import, explainable qualification, pipeline stages, activities, tasks, and suppression controls before automated outreach.
