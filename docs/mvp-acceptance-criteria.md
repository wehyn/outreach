# MVP acceptance criteria

## Milestone A: usable lead tracker

A user can complete the following workflow without editing the database directly:

1. Create a company.
2. Add a contact and associate it with that company.
3. Create a lead for the company and choose the contact.
4. Open the lead detail page and see the company, contact, stage, priority, reason for fit, and next action together.
5. Move the lead through at least two pipeline stages.
6. Log a note or manual outreach activity.
7. Create a follow-up task with a due date.
8. Complete the task.
9. Refresh the app and see the persisted lead, stage, activity, and task state.

### Lead detail requirements

The lead detail view must show, above the fold on desktop:

- company and primary contact;
- current pipeline stage and priority;
- service interest and recommended offer;
- observed pain point and personalization hook;
- next action, due date, and overdue state;
- last contact date;
- activity timeline;
- actions to change stage, log activity, and create a task.

On mobile, these same items may stack, but context, reason, next action, and activity must remain in the same workflow rather than being scattered across unrelated screens.

### Data integrity requirements

- Every read and write is scoped to the authenticated workspace.
- Invalid request bodies return a clear validation error and do not write partial records.
- A stage change creates an activity entry.
- Logging an email, call, or meeting updates the lead's last-contacted timestamp.
- Completing a task removes it from open follow-up views without deleting its history.
- Archived companies and contacts remain available to historical activities.
- Do-not-contact contacts cannot be used by any future send or enrollment action.

## Milestone B: reliable data operations

After Milestone A is stable:

- Search finds companies, contacts, and leads by the primary identifying fields.
- Filters support due today, overdue, no next action, ready to contact, replied but not booked, high fit, nurture, and do not contact.
- CSV import previews rows before writing, reports invalid rows, and detects duplicates by normalized domain/email.
- CSV export contains only the authenticated workspace's records.
- Saved views reopen with the same search and filter criteria.

## Milestone C: decision-support dashboard

- Dashboard counts come from the same records shown in list and detail views.
- Pipeline totals, open tasks, overdue tasks, and recent activity are internally consistent.
- Analytics name their denominator and do not show invented metrics when there is no source data.
- Empty states explain the next action, such as `Add company`, `Import CSV`, or `Create lead`.

## Explicitly out of scope for the first release

- Automatic email sending.
- Bulk outreach or autonomous sequences.
- Contact scraping or LinkedIn automation.
- AI-generated claims presented as facts.
- Complex team permissions.
- Black-box lead scoring.
