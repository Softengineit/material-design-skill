# Shape

Material 3 describes every rectangular container with a ten-step corner radius scale, from square (none) to pill (full), and assigns each component a default step.
M3 Expressive adds three larger steps, a library of 35 abstract shapes, and shape morphing on interaction. Use the `--md-sys-shape-corner-*` properties from `assets/material-tokens.css`.

## Corner radius scale

| Token (md.sys.shape.corner.*) | CSS variable | Value |
|---|---|---|
| none | --md-sys-shape-corner-none | 0px |
| extra-small | --md-sys-shape-corner-extra-small | 4px |
| small | --md-sys-shape-corner-small | 8px |
| medium | --md-sys-shape-corner-medium | 12px |
| large | --md-sys-shape-corner-large | 16px |
| large-increased | --md-sys-shape-corner-large-increased | 20px |
| extra-large | --md-sys-shape-corner-extra-large | 28px |
| extra-large-increased | --md-sys-shape-corner-extra-large-increased | 32px |
| extra-extra-large | --md-sys-shape-corner-extra-extra-large | 48px |
| full | --md-sys-shape-corner-full | 9999px (pill or circle) |

- The scale is based on how round the corner looks, not on the size of the component (M2 had three size-based steps).
- `full` used to mean "50% of the component height". Since the Expressive update it is a dedicated token; in CSS a very large radius (9999px) produces the same pill shape on any rectangle and a circle on a square.
- `md.sys.shape.corner-value.*` tokens hold the raw numbers for building individual corners.
- Large increased (20), extra large increased (32) and extra extra large (48) were added in May 2025 for the larger button, FAB and toolbar sizes.

## Directional (asymmetric) shapes

Some components round only certain corners. Named tokens exist for the common cases:

| Token | Corners |
|---|---|
| md.sys.shape.corner.extra-small.top | top-left and top-right 4px, bottom 0 |
| md.sys.shape.corner.large.top | top corners 16px |
| md.sys.shape.corner.large.start | leading corners 16px (top-left and bottom-left in LTR) |
| md.sys.shape.corner.large.end | trailing corners 16px (top-right and bottom-right in LTR) |
| md.sys.shape.corner.extra-large.top | top corners 28px |

Used by: filled text field (extra-small.top), bottom sheet (extra-large.top), standard navigation drawer (large.end), modal side sheet docked on the end edge (large.start), bottom navigation drawer (large.top).

In CSS use logical properties so start and end flip in RTL:

```css
.nav-drawer {
  border-start-end-radius: var(--md-sys-shape-corner-large);
  border-end-end-radius: var(--md-sys-shape-corner-large);
}
.bottom-sheet {
  border-start-start-radius: var(--md-sys-shape-corner-extra-large);
  border-start-end-radius: var(--md-sys-shape-corner-extra-large);
}
```

Inner corners of closely grouped items (connected button groups, split buttons, menus) use smaller individual corner values than the outer corners so the group reads as one object.

## Default shape per component

| Shape step | Components |
|---|---|
| none (0) | Top app bar, bottom app bar, navigation bar, navigation rail, tabs, full-screen dialog, docked side sheet, docked toolbar, linear progress track, list items at rest (non-expressive) |
| extra-small (4) | Menus and autocomplete menus, snackbar, plain tooltip, outlined text field, filled text field (top corners only), list items (expressive, at rest) |
| small (8) | Assist, filter, input and suggestion chips, time picker selectors, list item leading image (expressive), menu groups |
| medium (12) | Elevated, filled and outlined cards, small FAB, rich tooltip, square-style icon buttons and buttons at default size, docked search results |
| large (16) | FAB (default size), extended FAB, navigation drawer (end corners), modal side sheet (start corners), detached side sheet, lists container, docked date picker, selected list item, modal expanded navigation rail |
| large-increased (20) | Medium FAB, medium extended FAB, floating toolbar FAB (medium) |
| extra-large (28) | Dialogs, large FAB, large extended FAB, modal date and time pickers, carousel items, docked search view, bottom sheet (top corners) |
| extra-large-increased (32) | Reserved for large expressive containers |
| extra-extra-large (48) | Reserved for extra large expressive containers |
| full | Buttons (filled, tonal, outlined, text, elevated), icon buttons, button groups, split buttons, segmented buttons, badges, search bar, floating toolbar, switch track and handle, slider track and handle, progress indicator (new style), navigation active indicators, checkbox state layer, avatars, FAB menu items, loading indicator |

Buttons and icon buttons now have two style families: round (default, `full`) and square. Square buttons map to medium at xsmall, small and default sizes, large at medium size, and extra-large at large and xlarge sizes.

## Shape morphing on interaction (M3 Expressive)

Expressive components change corner radius while pressed or selected, animated with the fast spatial spring (`md.sys.motion.spring.fast.spatial`). Button and icon button values:

| Size | Container height | At rest (round) | Pressed | Selected (round style) |
|---|---|---|---|---|
| xsmall | 32dp | full | small (8) | medium (12) |
| small | 40dp | full | small (8) | medium (12) |
| medium | 56dp | full | medium (12) | large (16) |
| large | 96dp | full | large (16) | extra-large (28) |
| xlarge | 136dp | full | large (16) | extra-large (28) |

For the square style the mapping flips: a selected square button becomes `full`.

Other morphs:
- List items (expressive): rest extra-small, hovered medium, focused, pressed, dragged or selected large.
- Menu items: selected or first/last child medium, rest extra-small.
- Connected button groups and the loading indicator use the shape library morph (one abstract shape blends into another).
- Shape morph uses the expressive motion scheme by default; switch to standard for utilitarian products.

CSS version (round button, press morph with a spring-like curve):

```css
.md-button {
  border-radius: var(--md-sys-shape-corner-full);
  transition: border-radius 350ms cubic-bezier(0.42, 1.67, 0.21, 0.9); /* approximates expressive fast spatial */
}
.md-button:active { border-radius: var(--md-sys-shape-corner-small); }
.md-button[aria-pressed="true"] { border-radius: var(--md-sys-shape-corner-medium); }
@media (prefers-reduced-motion: reduce) {
  .md-button { transition: none; }
}
```

## Customizing

- Change a scale step (for example medium 12 to 10) to restyle every component mapped to it at once; remap one component (for example buttons from full to small) to restyle only that component.
- Corner family can be rounded (default) or cut (straight diagonal). Cut corners clip more content, so add padding on dense components.
- Do not apply large or full corners to information-dense containers such as text-heavy cards; content near the corners gets clipped or looks cramped.
- Nested containers: use optical roundness, inner radius = outer radius - padding. Example: a 48px outer radius with 14px padding gives a 34px inner radius. Never give both the same radius.
- Shape is versatile, not semantic. Do not tie one shape to one meaning; a wavy outline can be a loader today and a button container tomorrow.
- Mixing square and round shapes on purpose creates tension that draws attention; use it for the one element that should stand out, not everywhere.

## Shape library (optional)

- M3 Expressive ships 35 abstract shapes (examples: circle, square, slanted, arch, fan, arrow, semicircle, oval, pill, triangle, diamond, clam shell, pentagon, gem, sunny, very sunny, cookie with 4, 6, 7, 9 or 12 sides, ghost-ish, clover with 4 or 8 leaves, burst, soft burst, boom, soft boom, flower, puffy, puffy diamond, pixel circle, pixel triangle, bun, heart).
- Intended for decorative uses: image crops, avatar masks, hero graphics, loading indicators, empty states. Avoid them on text-heavy containers.
- Available natively in Jetpack Compose and the Figma kit; on the web implement with `clip-path` (polygon or path) or an SVG mask, and morph by animating between paths with the same number of points (for example with `d` path interpolation or a library such as flubber).
- Use sparingly; one or two shape moments per product read as delight, many read as clutter.
