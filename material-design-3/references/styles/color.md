# Color

Material 3 color is a system of named roles, not hand-picked hex values. Every UI element maps to a role, every role maps to a tone from a tonal palette, and the tonal pairing rules keep text readable in light, dark and high-contrast themes.
Use the `--md-sys-color-*` custom properties from `assets/material-tokens.css`; never write raw hex into components.

## How the system is built

1. A source color (brand hex, wallpaper or image) is the starting point.
2. The algorithm derives five key colors from it: primary, secondary, tertiary, neutral, neutral variant. The error key color is fixed (red) in every scheme.
3. Each key color becomes a tonal palette: 13 standard tones 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100 (plus extras such as 4, 6, 12, 17, 22, 24, 87, 92, 94, 96, 98 for the neutral palette). Tone 0 is black, tone 100 is white.
4. Tones are assigned to color roles. Example: light theme primary = primary40, on-primary = primary100; dark theme primary = primary80, on-primary = primary20.
5. The same role names serve both light and dark themes; only the tone changes.

Key color intent:
- Primary: the most prominent accent (FAB, filled buttons, active states, links).
- Secondary: less prominent accent (tonal buttons, filter chips, selected navigation indicators).
- Tertiary: a contrasting accent for small highlights (badges, special inputs). Optional.
- Error: urgent states (invalid fields, destructive confirmation). Static in dynamic schemes.
- Neutral: surfaces and backgrounds.
- Neutral variant: outlines and medium-emphasis text.

## HCT color space

- Material defines colors in HCT: Hue (0 to 360), Chroma (0 up to about 120, 0 means grey), Tone (0 black to 100 white).
- Tone is perceptual lightness, so a fixed tone difference gives a predictable contrast ratio. Roughly: 40 tone steps apart gives at least 3:1, 50 apart gives 4.5:1, 70 apart gives 7:1.
- HCT values do not map one to one to HSL. Do not reason about contrast from HSL lightness.
- On the web, generate schemes with `@material/material-color-utilities` (npm). Typical use: `themeFromSourceColor(argbFromHex('#6750A4'))` then `applyTheme(theme, { target: document.body, dark: matchMedia('(prefers-color-scheme: dark)').matches })`. The library also exposes `Hct`, `TonalPalette`, `Blend.harmonize`, and scheme variants (`SchemeTonalSpot`, `SchemeVibrant`, `SchemeContent`, `SchemeFidelity`, etc.) with a `contrastLevel` argument.

## Role groups and pairing rules

Role naming conventions:
- `on-X` is the text and icon color to use on top of `X`. Always pair them; this is the only guaranteed accessible pairing.
- `X-container` is a fill color for components such as FABs, chips or cards. Never use a container color for text.
- `X-variant` is a lower-emphasis version of `X`.
- Surface roles are for backgrounds and large low-emphasis areas.

Accent groups (primary, secondary, tertiary, error), four roles each:

| Role | Use |
|---|---|
| primary | High-emphasis fill, text or icon against surface |
| on-primary | Text and icons on primary |
| primary-container | Standout fill against surface (FAB, selected chip) |
| on-primary-container | Text and icons on primary-container |

Same pattern for secondary, tertiary and error. In light theme on-X-container is tone 30 (more colorful than before), on-X is tone 100.

Surface group:
- `surface`: the default page background.
- `on-surface`: default text and icon color on any surface or surface-container.
- `on-surface-variant`: lower-emphasis text and icons (supporting text, inactive icons).
- Five container tiers from least to most emphasis: `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`. They are not tied to elevation; pick the tier by hierarchy. Overlapping areas must use different tiers so their edges show.
- Default component mapping: surface-container-low for elevated buttons and elevated cards, surface-container for app bars, navigation bars and navigation rails, surface-container-high for FAB (surface variant), dialogs and menus, surface-container-highest for filled text fields and the off switch track.
- `surface-dim` and `surface-bright`: add-on roles. Surface flips from light to dark between themes, but surface-bright is the brightest tone in both themes and surface-dim the dimmest in both.
- `surface-variant` and `background` still exist for backward compatibility; prefer the container tiers and `surface`.
- `surface-tint` equals primary and is deprecated as an elevation overlay; use the container tiers instead.

Outline:
- `outline`: important boundaries such as a text field border or a divider that must stand alone (meets 3:1 against surface).
- `outline-variant`: decorative lines such as list dividers and card borders. Also acceptable as a chip or button border when the content inside already gives 4.5:1 contrast.
- Do not use outline for dividers or card borders (too heavy). Do not use outline-variant alone to mark a target boundary.

Inverse roles (snackbars, tooltips over a scrim-free surface):
- `inverse-surface` background, `inverse-on-surface` text, `inverse-primary` for the action button on it.

Fixed roles (add-on, same tone in light and dark):
- `primary-fixed` (tone 90), `primary-fixed-dim` (tone 80), `on-primary-fixed` (tone 10), `on-primary-fixed-variant` (tone 30); same for secondary and tertiary.
- Use only where a component must keep the same color across themes. Because they do not adapt, avoid them where contrast matters.

Other: `scrim` (black at 32% opacity behind modals), `shadow` (black).

## Baseline scheme values

Light hex / dark hex, from `material-tokens.css`. Palette tones are in parentheses (light / dark).

| Role | Light | Dark |
|---|---|---|
| primary (40 / 80) | #6750a4 | #d0bcff |
| on-primary (100 / 20) | #ffffff | #381e72 |
| primary-container (90 / 30) | #eaddff | #4f378b |
| on-primary-container (30 / 90) | #4f378b | #eaddff |
| secondary (40 / 80) | #625b71 | #ccc2dc |
| on-secondary (100 / 20) | #ffffff | #332d41 |
| secondary-container (90 / 30) | #e8def8 | #4a4458 |
| on-secondary-container (30 / 90) | #4a4458 | #e8def8 |
| tertiary (40 / 80) | #7d5260 | #efb8c8 |
| on-tertiary (100 / 20) | #ffffff | #492532 |
| tertiary-container (90 / 30) | #ffd8e4 | #633b48 |
| on-tertiary-container (30 / 90) | #633b48 | #ffd8e4 |
| error (40 / 80) | #b3261e | #f2b8b5 |
| on-error (100 / 20) | #ffffff | #601410 |
| error-container (90 / 30) | #f9dedc | #8c1d18 |
| on-error-container (30 / 90) | #8c1d18 | #f9dedc |
| surface (98 / 6) | #fef7ff | #141218 |
| on-surface (10 / 90) | #1d1b20 | #e6e0e9 |
| on-surface-variant (NV30 / NV80) | #49454f | #cac4d0 |
| surface-container-lowest (100 / 4) | #ffffff | #0f0d13 |
| surface-container-low (96 / 10) | #f7f2fa | #1d1b20 |
| surface-container (94 / 12) | #f3edf7 | #211f26 |
| surface-container-high (92 / 17) | #ece6f0 | #2b2930 |
| surface-container-highest (90 / 22) | #e6e0e9 | #36343b |
| surface-dim (87 / 6) | #ded8e1 | #141218 |
| surface-bright (98 / 24) | #fef7ff | #3b383e |
| surface-variant (NV90 / NV30) | #e7e0ec | #49454f |
| background (98 / 6) | #fef7ff | #141218 |
| on-background (10 / 90) | #1d1b20 | #e6e0e9 |
| outline (NV50 / NV60) | #79747e | #938f99 |
| outline-variant (NV80 / NV30) | #cac4d0 | #49454f |
| inverse-surface (20 / 90) | #322f35 | #e6e0e9 |
| inverse-on-surface (95 / 20) | #f5eff7 | #322f35 |
| inverse-primary (80 / 40) | #d0bcff | #6750a4 |
| surface-tint | #6750a4 | #d0bcff |
| primary-fixed (90) | #eaddff | #eaddff |
| primary-fixed-dim (80) | #d0bcff | #d0bcff |
| on-primary-fixed (10) | #21005d | #21005d |
| on-primary-fixed-variant (30) | #4f378b | #4f378b |
| secondary-fixed (90) | #e8def8 | #e8def8 |
| secondary-fixed-dim (80) | #ccc2dc | #ccc2dc |
| on-secondary-fixed (10) | #1d192b | #1d192b |
| on-secondary-fixed-variant (30) | #4a4458 | #4a4458 |
| tertiary-fixed (90) | #ffd8e4 | #ffd8e4 |
| tertiary-fixed-dim (80) | #efb8c8 | #efb8c8 |
| on-tertiary-fixed (10) | #31111d | #31111d |
| on-tertiary-fixed-variant (30) | #633b48 | #633b48 |
| scrim | #000000 | #000000 |
| shadow | #000000 | #000000 |

Dark theme in the CSS file is activated by `prefers-color-scheme: dark` (unless `data-theme="light"` is set on `<html>`) or by `data-theme="dark"` on `<html>`.

## Accessibility and contrast

- Material targets 4.5:1 for small text and 3:1 for large text, icons and component boundaries. Every `on-X` over `X` meets at least 3:1 by construction; most text pairs meet 4.5:1.
- Only pair roles as designed. `primary` text on `primary-container`, or `on-surface` on `secondary-container`, is not guaranteed and will break at other contrast levels or in dynamic color.
- Default body text color is `on-surface`; secondary text is `on-surface-variant`. Links use `primary` (or `tertiary` for lower emphasis) and must be underlined.
- Three contrast levels exist: standard (default), medium (at least 3:1 everywhere, for people who find high contrast uncomfortable), high (7:1 on essential content). They apply to both light and dark. In material-color-utilities pass `contrastLevel` 0, 0.5 or 1.0. Custom components get contrast support for free if they use roles instead of raw values.
- Do not use tonal palette values (`--md-ref-palette-*`) directly in components. They do not switch with theme or contrast level.

## Static versus dynamic color

- Static (baseline or brand) scheme: colors never change for the user. Pick it when you want strict brand consistency, when migrating from M2, for enterprise tools, or on platforms without dynamic color. The baseline scheme above is static and built from a hand-picked purple source.
- Dynamic scheme: colors are generated at runtime from the user's wallpaper (user-generated) or from in-app content such as album art (content-based). The role mappings stay identical; only the resolved values change. Design and test with the baseline first, then verify across several source colors.
- Limit a screen to two schemes from different sources (for example baseline plus one content-based area), keep the content-based color next to its source image, and never replace semantic colors (red error, green success) with content color.
- Error roles stay static in dynamic schemes by default.

## Custom scheme from a brand color

1. Take the brand hex as the source color. Optionally supply separate sources for secondary, tertiary, neutral and neutral variant.
2. Generate the scheme with material-color-utilities (or the Material Theme Builder Figma plugin, which exports CSS, JSON, Compose, Flutter).
3. If the result looks washed out, enable color fidelity (the `SchemeFidelity` or `SchemeContent` variant) so tones follow the input more closely; then re-check the on-X pairings.
4. Extra semantic colors (success, warning, info) are defined the same way: one source gives four roles, `success`, `on-success`, `success-container`, `on-success-container`, with the same tone mapping as the accent groups (40/100/90/30 light, 80/20/30/90 dark). In dynamic schemes you may harmonize them toward primary with `Blend.harmonize(designColor, sourceColor)`; do not harmonize literal brand colors.
5. Custom roles beyond that should name a palette and tone for light and dark, state which roles they pair with, and be verified for contrast.

## CSS pattern

```css
.card {
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
.card .supporting { color: var(--md-sys-color-on-surface-variant); }
.button-filled {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.button-tonal {
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}
.fab {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
}
.field-error { color: var(--md-sys-color-error); }
.snackbar {
  background: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface);
}
.snackbar .action { color: var(--md-sys-color-inverse-primary); }
.scrim { background: color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent); }
```

State layers (hover, focus, pressed) are drawn with the content color (`on-X`) at the opacities in `md.sys.state`: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16. Disabled content uses `on-surface` at 0.38 and disabled containers use `on-surface` at 0.12.
