---
name: migration-handoff
description: Prepares a database schema change as a migration file and a run sheet for the owner. Use when the database schema must change. The agent writes files only and never runs a migration or a database command.
---

# Migration handoff

Follow these steps in order. Read `database.md` and `data-model.md` before you start.

## Part 1: Plan

1. Write one sentence that states the schema change and its reason. If you cannot write that sentence, stop and ask the owner.
2. For each new table, column, or index, find the rule in `data-model.md` that covers it. If no rule covers it, stop and ask the owner.
3. Classify the change as RISKY or NOT RISKY, using the definition in DB-06 of `database.md`. Write the classification and the rule you applied.
4. Find the migrations folder named in `database.md` (`prisma/migrations/`). If no folder is named, stop and ask the owner.

## Part 2: Write the migration

5. Write the migration file by hand in the migrations folder. Give the file a name that states the change.
6. If the change touches the vector column, check that its size matches DAT-08 in `data-model.md`. Check that an existing migration enables the pgvector extension, as required by `database.md` and PRD Section 10. If either check fails, stop and report the failure.
7. Check that the file contains only the change from step 1. Remove any other change.
8. Check that you ran no migration command and no SQL against a database during this task. The forbidden commands are listed in CMD-02 and CMD-03 of `command.md`. If you ran one, stop and report it to the owner.

## Part 3: Write the run sheet

9. If the change is RISKY, write the backup or rollback step. Ask the owner to confirm that step before the run sheet is final (DB-06).
10. Write the run sheet. For each step, write:
    - The command the owner runs by hand (DB-05, CMD-02).
    - The target environment, checked against ENV-01 and ENV-02 in `env.md`.
    - The expected result.
    - One read-only check the owner runs after the command.
11. Check that every step in the run sheet has all four items from step 10. If an item is missing, add it.
12. Write this line at the top of the run sheet: "The agent does not run these commands. The owner runs them."

## Part 4: Report

13. Report the migration file path, the risk classification, the status of the backup step, and the run sheet path.
14. Mark the change as pending owner run. Do not mark it as applied.
