---
trigger: model_decision
description: Enforce data schema design, business record ownership, integer money units (kobo), immutable measurement snapshots, append-only audit event logging, and pgvector HNSW indexing when designing, scaffolding, or modifying Prisma models and database records in Tayhlor.
alwaysApply: false
---

# Data model rules

One job: define how records are owned, stored, copied, logged, and indexed. This file does not copy the schema. The schema lives in the code and migrations.

## 1. Ownership and money

- DAT-01: Every record is scoped to the business. v1 has one business.
  Why: PRD 8.5 keeps every record scoped. PRD Section 1 limits v1 to one shop.
- DAT-02: Money is stored as whole minor units (kobo for NGN). PROPOSED: a quote is rejected unless it is a positive whole number of kobo.
  Why: PRD 8.5 stores money as integers to avoid rounding errors.

## 2. Copies and logs

- DAT-03: The measurement snapshot is copied into the order at submission. Later edits or deletions do not change it.
  Why: PRD FR-20 requires the snapshot.
- DAT-04: Status events and payment events MUST NOT be updated or deleted. Account deletion requests do NOT delete financial records or audit events; personal references are anonymised to preserve referential integrity while keeping logs append-only.
  Why: PRD FR-71 requires append-only logs. PRD FR-72 requires customer data deletion; category-based anonymisation reconciles privacy with immutable audit trails.
- DAT-05: Changes to customer contact details are logged.
  Why: PRD FR-34 (P1) requires it.
- DAT-11: Order status events MUST identify the initiator using `actorType` (`USER` or `SYSTEM`). For `USER` events, `actorId` MUST be a valid `User.id`. For `SYSTEM` events (such as Paystack webhooks or automated background jobs), `actorId` MUST be null, and the triggering system or event reference (e.g. webhook event ID) is recorded in `note` without sensitive data. Dummy system users are prohibited. The relationship is enforced by application validation and database CHECK constraint `(actorType = 'USER' AND actorId IS NOT NULL) OR (actorType = 'SYSTEM' AND actorId IS NULL)`.
  Why: Resolves Issue 7; eliminates fake users while maintaining strict attribution and referential integrity.
- DAT-12: Webhook event handling MUST be idempotent. Repeated webhook deliveries for the same transaction MUST NOT produce duplicate payment records, duplicate order status transitions, or duplicate audit events.
  Why: PRD FR-41 and Section 8.3 require idempotent webhook handling.

## 3. Test data and single-database architecture

- DAT-06: The v1 application uses one PostgreSQL database for development, test, preview, and production activity, as specified by the PRD.
  Why: Approved single-database architecture for v1.
- DAT-07: Test records MUST be explicitly identifiable via a `recordEnvironment` (or equivalent) marker on all records created during test or preview activity. The marker MUST propagate to all related records (including the customer user, order, measurement, associated payments, and status/audit events); marking only the order but leaving related records unmarked is forbidden. Test operations MUST NOT modify, delete, or impersonate real customer records. Test payment credentials MUST NOT be used to initiate transactions against real customer payment records. Test data MUST NOT be presented as genuine customer activity.
  Why: The exact implementation needs to account for related records; marking only the order without payments or audit events leaves gaps in data isolation and integrity. Safeguards protect real customer records in a shared database.

## 4. Referential integrity and deletion behaviour

- DAT-13: Cascading deletion from `User` to `Order`, `Payment`, `OrderStatusEvent`, or `Fitting` is strictly forbidden. A verified customer deletion request anonymises or redacts personal profile fields (`fullName`, `email`, `phone`, `passwordHash`, `googleSubject`) on the `User` record while preserving the record's primary key (`id`), keeping foreign keys valid across historical orders, payments, fittings, and audit trails. Standalone `Measurement` records may be deleted when no active orders require them; order measurement snapshots remain preserved as immutable JSON.
  Why: Resolves Issue 8; prevents accidental destruction of statutory financial and audit records while satisfying deletion requests.

## 5. Fittings

- DAT-14: Fitting records are captured in the dedicated `Fitting` model, linked to an `Order` and the recording tailor user (`recordedBy`), with outcomes `SATISFACTORY` or `ALTERATIONS_REQUIRED`. An order may have multiple fitting records. Existing fitting records MUST NOT be overwritten or mutated when subsequent fittings are added.
  Why: Resolves Issue 10; preserves complete fitting history.

## 6. Vectors

- DAT-08: The vector column size MUST equal the verified output size of the confirmed Gemini embedding model (candidate dimensions: 768, 1536, 3072; choice is OPEN in PRD Q13). Changing model or dimension requires a schema migration and complete re-embedding of all approved documents before search queries can execute. Vector dimension MUST be validated pre-storage; zero-padding or silent truncation is strictly prohibited.
  Why: PRD 9.2 and 9.4 require the match.
- DAT-09: The vector index is HNSW with cosine distance.
  Why: PRD 9.2 specifies it.

## 7. Dates

- DAT-10: OPEN: whether the completion date is a date or a date and time.
  Why: PRD FR-31 does not say.
