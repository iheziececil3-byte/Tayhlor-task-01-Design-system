# Colour Roles — Tayhlor Design System

## 1. Purpose

This document records the semantic colour roles, the primitive colour tokens they reference, and the contrast checks performed for the light theme.

The design system has two colour layers:

- **Primitive tokens:** foundational tonal values used to build the system.
- **Semantic colour roles:** tokens that communicate how a colour should be used in the interface.

UI components should use semantic colour roles rather than primitive palette values directly.

## 2. Primitive Key Colours

| Key colour | Hex |
|---|---|
| Primary | `#101B2D` |
| Secondary | `#425C8A` |
| Tertiary | `#B3C5E8` |
| Neutral | `#1A1C20` |
| Neutral Variant | `#1D2028` |
| Error | `#BA1A1A` |
| Warning | `#7D5700` |
| Success | `#2E6B3E` |

These are the selected key colours. Semantic roles may reference different tones from their corresponding primitive palettes.

## 3. Semantic Colour Roles and References

The references below follow the supplied `tokens.css`. Hex values are the values declared in its comments beside each role.

### Primary roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Primary | `#101B2D` | `primary40` |
| On-primary | `#FFFFFF` | `primary100` |
| Primary container | `#BCD2FF` | `primary90` |
| On-primary container | `#243652` | `primary30` |
| Primary fixed | `#BCD2FF` | `primary90` |
| On-primary fixed | `#091320` | `primary10` |
| Primary fixed dim | `#9AB6E6` | `primary80` |
| On-primary fixed variant | `#243652` | `primary30` |
| Inverse primary | `#9AB6E6` | `primary80` |

### Secondary roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Secondary | `#4D586A` | `secondary40` |
| On-secondary | `#FFFFFF` | `secondary100` |
| Secondary container | `#CFDBF0` | `secondary90` |
| On-secondary container | `#243652` | `primary30` |
| Secondary fixed | `#CFDBF0` | `secondary90` |
| On-secondary fixed | `#0B1525` | `secondary10` |
| Secondary fixed dim | `#B4BFD4` | `secondary80` |
| On-secondary fixed variant | `#364052` | `secondary30` |

### Tertiary roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Tertiary | `#5D687F` | `tertiary40` |
| On-tertiary | `#FFFFFF` | `tertiary100` |
| Tertiary container | `#E2EFFF` | `tertiary90` |
| On-tertiary container | `#465066` | `tertiary30` |
| Tertiary fixed | `#E2EFFF` | `tertiary90` |
| On-tertiary fixed | `#1A2337` | `tertiary10` |
| Tertiary fixed dim | `#C6D3EC` | `tertiary80` |
| On-tertiary fixed variant | `#465066` | `tertiary30` |

### Surface and background roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Background | `#FAF9FC` | `neutral98` |
| On-background | `#1A1C20` | `neutral10` |
| Surface | `#FAF9FC` | `neutral98` |
| On-surface | `#1A1C20` | `neutral10` |
| Surface variant | `#E6E7F0` | `neutralvariant90` |
| On-surface variant | `#494C54` | `neutralvariant30` |
| Surface container lowest | `#FFFFFF` | `neutral100` |
| Surface container low | `#F5F3F6` | `neutral96` |
| Surface container | `#EFEEF1` | `neutral94` |
| Surface container high | `#EAE8EB` | `neutral92` |
| Surface container highest | `#E4E2E5` | `neutral90` |
| Surface bright | `#FAF9FC` | `neutral98` |
| Surface dim | `#DBDADD` | `neutral87` |
| Inverse surface | `#2F3034` | `neutral20` |
| Inverse on-surface | `#F2F0F3` | `neutral95` |
| Surface tint | `#101B2D` | `primary40` |

### Outline and border roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Outline | `#797C85` | `neutralvariant50` |
| Outline variant | `#C9CBD5` | `neutralvariant80` |

The outline role is present in the supplied CSS. However, outline was excluded from the Step 6 contrast checks because the scope decision recorded for that step was to test only pairs actually used. If outline is used for form borders or other interface components, its contrast must be checked against the relevant background.

### Error roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Error | `#BA1A1A` | `error40` |
| On-error | `#FFFFFF` | `error100` |
| Error container | `#FFDAD6` | `error90` |
| On-error container | `#93000A` | `error30` |

### Warning roles

Warning is a custom addition using the same four-role pattern as the core colour groups.

| Role | Hex value | Primitive reference |
|---|---|---|
| Warning | `#7D5700` | `warning40` |
| On-warning | `#FFFFFF` | `warning100` |
| Warning container | `#FFEFD6` | `warning95` |
| On-warning container | `#5F4100` | `warning30` |

### Success roles

Success is a custom addition using the same four-role pattern as the core colour groups.

| Role | Hex value | Primitive reference |
|---|---|---|
| Success | `#2E6B3E` | `success40` |
| On-success | `#FFFFFF` | `success100` |
| Success container | `#C8FFCE` | `success95` |
| On-success container | `#00522A` | `success30` |

The CSS also contains the legacy spelling `--color-succes`, alongside the correctly spelled `--color-success` alias.

### Overlay and elevation roles

| Role | Hex value | Primitive reference |
|---|---|---|
| Scrim | `#000000` | `neutral0` |
| Shadow | `#101B2D` | `primary40` |

## 4. Contrast-check method

Contrast ratios were calculated from the six-digit foreground and background hex values using the WCAG 2 relative-luminance formula:

`Contrast ratio = (L1 + 0.05) / (L2 + 0.05)`

Here, `L1` is the lighter relative luminance and `L2` is the darker relative luminance.

The target for normal text is **4.5:1 (WCAG AA)**. The threshold for large text and relevant non-text interface components is **3:1**. The AAA target for normal text is **7:1**.

The figures below are the results recorded for Step 6. They should be independently rechecked in a contrast checker before final submission.

## 5. Contrast results — light theme

| Foreground role | Background role | Foreground | Background | Ratio | AA normal text | AAA normal text |
|---|---|---|---|---:|---|---|
| On-primary | Primary | `#FFFFFF` | `#101B2D` | 17.26:1 | Pass | Pass |
| On-primary container | Primary container | `#243652` | `#BCD2FF` | 8.00:1 | Pass | Pass |
| On-secondary | Secondary | `#FFFFFF` | `#4D586A` | 7.19:1 | Pass | Pass |
| On-secondary container | Secondary container | `#243652` | `#CFDBF0` | 8.72:1 | Pass | Pass |
| On-tertiary | Tertiary | `#FFFFFF` | `#5D687F` | 5.60:1 | Pass | Does not meet |
| On-tertiary container | Tertiary container | `#465066` | `#E2EFFF` | 6.93:1 | Pass | Does not meet |
| On-error | Error | `#FFFFFF` | `#BA1A1A` | 6.46:1 | Pass | Does not meet |
| On-error container | Error container | `#93000A` | `#FFDAD6` | 7.24:1 | Pass | Pass |
| On-success | Success | `#FFFFFF` | `#2E6B3E` | 6.39:1 | Pass | Does not meet |
| On-success container | Success container | `#00522A` | `#C8FFCE` | 8.33:1 | Pass | Pass |
| On-warning | Warning | `#FFFFFF` | `#7D5700` | 6.49:1 | Pass | Does not meet |
| On-warning container | Warning container | `#5F4100` | `#FFEFD6` | 8.28:1 | Pass | Pass |
| On-surface | Surface | `#1A1C20` | `#FAF9FC` | 16.27:1 | Pass | Pass |
| On-surface variant | Surface variant | `#494C54` | `#E6E7F0` | 6.97:1 | Pass | Does not meet |
| On-surface variant | Surface | `#494C54` | `#FAF9FC` | 8.19:1 | Pass | Pass |
| On-surface | Surface variant | `#1A1C20` | `#E6E7F0` | 13.85:1 | Pass | Pass |

**Finding:** No tested pair falls below the recorded AA threshold of 4.5:1. No tested pair required a colour correction or a decision to exclude it from text use under the Step 6 criteria.

Some pairs do not meet AAA for normal text. This does not make them AA failures.

## 6. Scope and limitations

- Only the light theme was in scope for Step 6.
- Dark theme has not been designed or tested. The previously observed tonal-order issue is therefore an untested risk, not a confirmed dark-theme contrast failure.
- Only foreground/background pairs selected for actual use were included.
- Outline was not included in the Step 6 results.
- Warning and success are custom additions following a four-role pattern.
- Contrast ratios do not replace checks of the actual rendered interface, including font size, component states, and the backgrounds on which roles are used.

## 7. Usage rule

Use semantic roles such as `--color-primary`, `--color-on-primary`, `--color-surface`, and `--color-on-surface` in interface components. Do not apply primitive tonal variables directly to UI components.

