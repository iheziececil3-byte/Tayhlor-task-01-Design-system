# Design System Divergences — Tayhlor

## 1. Purpose

This document records known departures, risks, and implementation inconsistencies associated with the design system.

A divergence is not automatically a defect. Some are deliberate scope decisions; others are issues that may require correction or further verification.

## 2. Primary palette tonal ordering

**Decision:** The primary key colour `#101B2D` was pinned to Primary 40.

**Observed issue:** The resulting palette has a tonal-order irregularity: Primary 30 (`#243652`) is lighter than Primary 40 (`#101B2D`). The transition from Primary 40 to Primary 50 (`#425C8A`) is also abrupt.

**Reason:** The palette was adjusted to preserve the selected brand colour at the required tone.

**Where it matters:** The primitive primary palette, semantic roles that reference Primary 30 and Primary 40, and any future theme derived from this palette.

**Current status:** This is a documented tonal-order risk. The light-theme contrast checks do not establish that the palette fails contrast requirements. Dark-theme behaviour has not been designed or tested.

## 3. Custom warning and success roles

**Decision:** Warning and success were added as custom semantic colour groups.

**Reason:** The design system requires warning and success colours in addition to the core colour groups.

**Implementation:** Each group follows a four-role pattern: colour, on-colour, container, and on-container.

**Where it matters:** Status messages, validation feedback, and other interface states that use warning or success colours.

**Current status:** These are deliberate additions, not accidental defects. Their tested foreground/background pairs are recorded in `docs/colour-roles.md`.

## 4. Legacy success-token spelling

**Observed issue:** The CSS defines both `--color-succes` and `--color-success`. The correctly spelled token aliases the primitive success colour, while the legacy spelling remains in the stylesheet.

**Reason:** The supplied CSS does not establish why both names were retained.

**Where it matters:** Any component or stylesheet that references the misspelled token, and future maintenance of the token system.

**Current status:** The duplicate spelling is documented as an implementation inconsistency. The supplied CSS alone does not establish whether removing the legacy token would break another file, so removal should not be assumed safe without checking its references.

## 5. Light-theme-only contrast scope

**Decision:** Step 6 checks only the light theme and only the foreground/background pairs intended for use.

**Reason:** The task scope does not require a dark theme, and the product currently ships with the light theme only.

**Where it matters:** The current light-theme interface and any future work introducing a dark theme or additional colour-role pairings.

**Current status:** This is a scope limitation, not a confirmed failure. Dark-theme contrast remains untested. New pairs must be checked when introduced.

## 6. Outline contrast not included in Step 6

**Decision:** Outline was excluded from the recorded contrast table.

**Reason:** The Step 6 scope decision was to check the role pairs actually used. The outline role was not included in those checks.

**Where it matters:** Form borders and other interface components that may use outline roles.

**Current status:** This is an outstanding verification item if outline is used for those components. The role exists in the supplied CSS, but its contrast was not included in the Step 6 results.

## 7. Evidence boundary

This document records only the divergences and risks supported by the available design-system information. Additional defects should be added only when supported by a reproducible observation, test result, or implementation evidence.

