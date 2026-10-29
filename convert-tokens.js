/**
 * ============================================================================
 * DESIGN SYSTEM TOKEN CONVERTER (Figma Tokens -> CSS Custom Properties)
 * ============================================================================
 * 
 * Target Design System: Tayhlor (D Williams Fashion Hub)
 * Source of Truth: evidence tokens-complete.json
 * 
 * ARCHITECTURAL PRINCIPLES:
 * ----------------------------------------------------------------------------
 * 1. TWO-TIER TOKEN ARCHITECTURE:
 *    - TIER 1: PRIMITIVE TOKENS (Base Palettes & Key Colors)
 *      * Pure, context-agnostic color scales (e.g., Primary 0-100, Neutral 0-100).
 *      * RULE: FOR SYSTEM-LEVEL COMPOSITION ONLY. NEVER USE DIRECTLY ON UI COMPONENTS.
 *      * Naming convention: --primitive-color-<palette>-<step>
 *    
 *    - TIER 2: COLOR ROLES (Semantic Tokens)
 *      * Functional, contextual tokens (e.g., --color-surface, --color-primary,
 *        --color-on-surface, --color-background, --color-outline).
 *      * RULE: THIS IS THE ONLY TIER USED DIRECTLY ON THE UI.
 *      * Defined by referencing primitives: var(--primitive-color-...)
 *      * Guarantees seamless dark mode, high contrast, and theming without touching components.
 * 
 * 2. SINGLE SOURCE OF TRUTH:
 *    * `evidence tokens-complete.json` remains the absolute source of truth.
 *    * Any Figma variable or style export updates the JSON; running this script
 *      regenerates the CSS tokens instantly.
 * 
 * 3. FULL TOKEN COVERAGE:
 *    * Primitive Key Colors
 *    * Primitive Tonal Palettes (Primary, Secondary, Tertiary, Neutral, Neutral Variant, Error, Warning, Success)
 *    * Semantic Color Roles (Surfaces, Containers, Text/On-colors, Outlines, Fixed roles)
 *    * Elevation & Effects (Drop shadows)
 *    * Typography Styles (Lora serif, Manrope sans-serif, sizes, weights, line heights)
 *    * Ready-to-use semantic CSS utility classes
 * 
 * USAGE:
 * ----------------------------------------------------------------------------
 * CLI:
 *   node convert-tokens.js
 *   node convert-tokens.js --input "evidence tokens-complete.json" --output "tokens.css"
 * 
 * Module:
 *   const { convertTokensToCSS, generateTokensCSSFile } = require('./convert-tokens.js');
 *   const css = convertTokensToCSS(tokensJson);
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

/**
 * Convert string to kebab-case (e.g., 'primary key color' -> 'primary-key-color',
 * 'neutral variant' -> 'neutral-variant', 'soft shadow' -> 'soft-shadow').
 *
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
}

/**
 * Format 8-digit hex (#rrggbbaa) to 6-digit (#rrggbb) if alpha is 'ff',
 * or rgba(r, g, b, a) if transparent.
 *
 * @param {string} hex
 * @returns {string}
 */
function formatColorValue(hex) {
  if (!hex || typeof hex !== 'string') return hex;
  const clean = hex.trim().replace(/^#/, '');

  if (clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const a = parseInt(clean.slice(6, 8), 16);

    if (a === 255) {
      return `#${clean.slice(0, 6).toLowerCase()}`;
    }
    const alpha = Math.round((a / 255) * 1000) / 1000;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (clean.length === 6) {
    return `#${clean.toLowerCase()}`;
  }

  return hex;
}

/**
 * Extract tone/step number from token key (e.g. 'primary40' -> '40', 'neutralvariant90' -> '90').
 *
 * @param {string} key
 * @returns {string}
 */
function extractTone(key) {
  const match = key.match(/\d+$/);
  return match ? match[0] : toKebabCase(key);
}

/**
 * Generate standardized CSS variable name for a primitive color token.
 *
 * @param {string} category 'key-color' | 'palette'
 * @param {string} group e.g. 'primary', 'neutral-variant'
 * @param {string} key e.g. 'primary40', 'primary key color'
 * @returns {string}
 */
function getPrimitiveCssVarName(category, group, key) {
  if (category === 'key-color') {
    // 'primary key color' -> '--primitive-key-primary'
    const cleanKey = key.replace(/\s*key\s*color$/i, '');
    return `--primitive-key-${toKebabCase(cleanKey)}`;
  }
  if (category === 'palette') {
    const tone = extractTone(key);
    return `--primitive-palette-${toKebabCase(group)}-${tone}`;
  }
  return `--primitive-${toKebabCase(group)}-${toKebabCase(key)}`;
}

/**
 * Generate standardized CSS variable name for a semantic color role.
 *
 * @param {string} roleName e.g. 'primary', 'on primary container', 'surface variant'
 * @returns {string}
 */
function getColorRoleCssVarName(roleName) {
  const kebab = toKebabCase(roleName);
  return `--color-${kebab}`;
}

/**
 * Traverse token JSON and resolve reference strings like:
 * '{primitives.color palettes.primary.primary40}'
 *
 * @param {string} refString
 * @param {object} rootTokens
 * @returns {{ resolvedPath: string, targetToken: object, resolvedValue: any }}
 */
function resolveTokenReference(refString, rootTokens) {
  if (typeof refString !== 'string' || !refString.startsWith('{') || !refString.endsWith('}')) {
    return { resolvedPath: null, targetToken: null, resolvedValue: refString };
  }

  const rawPath = refString.slice(1, -1).trim();
  const parts = rawPath.split('.');
  let current = rootTokens;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      throw new Error(`Token reference resolution failed: "${rawPath}" could not find part "${part}"`);
    }
    current = current[part];
  }

  if (current && typeof current === 'object' && 'value' in current) {
    // If the referenced value is itself a reference, follow recursively
    const nested = resolveTokenReference(current.value, rootTokens);
    return {
      resolvedPath: rawPath,
      targetToken: current,
      resolvedValue: nested.resolvedValue
    };
  }

  return {
    resolvedPath: rawPath,
    targetToken: current,
    resolvedValue: current
  };
}

/**
 * Parse and compile design tokens JSON into structured CSS sections.
 *
 * @param {object} tokens Data parsed from evidence tokens-complete.json
 * @param {object} options Configuration options
 * @returns {string} Formatted CSS string
 */
function convertTokensToCSS(tokens, options = {}) {
  const {
    includeUtilities = true,
    includeGoogleFonts = true,
    fontDisplay = 'swap',
    includeFallbackComments = true
  } = options;

  // Symbol registry: maps full JSON path -> { varName, formattedValue, rawValue }
  const registry = new Map();

  const primitiveKeyColors = [];
  const primitivePalettes = {};
  const semanticColorRoles = [];
  const effects = [];
  const typographyStyles = [];

  // ==========================================================================
  // 1. INDEX PRIMITIVES: Key Colors
  // ==========================================================================
  if (tokens.primitives && tokens.primitives['key colors']) {
    const keyColors = tokens.primitives['key colors'];
    for (const [keyName, tokenObj] of Object.entries(keyColors)) {
      if (!tokenObj || tokenObj.type !== 'color') continue;
      const varName = getPrimitiveCssVarName('key-color', null, keyName);
      const formatted = formatColorValue(tokenObj.value);
      const jsonPath = `primitives.key colors.${keyName}`;

      registry.set(jsonPath, { varName, formattedValue: formatted, rawValue: tokenObj.value });
      primitiveKeyColors.push({
        jsonPath,
        name: keyName,
        varName,
        value: formatted,
        raw: tokenObj.value
      });
    }
  }

  // ==========================================================================
  // 2. INDEX PRIMITIVES: Color Palettes (Tonal 0-100 scales)
  // ==========================================================================
  if (tokens.primitives && tokens.primitives['color palettes']) {
    const palettes = tokens.primitives['color palettes'];
    for (const [paletteName, tones] of Object.entries(palettes)) {
      if (!primitivePalettes[paletteName]) {
        primitivePalettes[paletteName] = [];
      }
      for (const [toneKey, tokenObj] of Object.entries(tones)) {
        if (!tokenObj || tokenObj.type !== 'color') continue;
        const varName = getPrimitiveCssVarName('palette', paletteName, toneKey);
        const formatted = formatColorValue(tokenObj.value);
        const jsonPath = `primitives.color palettes.${paletteName}.${toneKey}`;

        registry.set(jsonPath, { varName, formattedValue: formatted, rawValue: tokenObj.value });
        primitivePalettes[paletteName].push({
          jsonPath,
          palette: paletteName,
          key: toneKey,
          tone: extractTone(toneKey),
          varName,
          value: formatted,
          raw: tokenObj.value
        });
      }
    }
  }

  // ==========================================================================
  // 3. PROCESS COLOR ROLES (Semantic tokens for UI)
  // ==========================================================================
  if (tokens['color roles']) {
    const roles = tokens['color roles'];
    for (const [roleName, tokenObj] of Object.entries(roles)) {
      if (!tokenObj || tokenObj.type !== 'color') continue;

      const varName = getColorRoleCssVarName(roleName);
      const rawValue = tokenObj.value; // e.g. '{primitives.color palettes.primary.primary40}'
      const resolved = resolveTokenReference(rawValue, tokens);

      let targetVarName = null;
      let resolvedColor = formatColorValue(resolved.resolvedValue);

      if (resolved.resolvedPath && registry.has(resolved.resolvedPath)) {
        targetVarName = registry.get(resolved.resolvedPath).varName;
      } else if (resolved.resolvedPath) {
        // Fallback: construct variable name from path if not explicitly in registry
        const parts = resolved.resolvedPath.split('.');
        const palette = parts[2];
        const toneKey = parts[3];
        targetVarName = getPrimitiveCssVarName('palette', palette, toneKey);
      }

      semanticColorRoles.push({
        name: roleName,
        varName,
        targetVarName,
        resolvedColor,
        referencePath: resolved.resolvedPath || rawValue,
        description: tokenObj.description || ''
      });
    }
  }

  // ==========================================================================
  // 4. PROCESS EFFECTS (Elevation & Shadows)
  // ==========================================================================
  if (tokens.effect) {
    for (const [effectName, tokenObj] of Object.entries(tokens.effect)) {
      if (!tokenObj || tokenObj.type !== 'custom-shadow') continue;
      const val = tokenObj.value;
      const formattedColor = formatColorValue(val.color);
      const shadowValue = `${val.offsetX}px ${val.offsetY}px ${val.radius}px ${val.spread}px ${formattedColor}`;
      const baseVar = `--effect-${toKebabCase(effectName)}`;
      const aliasVar = `--shadow-${toKebabCase(effectName.replace(/\s*shadow$/i, ''))}`;

      effects.push({
        name: effectName,
        baseVar,
        aliasVar,
        shadowValue,
        raw: val
      });
    }
  }

  // ==========================================================================
  // 5. PROCESS TYPOGRAPHY
  // ==========================================================================
  if (tokens.typography) {
    for (const [styleName, styleTokens] of Object.entries(tokens.typography)) {
      if (!styleTokens || typeof styleTokens !== 'object') continue;

      const family = styleTokens.fontFamily ? styleTokens.fontFamily.value : 'sans-serif';
      const size = styleTokens.fontSize ? styleTokens.fontSize.value : 16;
      const weight = styleTokens.fontWeight ? styleTokens.fontWeight.value : 400;
      const lineHeight = styleTokens.lineHeight ? styleTokens.lineHeight.value : 24;
      const letterSpacing = styleTokens.letterSpacing ? styleTokens.letterSpacing.value : 0;
      const style = styleTokens.fontStyle ? styleTokens.fontStyle.value : 'normal';

      typographyStyles.push({
        name: styleName,
        slug: toKebabCase(styleName),
        family,
        size,
        weight,
        lineHeight,
        letterSpacing,
        style
      });
    }
  }

  // ==========================================================================
  // BUILD CSS STRING
  // ==========================================================================
  const lines = [];

  // Header Banner
  lines.push('/**');
  lines.push(' * ============================================================================');
  lines.push(' * DESIGN SYSTEM CSS TOKENS (AUTOMATICALLY GENERATED - SOURCE OF TRUTH)');
  lines.push(' * ============================================================================');
  lines.push(' * ');
  lines.push(' * Project: Tayhlor — D Williams Fashion Hub Design System');
  lines.push(' * Source File: evidence tokens-complete.json');
  lines.push(` * Generated At: ${new Date().toISOString()}`);
  lines.push(' * ');
  lines.push(' * ----------------------------------------------------------------------------');
  lines.push(' * ARCHITECTURE & USAGE RULES (CRITICAL):');
  lines.push(' * ----------------------------------------------------------------------------');
  lines.push(' * ⛔ 1. PRIMITIVE COLORS (Tier 1: --primitive-*)');
  lines.push(' *       DO NOT USE DIRECTLY ON UI COMPONENTS.');
  lines.push(' *       These raw tonal steps are system-level variables that feed into semantic roles.');
  lines.push(' * ');
  lines.push(' * ✅ 2. COLOR ROLES (Tier 2: --color-*)');
  lines.push(' *       ALWAYS USE THESE DIRECTLY ON ALL UI COMPONENTS & SCREENS.');
  lines.push(' *       These represent functional design intent (e.g., surface, primary, on-surface).');
  lines.push(' *       Using color roles ensures consistent theming, dark mode, and accessibility.');
  lines.push(' * ');
  lines.push(' * ----------------------------------------------------------------------------');
  lines.push(' * COMPONENT USAGE EXAMPLES:');
  lines.push(' *   button.btn-primary {');
  lines.push(' *     background-color: var(--color-primary);');
  lines.push(' *     color: var(--color-on-primary);');
  lines.push(' *     box-shadow: var(--shadow-soft);');
  lines.push(' *   }');
  lines.push(' *   .card {');
  lines.push(' *     background-color: var(--color-surface);');
  lines.push(' *     color: var(--color-on-surface);');
  lines.push(' *     border: 1px solid var(--color-outline-variant);');
  lines.push(' *   }');
  lines.push(' * ============================================================================');
  lines.push(' */\n');

  // Google Fonts import
  if (includeGoogleFonts) {
    lines.push('/* Typography Import: Lora (Editorial Serif for Display/Headlines) + Manrope (Modern Sans for UI) */');
    lines.push(`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=${fontDisplay}');\n`);
  }

  // ROOT BLOCK
  lines.push(':root {');

  // --------------------------------------------------------------------------
  // SECTION 1: PRIMITIVE KEY COLORS (PRIVATE / SYSTEM ONLY)
  // --------------------------------------------------------------------------
  lines.push('  /* ========================================================================');
  lines.push('   * TIER 1: PRIMITIVE KEY COLORS (SYSTEM-LEVEL ONLY — DO NOT USE IN UI)');
  lines.push('   * ======================================================================== */');
  for (const item of primitiveKeyColors) {
    lines.push(`  ${item.varName}: ${item.value}; /* ${item.name} */`);
  }
  lines.push('');

  // --------------------------------------------------------------------------
  // SECTION 2: PRIMITIVE COLOR PALETTES (TONAL SCALES 0-100)
  // --------------------------------------------------------------------------
  lines.push('  /* ========================================================================');
  lines.push('   * TIER 1: PRIMITIVE COLOR PALETTES (TONAL SCALES 0-100)');
  lines.push('   * ⛔ DO NOT USE DIRECTLY IN UI COMPONENTS.');
  lines.push('   * These provide foundational tonal values for semantic color roles.');
  lines.push('   * ======================================================================== */');

  for (const [paletteName, items] of Object.entries(primitivePalettes)) {
    lines.push(`  /* --- Primitive Palette: ${paletteName.toUpperCase()} --- */`);
    // Sort items by numeric tone
    const sorted = [...items].sort((a, b) => parseInt(a.tone, 10) - parseInt(b.tone, 10));
    for (const item of sorted) {
      lines.push(`  ${item.varName}: ${item.value};`);
    }
    lines.push('');
  }

  // --------------------------------------------------------------------------
  // SECTION 3: COLOR ROLES (SEMANTIC TOKENS — USE DIRECTLY ON UI)
  // --------------------------------------------------------------------------
  lines.push('  /* ========================================================================');
  lines.push('   * TIER 2: COLOR ROLES (SEMANTIC TOKENS — THE SINGLE SOURCE OF TRUTH FOR UI)');
  lines.push('   * ✅ USE THESE VARIABLES DIRECTLY ON ALL UI COMPONENTS.');
  lines.push('   * Each role maps semantic intent to a primitive color variable.');
  lines.push('   * ======================================================================== */');

  // Group color roles logically for clarity
  const roleGroups = {
    'Primary Roles': ['primary', 'on primary', 'primary container', 'on primary container', 'primary fixed', 'on primary fixed', 'primary fixed dim', 'on primary fixed variant', 'inverse primary'],
    'Secondary Roles': ['secondary', 'on secondary', 'secondary container', 'on secondary container', 'secondary fixed', 'on secondary fixed', 'secondary fixed dim', 'on secondary fixed variant'],
    'Tertiary Roles': ['tertiary', 'on tertiary', 'tertiary container', 'on tertiary container', 'tertiary fixed', 'on tertiary fixed', 'tertiary fixed dim', 'on tertiary fixed variant'],
    'Surfaces & Backgrounds': ['background', 'on background', 'surface', 'on surface', 'surface variant', 'on surface variant', 'surface container lowest', 'surface container low', 'surface container', 'surface container high', 'surface container highest', 'surface bright', 'surface dim', 'inverse surface', 'inverse on surface', 'surface tint'],
    'Outlines & Borders': ['outline', 'outline variant'],
    'Feedback & Status (Error, Warning, Success)': ['error', 'on error', 'error container', 'on error container', 'warning', 'on warning', 'warning container', 'on warning container', 'succes', 'on success', 'success container', 'on success container'],
    'Overlay & Elevation Elements': ['scrim', 'shadow']
  };

  const processedRoles = new Set();

  for (const [groupTitle, roleNames] of Object.entries(roleGroups)) {
    lines.push(`  /* --- ${groupTitle} --- */`);
    for (const rName of roleNames) {
      const match = semanticColorRoles.find(r => r.name.toLowerCase() === rName.toLowerCase());
      if (match) {
        processedRoles.add(match.name);
        const comment = includeFallbackComments ? ` /* ${match.resolvedColor} | ref: ${match.referencePath} */` : '';
        lines.push(`  ${match.varName}: var(${match.targetVarName});${comment}`);

        // Add normalized spelling alias for 'succes' -> '--color-success'
        if (match.name === 'succes') {
          lines.push(`  --color-success: var(${match.targetVarName}); /* Alias for spelling consistency */`);
        }
      }
    }
    lines.push('');
  }

  // Any remaining roles not in predefined groups
  const unassigned = semanticColorRoles.filter(r => !processedRoles.has(r.name));
  if (unassigned.length > 0) {
    lines.push('  /* --- Other Semantic Color Roles --- */');
    for (const match of unassigned) {
      const comment = includeFallbackComments ? ` /* ${match.resolvedColor} | ref: ${match.referencePath} */` : '';
      lines.push(`  ${match.varName}: var(${match.targetVarName});${comment}`);
    }
    lines.push('');
  }

  // --------------------------------------------------------------------------
  // SECTION 4: ELEVATION & SHADOW EFFECTS
  // --------------------------------------------------------------------------
  lines.push('  /* ========================================================================');
  lines.push('   * ELEVATION & SHADOW EFFECTS');
  lines.push('   * Pre-configured elevation levels for modals, cards, popovers, and buttons.');
  lines.push('   * ======================================================================== */');
  for (const eff of effects) {
    lines.push(`  ${eff.baseVar}: ${eff.shadowValue};`);
    lines.push(`  ${eff.aliasVar}: var(${eff.baseVar});`);
  }
  lines.push('');

  // --------------------------------------------------------------------------
  // SECTION 5: TYPOGRAPHY TOKENS
  // --------------------------------------------------------------------------
  lines.push('  /* ========================================================================');
  lines.push('   * TYPOGRAPHY TOKENS (FONT FAMILIES, SCALES, WEIGHTS, LINE HEIGHTS)');
  lines.push('   * ======================================================================== */');
  lines.push("  --font-family-display: 'Lora', Georgia, 'Times New Roman', serif;");
  lines.push("  --font-family-body: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;");
  lines.push('');

  for (const t of typographyStyles) {
    const isSerif = t.family.toLowerCase().includes('lora');
    const familyVar = isSerif ? 'var(--font-family-display)' : 'var(--font-family-body)';

    lines.push(`  /* Style: ${t.name} */`);
    lines.push(`  --type-${t.slug}-font-family: ${familyVar};`);
    lines.push(`  --type-${t.slug}-font-size: ${t.size}px;`);
    lines.push(`  --type-${t.slug}-font-weight: ${t.weight};`);
    lines.push(`  --type-${t.slug}-line-height: ${t.lineHeight}px;`);
    lines.push(`  --type-${t.slug}-letter-spacing: ${t.letterSpacing}px;`);
    lines.push('');
  }

  lines.push('}\n'); // Close :root

  // --------------------------------------------------------------------------
  // SECTION 6: READY-TO-USE UI UTILITY CLASSES
  // --------------------------------------------------------------------------
  if (includeUtilities) {
    lines.push('/* ==========================================================================');
    lines.push(' * UI UTILITY CLASSES (DRIVEN EXCLUSIVELY BY COLOR ROLES & TYPOGRAPHY)');
    lines.push(' * Use these utility classes across components for consistent styling.');
    lines.push(' * ========================================================================== */\n');

    lines.push('/* Background Color Utilities */');
    lines.push('.bg-primary                { background-color: var(--color-primary) !important; }');
    lines.push('.bg-primary-container      { background-color: var(--color-primary-container) !important; }');
    lines.push('.bg-secondary              { background-color: var(--color-secondary) !important; }');
    lines.push('.bg-secondary-container    { background-color: var(--color-secondary-container) !important; }');
    lines.push('.bg-tertiary               { background-color: var(--color-tertiary) !important; }');
    lines.push('.bg-tertiary-container     { background-color: var(--color-tertiary-container) !important; }');
    lines.push('.bg-background             { background-color: var(--color-background) !important; }');
    lines.push('.bg-surface                { background-color: var(--color-surface) !important; }');
    lines.push('.bg-surface-variant        { background-color: var(--color-surface-variant) !important; }');
    lines.push('.bg-surface-container-low  { background-color: var(--color-surface-container-low) !important; }');
    lines.push('.bg-surface-container      { background-color: var(--color-surface-container) !important; }');
    lines.push('.bg-surface-container-high { background-color: var(--color-surface-container-high) !important; }');
    lines.push('.bg-surface-container-highest { background-color: var(--color-surface-container-highest) !important; }');
    lines.push('.bg-error                  { background-color: var(--color-error) !important; }');
    lines.push('.bg-error-container        { background-color: var(--color-error-container) !important; }');
    lines.push('.bg-warning                { background-color: var(--color-warning) !important; }');
    lines.push('.bg-warning-container      { background-color: var(--color-warning-container) !important; }');
    lines.push('.bg-success                { background-color: var(--color-success, var(--color-succes)) !important; }');
    lines.push('.bg-success-container      { background-color: var(--color-success-container) !important; }\n');

    lines.push('/* Text / Foreground Color Utilities */');
    lines.push('.text-primary              { color: var(--color-primary) !important; }');
    lines.push('.text-on-primary           { color: var(--color-on-primary) !important; }');
    lines.push('.text-on-primary-container { color: var(--color-on-primary-container) !important; }');
    lines.push('.text-secondary            { color: var(--color-secondary) !important; }');
    lines.push('.text-on-secondary         { color: var(--color-on-secondary) !important; }');
    lines.push('.text-on-secondary-container { color: var(--color-on-secondary-container) !important; }');
    lines.push('.text-tertiary             { color: var(--color-tertiary) !important; }');
    lines.push('.text-on-tertiary          { color: var(--color-on-tertiary) !important; }');
    lines.push('.text-on-tertiary-container { color: var(--color-on-tertiary-container) !important; }');
    lines.push('.text-on-background        { color: var(--color-on-background) !important; }');
    lines.push('.text-on-surface           { color: var(--color-on-surface) !important; }');
    lines.push('.text-on-surface-variant   { color: var(--color-on-surface-variant) !important; }');
    lines.push('.text-error                { color: var(--color-error) !important; }');
    lines.push('.text-on-error             { color: var(--color-on-error) !important; }');
    lines.push('.text-warning              { color: var(--color-warning) !important; }');
    lines.push('.text-on-warning           { color: var(--color-on-warning) !important; }');
    lines.push('.text-success              { color: var(--color-success, var(--color-succes)) !important; }');
    lines.push('.text-on-success           { color: var(--color-on-success) !important; }\n');

    lines.push('/* Border & Outline Utilities */');
    lines.push('.border-outline            { border-color: var(--color-outline) !important; }');
    lines.push('.border-outline-variant    { border-color: var(--color-outline-variant) !important; }');
    lines.push('.border-primary            { border-color: var(--color-primary) !important; }\n');

    lines.push('/* Shadow Utilities */');
    lines.push('.shadow-soft               { box-shadow: var(--shadow-soft) !important; }');
    lines.push('.shadow-medium             { box-shadow: var(--shadow-medium) !important; }');
    lines.push('.shadow-hard               { box-shadow: var(--shadow-hard) !important; }\n');

    lines.push('/* Typography Classes */');
    for (const t of typographyStyles) {
      lines.push(`.${t.slug} {`);
      lines.push(`  font-family: var(--type-${t.slug}-font-family);`);
      lines.push(`  font-size: var(--type-${t.slug}-font-size);`);
      lines.push(`  font-weight: var(--type-${t.slug}-font-weight);`);
      lines.push(`  line-height: var(--type-${t.slug}-line-height);`);
      lines.push(`  letter-spacing: var(--type-${t.slug}-letter-spacing);`);
      lines.push('}');
    }
  }

  return lines.join('\n');
}

/**
 * File generation helper. Reads the input tokens JSON file and writes out CSS.
 *
 * @param {string} inputFilePath
 * @param {string} outputFilePath
 * @param {object} options
 * @returns {{ css: string, stats: object }}
 */
function generateTokensCSSFile(inputFilePath, outputFilePath, options = {}) {
  const resolvedInput = path.resolve(process.cwd(), inputFilePath);
  const resolvedOutput = path.resolve(process.cwd(), outputFilePath);

  if (!fs.existsSync(resolvedInput)) {
    throw new Error(`Input token file does not exist: ${resolvedInput}`);
  }

  const rawJson = fs.readFileSync(resolvedInput, 'utf8');
  const tokens = JSON.parse(rawJson);

  const css = convertTokensToCSS(tokens, options);

  // Ensure output directory exists
  const outputDir = path.dirname(resolvedOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(resolvedOutput, css, 'utf8');

  // Compute stats
  const primitiveKeyColorsCount = tokens.primitives?.['key colors'] ? Object.keys(tokens.primitives['key colors']).length : 0;
  let paletteColorsCount = 0;
  if (tokens.primitives?.['color palettes']) {
    for (const p of Object.values(tokens.primitives['color palettes'])) {
      paletteColorsCount += Object.keys(p).length;
    }
  }
  const colorRolesCount = tokens['color roles'] ? Object.keys(tokens['color roles']).length : 0;
  const effectsCount = tokens.effect ? Object.keys(tokens.effect).length : 0;
  const typographyCount = tokens.typography ? Object.keys(tokens.typography).length : 0;

  return {
    css,
    stats: {
      primitiveKeyColorsCount,
      paletteColorsCount,
      totalPrimitives: primitiveKeyColorsCount + paletteColorsCount,
      colorRolesCount,
      effectsCount,
      typographyCount,
      outputFilePath: resolvedOutput
    }
  };
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================
if (require.main === module) {
  const args = process.argv.slice(2);

  let inputPath = 'evidence tokens-complete.json';
  let outputPath = 'tokens.css';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' || args[i] === '-i') {
      inputPath = args[++i];
    } else if (args[i] === '--output' || args[i] === '-o') {
      outputPath = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Tayhlor Design Token to CSS Converter
--------------------------------------------------
Usage:
  node convert-tokens.js [options]

Options:
  --input, -i   Path to tokens JSON file (default: "evidence tokens-complete.json")
  --output, -o  Path to output CSS file (default: "tokens.css")
  --help, -h    Show this help message

Design System Rule:
  Color roles (--color-*) are the public UI tokens.
  Primitives (--primitive-*) are internal and should NOT be used directly in components.
      `);
      process.exit(0);
    }
  }

  try {
    console.log('🔄 Converting design tokens to CSS variables...');
    console.log(`📖 Reading source of truth: ${inputPath}`);

    const result = generateTokensCSSFile(inputPath, outputPath);

    console.log('✅ Conversion successful!');
    console.log('--------------------------------------------------');
    console.log(`🎨 Primitives:    ${result.stats.totalPrimitives} (${result.stats.primitiveKeyColorsCount} key colors + ${result.stats.paletteColorsCount} tonal steps) [Tier 1: System only]`);
    console.log(`🎯 Color Roles:   ${result.stats.colorRolesCount} semantic roles [Tier 2: UI Implementation Layer]`);
    console.log(`✨ Effects:       ${result.stats.effectsCount} shadows`);
    console.log(`🔤 Typography:    ${result.stats.typographyCount} styles`);
    console.log(`💾 Output CSS:    ${result.stats.outputFilePath}`);
    console.log('--------------------------------------------------');
    console.log('💡 Remember: Use color roles (e.g. var(--color-primary), var(--color-surface)) on the UI.');
  } catch (err) {
    console.error('❌ Error during token conversion:', err.message);
    process.exit(1);
  }
}

module.exports = {
  convertTokensToCSS,
  generateTokensCSSFile,
  formatColorValue,
  resolveTokenReference,
  toKebabCase,
  getPrimitiveCssVarName,
  getColorRoleCssVarName
};
