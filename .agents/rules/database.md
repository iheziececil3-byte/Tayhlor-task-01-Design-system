---
trigger: always_on
alwaysApply: true
description: Enforce database schema migration controls, connection pooling rules, pgvector setup, and session business scoping on all queries.
---

# Database Rules

Scope: Database integrity, schema changes, migrations, and safe database access.

## Rules

- DB-01: Database schema and structural changes MUST be represented by version-controlled migration files. Reason: Database changes must be reviewable, traceable, and reproducible.

- DB-02: Application requests MUST NOT automatically execute database migrations. Reason: A normal user request must not unexpectedly change the database structure.

- DB-03: The database schema MUST remain consistent with the application's data model and approved project requirements. Reason: Inconsistent schemas can cause data loss, invalid records, and application failures.

- DB-04: Database queries MUST respect the authorization and record-ownership requirements in `security.md`. Reason: Database access must not bypass application security rules.

- DB-05: Database migrations MUST be reviewed before they are applied to a database. The owner is responsible for approving and applying them. Reason: Structural database changes can cause irreversible data loss or service disruption.

- DB-06: Before a potentially destructive database change, the owner MUST confirm an appropriate backup or rollback strategy. PROPOSED. Reason: A recovery path reduces the impact of an unsuccessful or destructive change.

## Migration ownership

- Migration command permissions and prohibited commands are defined in `command.md`.
- The migration file location is `prisma/migrations/`, using Prisma's standard migration structure. PROPOSED.
- The Prisma schema is maintained in `prisma/schema.prisma`.
- The agent may generate and review migration files but MUST NOT apply them to a database without explicit owner approval.

## Database provider

- PostgreSQL with pgvector is the proposed database technology.
- The database hosting provider is Vercel Postgres with pgvector (decided by owner, PRD Q12).
- The provider supports connection pooling for application runtime queries (POSTGRES_URL) and direct unpooled connections for Prisma migrations and CLI operations (POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING).
- The database provider MUST support the required PostgreSQL and pgvector functionality before implementation is finalized.

## Scope boundary

This file defines database constraints. It does not contain the database schema itself. The actual schema belongs in the application's Prisma schema and migration files.