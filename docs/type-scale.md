# Typography System — Tayhlor

## 1. Overview

The typography system contains 15 styles organized into five categories:

- Display
- Headline
- Title
- Body
- Label

Each category contains three sizes: Large, Medium, and Small.

The system uses two font families:

- **Lora:** Used for Display and Headline styles.
- **Manrope:** Used for Title, Body, and Label styles.

The specifications below are extracted from the project's `tokens.css` file.

## 2. Font Families

| Property | Specification |
|---|---|
| Display font | Lora |
| Display fallback fonts | Georgia, Times New Roman, serif |
| Body font | Manrope |
| Body fallback fonts | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif |

## 3. Display Styles

Display styles are the largest typography styles in the system.

| Property | Display Large | Display Medium | Display Small |
|---|---:|---:|---:|
| Font family | Lora | Lora | Lora |
| Font size | 64px | 48px | 40px |
| Font weight | 600 | 600 | 600 |
| Line height | 89.6px | 67.2px | 56px |
| Letter spacing | -2.24px | -1.44px | -1px |

## 4. Headline Styles

Headline styles provide a smaller scale than Display styles.

| Property | Headline Large | Headline Medium | Headline Small |
|---|---:|---:|---:|
| Font family | Lora | Lora | Lora |
| Font size | 34px | 28px | 24px |
| Font weight | 500 | 600 | 500 |
| Line height | 47.6px | 39.2px | 33.6px |
| Letter spacing | -0.51px | -0.476px | -0.192px |

## 5. Title Styles

Title styles use Manrope.

| Property | Title Large | Title Medium | Title Small |
|---|---:|---:|---:|
| Font family | Manrope | Manrope | Manrope |
| Font size | 22px | 16px | 14px |
| Font weight | 500 | 500 | 500 |
| Line height | 30.8px | 22.4px | 19.6px |
| Letter spacing | -0.55px | -0.4px | -0.35px |

## 6. Body Styles

Body styles use Manrope.

| Property | Body Large | Body Medium | Body Small |
|---|---:|---:|---:|
| Font family | Manrope | Manrope | Manrope |
| Font size | 16px | 14px | 12px |
| Font weight | 500 | 500 | 500 |
| Line height | 22.4px | 19.6px | 16.8px |
| Letter spacing | -0.24px | -0.21px | -0.048px |

## 7. Label Styles

Label styles use Manrope.

| Property | Label Large | Label Medium | Label Small |
|---|---:|---:|---:|
| Font family | Manrope | Manrope | Manrope |
| Font size | 14px | 12px | 11px |
| Font weight | 500 | 500 | 500 |
| Line height | 19.6px | 16.8px | 15.4px |
| Letter spacing | -0.014px | -0.06px | -0.055px |

## 8. Implementation Reference

The typography specifications are implemented through CSS custom properties in `tokens.css`.

The token naming pattern is:

`--type-{category}-{size}-{property}`

For example:

- `--type-display-large-font-family`
- `--type-display-large-font-size`
- `--type-display-large-font-weight`
- `--type-display-large-line-height`
- `--type-display-large-letter-spacing`

The shared font-family variables are:

- `--font-family-display`
- `--font-family-body`

The individual typography tokens reference these shared variables rather than independently defining their font-family values.

## 9. Source and Verification

**Source file:** `tokens.css`

**Verification:** Compare the documented values against the corresponding CSS custom properties in `tokens.css`. If the Figma typography specifications are also required as evidence, verify them against the original Figma design system before treating the CSS export as proof that the two match.

