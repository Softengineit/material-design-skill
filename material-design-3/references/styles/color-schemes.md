# Color schemes: generating, adapting and managing Material 3 color

How a single source color becomes the 45 roles of a scheme, how to get a scheme that fits a brand without being pale, how to add success or warning colors, combine schemes on one screen, and ship light, dark and three contrast levels. `color.md` lists the roles and their pairing rules; this file is about producing and managing the values. Use `scripts/make_scheme.mjs` for the arithmetic; never compute tones by hand.

## 1. The pipeline in one paragraph

A source color (brand hex, wallpaper or image) is converted to HCT. A scheme variant turns it into five key colors (primary, secondary, tertiary, neutral, neutral variant), each with a fixed hue and chroma; error is a sixth, fixed at hue 25 and chroma 84. Each key color becomes a tonal palette (same hue and chroma, tone from 0 to 100). Each role picks one tone from one palette, with a different tone in light and in dark. Contrast levels move those tones further apart. That is the whole system: the role names never change, only the tones and the palettes behind them.

## 2. HCT: what the three numbers mean

- Hue: 0 to 360 degrees, from the CAM16 model (perceptual, not HSL).
- Chroma: colorfulness, 0 is grey. Practical maximum about 120, and it depends on hue and tone (a pale yellow cannot have high chroma at tone 40).
- Tone: lightness from 0 (black) to 100 (white). Tone is exactly CIE L*, so a tone difference gives a guaranteed minimum contrast ratio whatever the hue:

| Tone gap | Minimum WCAG ratio | Used for |
|---|---|---|
| 40 | 3:1 | large text, icons, borders, focus rings |
| 50 | 4.5:1 | body text |
| 65 or more | 7:1 | AAA text |

HSL lightness is not perceptual (at HSL lightness 50 the real lightness ranges from 33 to 96). Never build or adjust a Material palette with HSL or with `color-mix()` steps; use HCT through the script or material-color-utilities.

## 3. Scheme variants

The variant decides how far the scheme departs from the source color. Hue and chroma per palette, h is the source hue:

| Variant | Primary | Secondary | Tertiary | Neutral | Neutral variant | Character |
|---|---|---|---|---|---|---|
| tonal-spot (default) | h, chroma 36 | h, 16 | h+60, 24 | h, 6 | h, 8 | Calm, low chroma. The Android 12 default. Looks pale with blue, green or grey sources |
| vibrant | h, max chroma | rotated h, 24 | rotated h, 32 | h, 10 | h, 12 | Saturated accents, neutral still quiet |
| expressive | h+240, 40 | rotated h, 24 | rotated h, 32 | h+15, 8 | h+15, 12 | Deliberately far from the source; playful |
| fidelity | h, source chroma | h, reduced chroma | complement | h, chroma/8 | h, chroma/8+4 | Keeps the brand hue and chroma; source lands in primary-container |
| content | like fidelity | like fidelity | analogous | h, chroma/8 | h, chroma/8+4 | For colors extracted from an image |
| neutral | h, 12 | h, 8 | h+60, 16 | h, 2 | h, 2 | Near grey with a hint of hue |
| monochrome | chroma 0 | 0 | 0 | 0 | 0 | Greys only |
| rainbow, fruit-salad | shifted hues | | | chroma 0 or 10 | | The source hue does not appear; for playful products |

Tonal-spot ignores the source chroma (it always uses 36) and all variants except fidelity and content ignore the source tone (roles land on fixed tones). Consequences:
- A vivid brand color comes out muted with tonal-spot. Use `vibrant` for a colorful product, `fidelity` when the exact brand hue and chroma must survive.
- A bright or very dark brand color loses its lightness: primary is always tone 40 in light. If the brand is defined by its lightness (a light cyan, a navy), use `fidelity` or keep the exact hex for logos and illustrations only.
- A grey or near-grey source has an unstable hue; tonal-spot still applies chroma 36 to it and gives a random tint. Use `neutral` or `monochrome` for grey brands.

## 4. Generating the roles (the script)

```bash
npm i @material/material-color-utilities          # once per project
node scripts/make_scheme.mjs '#1e7a4a'                       # CSS, light + dark, tonal-spot
node scripts/make_scheme.mjs '#1e7a4a' --variant vibrant     # more colorful
node scripts/make_scheme.mjs '#1e7a4a' --contrast all        # adds medium and high contrast blocks
node scripts/make_scheme.mjs '#1e7a4a' --custom success=#2e7d32 --custom warning=#ed6c02
node scripts/make_scheme.mjs '#1e7a4a' --check               # contrast of every guaranteed pair
node scripts/make_scheme.mjs '#1e7a4a' --json > tokens/scheme.json
```

Paste the CSS into `tokens/theme.css`, loaded after `material-tokens.css`. It redefines only `--md-sys-color-*`; typography, shape, motion and the component CSS do not change. Keep the JSON in the repo so designers and developers share the same values; the Material Theme Builder (Figma plugin and web app) produces the same numbers from the same source and variant.

What the script does, in case you need to do it in another language: `Hct.fromInt(argb)`, then `new SchemeTonalSpot(hct, isDark, contrastLevel)` (or another Scheme class), then `MaterialDynamicColors.<role>.getArgb(scheme)` for each of the 45 roles, then `hexFromArgb`. Custom colors: `Blend.harmonize(custom, source)` then `TonalPalette.fromInt(harmonized).tone(40 | 100 | 90 | 10)` in light and `(80 | 20 | 30 | 90)` in dark. The old `themeFromSourceColor` and `applyTheme` helpers still exist in the library but produce the pre-2023 role set without surface-container tiers; do not use them for new work.

## 5. Baseline tones per role

For reference and for custom roles: palette and tone for each role, light / dark (P primary, S secondary, T tertiary, E error, N neutral, NV neutral variant).

| Role | Light | Dark |
|---|---|---|
| primary / on-primary | P40 / P100 | P80 / P20 |
| primary-container / on-primary-container | P90 / P30 (P10 before 2024) | P30 / P90 |
| inverse-primary | P80 | P40 |
| primary-fixed, fixed-dim, on-fixed, on-fixed-variant | P90, P80, P10, P30 | same |
| secondary, tertiary and error groups | same tones as primary, on their palette | same |
| surface | N98 | N6 |
| surface-dim / surface-bright | N87 / N98 | N6 / N24 |
| surface-container lowest, low, default, high, highest | N100, N96, N94, N92, N90 | N4, N10, N12, N17, N22 |
| on-surface / on-surface-variant | N10 / NV30 | N90 / NV80 |
| outline / outline-variant | NV50 / NV80 | NV60 / NV30 |
| inverse-surface / inverse-on-surface | N20 / N95 | N90 / N20 |
| scrim, shadow | N0 | N0 |

Error palette is fixed (hue 25, chroma 84) so errors stay red whatever the source. `on-primary-container` moved from tone 10 to tone 30 in 2024 to be more colorful while keeping 4.5:1; the script and material-tokens.css use the 2024 values.

## 6. Contrast levels

`contrastLevel` runs from -1 (reduced) through 0 (standard), 0.5 (medium) to 1 (high). Tones do not move by a fixed offset: each role has a target contrast curve against its background and the library searches the nearest tone that meets it. At high contrast, light containers darken and on-colors go toward 0 or 100.

Ship all three: generate with `--contrast all`, which emits `:root[data-contrast="medium"]` and `[data-contrast="high"]` blocks, and set the attribute from a user setting or from `matchMedia('(prefers-contrast: more)')` (map "more" to medium by default, high when the user asks). Components written with roles get contrast support for free; components written with hex values do not.

## 7. Custom colors: success, warning, info, brand accents

Material calls them static colors. One source gives four roles with the same tone mapping as an accent group:

| Role | Light tone | Dark tone |
|---|---|---|
| `{name}` | 40 | 80 |
| `on-{name}` | 100 | 20 |
| `{name}-container` | 90 | 30 |
| `on-{name}-container` | 10 | 90 |

Rules:
- Harmonize semantic colors toward the scheme hue (`Blend.harmonize`): the hue moves toward the source by half the difference, at most 15 degrees; chroma and tone are kept, so green stays green. The script does it by default.
- Do not harmonize an exact brand color that must stay identical (a logo color); pass `--no-harmonize` for that one.
- Use them as you use the accent groups: `success-container` with `on-success-container` for a confirmed state chip, `success` for an icon on surface. Never use them for text on an unrelated container.
- Do not invent extra roles beyond these four unless a palette, a tone per theme and contrast level, a background and a verified contrast ratio are written down for each.

CSS output from the script, for `--custom success=#2e7d32`: `--md-sys-color-success`, `--md-sys-color-on-success`, `--md-sys-color-success-container`, `--md-sys-color-on-success-container`.

## 8. Several schemes on one screen

- One base scheme for the app chrome: navigation, surfaces, main actions.
- A content-based scheme (`--variant content` from an album cover, a product photo, a team color) may be scoped to the region that shows that content: redefine the `--md-sys-color-*` variables on that container element; custom properties inherit, and every component inside picks them up.
- Keep the source visible in that region (the cover, the photo), otherwise the color looks arbitrary.
- At most two source types per screen (base plus one content area).
- Never replace error, success or warning with content color; their meaning is the point.
- Never pair roles across schemes: `on-primary` from scheme A over `primary` from scheme B has no contrast guarantee.

## 9. Remapping roles on a component

A component may use a different role than its default, as long as the pair moves together: a button on `secondary` takes `on-secondary` as label; a card on `tertiary-container` takes `on-tertiary-container`. In CSS, override the component's own variables rather than editing the component: `.md-button--brand { --_container: var(--md-sys-color-tertiary); --_label: var(--md-sys-color-on-tertiary); }`. Container roles (`*-container`) are never text colors. Tonal palette values (`--md-ref-palette-*`) are never used in components; they do not follow theme or contrast changes.

## 10. Choosing a source color and integrating a brand

- Start from the brand's main color as source. If the brand has several, the main one is the source and the others become custom colors (section 7) or the explicit secondary and tertiary palettes.
- Check the HCT of the source (the script prints it). Chroma under 20: the scheme will be grey-ish with tonal-spot; use `neutral` on purpose or raise the source chroma. Tone far from 40: expect primary to differ from the brand hex; decide whether that is acceptable or use `fidelity`.
- If you must show the exact brand hex, keep it on the logo and illustrations. If you hand-set a role to a brand hex, keep the role's tone (primary at tone 40 in light, 80 in dark) or the on-role pairings break.
- Pick the variant by product: enterprise tools and back-offices work with tonal-spot or vibrant on a low-chroma source; consumer apps, media and food often want vibrant or fidelity; grey brands want neutral.
- Then run `--check` and look at both themes at 400 px. If the light theme still reads pale, apply the adjustments in `color.md`, section "When the light theme looks too pale", and re-run `--check`.

## 11. Dynamic color

On Android 12 and later the system derives the scheme from the wallpaper and apps that use roles follow it. The web has no system equivalent; "dynamic" there means generating from user content at runtime with the same library (`argbFromHex` on a chosen color, or `QuantizerCelebi` plus `Score.score` on image pixels to pick a source). The role mapping is identical, so a component tested with the baseline works with any generated scheme. Test with at least four sources (a red, a yellow, a green and a blue) before claiming dynamic support.

## 12. Material 3 Expressive (2025)

The role set for phone and web did not change. The library gained a 2025 color spec (higher chroma across hues, a chroma multiplier on surfaces) that Android applies automatically; on the web it is opt-in and depends on the installed library version. New `*-dim` roles exist for watches only. The practical effect for web work: expect more vivid schemes from Google's tools, and prefer `vibrant` when matching an Android app that already shows Expressive colors.

## 13. Checklist before shipping a scheme

- Generated by the script or the Theme Builder from a recorded source hex and variant, not typed by hand.
- Light and dark both present; `color-scheme` and `theme-color` metas aligned with `surface`.
- `--check` shows every pair at or above its target in both themes.
- Custom colors harmonized (except literal brand colors) and used in pairs.
- No `--md-ref-palette-*` and no hex in component CSS (the checker reports them).
- Medium and high contrast blocks shipped, or a written reason why not.
- Looked at on a phone in daylight: pale schemes are usually noticed there first.
