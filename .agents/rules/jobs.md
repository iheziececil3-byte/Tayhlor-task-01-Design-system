---
trigger: model_decision
description: Enforce background and scheduled job definitions, idempotency, failure logging, payment re-checks, daily reconciliation, asynchronous email dispatch, and document indexing for Tayhlor.
alwaysApply: false
---

# Background and scheduled job rules

One job: define how scheduled and background work runs, and what each job must do.

## 1. General rules

- JOB-01: Every scheduled or background job MUST be listed in section 2 with its purpose, its trigger, and the file that holds its rules.
  Why: The owner must see every job that changes data or sends email.
- JOB-02: A job MUST be safe to run twice. Running it again with the same input MUST NOT create a duplicate payment, email, or chunk.
  Why: Schedules and retries repeat runs. PRD FR-41 requires repeated events to have no effect.
- JOB-03: A job MUST NOT change an order's status except through the moves in order-lifecycle.md. The actor recorded for the change follows ORD-04.
  Why: PRD FR-33 requires every status change to be traceable.
- JOB-04: PROPOSED. A job MUST NOT set a payment to SUCCESSFUL except through the verification path in PAY-12. Reconciliation (JOB-10) only reports.
  Why: One confirmation path is easier to audit. PRD 8.3 and FR-41 require verification before SUCCESSFUL.
- JOB-05: A failed run MUST be recorded with the job name, the time, and the type of error. The record MUST NOT hold personal data (SEC-08). OPEN: where the owner sees failed runs.
  Why: The owner cannot fix a job they cannot see. The PRD does not say where failures appear.
- JOB-06: A failed job MAY be retried. OPEN: the retry limit and the delay between retries.
  Why: Retries help with temporary errors. Without a limit, a failing job can repeat external calls indefinitely.
- JOB-07: Test jobs MUST run against the test environment only (ENV-02, DAT-07).
  Why: PRD Section 13 names test and live data mixing as a risk.
- JOB-08: The agent MUST ask before changing a job's schedule in hosting settings (CMD-05).
  Why: PRD Q9 ties schedules to the Vercel plan, so a schedule change affects cost and timing.

## 2. Job register

- JOB-09: Payment re-check.
  Purpose: Find PENDING payments older than 15 minutes and check them with Paystack.
  Trigger: The schedule in PAY-15.
  Rules: payments.md, PAY-15.
  Why: This catches missed webhooks (PRD 8.3).
- JOB-10: Reconciliation.
  Purpose: Match each SUCCESSFUL payment to its verified Paystack transaction by reference, amount, and currency. Match each REFUNDED payment to Paystack's refund record.
  Trigger: Once a day. Confirmed by the owner.
  Rules: This file. A mismatch is flagged and never changes a payment's status (JOB-04). OPEN: how the owner is told about a mismatch.
  Why: PRD Section 12 uses this job to measure payment accuracy against a 100% target. Matching SUCCESSFUL payments comes from the PRD. The refund match is an addition the owner agreed to.
- JOB-11: Customer email sending.
  Purpose: Send the emails listed in REQ-08.
  Trigger: A background job, started when the status change or payment event is saved. The status change does not wait for the email.
  Rules: requirements.md, REQ-08 to REQ-10. Each email is sent once per event (JOB-02).
  Why: PRD FR-51 allows five minutes. Sending in the background means a slow or failed email cannot block the status change.
- JOB-12: Document indexing.
  Purpose: Chunk and embed an approved document.
  Trigger: Approval (FAQ-14). Runs in the background. The tailor's approval does not wait for it.
  Rules: faq-assistant.md, FAQ-14 to FAQ-19. OPEN: whether the tailor sees indexing status.
  Why: Embedding calls can be slow and rate limited (PRD Section 13, FAQ-19). Until indexing finishes, questions about the document get the decline response (FAQ-11), which is safe under FR-62.
- JOB-13: Export and deletion requests.
  Purpose: Fulfil customer export and deletion requests.
  Trigger: OPEN: how a request starts, and whether it runs as a job.
  Rules: privacy.md, PRV-08 to PRV-10.
  Why: PRD FR-72 (P1) requires fulfilment. The PRD does not say how requests are handled.

