<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

- Use TypeScript strict mode and the App Router structure.
- Keep the charcoal visual language centralized in `DESIGN.md` and `app/globals.css`.
- Treat the lead detail view as the core workflow: context, reason, next action, and activity should stay close together.
- Keep server-only database and authentication code out of Client Components.
- Use Zod for request validation and scope every read/write to the authenticated workspace.
- Add tests for new behavior before implementation and run the focused test before the full suite.
- Do not add email sending, scraping, bulk outreach, or autonomous AI actions without explicit review.
- Never commit secrets, provider tokens, production data, or `.env` files.
- Run `npm run check` and `npm run build` before considering a feature complete.

