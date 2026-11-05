# Design tokens and customization

Tokens are named style values (color, type, shape, elevation, state opacity) shared by design files and code.
M3 has three classes: reference (`md.ref.*`), system (`md.sys.*`) and component (`md.comp.*`); theming happens at the system level.

## What a token is

- A token is a name plus a value. The value is a color, a typeface, a size, an opacity, or a pointer to another token.
- Example: `md.ref.palette.secondary90` holds `#E8DEF8`. `md.sys.color.secondary-container` points to `md.ref.palette.secondary90`. `md.comp.fab.primary.container.color` points to a system color role.
- The name describes how or where the value is used, not what the value looks like. The value can change (rebrand, dark theme, high contrast) and every consumer updates; the name and its meaning stay.
- Never hardcode a hex, font size or radius in a component when a token exists.

## Token name structure

Parts are separated by periods and go from general to specific:

1. System prefix: `md` for Material Design.
2. Class: `ref`, `sys` or `comp`.
3. Role words: what the token is for, most specific last.

Examples:
- `md.ref.palette.primary40`
- `md.ref.typeface.plain-medium`
- `md.sys.color.on-secondary-container`
- `md.sys.typescale.label-medium.font`
- `md.sys.shape.corner.large`
- `md.sys.state.hover.state-layer-opacity`
- `md.comp.filled-button.label-text.color`

## The three classes

### Reference tokens (`md.ref.*`)
- The full list of raw options the system allows: tonal palettes (13 tones per key color: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100), typefaces, base measurements.
- Usually point to a static value. May point to another ref token. Never change with context (light or dark, dense, RTL).
- Do not use them directly in component CSS. They exist to be assigned to roles.

### System tokens (`md.sys.*`)
- The design decisions: color roles (primary, on-primary, primary-container, surface, outline, error), type scale roles (display, headline, title, body, label in large, medium, small), shape scale (corner none, extra-small, small, medium, large, extra-large, full), elevation levels, state layer opacities, motion.
- This is where theming lives. A system token points to different reference tokens per context: `md.sys.color.background` points to a light tone in the light theme and a dark tone in the dark theme.
- Should point to reference tokens, not raw values, whenever possible.
- Component CSS should read system tokens. This is the layer to override for branding.

### Component tokens (`md.comp.*`)
- Properties of each part (element) of one component: container color, label text font, icon size, outline width, elevation, shape, per state (enabled, disabled, hover, focused, pressed).
- Point to system or reference tokens, never to hardcoded values.
- A property that is unique to one component and never reused may stay a plain value; anything shared across components of the same intent becomes a token.
- Component specs on the M3 site list tokens grouped first by state, then by element, with columns: name, token ID, description, value.
- Still marked "in development": names can change. Treat them as implementation detail and expose system tokens as the public theming surface.

## Contexts

- A context is a condition that changes which value a token resolves to: light or dark theme, high contrast, dense layout, RTL, device form factor.
- A context acts like a tag on an alternate value: a value tagged "dark" overrides the default when the dark context is active.
- Only system (and component) tokens vary by context. Reference tokens are fixed.
- In code: a context is a selector scope that redefines the same custom property names.

## Mapping tokens to CSS custom properties

The dot name becomes a kebab-case custom property with `--` prefix and dots replaced by hyphens. This is the convention used by Material Web and Material Theme Builder exports.

| Token | CSS custom property |
|---|---|
| `md.sys.color.primary` | `--md-sys-color-primary` |
| `md.sys.color.on-primary-container` | `--md-sys-color-on-primary-container` |
| `md.sys.color.surface-container-high` | `--md-sys-color-surface-container-high` |
| `md.sys.typescale.body-large.font` | `--md-sys-typescale-body-large-font` |
| `md.sys.typescale.body-large.size` | `--md-sys-typescale-body-large-size` |
| `md.sys.typescale.body-large.line-height` | `--md-sys-typescale-body-large-line-height` |
| `md.sys.typescale.body-large.weight` | `--md-sys-typescale-body-large-weight` |
| `md.sys.shape.corner.medium` | `--md-sys-shape-corner-medium` |
| `md.sys.elevation.level2` | `--md-sys-elevation-level2` |
| `md.sys.state.hover.state-layer-opacity` | `--md-sys-state-hover-state-layer-opacity` |
| `md.ref.palette.primary40` | `--md-ref-palette-primary40` |
| `md.comp.filled-button.container.color` | `--md-comp-filled-button-container-color` (or the Material Web form `--md-filled-button-container-color`) |

Skeleton for a theme file:

```css
:root {
  /* reference */
  --md-ref-palette-primary40: #6750A4;
  --md-ref-palette-primary80: #D0BCFF;
  --md-ref-palette-primary90: #EADDFF;
  --md-ref-palette-primary10: #21005D;
  --md-ref-typeface-plain: "Roboto", system-ui, sans-serif;
  --md-ref-typeface-brand: "Roboto", system-ui, sans-serif;

  /* system, light context */
  --md-sys-color-primary: var(--md-ref-palette-primary40);
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: var(--md-ref-palette-primary90);
  --md-sys-color-on-primary-container: var(--md-ref-palette-primary10);
  --md-sys-typescale-body-large-font: var(--md-ref-typeface-plain);
  --md-sys-typescale-body-large-size: 1rem;
  --md-sys-typescale-body-large-line-height: 1.5rem;
  --md-sys-typescale-body-large-weight: 400;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-full: 9999px;
  --md-sys-state-hover-state-layer-opacity: 0.08;
  --md-sys-state-focus-state-layer-opacity: 0.10;
  --md-sys-state-pressed-state-layer-opacity: 0.10;
  --md-sys-state-dragged-state-layer-opacity: 0.16;
}

/* dark context: same names, different reference tokens */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --md-sys-color-primary: var(--md-ref-palette-primary80);
    --md-sys-color-on-primary: #381E72;
    --md-sys-color-primary-container: #4F378B;
    --md-sys-color-on-primary-container: var(--md-ref-palette-primary90);
  }
}
:root[data-theme="dark"] { /* repeat the dark block */ }

/* component tokens read system tokens */
.filled-button {
  --md-comp-filled-button-container-color: var(--md-sys-color-primary);
  --md-comp-filled-button-label-text-color: var(--md-sys-color-on-primary);
  background: var(--md-comp-filled-button-container-color);
  color: var(--md-comp-filled-button-label-text-color);
  border-radius: var(--md-sys-shape-corner-full);
  font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) / var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font);
}
```

Rules for the CSS layer:
- Component CSS reads `--md-sys-*` (or `--md-comp-*` that itself reads `--md-sys-*`). It never reads `--md-ref-*` and never contains raw hex values.
- Define all `--md-sys-*` on `:root`; redefine for dark under `@media (prefers-color-scheme: dark)` and under an explicit `[data-theme="dark"]` so users can override the OS.
- Keep the on-color with its container: whenever you set `background` from a `-container` or surface token, set `color` from the matching `on-` token.
- High contrast, dense or other contexts are additional scopes (`[data-contrast="high"]`, `[data-density="-1"]`) that redefine the same names.
- Frameworks: React, Vue, Svelte and Angular consume the same custom properties; Angular Material has its own theming API and its values may differ from these guidelines.
- Material Web (`@material/web`) is in maintenance mode and does not implement M3 Expressive; its `--md-sys-*` property names still match this convention.

## Customization (theming)

- A theme is the full set of system-token values for one brand and context (color, type, shape, elevation, state). A color scheme is only the color part. "Light scheme" and "light theme" are not the same thing.
- Start from the baseline theme and override system tokens; do not fork component CSS.
- Material Theme Builder (Figma plugin or web) takes one source color (optionally a second and third, or a full brand palette) and generates the five key palettes (primary, secondary, tertiary, neutral, neutral variant), the light and dark schemes, the type scale, and exports them as tokens (DSP JSON, Android, Compose, CSS).
- Color roles fill from tonal palettes so each container and its on-color pass contrast automatically, and state layers, elevation tints and component structure keep working. This applies to custom non-Material components too, as long as they use the roles.
- Dynamic color: the app maps user-generated schemes (from wallpaper or system presets) onto its color roles. It is both a user setting and a developer choice. Always ship a fallback custom scheme for users without dynamic color. Dynamic color can be applied to only some screens (an account page) while brand colors stay elsewhere.
- Extended colors: extra roles beyond the key colors for semantic or brand meaning (success, warning, a brand accent). Name them like system tokens (`--md-sys-color-success`, `--md-sys-color-on-success`) and give each a container and on-container pair.

## When to override what

| Goal | Override |
|---|---|
| Rebrand, change palette for the whole product | `md.ref.palette.*` values (or regenerate from a new source color) |
| Change the role of a color, type or shape globally (make secondary buttons use tertiary) | `md.sys.*` |
| Light, dark, high contrast, dense | `md.sys.*` under a context scope |
| Change one component only (a square FAB while other shapes stay round) | that component's `md.comp.*` tokens |
| One-off instance | a scoped custom property on that element, still pointing at a system token |

- Do not override reference tokens to fix one component. Do not override component tokens to rebrand.
- Tokens pay off when the product is new or being redesigned, spans several products or platforms, or will need style updates. They pay off less for a frozen app with hardcoded values and no design system.
- Keep every token in one place (one CSS file or one JSON export). That file is the single source of truth and the handoff artifact between design and engineering.
- When a value changes, change the token value, never the token name. Code that references the name keeps working.
