# Clinical Records, Notes, and Billing Model

How Zavy structures the patient clinical/financial record. Generic model only —
keep patient data, IDs, and scheme numbers in the business repo, not here.

## Patient record routes

`/patients/{id}/` + `profile`, `notes`, `chart`, `invoices`, `treatment-plan`,
`periodontal`, `documents`, `imaging`, etc. The **Clinical Summary** button
(top of the record) opens a consolidated timeline.

## Notes data model

- A note carries `metadata = { fdi, surfaceCode, noteTitle, itemCost }`:
  - `fdi` = tooth in FDI two-digit notation; `surfaceCode` = e.g. `MOD`, `DOBL`.
  - `noteTitle` = the ADA item code + description; `itemCost` = its price.
- `autoNote: true` → the note was **auto-generated when a charted item was
  completed**. The header is stamped from the structured item (NOT AI), one item
  per note. `autoNote: false` → manually written; no header item.
- A multi-procedure visit therefore shows **one** pinned item at the note head,
  while the free-text body may describe several procedures. The head is a
  display summary, not the full billable list — read the chart/Invoice Builder
  for the complete item set.

## Note types, states, editability

- Types: **Clinical: Treatment / Dental / Billing** (the clinical record) and
  **General / Internal / Follow Up / Comment** (non-clinical).
- States seen: `published`, `finalized`.
- **Clinical notes lock** once finalised → `Locked`, Print-only, **not
  editable** (medico-legal integrity); add an addendum instead.
- **General / Internal / etc. stay editable** (keep an `Edit` action) — so a
  pinned editable note is the right vehicle for a **living patient summary** you
  regenerate in place. Pin = `sticky` (also surfaced in the profile Sticky Notes
  panel).

## What the consolidated views include

- **Clinical Summary**: charted items + their **Clinical: Treatment** note
  bodies only. It does **not** include General/Internal notes.
- **Treatment Plan** view: items only.
- So a General/Internal summary note is visible only in the **Notes** tab — it
  will not clutter Clinical Summary or Treatment Plan, but also won't appear in
  them.

## Billing surfaces (charted ≠ invoiced)

- **Invoice Builder** (`/invoices`) "Ready to Invoice" = items completed/charted
  but not yet invoiced. **Treatment Plan** "Proposed" = planned, not done.
  Actual invoices are separate (Draft/Unpaid/Paid).
- Item codes are the **ADA schedule**; prices come from a **price list** (e.g. a
  government-scheme fee list).
- Work can be fully **charted yet `$0` invoiced** — "Ready to Invoice" is not
  billed until someone creates the invoice/claim.
- **Reports → Finance → Uninvoiced Items** only counts items that carry a
  *completion timestamp*, so it can **under-report** what's actually sitting in
  patients' Invoice Builders. Cross-check builders; don't trust it alone.

## Visibility (verify before trusting confidentiality)

- Visibility is governed by note **type**, not a per-note toggle.
- Cross-practice exposure comes from **Location/Practice Sharing** and
  **Referrals**, not open browsing. No Zavy doc confirms whether `Internal`
  notes are excluded from these — **UNVERIFIED**. Before relying on `Internal`
  for practice-private content, verify by test (create one and view from the
  other practice's login/shared view) or ask Zavy support which types are
  excluded from Location Sharing + Referral sharing. Also check that referral/
  print "Clinical Notes" template variables don't pull non-clinical notes.

## Living summary note (agent-maintained)

A pinned, editable General/Internal note can serve as a curated, regenerated
"patient summary" — the opposite of the raw-questionnaire sticky-note dump.
Useful sections: Alerts & Safety / Medical / Funding & Scheme / Active Plan &
Next Steps / Recent Treatment / Recall / Cover / Imaging / Billing Snapshot /
Admin. Format with H3 headers + 16px body. Keep one visible
`Last synced YYYY-MM-DD` marker near the top for freshness/verification; do not
repeat that marker inside source excerpts or per-section bullets.

- **Singleton, find-by-title** (`📋 Internal Summary`). One per patient.
- **Lab Flow/system-owned summaries must be upserted, not appended**. If zero
  active system-owned summaries exist, create one. If exactly one exists, edit
  and publish that same note. If more than one exists, fail closed and clean up
  intentionally; do not create another duplicate.
- **Never overwrite human summaries**. A system-maintained summary must carry a
  machine-owned marker/ref in its body/footer. If the only matching title lacks
  that marker, stop for human review.
- **Humans revise it in place** (Edit → change → Publish) — trivial in the UI.
- **Agents edit in place via the CDP Input domain** (real mouse + `Input.insertText`)
  — synthetic JS events don't register in this editor. Recreate (archive + paste
  into an empty composer) is only a fallback for wholesale rewrites. Verify the
  singleton afterwards. See
  [`notes-editor-automation.md`](notes-editor-automation.md) for the mechanics.
- **Link action items to Tasks**: keep the human-readable checklist in the note,
  and for tracked items create a **Task** (patient Tasks tab) that uses the
  **"Search note"** field to point back at the summary — tasks are board-visible,
  assignable, due-dated, and patient-linked.
