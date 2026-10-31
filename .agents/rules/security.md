---
trigger: always_on
alwaysApply: true
description: Enforce access control, session and role checks, server-side validation, secret protection, and customer data isolation for Tayhlor.
---

# Security Rules

Scope: Non-negotiable rules that apply to the security of Tayhlor and its protected operations.

## Rules

- SEC-01: Every protected page, server action, and route handler MUST verify the caller's authenticated session before accessing protected data. Reason: Unauthenticated callers must not access private application functionality.

- SEC-02: Every protected operation MUST enforce the permissions assigned to the caller's role. Reason: Authentication proves who the caller is, but does not establish that they are allowed to perform a particular action.

- SEC-03: Access MUST be denied by default when an operation has no explicit permission rule. Reason: Missing permission definitions must not accidentally grant access.

- SEC-04: Record ownership and access checks MUST run on the server. Browser-side checks alone are insufficient. Reason: Browser controls can be modified or bypassed.

- SEC-05: A customer MUST only access their own private records unless an explicitly authorized business role permits otherwise. Reason: Customer records must remain isolated.

- SEC-06: Secret values MUST NOT appear in source code, client-side code, logs, error messages, commits, or assistant responses. Reason: Exposed secrets can compromise application accounts and services.

- SEC-07: Inputs received from browsers, forms, external services, and webhooks MUST be validated on the server before use. Reason: External input cannot be trusted merely because it comes from the application interface.

- SEC-08: Personal information MUST NOT be unnecessarily exposed in logs or error messages. Reason: Diagnostic information must not become another source of personal-data exposure.

- SEC-09: Passwords MUST be stored using a secure password-hashing algorithm, never as plaintext or reversible encryption. Reason: A database exposure must not reveal users' original passwords.

- SEC-10: Password hashing MUST use Argon2id with a maintained implementation. Each password MUST receive a unique salt. PROPOSED. Reason: Argon2id is a modern password-hashing algorithm designed to resist password-cracking attacks.

- SEC-11: New application dependencies MUST receive owner approval before being added. Reason: Dependencies introduce maintenance, security, and supply-chain risks.

- SEC-12: Automated tests MUST cover authentication, role permissions, and record ownership for protected operations. Reason: Security rules that are not tested can regress without detection.

- SEC-13: The application MUST store payment references and payment statuses, not customers' card details. PROPOSED. Reason: Card data should remain within the payment provider's payment flow rather than becoming a liability for Tayhlor.

## Tayhlor-specific clarification

- Authentication and authorization enforcement belong in this file.
- Registration, account verification, password reset, account linking, and session-lifecycle requirements belong in `accounts-and-access.md`.
- Payment verification requirements belong in `payments.md`.
- Personal-data retention and deletion requirements belong in `privacy.md`.