---
trigger: always_on
alwaysApply: true
description: Enforce command execution safety, build and scaffolding permissions, dependency controls, and task completion criteria for Tayhlor.
---

# Command Rules

Scope: Commands the coding agent may execute, commands requiring approval, and task-completion checks.

## Rules

- CMD-01: The agent MAY run ordinary development commands without separate approval when they do not perform destructive operations or change shared infrastructure. These include dependency installation, starting the development server, type checking, linting, automated tests, production builds, and client generation. PROPOSED. Reason: Routine development checks should not require unnecessary interruptions.

- CMD-02: The agent MUST NOT execute commands that apply, reset, or seed a database, or execute SQL that changes database contents or structure, without explicit owner approval. Reason: Database-changing operations can damage or overwrite important data.

- CMD-03: The following Prisma commands MUST NOT be executed without explicit owner approval:

  - `prisma migrate dev`
  - `prisma migrate deploy`
  - `prisma migrate reset`
  - `prisma db push`
  - `prisma db seed`

  Reason: These commands can modify database structure or data.

- CMD-04: Generating, inspecting, and reviewing migration files without applying them MAY be performed by the agent. Reason: Migration preparation can be reviewed without changing a live or shared database.

- CMD-05: The agent MUST ask before executing commands that change database contents, apply migrations, alter hosting configuration, or deploy the application. Reason: These operations can affect shared resources or live services.

- CMD-06: A production deployment MUST receive explicit owner approval. Reason: Production changes affect real users and business operations.

- CMD-07: The agent MUST report which checks passed, failed, were skipped, or could not be executed. Reason: The owner must be able to distinguish verified work from unverified work.

- CMD-08: A task MUST NOT be reported as fully verified if required checks have not been run. Reason: Completion claims must reflect actual verification.

## Tayhlor-specific restriction

- Raw SQL that changes database structure or data MUST NOT be executed without explicit owner approval.
- The agent MUST NOT bypass these restrictions by using a different tool, script, ORM method, or database client.
- The agent MUST distinguish read-only database inspection from database-changing operations.