# Horizon Pro Dental — Zavy account reference

Use this account reference only for the Horizon Pro Dental Zavy account at
`https://horizonprodental.zavy.com`. Pair it with the generic `zavy` skill.

This file may contain Horizon's stable operating conventions, but never patient
data, invoice copies, credentials, or one-off patient/invoice values.

## Locations

Horizon operates the Parkside and Woodside locations. Before creating or
editing a record, confirm the source document identifies the location and that
the matching location/site is active in Zavy. Do not infer a location from the
patient, practitioner, or prior records.

For the lab-invoice outlier workflow below, the treatment/payment record in
Zavy overrides the location printed on the laboratory invoice.

## Enter a Horizon Pro Laboratories tax invoice

Use this workflow when a Horizon Pro Laboratories invoice needs to be recorded
as patient lab work.

### Required source fields

Read these from the invoice and the live Zavy record. Do not copy them into
chat, commits, screenshots, or this account reference.

- Horizon location determined from the relevant treatment/payment record
- patient identity
- applicable treatment or appointment
- requesting dentist
- invoice due date
- total invoice cost

If the patient, location, appointment, dentist, due date, or total is ambiguous,
stop before saving and ask the operator to resolve it. Never guess clinical or
invoice associations.

### Patient-first route

1. Confirm the browser is on `horizonprodental.zavy.com`.
2. Search for the patient across both Parkside and Woodside. In the live UI,
   enter the search text and press **Enter**; typing alone may not submit the
   search. Verify the correct patient before opening the record.
3. At each possible site, inspect **Invoices** using **All**, **Unpaid**,
   **Paid**, **Draft**, and **Archived** as needed. Use the site where the
   relevant treatment/payment record is held, even when the laboratory invoice
   prints a different site.
4. Switch the clinic selector to that site. If the selector is not visible or
   usable, widen the browser viewport before continuing.
5. Open **Lab Work**, then select **New Lab Work**.
6. Attach the most recent appointment that is genuinely applicable to the lab
   item. For example, a mouthguard invoice belongs to the relevant mouthguard
   appointment; recency alone is not enough.
7. Set **Staff member** to the requesting dentist record associated with the
   selected site. Where duplicate staff names exist, verify the site-linked
   record rather than selecting by name alone.
8. Set the laboratory/contact to **Horizon Pro Laboratories**.
9. Enter the **Due date** exactly as shown on the invoice. If it is **TBD**, use
   today's date only when the operator explicitly instructs you to do so;
   otherwise stop and ask.
10. Enter the invoice **Total cost** exactly, checking decimal placement and that
   the amount is the invoice total rather than a line item or balance.
11. Preserve all invoice details already entered. Re-check the routed site,
   patient, appointment, site-linked requester, laboratory, due date, and total,
   then save with the required live-action confirmation.
12. In the lab-work list, open the row's three-dot menu in the **State** column
    and change **New** to **Complete**.

### Lab-work-first route

From the main **Lab Work** area, select **New Lab Work**, search for and verify
the patient, then complete the same appointment, dentist, laboratory, due-date,
cost, save, and state steps above. Prefer the patient-first route when it makes
identity verification clearer.

### UI gotchas

- Patient search may not run until **Enter** is pressed.
- The clinic selector may require a wider browser viewport.
- Completed lab work may be hidden by default. Reveal completed records before
  trying to find or edit an existing entry.

### Verify

Re-open or re-query the saved record and confirm all of the following:

- the Parkside/Woodside location matches the relevant treatment/payment record,
  regardless of the location printed on the laboratory invoice;
- the patient and applicable appointment are correct;
- the requesting dentist record is linked to that site;
- the laboratory/contact is **Horizon Pro Laboratories**;
- the due date and total match the invoice; and
- the state is **Complete**.

Report completion without repeating patient-identifying or invoice-sensitive
details in chat.
