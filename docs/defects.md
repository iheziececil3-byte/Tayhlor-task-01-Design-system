# Defects Log — Tayhlor Design System

**Project:** Tayhlor — D Williams Fashion Hub Design System  
**Task:** Task 1 — Design System  
**Status:** Working record; verify unresolved items against the evidence before final submission.

## 1. Confirmed Defects

### DEF-001: Incomplete design-token export

**Area:** Design-token export and colour-system inclusion

**Observed behaviour:** The first exported token file contained typography and shadow/effect tokens, but the colour system was missing.

**Expected behaviour:** The exported token file should contain all selected design-system categories, including colour, typography, and shadows/effects.

**Cause identified:** The colour system had not been selected during the first export.

**Detection method:** The exported JSON was inspected in the IDE, where the missing colour-token entries were identified.

**Resolution:** The incomplete export was removed, and the export was repeated with the colour system selected. The subsequent inspection found the complete export.

**Evidence:**
- `evidence/tokens-incomplete.json`
- `evidence/tokens-complete.json`

**Verification note:** Include a one-line diff showing the difference between the incomplete and complete exports. Preserve both files as evidence of the defect and its correction.

**Status:** Corrected; retain the evidence for verification.

## 2. Issues Requiring Verification

### DEF-002: Success-token naming inconsistency

**Area:** Semantic colour tokens

**Observed condition:** The generated CSS contains both `--color-succes` and `--color-success`.

**Why it matters:** The misspelled and correctly spelled names may represent duplicate aliases or inconsistent references. This can cause problems if components or other files depend on different names.

**Required verification:**
- Search the project for both token names.
- Determine whether either name is referenced by components, stylesheets, or scripts.
- Confirm which name is intended to be canonical.
- Check whether removing or renaming the misspelled token would break existing references.

**Status:** Naming inconsistency identified; impact and required correction not yet confirmed.

**Evidence:** Generated `tokens.css`, sourced from `evidence/tokens-complete.json`.

### DEF-003: Broken token references

**Area:** Design-token references and integration

**Observed evidence available:** `evidence/11-broken-referencing.png` is listed as a required evidence artifact.

**Required verification:** Inspect the screenshot and the relevant token files to establish which reference was broken, why it failed, and whether it was corrected.

**Status:** Requires confirmation of the exact failure, cause, and resolution before this entry can be finalized.

## 3. Design Risks Not Yet Confirmed as Defects

### RISK-001: Irregular primary-palette tonal progression

**Area:** Primary colour palette

**Observed condition:** After pinning Primary 40 to `#101B2D`, the palette showed a tonal-order irregularity: tone 30 appeared lighter than tone 40, and the transition from tone 40 to tone 50 appeared abrupt.

**Potential impact:** Components that rely on progressively lighter or darker tones may not behave as expected when selecting colours by tone number.

**Required verification:** Inspect the complete palette, verify the generated tonal values, and test any affected colour-role assignments.

**Status:** Observed risk; not yet established as a functional defect.

**Evidence:** `evidence/01-palette-before-pin.png` and `evidence/02-palette-after-pin.png`.

### RISK-002: Dark-theme behaviour not verified

**Area:** Colour-system theming

**Observed condition:** The documented contrast checks cover the light theme only.

**Potential impact:** The current results do not establish whether the same colour roles provide adequate contrast in a dark theme.

**Required verification:** Test the dark theme separately if it becomes part of the project's scope.

**Status:** Untested; not a confirmed defect.

## 4. Verification Principles

- Record defects only when there is evidence of an actual failure or incorrect result.
- Distinguish corrected defects from unresolved issues.
- Keep risks that have not been demonstrated to fail outside the confirmed-defects list.
- Link each finding to its supporting screenshot, export, or test output.
- Do not mark an issue as fixed until the correction has been verified.

## 5. Current Summary

| Finding | Classification | Status |
|---|---|---|
| Incomplete design-token export | Confirmed defect | Corrected |
| Success-token naming inconsistency | Requires verification | Unresolved |
| Broken token references | Requires verification | Details to confirm |
| Irregular primary-palette tonal progression | Design risk | Untested further |
| Dark-theme behaviour | Verification gap | Not tested |

This document should be updated as additional evidence is inspected. It does not claim that every listed issue has been reproduced or independently retested.
