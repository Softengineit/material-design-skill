# Typography

Material 3 ships one type scale with 30 styles: 15 baseline styles across five roles (display, headline, title, body, label) in three sizes each, plus 15 emphasized twins added by M3 Expressive.
Apply styles through the `--md-sys-typescale-*` properties in `assets/material-tokens.css`; pick a handful of styles per product, not all 30.

## Type scale (baseline)

Default font is Roboto for both the brand and plain typefaces. Sizes are in px (1 px here equals 1 sp on Android, and size / 16 gives rem on the web).

| Style | Weight | Size | Line height | Tracking |
|---|---|---|---|---|
| display-large | 400 | 57px | 64px | -0.25px |
| display-medium | 400 | 45px | 52px | 0px |
| display-small | 400 | 36px | 44px | 0px |
| headline-large | 400 | 32px | 40px | 0px |
| headline-medium | 400 | 28px | 36px | 0px |
| headline-small | 400 | 24px | 32px | 0px |
| title-large | 400 | 22px | 28px | 0px |
| title-medium | 500 | 16px | 24px | 0.15px |
| title-small | 500 | 14px | 20px | 0.1px |
| body-large | 400 | 16px | 24px | 0.5px |
| body-medium | 400 | 14px | 20px | 0.25px |
| body-small | 400 | 12px | 16px | 0.4px |
| label-large | 500 | 14px | 20px | 0.1px |
| label-medium | 500 | 12px | 16px | 0.5px |
| label-small | 500 | 11px | 16px | 0.5px |

## Emphasized styles

Same size, line height and tracking as the baseline style; only the weight goes up. Token name pattern: `md.sys.typescale.emphasized.<style>` (CSS: `--md-sys-typescale-emphasized-<style>-*`).

| Style | Baseline weight | Emphasized weight |
|---|---|---|
| display-large / medium / small | 400 | 500 |
| headline-large / medium / small | 400 | 500 |
| title-large | 400 | 500 |
| title-medium / small | 500 | 700 |
| body-large / medium / small | 400 | 500 |
| label-large / medium / small | 500 | 700 |

Where to use emphasized styles:
- Selected or active items (selected list item, selected menu item, active navigation label).
- Primary action buttons, extended FAB labels, badges.
- Unread or new content, and headlines in editorial moments.
- Components do not use them by default; swap the baseline token for the emphasized token of the same style. Keep baseline and emphasized styles together in one layout so the contrast reads as hierarchy.

Roboto Flex variant: the token file also has `--md-sys-typescale-variable-*` and `--md-sys-typescale-variable-emphasized-*` sets that use "Roboto Flex", 0px tracking, and emphasized weights of 500 (display, headline, title-large, body) and 600 (title-medium, title-small, labels). Use these when you load Roboto Flex.

## Which role to use where

- Display (57 / 45 / 36): the largest text on screen. Short strings or numbers only: hero headings, big numerals, splash screens. Best on large screens. An expressive or script typeface is acceptable here.
- Headline (32 / 28 / 24): short high-emphasis text on smaller screens: page titles, dialog titles, section openers. Expressive typefaces are allowed if line height and tracking are tuned.
- Title (22 / 16 / 14): medium-emphasis short text: top app bar title (title-large), card titles and list item headlines (title-medium), dense subheaders (title-small). Avoid decorative fonts.
- Body (16 / 14 / 12): paragraphs and any multi-line reading text. body-large for primary reading, body-medium for most UI copy and supporting text, body-small for captions and helper text. Use a readable workhorse face, never a display face.
- Label (14 / 12 / 11): text inside components. label-large for buttons, tabs and text field labels; label-medium for navigation bar labels and chips; label-small for tiny captions, timestamps and overlines.

Readability rules:
- Line height ratio is about 1.2 for display, headline and title and about 1.5 for body and label. The token values already follow this.
- Keep sizes as defined; change line height, tracking or typeface when customizing, not size, because component heights depend on size.
- Use tabular (monospaced) figures for clocks, counters and tables so widths do not jump: `font-variant-numeric: tabular-nums;`.
- Default text color is `--md-sys-color-on-surface`; supporting text uses `--md-sys-color-on-surface-variant`. Links use `--md-sys-color-primary` and are underlined. Contrast targets: 4.5:1 for small text, 3:1 for large text (24px regular or 19px bold and above).
- Reserve very light weights for large sizes; thin strokes break on low-resolution screens at body sizes. Avoid heavy weights at label sizes.

## Fonts and loading

- Roboto: default static family, about 3,300 glyphs. Weights used by the scale: 400, 500, 700.
- Roboto Flex: variable family with weight, width, slant, grade and optical size axes, plus advanced axes (XOPQ, YOPQ, XTRA, YTUC, YTLC, YTAS, YTDE, YTFI). Not yet the default in the scale, but supported through the `variable` token set.
- Roboto Serif and Roboto Mono: variable companions for reading-heavy or code contexts.
- Noto Sans: fallback collection for scripts Roboto does not cover. Fallback order: Roboto Flex, Roboto, Noto Sans, then system sans-serif.
- Brand versus plain typeface: `md.ref.typeface.brand` applies to display and headline (expression), `md.ref.typeface.plain` to title, body and label (readability). Both default to Roboto. Swap the brand face first if you want a branded look with low risk.

Load from Google Fonts (static Roboto with the three weights used):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
```

Load Roboto Flex as a variable font with the weight, width and optical size axes:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap">
```

Variable font axes in CSS:

```css
.hero {
  font-family: "Roboto Flex", "Roboto", "Noto Sans", sans-serif;
  font-weight: 650;                 /* wght, continuous 100 to 1000 */
  font-stretch: 110%;               /* wdth, 25 to 151 */
  font-optical-sizing: auto;        /* opsz follows font-size, 8 to 144 */
  font-variation-settings: "GRAD" -25; /* grade, -200 to 150, no reflow */
}
```

Axis guidance:
- Weight: main thickness control. Changes letter widths, so it can reflow text.
- Grade: fine thickness change without reflow. Use a negative grade (for example -25) for light text on dark backgrounds so it does not look heavier than in light theme; use a positive grade to mark an active state without moving layout.
- Width: narrow widths fit more characters in labels and navigation bars; wide widths add personality but need room. Avoid wide in top app bars.
- Optical size: match it to the rendered size. Large optical sizes at small text sizes get too thin; set `font-optical-sizing: auto` and the browser handles it.
- Slant: Roboto Flex supports a slant axis for oblique styles.

## Applying a style with tokens

Each style has five properties: `-font`, `-weight`, `-size`, `-line-height`, `-tracking`.

```css
.md-typescale-body-large {
  font-family: var(--md-sys-typescale-body-large-font);
  font-weight: var(--md-sys-typescale-body-large-weight);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}
.md-typescale-title-medium-emphasized {
  font-family: var(--md-sys-typescale-emphasized-title-medium-font);
  font-weight: var(--md-sys-typescale-emphasized-title-medium-weight);
  font-size: var(--md-sys-typescale-emphasized-title-medium-size);
  line-height: var(--md-sys-typescale-emphasized-title-medium-line-height);
  letter-spacing: var(--md-sys-typescale-emphasized-title-medium-tracking);
}
```

A short helper that generates all classes (Sass):

```scss
$styles: display-large, display-medium, display-small, headline-large, headline-medium,
  headline-small, title-large, title-medium, title-small, body-large, body-medium,
  body-small, label-large, label-medium, label-small;
@each $s in $styles {
  .md-typescale-#{$s} {
    font: var(--md-sys-typescale-#{$s}-weight) var(--md-sys-typescale-#{$s}-size) /
      var(--md-sys-typescale-#{$s}-line-height) var(--md-sys-typescale-#{$s}-font);
    letter-spacing: var(--md-sys-typescale-#{$s}-tracking);
  }
}
```

Semantic HTML mapping that works for most pages: `h1` headline-large or display-small, `h2` headline-medium, `h3` headline-small, `h4` title-large, `h5` title-medium, `h6` title-small, `p` body-large or body-medium, `button` label-large, `small` or captions body-small or label-small.

## Typesetting on the web

- Line height equals the bounding box height; CSS centers the glyphs with half-leading. Space text from container edges with padding, not with baseline math.
- Keep spacing tokens unchanged when text scales up to 200%; let containers grow instead.
- Language height: scripts such as Arabic, Devanagari, Thai and CJK need taller line heights (medium about 7% taller, Telugu and Burmese about 30%, Nastaliq about 100%). Do not give text containers fixed heights if they will show those scripts.
- Rem conversion: size in px / 16. Letter spacing in em or rem: tracking px / font size px (0.5px on 16px = 0.03125em).

## Customizing the scale

- To rebrand, change the brand and plain typeface tokens first, then adjust line height and tracking per style. Heavier faces need wider tracking; faces with long ascenders need taller line heights.
- Material's default scale follows the Major Second ratio (1.125) anchored on 14px body text. If you add sizes, keep clear steps between them.
- Most products use 5 to 8 styles. Remove the rest from your theme rather than inventing new ones.
- Editorial treatments (hero typography with custom sizes, widths or weights) are allowed for showcase moments. Tokenize each treatment so it is reused consistently, keep one treatment per layout, and never use them for labels or informational text.
