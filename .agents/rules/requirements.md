---
trigger: always_on
alwaysApply: true
description: Enforce v1 product scope, feature prioritization (P0 before P1), out-of-scope boundaries, and core customer/tailor requirements for Tayhlor.
---

# Requirements rules

One job: define what the app must build and show.

- REQ-01: Build only the v1 scope in PRD 5.1.
  Why: PRD Section 13 rates scope exceeding the bootcamp timeline as a high-likelihood, high-impact risk.
- REQ-02: Build nothing in PRD 5.2. This includes image uploads.
  Why: PRD 5.2 lists these as out of v1.
- REQ-03: Build P0 items before P1 items. Build no P2 item until the owner decides.
  Why: PRD Section 6 defines P0 as required for launch and P2 as later.
- REQ-04: The app is responsive web only. Do not build a native app.
  Why: PRD 5.2 excludes native iOS and Android apps.

## Customers

- REQ-05: Customers create, edit, and delete their own measurement records. Each record has a label, values in centimetres, and a timestamp. Standard fields: chest, waist, hip, shoulder, sleeve, inseam, length. Records appear only on the dashboard of the customer who created them.
  Why: PRD FR-10 defines the record. PRD Q7 sets the standard fields.
- REQ-06: Order submission requires a garment type, a non-empty description, and a measurement record. Both the client-side form and server-side validation MUST enforce that the description is non-empty.
  Why: PRD FR-20 and corrected Section 8.5 require all three, with description as a mandatory non-nullable field.
- REQ-07: Customer order status updates appear without a manual refresh, or within a polling interval. OPEN: the interval.
  Why: PRD FR-50 and Goal G2 say customers stay informed without calling the tailor.
- REQ-08: Customers get an email within five minutes of: order accepted, order declined, payment succeeded, order ready, or refund processed.
  Why: PRD FR-51 (P1) requires these emails. Emails go through Resend.
- REQ-09: No email is sent until the Resend sending domain is verified.
  Why: PRD 8.2 says Resend requires a verified sending domain.
- REQ-10: Shop details shown to customers come only from the business record.
  Why: PRD FR-62 and Goal G3 forbid invented or unverified facts.

## Tailor

- REQ-11: The tailor sees every order in an incoming-orders queue, filterable by status. The queue also shows each order's deposit and balance status.
  Why: PRD FR-30, FR-44, and section 4.2 require these views.
- REQ-12: The tailor views and edits customer contact details. Each change is logged (DAT-05).
  Why: PRD FR-34 (P1) requires it.
- REQ-13: The tailor creates, edits, and approves FAQ source documents. Only the tailor approves them.
  Why: PRD FR-64 (P0) and section 4.2 give this to the tailor.
- REQ-14: The tailor may view the current measurement records of customers who have at least one order associated with the business, including completed and cancelled orders. The tailor may not view measurements belonging to customers who have never placed an order.
  Why: PRD Section 4.2 and FR-11 rule.
