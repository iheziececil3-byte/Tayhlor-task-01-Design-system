---
trigger: model_decision
description: Enforce Paystack payment processing, 70% deposit and 30% balance calculation, webhook signature verification, server-side confirmation, and manual refund rules when building, scaffolding, or modifying payment workflows in Tayhlor.
alwaysApply: false
---

# Payments rules

One job: control how Paystack payments are started, confirmed, refunded, and recorded.

## 1. Provider and currency

- PAY-01: Paystack is the only payment provider. Flutterwave is out of scope.
  Why: PRD 5.2 and 8.2 set this for the pilot.
- PAY-02: The Paystack integration is custom. Do not use platform built-in payments.
  Why: PRD 8.2 chooses a custom Paystack integration.
- PAY-03: Paystack test credentials must remain active throughout development, integration testing, and pre-launch verification. Production credentials may only be configured after the required payment tests pass and the owner explicitly approves the production launch.
  Why: Reconciles PRD Section 8.1 and Section 13, establishing a strict verification gate before production credentials can be configured.
- PAY-04: Currency is NGN. Amounts are stored in kobo (minor units).
  Why: The owner decided NGN (PRD Section 14, decided list). PRD 8.5 stores minor units.

## 2. Amounts

- PAY-05: The deposit is 70% of the quoted total. The server calculates it and rounds to the nearest whole kobo. OPEN: how an exact half kobo is rounded.
  Why: PRD FR-40 requires the calculation. 70% of some totals gives an exact half kobo, and the PRD does not say how to round it.
- PAY-06: The deposit is payable only when the order is ACCEPTED, and no deposit is PENDING or SUCCESSFUL. PROPOSED: the PENDING part of this rule.
  Why: PRD FR-40 requires ACCEPTED and no successful deposit. Blocking a second attempt while one is PENDING prevents two open checkouts.
- PAY-07: The balance equals the quoted total minus the deposit. It is payable only when the order is READY_FOR_COLLECTION and the deposit has succeeded.
  Why: PRD FR-42 requires it.

## 3. Starting a payment

- PAY-08: Before redirecting the customer, the server creates a PENDING payment with a unique reference and a server-calculated amount.
  Why: PRD 8.3 step 2 requires it.
- PAY-09: The customer pays on Paystack's hosted checkout.
  Why: PRD FR-40 requires it.
- PAY-10: At most one successful payment may exist per order and per payment type. The check runs inside a transaction.
  Why: PRD 8.5 places this check inside a transaction.
- PAY-11: A FAILED payment can be retried.
  Why: PRD 8.5 requires retries after a failed attempt.

## 4. Confirming a payment

- PAY-12: A payment becomes SUCCESSFUL only after a verified webhook signature and a server-side verify call. The verified amount and currency MUST equal the amount and currency stored on the PENDING payment.
  Why: PRD FR-41 and 8.3 steps 5 to 7 require these checks.
- PAY-13: A browser redirect never confirms a payment. The return page reads the status from the database, not from URL parameters.
  Why: PRD FR-41 and 8.3 step 8 require it.
- PAY-14: Repeated webhooks have no effect and create no duplicate payments.
  Why: PRD FR-41 requires it.
- PAY-15: PENDING payments older than 15 minutes are re-checked. A re-check asks Paystack for the payment status and applies PAY-12. Run the re-check every 15 minutes if the hosting plan allows it, otherwise hourly.
  Why: This catches missed webhooks (PRD 8.3). PRD Section 14 Q9 sets the schedule.

## 5. Refunds and records

- PAY-16: A refund equals the full amount paid. The payment is set to REFUNDED with a date. The owner processes the refund by hand in Paystack, then the refund is logged.
  Why: PRD FR-46 and section 5.2 require manual refunds in v1.
- PAY-17: Refund target: within 7 days of the cancellation. This is a working assumption (PRD Section 14 Q4). The owner confirms it.
  Why: The PRD gives 7 days as the working assumption.
- PAY-18: Every payment event is logged. OPEN: where the log is stored.
  Why: PRD FR-71 requires the log. The PRD does not say where it lives.
- PAY-19: The balance is paid online through Paystack. Manual recording of a payment is P2 and is not built until the owner decides.
  Why: PRD FR-45 is P2. PRD Section 14 Q1 sets online payment as the working assumption.
- PAY-20: Customers see their own payments. The tailor sees all payments. Each payment shows type, amount, date, and status.
  Why: PRD FR-43 (P1) defines this view.
- PAY-21: PROPOSED. The app MUST NOT store card details. It stores payment references and status only.
  Why: The Payment model in PRD 8.5 holds references, amounts, and status, with no card fields.
