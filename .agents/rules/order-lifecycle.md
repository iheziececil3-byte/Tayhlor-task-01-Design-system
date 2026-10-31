---
trigger: model_decision
description: Enforce order statuses, allowed state transitions, acceptance pricing and completion dates, cancellation rules, and audit logging when building, scaffolding, or modifying order workflows in Tayhlor.
alwaysApply: false
---

# Order lifecycle rules

One job: define order statuses, allowed moves, acceptance, decline, completion, and cancellation.

## 1. Statuses and moves

- ORD-01: Statuses are exactly: SUBMITTED, ACCEPTED, DECLINED, IN_PROGRESS, READY_FOR_COLLECTION, COMPLETED, CANCELLED.
  Why: PRD 8.4 defines these states. The agent must not add others.
- ORD-02: Allowed moves: SUBMITTED to ACCEPTED, DECLINED, or CANCELLED. ACCEPTED to IN_PROGRESS or CANCELLED. IN_PROGRESS to READY_FOR_COLLECTION. READY_FOR_COLLECTION to COMPLETED. Any other move is refused. DECLINED, COMPLETED, and CANCELLED are final. The move to IN_PROGRESS also needs a successful deposit.
  Why: PRD 8.4 and FR-33 define the moves. PRD 8.4 says work starts only after the deposit.
- ORD-03: Every status change records the actor attribution (`actorType`: `USER` with user ID, or `SYSTEM` with null user ID and source reference in note), the time, the previous status, the new status, and an optional note.
  Why: PRD FR-33 and FR-71 require this record.
- ORD-04: Automated changes (such as Paystack webhooks and scheduled jobs) record `actorType = SYSTEM` and `actorId = NULL`. The originating system reference (e.g. Paystack webhook event ID or reconciliation job name) is recorded in `note` without sensitive data. Dummy system user records are prohibited. Idempotent processing ensures repeated webhooks do not trigger duplicate events or transitions.
  Why: Resolves Issue 7; eliminates fake users while maintaining full auditability and idempotency.

## 2. Acceptance and decline

- ORD-05: Accepting an order requires an exact quoted total and a proposed completion date. Both are required.
  Why: PRD FR-31 requires both.
- ORD-06: OPEN: whether the tailor can change the quoted total or the completion date after acceptance.
  Why: The PRD does not say. A change after the deposit could leave the deposit based on an old total.
- ORD-07: Declining an order requires a reason. The customer sees the reason.
  Why: PRD FR-32 requires it.

## 3. Completion

- ORD-08: COMPLETED requires server-side validation that: 1) balance payment is SUCCESSFUL, and 2) a fitting has been recorded by the tailor with outcome SATISFACTORY in the dedicated `Fitting` model. A fitting marked ALTERATIONS_REQUIRED does not satisfy completion.
  Why: Resolves Issue 10; PRD 8.4 and FR-33 require verified balance and satisfactory fitting collection.
- ORD-16: OPEN: the alteration workflow after an ALTERATIONS_REQUIRED fitting (how alteration tasks are tracked, whether order status remains READY_FOR_COLLECTION or loops, and customer notifications). No unofficial statuses or automatic transitions may be introduced.
  Why: Issue 10; alterations management is not defined in the PRD and remains open for owner decision.

## 4. Cancellation

- ORD-09: A customer cancelling a SUBMITTED order involves no payment.
  Why: PRD FR-22 says no payment is involved before acceptance.
- ORD-10: A customer may cancel an ACCEPTED order before it enters IN_PROGRESS. If a successful deposit exists, the order is set to CANCELLED and the customer is entitled to a full refund of the amount paid under the approved refund procedure (PAY-16).
  Why: PRD FR-22 and approved cancellation policy.
- ORD-11: Once an order enters IN_PROGRESS, customer-initiated cancellation is no longer allowed.
  Why: Clear cancellation boundary; work has begun (PRD Section 14 Q3).
- ORD-12: A customer may cancel an ACCEPTED order before it enters IN_PROGRESS. If no successful payment exists, the order is cancelled without a refund.
  Why: PRD Section 4.2 and Section 8.4 approved cancellation policy.
- ORD-13: The tailor cancels with a reason. The refund rule in PAY-16 applies if a deposit succeeded.
  Why: PRD 4.2 lets the tailor cancel with a reason. PRD Section 14 Q2 sets the refund rule.
- ORD-14: OPEN: whether the tailor can cancel from IN_PROGRESS or READY_FOR_COLLECTION.
  Why: The PRD does not say.

## 5. Customer view

- ORD-15: Customers see the status, quoted total, and proposed completion date of their own orders only.
  Why: PRD FR-21 requires it.
