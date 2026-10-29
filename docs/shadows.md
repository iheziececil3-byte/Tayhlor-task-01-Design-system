# Shadows — Tayhlor Design System

## 1. Purpose

This document records the three shadow levels defined in the supplied `tokens.css`.

The shadow tokens provide reusable elevation effects for interface elements. Components should reference the semantic shadow aliases rather than repeat shadow values throughout the stylesheet.

## 2. Shadow specifications

| Level | CSS value | Semantic token |
|---|---|---|
| Soft | `1.5px 6px 30px 0px rgba(16, 27, 45, 0.149)` | `--shadow-soft` |
| Medium | `4px 6px 25px 0px rgba(16, 27, 45, 0.2)` | `--shadow-medium` |
| Hard | `7px 11px 20px 0px rgba(16, 27, 45, 0.2)` | `--shadow-hard` |

## 3. Token relationships

Each semantic shadow token points to an effect token:

- `--shadow-soft` references `--effect-soft-shadow`.
- `--shadow-medium` references `--effect-medium-shadow`.
- `--shadow-hard` references `--effect-hard-shadow`.

All three effects use the same RGB shadow colour: `rgba(16, 27, 45, ...)`, corresponding to the dark navy key colour `#101B2D`, with different opacity values.

## 4. Intended use

The CSS comments describe these effects as elevation levels for elements such as modals, cards, popovers, and buttons.

The token names establish the three available levels. The supplied CSS does not specify a mandatory component-by-component mapping, so this document does not assign a particular shadow to a particular component.

## 5. Implementation rule

Use the semantic aliases:

```css
.card {
  box-shadow: var(--shadow-soft);
}

.dialog {
  box-shadow: var(--shadow-hard);
}
```

These examples demonstrate how to reference the tokens; they are not a claim that the current interface assigns those exact levels to those components.

