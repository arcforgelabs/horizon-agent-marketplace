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

## Enter a Horizon Pro Laboratories tax invoice

Use this workflow when a Horizon Pro Laboratories invoice needs to be recorded
as patient lab work.

### Required source fields

Read these from the invoice and the live Zavy record. Do not copy them into
chat, commits, screenshots, or this account reference.

- Horizon location: Parkside or Woodside
- patient identity
- applicable treatment or appointment
- requesting dentist
- invoice due date
- total invoice cost

If the patient, location, appointment, dentist, due date, or total is ambiguous,
stop before saving and ask the operator to resolve it. Never guess clinical or
invoice associations.

### Patient-first route

1. Confirm the browser is on `horizonprodental.zavy.com` and select the invoice's
   Parkside or Woodside location.
2. Open **Patients** from the left navigation, search for the patient, and verify
   the correct patient before opening the record.
3. Open **Lab Work**, then select **New Lab Work**.
4. Attach the most recent appointment that is genuinely applicable to the lab
   item. For example, a mouthguard invoice belongs to the relevant mouthguard
   appointment; recency alone is not enough.
5. Set **Staff member** to the dentist who requested the work.
6. Set the laboratory/contact to **Horizon Pro Laboratories**.
7. Enter the **Due date** exactly as shown on the invoice.
8. Enter the invoice **Total cost** exactly, checking decimal placement and that
   the amount is the invoice total rather than a line item or balance.
9. Re-check the location, patient, appointment, dentist, laboratory, due date,
   and total against the invoice, then save with the required live-action
   confirmation.
10. In the lab-work list, open the row's three-dot menu in the **State** column
    and change **New** to **Complete**.

### Lab-work-first route

From the main **Lab Work** area, select **New Lab Work**, search for and verify
the patient, then complete the same appointment, dentist, laboratory, due-date,
cost, save, and state steps above. Prefer the patient-first route when it makes
identity verification clearer.

### Verify

Re-open or re-query the saved record and confirm all of the following:

- the Parkside/Woodside location matches the invoice;
- the patient and applicable appointment are correct;
- the requesting dentist is selected;
- the laboratory/contact is **Horizon Pro Laboratories**;
- the due date and total match the invoice; and
- the state is **Complete**.

Report completion without repeating patient-identifying or invoice-sensitive
details in chat.
