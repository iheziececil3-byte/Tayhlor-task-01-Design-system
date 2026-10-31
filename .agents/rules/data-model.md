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
- DAT-04: Status events and payment events MUST NOT be updated or deleted. The only exception is a deletion request, which PRV-08 leaves OPEN. PROPOSED: assistant question logs follow the same rule.
  Why: PRD FR-71 requires append-only logs. PRD FR-72 requires deletion on request, so the owner must reconcile the two.
- DAT-05: Changes to customer contact details are logged.
  Why: PRD FR-34 (P1) requires it.

## 3. Test data and single-database architecture

- DAT-06: The v1 application uses one PostgreSQL database for development, test, preview, and production activity, as specified by the PRD.
  Why: Approved single-database architecture for v1.
- DAT-07: Test records MUST be explicitly identifiable via a `recordEnvironment` (or equivalent) marker on all records created during test or preview activity. The marker MUST propagate to all related records (including the customer user, order, measurement, associated payments, and status/audit events); marking only the order but leaving related records unmarked is forbidden. Test operations MUST NOT modify, delete, or impersonate real customer records. Test payment credentials MUST NOT be used to initiate transactions against real customer payment records. Test data MUST NOT be presented as genuine customer activity.
  Why: The exact implementation needs to account for related records; marking only the order without payments or audit events leaves gaps in data isolation and integrity. Safeguards protect real customer records in a shared database.

## 4. Vectors

- DAT-08: The vector column size MUST equal the embedding model's output size. The working assumption is 1536 (PRD Q13). Changing the size requires a migration.
  Why: PRD 9.2 and 9.4 require the match.
- DAT-09: The vector index is HNSW with cosine distance.
  Why: PRD 9.2 specifies it.

## 5. Dates

- DAT-10: OPEN: whether the completion date is a date or a date and time.
  Why: PRD FR-31 does not say.
