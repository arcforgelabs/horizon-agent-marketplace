# Recalls and Reports

Use this reference when counting Zavy recall backlog, populating call queues, or
explaining why recall report exports do not match the operational recall page.

## Source Order For Recall Counts

1. **Operational source:** `/recalls`
2. Patient record/profile state if validating an individual row.
3. Patient reports only as secondary evidence:
   - `/reports/patient/recalls`
   - `/reports/patient/recalls-due`
   - appointment reports such as `/reports/appointment/non-rebooked`

Do not treat report grid exports as the recall call queue without checking them
against `/recalls`. The report screens can load different columns, blank due
fields, sparse visible rows, or no rows even when `/recalls` has actionable due
patients.

## Operational Due Logic

The `/recalls` page text and Apollo query define the due queue. The practical
query shape observed in the authenticated web app is:

```json
{
  "operationName": "UserPracticeConnectionRecalls",
  "variables": {
    "attributes": {
      "role": "patient",
      "recallFilter": "due",
      "missedAppointments": 4,
      "skipFutureVisit": true,
      "skipActiveRecall": true,
      "skipWithDropOff": false,
      "state": ["active"],
      "recallDueTime": {
        "start": "YYYY-MM-01",
        "end": "YYYY-MM-last"
      }
    },
    "first": 25
  }
}
```

Interpretation:

- Due is month-scoped by `recallDueTime`.
- Patients must be active.
- Patients with an upcoming visit are skipped.
- Patients with an active recall are skipped.
- Patients with 4 or more consecutive missed appointments are skipped.
- Drop-off recalls are not skipped by default in the observed query.
- The default patient recall period can be read from practice configuration;
  the observed field is `newPatientDefaultRecallPeriod`.

For full backlog counts or exports, request enough rows for pagination, for
example `first: 200`, or follow `pageInfo`/cursor pagination. Do not rely on the
first visible grid page when `totalCount` is larger than visible edges.

## Counting Pattern Over CDP

Attach to the authenticated browser, create a separate tab for navigation, and
read counts from Apollo rather than scraping patient rows into chat:

```bash
curl -s http://127.0.0.1:9226/json/list \
  | jq -r '.[] | [.id,.type,.title,.url] | @tsv' \
  | rg 'zavy|bookings'
```

For a visible `/recalls` page:

```js
const cache = window.__APOLLO_CLIENT__?.cache?.extract?.() || {};
const root = cache.ROOT_QUERY || {};
Object.keys(root)
  .filter((key) =>
    key.startsWith("userPracticeConnections:") &&
    key.includes('"recallFilter":"due"')
  )
  .map((key) => ({ key, totalCount: root[key]?.totalCount }));
```

When doing a functional extraction for a call queue, call the same persisted
query through the authenticated page context with `fetch('/graphql', ...)`,
`credentials: 'include'`, and a larger `first` value. Keep raw patient rows in a
local source file only; do not paste patient names, phone numbers, email
addresses, or screenshots into chat or docs.

For profile links from `UserPracticeConnectionRecalls`, use the
`UserPracticeLink.guid` / `node.guid` value:

```text
/patients/<node.guid>/profile
```

Do not use `node.profile.guid` in that path. Zavy's UI links recall rows with
the user-practice-connection GUID; using the nested profile GUID returns Page
not found.

## Report Pitfalls

- `Patient Recalls` can show recall metadata but may have blank due fields for
  rows in the selected report period.
- `Patient Recalls Due` can time out or export only headers/zero rows even when
  the operational `/recalls` page has due patients.
- `Non Rebooked` is an appointment report, not the recall due queue. It can help
  find follow-up opportunities, but it should not be used as the source of truth
  for due recall counts.
- AG Grid exports may capture only visible/paginated rows unless the extractor
  scrolls/paginates or calls the backing query directly.
