# Icons

Material 3 uses Material Symbols, a variable icon font in three styles (outlined, rounded, sharp) with four adjustable axes: FILL, wght, GRAD and opsz.
Icons are 24dp by default, sit in a 48dp touch target, and must be labeled unless purely decorative.

## Styles

- Outlined (default): stroke-based, light and clean, best for dense UIs. Stroke weight can follow the weight of your typography.
- Rounded: softer corners, pairs with heavier type, round logos and pill buttons.
- Sharp: 0dp corners, crisp look, pairs with rectangular brand details. Stays legible at small sizes.
- Pick one style for the whole product. Do not mix styles, weights or fills within one icon set.
- Legacy "Material Icons" (filled, outlined, round, sharp, two-tone) still exist but have no variable axes. Prefer Material Symbols.
- A few symbols stay filled in every style for recognition: full-body human figures and proprietary logos.

## Sizes and layout

- Standard size: 24dp x 24dp on a 24dp grid, with a 20dp live area and 2dp padding. Nothing extends past the trim area.
- Other optical sizes: 20dp (desktop, dense layouts, small visuals), 40dp and 48dp (display and headline type, large screens, highlighted primary actions).
- Touch target: a 24dp icon needs a 48dp x 48dp target. With mouse and keyboard as primary input, a 20dp icon may use a 40dp target.
- Keyline shapes inside the grid: square 18dp, circle 20dp, vertical rectangle 20 x 16dp, horizontal rectangle 16 x 20dp. Position custom icons on whole pixels.
- Default stroke is 2dp (weight 400). Exterior corner radius 2dp; interior corners square in the outlined style. Complex glyphs may drop to 1.5dp strokes for fit.
- Custom icons: simple, bold, geometric, front-facing, no perspective, no fine organic detail. Match the Material Symbols metrics or they will look foreign next to the set.

## Variable axes

| Axis | Range | Default | Notes |
|---|---|---|---|
| FILL | 0 to 1 | 0 | 1 is fully filled. Use for selected versus unselected states (navigation bar, favorites). Can animate. |
| wght | 100 to 700 | 400 | Stroke thickness. Minimum 200 at 24dp. Match the text weight next to the icon. |
| GRAD | -50 to 200 | 0 | Fine thickness without changing size. Use -25 for light icons on dark backgrounds so they do not look heavier than in light theme; use a positive grade for an active state. Match a text font's grade if it has one. |
| opsz | 20 to 48 | 24 | Optical size. Set it equal to the rendered size so stroke thickness stays consistent when scaling. |

Only `wght` maps to a standard CSS property (`font-weight`). FILL, GRAD and opsz are set through `font-variation-settings`.

## Loading from Google Fonts

Load the whole variable range (largest download, most flexible):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block">
```

Load a single fixed configuration (smallest download):

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=block">
```

Load only the glyphs you use (add `&icon_names=home,search,settings`, names sorted alphabetically, in combination with a fixed configuration) for the lightest payload.

Swap `Material+Symbols+Outlined` for `Material+Symbols+Rounded` or `Material+Symbols+Sharp` to change style. Use `display=block` rather than `swap` so ligature names are not shown as text while the font loads.

Base CSS class (Google's recommended defaults):

```css
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;        /* standard size */
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
```

## Using icons in HTML

Icons are ligatures: write the icon name as text content.

```html
<span class="material-symbols-outlined" aria-hidden="true">home</span>
<span class="material-symbols-outlined" aria-hidden="true">search</span>
<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
```

Variants with CSS:

```css
.icon-filled { font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24; }
.icon-20 { font-size: 20px; font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20; }
.icon-48 { font-size: 48px; font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48; }
/* dark theme: lighter grade so strokes do not bloom */
@media (prefers-color-scheme: dark) {
  .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" -25, "opsz" 24; }
}
/* selected navigation item: fill animates */
.nav-item .material-symbols-outlined { transition: font-variation-settings 200ms cubic-bezier(0.2, 0, 0, 1); }
.nav-item[aria-current="page"] .material-symbols-outlined { font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24; }
```

Color: icons take `currentColor`, so set `color` on the parent. Default icon color is `--md-sys-color-on-surface-variant`; active or emphasized icons use `--md-sys-color-on-surface`, `--md-sys-color-primary` or the `on-X` color of their container.

SVG alternative: each symbol is also available as an SVG from the icon catalog (fonts.google.com/icons). Inline SVG with `fill="currentColor"` and `width="24" height="24"` avoids font loading entirely; keep `viewBox="0 -960 960 960"` from the download.

## Icons with text

- Match icon size to the text size next to it (a 20px icon with 14px label text in a button, a 24px icon with 16px body text in a list).
- Match optical weight: regular text with 400 icons, medium or bold text with heavier icons.
- Shift the icon baseline down about 11.5% of the text size so it sits optically centered. Simplest: wrap icon and text in a flex container with `align-items: center`, which approximates this.
- Button icons are 20dp with an 8dp gap to the label (`md.comp.button.icon-label-space` = space100). Medium buttons use 24dp icons, large 32dp, xlarge 40dp.

```css
.button { display: inline-flex; align-items: center; gap: 8px; }
.button .material-symbols-outlined { font-size: 20px; font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20; }
```

## Accessibility

- Decorative icons (an icon next to a text label that already says what it does): `aria-hidden="true"` so screen readers do not announce the ligature text ("home").
- Icon-only controls must have a name: `aria-label` on the button, not on the span.

```html
<button type="button" class="icon-button" aria-label="Search">
  <span class="material-symbols-outlined" aria-hidden="true">search</span>
</button>

<button type="button" class="icon-button" aria-label="Add to favorites" aria-pressed="false">
  <span class="material-symbols-outlined" aria-hidden="true">favorite</span>
</button>
```

- Toggle icon buttons expose state with `aria-pressed`; the FILL axis shows the same state visually.
- A standalone meaningful icon that is not a control (a status indicator) uses `role="img"` and `aria-label`.
- Tooltips on icon buttons help sighted users but do not replace `aria-label`.
- Navigation destinations should always show a visible text label. Omitting labels is allowed only when meaning is unmistakable and space is critical.
- Below 20dp, complex icons and icons for key actions need an adjacent text label; simple icons such as rating stars can stand alone at any size.
- Icon-only targets keep the 48dp (or 40dp on desktop) hit area even if the glyph is smaller: use padding or `min-width` and `min-height`.
- Do not rely on color alone to convey an icon's state; change FILL, weight or add a label.
- Hide the ligature text if the font fails to load: `font-display: block` plus `aria-hidden` on decorative icons prevents stray words from being read.

## Localization

- Icons with cultural meaning (owls, hand gestures, mailboxes, shopping cart versus bag versus basket) may not translate; test in target markets or add labels.
- Directional icons (arrow_back, send, chevron_right) must flip in RTL layouts: `[dir="rtl"] .icon-flip { transform: scaleX(-1); }`. Icons that represent physical objects (clock, calendar) do not flip.
- Color meaning varies by culture; pair status colors with an icon and a label.
