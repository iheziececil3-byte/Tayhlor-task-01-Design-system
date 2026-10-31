---
trigger: model_decision
description: Enforce privacy notice requirements, Gemini free-tier disclosures, data minimization, and customer data export and deletion request handling for Tayhlor.
alwaysApply: false
---

# Privacy rules

One job: control what customers are told about their data and how their data requests are handled.

## 1. Notice

- PRV-01: A privacy notice is visible at sign-up and in the footer.
  Why: PRD FR-73 requires both places.
- PRV-02: The notice states that order and payment data stay in the app.
  Why: PRD FR-73 requires it.
- PRV-03: The notice states that document text and FAQ questions are sent to Google for embeddings and answers.
  Why: PRD FR-73 and 9.6 require it.
- PRV-04: While the app uses the Gemini free tier, the notice states that Google may use this content to improve its products, and that human reviewers may read it.
  Why: PRD FR-73 and Section 14 Q13 require it.
- PRV-05: The notice wording is checked against Google's terms in effect before launch.
  Why: PRD FR-73 requires the check.
- PRV-06: OPEN: whether sign-up requires the customer to accept the notice, or only shows it.
  Why: The PRD requires the notice to be visible. It does not say whether acceptance is needed.

## 2. Data and requests

- PRV-07: Collect only the personal data the features need.
  Why: PRD Section 13 names this as the mitigation for personal data risk.
- PRV-08: Customer deletion requests follow a category-based retention and deletion policy:
  1. Customer profile: Upon verified request, personal fields (`fullName`, `email`, `phone`, `passwordHash`, `googleSubject`) on the `User` record are redacted or anonymised once all orders reach terminal states (COMPLETED or CANCELLED). Deletion during active orders is rejected until orders finish and accounts settle.
  2. Order and payment records: Preserved to satisfy statutory financial, tax, and dispute requirements. Direct personal identifiers are minimised while preserving transaction amounts, dates, and provider references.
  3. Measurements: Standalone `Measurement` records may be deleted when no active orders depend on them. Order `measurementSnapshot` JSON records remain intact as immutable order specifications.
  4. Append-only audit logs: `OrderStatusEvent` logs are strictly immutable and never deleted. Foreign keys point to the anonymised User record to preserve relational integrity without exposing personal details.
  5. Backups: Backups expire according to documented schedules. Restoring a backup requires re-applying pending deletions from a persistent tombstone log so deleted personal data is not resurrected. Complete deletion cannot be claimed while recoverable backup copies exist.
  Why: Resolves Issue 8; balances customer privacy rights (FR-72) with legitimate legal retention, audit integrity (FR-71), and referential consistency.
- PRV-09: Once the timeframe in PRV-10 is set, export and deletion requests MUST be fulfilled within it. OPEN: the export format.
  Why: PRD FR-72 (P1) requires fulfilment within the stated timeframe.

## 3. Open decisions

- PRV-10: OPEN: the export and deletion timeframe (PRD Q8). Set it in the notice before the pilot.
  Why: PRD Q8 says it is set in the notice before the pilot.
- PRV-11: OPEN: personal details typed into FAQ questions, and whether they are removed before the questions go to Google.
  Why: PRD 9.6 sends questions to Google. The PRD does not say how personal details are handled.
- PRV-12: OPEN: formal statutory retention periods and legal exceptions (PRD Q8). Must be approved by the owner following legal review under applicable Nigerian data protection (NDPA 2023) and financial recordkeeping requirements (CAMA). Unverified interpretations must not be presented as confirmed decisions.
  Why: Issue 8; Nigerian statutory retention rules require formal legal confirmation rather than invented defaults.
- PRV-13: OPEN: whether to stay on the Gemini free tier for the pilot with real customers (PRD Q13).
  Why: PRD Q13 says this is decided before the pilot.
