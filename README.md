# Outreach

A focused workspace for researching prospects, managing company/contact relationships, tracking outreach, and staying ahead of follow-ups.

The first slice is a responsive dashboard shell using the charcoal design system in `DESIGN.md`. It currently uses demo data; persistence, authentication, and API-backed CRM entities are implemented in later plan tasks.

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
npm test
npm run build
```

The design-token spec can be validated with:

```bash
npx -y @google/design.md lint DESIGN.md
```

## Project direction

The product is an Operate surface: the user should quickly answer who to contact next, why the lead is a fit, and what action is due. The MVP prioritizes manual entry, CSV import, explainable qualification, pipeline stages, activities, tasks, and suppression controls before automated outreach.
