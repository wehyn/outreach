# Product decisions

These decisions define the first usable version of Outreach. They are intentionally narrow so the core follow-up loop can be validated before integrations or automation are added.

## Workspace and access

- The first release is single-user with one workspace per account.
- The data model still carries a workspace boundary so multi-user access can be added without rewriting the CRM entities.
- Authentication and workspace authorization must exist before the app handles real prospect data.
- The initial local demo may use a clearly identified demo workspace; it must not be presented as production authentication.

## Core workflow

The primary workflow is:

1. Create or import a company.
2. Add a contact, optionally linked to the company.
3. Create a lead for the company and optionally choose a primary contact.
4. Capture the reason the lead may be a fit.
5. Set a next action and due date before outreach begins.
6. Manually log notes, email attempts, calls, meetings, and stage changes.
7. Move the lead through the pipeline toward won, lost, or nurture.

The first release records outreach; it does not send email, scrape contacts, run bulk campaigns, or take autonomous actions.

## Pipeline

The initial stages are ordered as follows:

1. `New`
2. `Researching`
3. `Ready to Contact`
4. `Contacted`
5. `Replied`
6. `Meeting Booked`
7. `Proposal`
8. `Won`
9. `Lost`
10. `Nurture`

`Won` and `Lost` are terminal stages. `Nurture` is an active holding stage that can be reopened later. Stage changes are recorded in the activity timeline.

## Relationships and required fields

- A company can have many contacts and many leads.
- A contact may exist without a company so incomplete or imported records are not blocked.
- A lead must belong to a company.
- A lead may initially have no primary contact while the decision maker is being researched.
- A lead requires a name, stage, status, and priority. New leads default to `New`, `active`, and `medium`.
- A lead should have a next action and due date before it reaches `Ready to Contact`; research-stage leads may temporarily show `No next action`.
- Deleting a company or contact must not silently erase activity history; archive behavior is preferred.

## Outreach and privacy

- Email, phone, and meeting activity is manually logged in the first release.
- Do-not-contact and unsubscribe state are stored on contacts and checked before any future send or enrollment feature.
- The first release does not send messages, enroll contacts in sequences, or infer consent.

## Qualification

The initial lead detail flow captures these human-readable fields:

- service interest;
- observed pain point;
- recommended offer;
- personalization hook;
- research notes;
- estimated value;
- source.

Explainable fit and engagement scoring follows the basic lead workflow. Scores must always expose their underlying inputs and rules.

## Data and time conventions

- Store timestamps in UTC.
- Render dates and times in the user's local timezone.
- Treat task due dates as calendar dates unless a specific time is explicitly required.
- Normalize email addresses and domains only for duplicate detection; preserve the original display value.
