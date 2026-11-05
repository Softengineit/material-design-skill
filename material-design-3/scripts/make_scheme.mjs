#!/usr/bin/env node
/**
 * make_scheme.mjs : generate the Material 3 color roles (--md-sys-color-*) from one source color,
 * with Google's own algorithm (HCT, tonal palettes, dynamic color), for light and dark and for the
 * three contrast levels. Output is CSS ready to paste after assets/material-tokens.css, or JSON.
 *
 * Setup (once per project):   npm i @material/material-color-utilities
 * Usage:
 *   node make_scheme.mjs '#1e7a4a'                          # TonalSpot (Material default), standard contrast, CSS
 *   node make_scheme.mjs '#1e7a4a' --variant vibrant        # more colorful
 *   node make_scheme.mjs '#1e7a4a' --variant fidelity       # keep the brand hue and chroma as given
 *   node make_scheme.mjs '#1e7a4a' --contrast all           # standard, medium and high blocks
 *   node make_scheme.mjs '#1e7a4a' --custom success=#2e7d32 --custom warning=#ed6c02
 *   node make_scheme.mjs '#1e7a4a' --json > scheme.json
 *   node make_scheme.mjs '#1e7a4a' --check                  # print contrast ratios of the guaranteed pairs
 *
 * Variants: tonal-spot (default), vibrant, expressive, fidelity, content, monochrome, neutral, rainbow, fruit-salad.
 * Custom colors get the four roles {name}, on-{name}, {name}-container, on-{name}-container, harmonized
 * toward the source hue (Blend.harmonize) unless --no-harmonize is given.
 */
import {
  argbFromHex, hexFromArgb, Hct, Blend, TonalPalette, MaterialDynamicColors,
  SchemeTonalSpot, SchemeVibrant, SchemeExpressive, SchemeFidelity, SchemeContent,
  SchemeMonochrome, SchemeNeutral, SchemeRainbow, SchemeFruitSalad,
} from '@material/material-color-utilities';

const VARIANTS = {
  'tonal-spot': SchemeTonalSpot, vibrant: SchemeVibrant, expressive: SchemeExpressive,
  fidelity: SchemeFidelity, content: SchemeContent, monochrome: SchemeMonochrome,
  neutral: SchemeNeutral, rainbow: SchemeRainbow, 'fruit-salad': SchemeFruitSalad,
};

const ROLES = [
  'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer', 'inversePrimary',
  'primaryFixed', 'primaryFixedDim', 'onPrimaryFixed', 'onPrimaryFixedVariant',
  'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
  'secondaryFixed', 'secondaryFixedDim', 'onSecondaryFixed', 'onSecondaryFixedVariant',
  'tertiary', 'onTertiary', 'tertiaryContainer', 'onTertiaryContainer',
  'tertiaryFixed', 'tertiaryFixedDim', 'onTertiaryFixed', 'onTertiaryFixedVariant',
  'error', 'onError', 'errorContainer', 'onErrorContainer',
  'background', 'onBackground', 'surface', 'onSurface', 'surfaceVariant', 'onSurfaceVariant',
  'surfaceDim', 'surfaceBright', 'surfaceContainerLowest', 'surfaceContainerLow',
  'surfaceContainer', 'surfaceContainerHigh', 'surfaceContainerHighest',
  'inverseSurface', 'inverseOnSurface', 'outline', 'outlineVariant', 'shadow', 'scrim', 'surfaceTint',
];

// Pairs whose contrast Material guarantees (foreground, background)
const PAIRS = [
  ['onPrimary', 'primary'], ['onPrimaryContainer', 'primaryContainer'],
  ['onSecondary', 'secondary'], ['onSecondaryContainer', 'secondaryContainer'],
  ['onTertiary', 'tertiary'], ['onTertiaryContainer', 'tertiaryContainer'],
  ['onError', 'error'], ['onErrorContainer', 'errorContainer'],
  ['onSurface', 'surface'], ['onSurface', 'surfaceContainerHighest'], ['onSurfaceVariant', 'surface'],
  ['primary', 'surface'], ['inverseOnSurface', 'inverseSurface'], ['inversePrimary', 'inverseSurface'],
  ['outline', 'surface'],
];

const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

function parseArgs(argv) {
  const o = { source: null, variant: 'tonal-spot', contrast: 'standard', custom: [], harmonize: true, json: false, check: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--variant') o.variant = argv[++i];
    else if (a === '--contrast') o.contrast = argv[++i];
    else if (a === '--custom') o.custom.push(argv[++i]);
    else if (a === '--no-harmonize') o.harmonize = false;
    else if (a === '--json') o.json = true;
    else if (a === '--check') o.check = true;
    else if (a.startsWith('#')) o.source = a;
    else if (/^[0-9a-fA-F]{6}$/.test(a)) o.source = '#' + a;
  }
  if (!o.source) { console.error('Give a source color, for example #1e7a4a'); process.exit(2); }
  if (!VARIANTS[o.variant]) { console.error('Unknown variant. Use: ' + Object.keys(VARIANTS).join(', ')); process.exit(2); }
  return o;
}

function roles(scheme) {
  const out = {};
  for (const r of ROLES) out[r] = hexFromArgb(MaterialDynamicColors[r].getArgb(scheme));
  return out;
}

function customRoles(name, hex, sourceArgb, isDark, harmonize) {
  let argb = argbFromHex(hex);
  if (harmonize) argb = Blend.harmonize(argb, sourceArgb);
  const p = TonalPalette.fromInt(argb);
  const t = isDark ? [80, 20, 30, 90] : [40, 100, 90, 10];
  return {
    [name]: hexFromArgb(p.tone(t[0])), ['on' + cap(name)]: hexFromArgb(p.tone(t[1])),
    [name + 'Container']: hexFromArgb(p.tone(t[2])), ['on' + cap(name) + 'Container']: hexFromArgb(p.tone(t[3])),
  };
}
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function luminance(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) { const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); }

function cssBlock(selector, map, indent = '') {
  return `${indent}${selector} {\n` + Object.entries(map).map(([k, v]) => `${indent}  --md-sys-color-${kebab(k)}: ${v};`).join('\n') + `\n${indent}}`;
}

const o = parseArgs(process.argv.slice(2));
const sourceArgb = argbFromHex(o.source);
const hct = Hct.fromInt(sourceArgb);
const Variant = VARIANTS[o.variant];
const levels = o.contrast === 'all' ? [['standard', 0], ['medium', 0.5], ['high', 1]] : [[o.contrast, { standard: 0, medium: 0.5, high: 1 }[o.contrast] ?? 0]];

const result = { source: o.source, hct: { hue: +hct.hue.toFixed(1), chroma: +hct.chroma.toFixed(1), tone: +hct.tone.toFixed(1) }, variant: o.variant, schemes: {} };
for (const [name, level] of levels) {
  for (const isDark of [false, true]) {
    const scheme = new Variant(hct, isDark, level);
    const map = roles(scheme);
    for (const c of o.custom) {
      const [n, hex] = c.split('=');
      Object.assign(map, customRoles(n, hex, sourceArgb, isDark, o.harmonize));
    }
    result.schemes[`${name}-${isDark ? 'dark' : 'light'}`] = map;
  }
}

if (o.json) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

if (o.check) {
  for (const [key, map] of Object.entries(result.schemes)) {
    console.log(`\n${key}`);
    for (const [fg, bg] of PAIRS) {
      const r = contrast(map[fg], map[bg]);
      const need = fg === 'outline' ? 3 : 4.5;
      console.log(`  ${(r.toFixed(2) + ':1').padStart(7)}  ${r >= need ? 'ok ' : 'LOW'}  ${kebab(fg)} on ${kebab(bg)}`);
    }
  }
  process.exit(0);
}

const lines = [
  `/* Material 3 color roles generated by make_scheme.mjs`,
  `   source ${o.source} (HCT hue ${result.hct.hue}, chroma ${result.hct.chroma}, tone ${result.hct.tone}), variant ${o.variant}.`,
  `   Load after material-tokens.css; these override its --md-sys-color-* values. */`,
];
const std = levels[0][0];
lines.push(cssBlock(':root', result.schemes[`${std}-light`]));
lines.push('@media (prefers-color-scheme: dark) {');
lines.push(cssBlock(':root:not([data-theme="light"])', result.schemes[`${std}-dark`], '  '));
lines.push('}');
lines.push(cssBlock(':root[data-theme="dark"]', result.schemes[`${std}-dark`]));
if (o.contrast === 'all') {
  for (const name of ['medium', 'high']) {
    lines.push(`/* ${name} contrast: apply with data-contrast="${name}" on <html>, or map to prefers-contrast: more */`);
    lines.push(cssBlock(`:root[data-contrast="${name}"]`, result.schemes[`${name}-light`]));
    lines.push(cssBlock(`:root[data-contrast="${name}"][data-theme="dark"]`, result.schemes[`${name}-dark`]));
  }
}
console.log(lines.join('\n'));
