---
trigger: always_on
alwaysApply: true
description: Enforce branch workflow, protect main branch from direct commits/pushes, prevent force pushes, and enforce commit message rule citations for Tayhlor.
---

# Git Rules

Scope: Branching, protected branches, repository history, and committed files.

## Rules

- GIT-01: Project work MUST be performed on a task branch rather than directly on the main branch. Reason: Isolated changes are easier to review and revert.

- GIT-02: Changes to the main branch MUST receive owner approval. Reason: The main branch should remain under controlled integration.

- GIT-03: Force pushes and history rewrites MUST NOT be performed without explicit owner approval. Reason: Rewriting shared history can remove or disrupt other work.

- GIT-04: Secret files, private environment files, and machine-specific configuration MUST NOT be committed. Reason: Repository history can expose private credentials and local configuration.

- GIT-05: Changes MUST be committed in logical units that accurately describe what changed. Reason: Clear commit history makes project changes easier to understand and review.

- GIT-06: The agent MUST inspect the intended changes before committing them. Reason: Unintended files, secrets, and unrelated changes should not enter the repository.

## Additional restriction

A successful local commit does not prove that changes have been pushed to the remote repository. The agent MUST report the actual result of each Git operation.