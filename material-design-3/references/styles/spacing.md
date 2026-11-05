# Spacing

Material 3 spacing is a linear scale built on an 8dp unit (space100 = 8dp), with a few nested values (2, 4, 6, 10, 12, 14dp) for tight places inside components.
Apply spacing as padding and gaps on the parent container, use margins only in page layouts, and use the `--md-sys-measurement-space*` properties from `assets/material-tokens.css`.

## Grid

- Layout grid: 8dp. Component heights, paddings between regions and gaps between cards land on multiples of 8 (16, 24, 32, 48, 56, 64).
- Component grid: 4dp. Inside a component (icon to label, text field label offset, chip padding) values can be multiples of 4 (4, 12, 20, 36).
- Touch targets stay at least 48dp x 48dp, which is 6 units. On desktop with pointer input, 40dp is acceptable.
- Text scaled to 200% keeps the same spacing tokens; containers grow instead.
- Leading and trailing swap in RTL. Write `padding-inline-start` and `padding-inline-end` or `margin-inline-*`, not left and right.

## Spacing tokens

Token number = multiplier of 8dp x 100.

| Token (md.sys.measurement.*) | CSS variable | Value |
|---|---|---|
| space0 | --md-sys-measurement-space0 | 0px |
| space25 | --md-sys-measurement-space25 | 2px |
| space50 | --md-sys-measurement-space50 | 4px |
| space75 | --md-sys-measurement-space75 | 6px |
| space100 | --md-sys-measurement-space100 | 8px |
| space125 | --md-sys-measurement-space125 | 10px |
| space150 | --md-sys-measurement-space150 | 12px |
| space175 | --md-sys-measurement-space175 | 14px |
| space200 | --md-sys-measurement-space200 | 16px |
| space250 | --md-sys-measurement-space250 | 20px |
| space300 | --md-sys-measurement-space300 | 24px |
| space400 | --md-sys-measurement-space400 | 32px |
| space450 | --md-sys-measurement-space450 | 36px |
| space500 | --md-sys-measurement-space500 | 40px |
| space600 | --md-sys-measurement-space600 | 48px |
| space700 | --md-sys-measurement-space700 | 56px |
| space800 | --md-sys-measurement-space800 | 64px |
| space900 | --md-sys-measurement-space900 | 72px |

- Need another value? Follow the multiplier rule: space225 = 18px (8 x 2.25). Add it to your theme instead of hardcoding.
- Repeated adaptive patterns (cards and sheets that share the same content padding) deserve a pattern token such as `surface-content.padding.horizontal` that maps to a system token per breakpoint.

## Three kinds of spacing

- Padding: space inside an element between its edge and its content. Named by edge: top, bottom, vertical, leading, trailing, horizontal.
- Gap: space between siblings in a container or grid. Horizontal gap between side by side items, vertical gap between stacked items. Complex components name gaps by their neighbors (icon-label gap).
- Margin: space outside an element, between it and the parent or screen edge. Material components almost never use margins; layouts do.

Rules:
- Put padding and gaps on the parent, not margins on children. One `gap` on a flex or grid container replaces many uneven child margins.
- Use margins only to add space beyond the parent's padding, or for page-level regions (search bar margins, pane margins).
- Define a single horizontal gap and vertical gap for simple components; name gaps per element pair only when they differ.

```css
.list-item {
  display: flex;
  align-items: center;
  gap: var(--md-sys-measurement-space200);                /* 16px between leading element, text, trailing element */
  padding-block: var(--md-sys-measurement-space125);      /* 10px */
  padding-inline: var(--md-sys-measurement-space200);     /* 16px */
}
.card-grid {
  display: grid;
  gap: var(--md-sys-measurement-space100);                /* 8px between cards */
}
```

## When to use 4, 8, 16, 24 and more

| Value | Typical use |
|---|---|
| 2 to 4px | Hairline offsets: focus ring offset (2), badge offset, gap between stacked icon and tiny label, icon-label gap in xsmall buttons (4) |
| 8px | Gap between icon and label in buttons and chips, gap between cards in a grid, gap between chips in a row, vertical padding in search and dense list rows, icon button padding |
| 12px | Gap between icon and label in extended FABs, vertical padding of chips, inner padding of compact containers, list item between-space |
| 16px | Default screen margin on compact windows, card and list item horizontal padding, text field horizontal padding, gap between unrelated items in a column, dialog action row padding |
| 24px | Button horizontal padding (default and medium size), dialog content padding, screen margin on medium and larger windows, gap between sections and panes, search bar margins |
| 32px | Padding of large containers, large icon button padding |
| 48px | Large button horizontal padding, minimum touch target, spacing between major page regions on large screens |
| 56 to 72px | Extra large components (xlarge button padding is 64px), navigation rail width (80 uses 72 + 8), bottom app bar height |

Simple rule: 4 within a control, 8 between related items, 16 between groups and at container edges on phones, 24 between sections and at container edges on tablets and desktop.

## Common component values

Values from the component tokens; all map to the system scale.

| Component | Spacing |
|---|---|
| Button (small / default, 40dp tall) | leading and trailing padding 24 (small: 16), icon-label gap 8 |
| Button medium (56dp) | padding 24, icon-label gap 8 |
| Button large (96dp) | padding 48, icon-label gap 12 |
| Button xlarge (136dp) | padding 64, icon-label gap 16 |
| Button xsmall (32dp) | padding 12, icon-label gap 4 |
| Icon button (default 40dp) | padding 8; narrow 4, wide 14 |
| Icon button medium / large / xlarge | padding 16 / 32 / 48 |
| Extended FAB | leading 16, trailing 20, icon-label gap 12; small 16/16/8; large 28/28/16 |
| List item | horizontal padding 16, vertical padding 10, gap between elements 12; divider inset 16 |
| Search bar | horizontal padding 16, leading icon to label gap 16, container margins 24 |
| Floating toolbar | horizontal padding 8, gap 4, external padding 16 (horizontal) or 24 (vertical) |
| Docked toolbar | horizontal padding 16 |
| Card (content) | 16 padding on all sides; 24 on large windows for prominent content |
| Dialog | 24 padding around title and body, 24 top for icon dialogs, 8 gap between action buttons, actions row padded 24 horizontally and 24 bottom |
| Chip | 8 horizontal padding with icon side, 16 on text-only side, 8 gap between chips |
| Text field | 16 horizontal padding, 8 between field and supporting text, leading/trailing icon 12 from edge |
| Navigation bar item | 12 top padding, 4 between icon and label, 16 bottom |
| Snackbar | 16 horizontal padding, 8 gap to action, 14 vertical padding |
| Screen margins | 16 on compact (under 600dp), 24 on medium and expanded; pane gap 24 |

## Density and adaptive spacing

- Keep horizontal spacing stable and adjust vertical padding for density. Example: a default button uses space125 (10) top padding; a taller brand button remaps to space200 (16); a dense desktop setting drops to space75 (6).
- Map one component attribute to different system tokens per window class instead of forking the component: card padding space200 on compact, space300 on expanded.
- Do not shrink touch targets below 48dp on touch devices even when density is compact; keep the visual size small and extend the target with padding or a pseudo-element.

```css
:root {
  --layout-margin: var(--md-sys-measurement-space200); /* 16px compact */
  --layout-gutter: var(--md-sys-measurement-space200);
}
@media (min-width: 600px) {
  :root {
    --layout-margin: var(--md-sys-measurement-space300); /* 24px medium and up */
    --layout-gutter: var(--md-sys-measurement-space300);
  }
}
.page { padding-inline: var(--layout-margin); }
.panes { display: grid; gap: var(--layout-gutter); }
```

## Checklist

- Every padding, gap and margin is a token, not an arbitrary number.
- Values fall on the 8dp grid at layout level and the 4dp grid inside components.
- Parents own spacing through padding and `gap`; children do not carry margins.
- Logical properties (inline-start, inline-end) for anything that flips in RTL.
- Touch targets at least 48dp (40dp on pointer-first desktop).
- Spacing does not change when text scales.
