---
name: zavy
description: "Operate Zavy/Zavy360 via browser: online bookings, appointment shortcuts, rosters, settings checks."
---

# Zavy

If an installed `ACCOUNT.md` is present beside this skill, read it completely
before acting. It owns organisation-specific locations, contacts, staff rules,
and workflows; this generic skill owns Zavy mechanics and safety.

Use this skill when working inside Zavy/Zavy360, especially for calendar,
online booking, staff/roster, appointment shortcut, location branding, billing,
or API-access questions.

Zavy is a clinical/health-data system. Treat it as production. Avoid patient
data in notes, screenshots, commits, and chat. Prefer read-only inspection
first, then small reversible changes, then verify from both admin and public
booking surfaces.

## Source Order

1. User intent and live authenticated Zavy UI.
2. Zavy public help/release notes.
3. Zavy support responses.
4. Authenticated app schema/cache for verification and careful automation.

Do not present internal GraphQL details as official API access. Zavy currently
does not offer open self-service API keys; partner access is controlled through
Zavy's Partner API Program. For details, read
[`references/api-and-browser.md`](references/api-and-browser.md).

## Browser Access

For authenticated work, attach to the user's existing browser session rather
than starting a fresh login. In a typical Brave/Chrome workstation setup, the
CDP endpoint is usually (override with `ZAVY_CDP`):

```bash
http://127.0.0.1:9226
```

List Zavy tabs:

```bash
curl -s http://127.0.0.1:9226/json/list | jq -r '.[] | [.id,.type,.title,.url] | @tsv' | rg 'zavy|bookings'
```

If CDP is unavailable, ask the user to reopen the authenticated browser with
remote debugging before changing live settings.

For repeatable read-only browser/API inspection, prefer the bundled helper:

```bash
scripts/zavy-cdp-helper.mjs list-tabs --pretty
scripts/zavy-cdp-helper.mjs search-patient --name "Jane Example" --dob 1980-01-31 --pretty
scripts/zavy-cdp-helper.mjs search-staff --name "Amy" --pretty
scripts/zavy-cdp-helper.mjs notes --patient-guid <guid> --created-start 2026-06-29T00:00:00+09:30 --created-end 2026-06-29T23:59:59+09:30 --pretty
```

The helper runs GraphQL queries from inside the authenticated Zavy tab and
prints JSON to stdout only. Treat the output as patient data: keep it local,
summarize minimally, and do not commit it.

## Safe Working Pattern

1. Identify the exact record(s) and current state.
2. Capture the fields you may need to preserve before mutating.
3. Apply the smallest change.
4. Re-query the admin record.
5. Verify the public booking flow if the change affects patients.

For mutation gotchas and full-payload preservation, read
[`references/api-and-browser.md`](references/api-and-browser.md).

## Common Areas

- **Online booking services**: appointment shortcuts/reasons with
  `ONLINE_BOOKINGS`. See
  [`references/online-bookings.md`](references/online-bookings.md).
- **Availability and blockers**: rosters define bookable sessions; private
  appointments block time. See
  [`references/appointments-and-blockers.md`](references/appointments-and-blockers.md).
- **Location cards/images**: `Settings > Business > Locations > edit location`
  includes `Upload CoverPhoto` for public location cards.
- **Licensing/billing**: licence limits can block staff invite acceptance. See
  [`references/operations.md`](references/operations.md).
- **Clinical records, notes, billing**: note data model, note types and
  editability (clinical notes lock; general/internal stay editable), Clinical
  Summary, and charted-vs-invoiced surfaces. See
  [`references/clinical-records-and-notes.md`](references/clinical-records-and-notes.md).
- **Read-only patient/notes lookups**: use `scripts/zavy-cdp-helper.mjs` for
  CDP tab discovery, patient/staff lookup, GraphQL schema inspection, and
  non-clinical note extraction with Base64Brotli content decoding.
- **Authoring/automating notes**: the Lexical note editor over CDP — paste-HTML
  fidelity, the duplicate-paste gotcha, checklists/headings, and building a
  pinned editable patient summary. See
  [`references/notes-editor-automation.md`](references/notes-editor-automation.md).
  If the project repo provides deterministic write-job scripts or endpoints,
  use those instead of ad hoc browser driving; the browser is the transport, not
  the source of truth for note content.
- **Recall due queues and reports**: the operational `/recalls` page is the
  source for actionable due recalls. Zavy report grids such as Patient Recalls,
  Patient Recalls Due, and Non Rebooked can be useful but may expose different
  or incomplete data. See
  [`references/recalls-and-reports.md`](references/recalls-and-reports.md).

## High-Risk Gotcha

Zavy update mutations for appointment reasons can treat omitted fields as empty.
When editing online booking appointment shortcuts programmatically, preserve
fields such as assigned practitioners, shift/session filters, catalogue item
links, templates, visibility, prepayment, deposit, and cost flags. Do not send a
partial payload unless you have verified that the specific mutation is patch-like.

## Installation Notes

This is a generic Zavy operations skill. Keep business-specific IDs, staff
names, account billing facts, patient data, and practice-specific policy in the
project repo for that business, not in this skill.
