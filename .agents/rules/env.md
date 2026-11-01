---
trigger: always_on
alwaysApply: true
description: Enforce environment variable controls, secret isolation, browser leak prevention, and credential separation for Tayhlor.
---

# Environment Rules

Scope: Environment configuration, environment separation, and secret handling.

## Rules

- ENV-01: Development, test, preview, and production environments MUST use separate environment configurations. Separate configurations do not imply separate databases; the v1 application uses one PostgreSQL database for development, test, preview, and production activity, as specified by the PRD. Reason: Configuration from one environment must not accidentally affect another, while operating within the approved single-database v1 architecture.

- ENV-02: Test and production credentials MUST NOT be mixed. Test payment credentials must not be used to initiate transactions against real customer payment records. Test operations must not modify, delete, or impersonate real customer records. Reason: Development or test activity must not accidentally affect real customers or access production services.

- ENV-03: Secret values MUST be stored in approved environment configuration or a secrets manager, never hardcoded into application source code. Reason: Secrets committed to source code can be exposed through repository access or history.

- ENV-04: Secret values MUST NOT be exposed to browser-side code. Reason: Browser-delivered code is visible to users and cannot safely contain private credentials.

- ENV-05: Every environment variable used by the application MUST be documented with its purpose, whether it is public or secret, and the environment in which it is required. Reason: The owner and developer must understand the application's configuration requirements.

- ENV-06: Production credentials MUST NOT be used for automated development or test operations. Reason: Automated tests must not accidentally modify real customer or business data.

- ENV-07: The Resend sending domain MUST be verified before the application sends production email. Reason: Domain verification supports reliable and authorized email delivery.

## Tayhlor environment categories

The following configuration categories are expected:

- Runtime database connection.
- Direct database connection for approved migration operations, if required by the selected provider.
- Paystack test credentials.
- Gemini API credentials.
- Resend API credentials.
- Google sign-in credentials.
- Authentication secrets.

Exact environment variable names MUST follow the confirmed database provider and selected integrations.

The database provider is confirmed as Vercel Postgres (decided by owner, PRD Q12).
Exact environment variable names for Vercel Postgres:
- `POSTGRES_URL`: Pooled runtime database connection string (secret, server-side only).
- `POSTGRES_PRISMA_URL`: Connection string configured with pgBouncer pooling for Prisma (secret, server-side only).
- `POSTGRES_URL_NON_POOLING`: Direct unpooled connection string for Prisma CLI and migration operations (secret, server-side only).
- `POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`: Individual connection credentials (secret, server-side only).

## Security boundary

A variable intended for server-side use MUST NOT receive a public browser-exposure prefix or otherwise be included in client-side bundles.