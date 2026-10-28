# Design System Tokens & CSS Architecture — Tayhlor

> **Single Source of Truth:** [`evidence tokens-complete.json`](../evidence%20tokens-complete.json)  
> **Converter Script:** [`convert-tokens.js`](../convert-tokens.js)  
> **Generated CSS:** [`tokens.css`](../tokens.css)  

---

## 1. Core Architectural Principle: Two-Tier Token Model

In modern design systems (Material Design 3, Tailwind Token Architecture, Radix UI), colors are strictly separated into two architectural tiers:

```
┌────────────────────────────────────────────────────────┐
│  TIER 1: PRIMITIVES (System-Level Palettes)            │
│  e.g., --primitive-palette-primary-40: #101b2d         │
│  ⛔ NEVER USE DIRECTLY IN UI COMPONENTS               │
└──────────────────────────┬─────────────────────────────┘
                           │ referenced by
                           ▼
┌────────────────────────────────────────────────────────┐
│  TIER 2: COLOR ROLES (Semantic Tokens)                 │
│  e.g., --color-primary: var(--primitive-palette-primary-40)  │
│  ✅ ALWAYS USE DIRECTLY IN UI COMPONENTS               │
└────────────────────────────────────────────────────────┘
```

### Why Primitives Must NOT Be Used Directly in the UI:
1. **Context & Intent Agnostic:**  
   `primary40` or `neutral98` describes a shade on a mathematical scale, not what it represents on a screen. When a component uses `--primitive-palette-neutral-98`, it is impossible to know whether it's a card background, dialog surface, or disabled button.
2. **Theming & Dark Mode Breakdown:**  
   If an application uses `--primitive-palette-neutral-98` for container backgrounds, switching to Dark Mode requires re-writing every CSS selector. When you use `--color-surface` and `--color-on-surface`, dark mode only requires remapping the role to `--primitive-palette-neutral-10` in a `.dark` scope, and the entire UI adapts automatically without touching a single component.
3. **Brand Swaps & Accessibility:**  
   When the brand palette changes, only the primitive mappings in the tokens JSON change. The component contracts remain completely stable.

---

## 2. Token Inventory in `evidence tokens-complete.json`

| Section | Tokens Count | Description | Intended Usage |
|---|:---:|---|---|
| **Primitive Key Colors** | 8 | Foundational brand seed colors | System-level palette generation |
| **Primitive Color Palettes** | 132 | Tonal scales (0–100) for Primary, Secondary, Tertiary, Neutral, Neutral Variant, Error, Warning, Success | System-level composition only |
| **Color Roles (Semantic)** | 57 | Semantic mappings (`primary`, `surface`, `on-surface`, `outline`, etc.) | **Direct UI implementation** |
| **Effects (Shadows)** | 3 | `soft shadow`, `medium shadow`, `hard shadow` | Elevation for cards, popovers, modals |
| **Typography Styles** | 15 | Lora (display/headline) & Manrope (title/body/label) | Typography & layout hierarchy |

---

## 3. How to Run the Converter

The conversion script [`convert-tokens.js`](../convert-tokens.js) is self-contained with zero external dependencies (Node.js standard library only).

### Basic Command:
```bash
node convert-tokens.js
```
*Reads [`evidence tokens-complete.json`](../evidence%20tokens-complete.json) and compiles [`tokens.css`](../tokens.css).*

### Custom Input / Output:
```bash
node convert-tokens.js --input "path/to/tokens.json" --output "dist/tokens.css"
```

### Programmatic API:
```javascript
const { convertTokensToCSS, generateTokensCSSFile } = require('./convert-tokens.js');

// Generate CSS directly to a file
const result = generateTokensCSSFile('evidence tokens-complete.json', 'tokens.css');
console.log(`Converted ${result.stats.colorRolesCount} semantic color roles.`);
```

---

## 4. UI Implementation Examples

### Button Component
```css
/* ✅ CORRECT: Using Tier 2 Color Roles */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-soft);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: var(--type-label-large-font-family);
  font-size: var(--type-label-large-font-size);
  font-weight: var(--type-label-large-font-weight);
}

.btn-primary:hover {
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

/* ⛔ INCORRECT: Never use primitives directly */
.btn-bad {
  background-color: var(--primitive-palette-primary-40); /* BREAKS THEMING */
  color: var(--primitive-palette-primary-100);
}
```

### Card & Surface Component
```css
/* ✅ CORRECT: Semantic Surface Hierarchy */
.tailor-card {
  background-color: var(--color-surface-container);
  color: var(--color-on-surface);
  border: 1px solid var(--color-outline-variant);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-medium);
}

.tailor-card-header {
  font-family: var(--type-title-large-font-family);
  font-size: var(--type-title-large-font-size);
  font-weight: var(--type-title-large-font-weight);
  color: var(--color-on-surface);
}

.tailor-card-subtext {
  color: var(--color-on-surface-variant);
}
```

### Typography Hierarchy
```css
/* Editorial serif headings for bespoke fashion elegance */
h1.hero-title {
  font-family: var(--type-display-large-font-family); /* Lora */
  font-size: var(--type-display-large-font-size);       /* 64px */
  font-weight: var(--type-display-large-font-weight);   /* 600 */
  line-height: var(--type-display-large-line-height);   /* 89.6px */
  color: var(--color-on-surface);
}

/* Modern, crisp sans-serif for UI clarity */
p.body-text {
  font-family: var(--type-body-large-font-family);      /* Manrope */
  font-size: var(--type-body-large-font-size);          /* 16px */
  line-height: var(--type-body-large-line-height);      /* 24px */
  color: var(--color-on-surface-variant);
}
```

---

## 5. Maintaining Design Tokens as the Source of Truth

Whenever tokens are updated in Figma:
1. Export updated JSON to [`evidence tokens-complete.json`](../evidence%20tokens-complete.json).
2. Run `node convert-tokens.js`.
3. [`tokens.css`](../tokens.css) is updated automatically, instantly propagating updates across the application without breaking any component code.
