---
trigger: model_decision
description: Enforce user roles (customer/tailor), sign-up, sign-in, Auth.js sessions, password hashing, email verification, password reset, and access restrictions when building, scaffolding, or modifying accounts, authentication, or user access in Tayhlor.
alwaysApply: false
---

# Accounts and access rules

One job: define roles, sign-up, sign-in, verification, and password reset.

## 1. Roles and sign-up

- ACC-01: There are two roles: customer and tailor (admin). Each role may do only what PRD 4.2 lists.
  Why: PRD 4.2 is the only permission table.
- ACC-02: Sign-up always creates a customer account. OPEN: how a tailor account is created.
  Why: Public sign-up that could create tailor accounts would give anyone admin access. The PRD does not say how tailor accounts are created.
- ACC-03: Sign-up with email and password collects full name, email, phone, and password. Sign-up with Google creates the account from the Google sign-in. OPEN: whether a Google sign-up must also collect a phone number.
  Why: PRD FR-01 lists the fields for email and password sign-up. It does not say what Google sign-up collects.
- ACC-04: Sign-out ends the session.
  Why: PRD FR-02 requires sign-out for both roles.

## 2. Sign-in and sessions

- ACC-05: A duplicate email MUST show a clear message.
  Why: PRD FR-01 requires it. It stops a second account being made on the same email.
- ACC-06: A Google account links to an existing account only after confirmation. OPEN: the confirmation method.
  Why: Linking without confirmation could expose another person's account.
- ACC-07: Invalid sign-in MUST show a generic error.
  Why: PRD FR-02 requires it. The error does not reveal which emails have accounts.
- ACC-08: Sessions expire after a period of inactivity. OPEN: the period.
  Why: PRD FR-02 requires expiry. The PRD does not set the period.
- ACC-09: Passwords MUST be stored only as salted hashes. OPEN: the owner chooses bcrypt or argon2 before the agent implements hashing.
  Why: PRD FR-01 requires salted hashes. PRD 8.2 names both algorithms and leaves the choice open.
- ACC-10: The sign-in library's working assumption is Auth.js. OPEN: the owner confirms it. The agent asks before installing it (CMD-07).
  Why: PRD Q6 gives Auth.js as the working assumption. PRD 8.2 leaves the choice pending.

## 3. Verification and reset

- ACC-11: Every email and password account MUST be verified. An unverified customer MAY sign in to verify, and MUST NOT submit an order.
  Why: PRD FR-05 requires verification for email and password accounts and blocks orders until then.
- ACC-12: The verification link is single use and expires after 24 hours.
  Why: PRD FR-05 sets these limits.
- ACC-13: Google sign-ins count as verified.
  Why: PRD FR-05 says Google verifies the address.
- ACC-14: The password reset link is single use and expires after 30 minutes. Google-only accounts have no password, so there is nothing to reset.
  Why: PRD FR-03 (P1) sets these limits. PRD 8.5 notes that Google-only accounts have no password.
