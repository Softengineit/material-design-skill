# Lists

A list is a continuous vertical column of items (text, icons, images, controls) that people scan to find one item and act on it.

## When to use / when not to use

Use a list when:
- People need to find a specific item in a set and act on it (open, select, toggle).
- Items share the same structure and can be ordered logically (alphabetical, by date, by number).
- Content is short enough to scan: a label, optional supporting text, a leading visual, a trailing action.

Do not use a list when:
- Each item needs rich content and several actions of its own: use cards.
- Items are browsed horizontally as a collection of visuals: use a carousel.
- You need a temporary set of choices that opens from a control: use a menu.
- On large screens, consider swapping the list for cards or a list-detail layout.

## Variants

- Expressive list (recommended for new designs, M3 Expressive, December 2025): rounded containers, highlighted selection state, support for custom slots. Two visual styles:
  - Standard: items sit on one shared surface.
  - Segmented: each item is a separate filled container, separated by a 2dp gap (md.comp.list.segmented.gap). Visual choice only, same behavior.
- Baseline list: square corners, standard colors, no shape morphing on selection. Still available, not recommended for new work.

Selection modes (one mode per list at a time):
- Single-action: the whole item is one tap target (for example navigation). No persistent selected state.
- Multi-action: a primary action plus one or more secondary actions in the trailing position (icon button, overflow menu).
- Single-select: one item at a time, pair with radio buttons. No nested secondary actions.
- Multi-select: several items on, pair with checkboxes or switches. No nested secondary actions.
- Non-interactive: pure information, nothing to tap.

Interactions: expand and collapse (parent-child, container transform), swipe to reveal (Android Views only).

## Subheaders and sections

A list can be split into sections. Each section starts with a subheader: one line of text in `title-small` (14px, weight 500) colored `on-surface-variant`, 16px side padding, 48px row height (or 16px top padding and 8px bottom padding when placed between items). Subheaders are not interactive and are not list items: use a heading element (`<h2>` or `<h3>`) or `role="presentation"` on a `<li>` inside the `<ul>`, so screen readers do not count them as choices. Separate sections with a full-width divider or with 8px of vertical space, not both.

## Anatomy

Required: container, label text. Optional:
- Overline (label-small, above the label)
- Supporting text (body-medium, below the label, 1 to 3 lines)
- Trailing supporting text (label-small, for meta info like a date or price)
- Trailing icon or icon button
- Trailing selection control (checkbox, radio button, switch)
- Leading avatar (40dp, corner full, primary-container with on-primary-container initials)
- Leading icon (24dp, 20dp in expressive)
- Leading image (56x56) or video thumbnail (100x56 small, 114x64 large)
- Divider (1dp, outline, inset 16dp each side)

Slot model: leading slot, content slot, trailing slot. The content slot must be the widest. Slots require custom code and are not accessible by default.

## Specs

| Size / part | Value |
| --- | --- |
| One-line item height | 56dp (md.comp.list.list-item.one-line.container.height) |
| Two-line item height | 72dp |
| Three-line item height | 88dp |
| Item padding | leading 16dp, trailing 16dp (space200), top and bottom 10dp (space125), gap between slots 12dp (space150) |
| Container color | → md.sys.color.surface |
| Container shape, baseline | → md.sys.shape.corner.none |
| Container shape, expressive unselected | → md.sys.shape.corner.extra-small (4dp inner corners, 16dp outer corners of the group) |
| Container shape, expressive selected | → md.sys.shape.corner.large (16dp all around) |
| Container elevation | level0 at rest, level4 when dragged |
| Label text | → md.sys.typescale.body-large, color → md.sys.color.on-surface |
| Supporting text | → md.sys.typescale.body-medium, color → md.sys.color.on-surface-variant |
| Overline | → md.sys.typescale.label-small, on-surface-variant |
| Trailing supporting text | → md.sys.typescale.label-small, on-surface-variant |
| Leading icon | 24dp (20dp expressive), → md.sys.color.on-surface-variant |
| Trailing icon | 24dp (20dp expressive), → md.sys.color.on-surface-variant |
| Leading avatar | 40dp, → md.sys.shape.corner.full, primary-container, label title-medium on-primary-container |
| Leading image | 56x56dp, corner none (baseline) or corner small (expressive) |
| Selected container | → md.sys.color.secondary-container, text → md.sys.color.on-secondary-container |
| Divider | 1dp, → md.sys.color.outline, leading/trailing space 16dp |
| Focus indicator | → md.sys.color.secondary, 3dp thick, inner offset -3dp |
| Touch target | 48dp minimum |

Vertical alignment: elements are centered. If the item is 88dp or taller, or has three or more text lines, elements align to the top (leading icon top padding 8dp, 12dp at 88dp+).

## States and interaction

State layer color is on-surface for unselected and selected items.

| State | What changes |
| --- | --- |
| Enabled | Default colors above |
| Hover | State layer opacity 0.08 (md.sys.state.hover.state-layer-opacity). Expressive shape becomes corner medium (12dp) |
| Focus | State layer opacity 0.1, focus ring secondary 3dp. Expressive shape becomes corner large |
| Pressed | State layer opacity 0.1, ripple. Expressive shape becomes corner large |
| Dragged | State layer opacity 0.16, elevation level4, shape corner large |
| Selected | Container secondary-container, text and icons on-secondary-container, shape morphs to corner large (16dp) |
| Disabled | Label, icons, supporting text at 0.38 opacity on on-surface; state layer opacity 0.1. Selected and disabled: container on-surface at 0.38 opacity |
| Reorder (drag) | Container tertiary-container, content on-tertiary-container, drop zone surface-container-low |

The selected state applies to the whole item: when a checkbox in the item is checked, the item container changes too.

## Accessibility

- Web roles: container `role="listbox"` for selectable lists (its label should say what kind of selection is possible), each item `role="option"` with `aria-selected`. Plain navigation lists use `<ul>` / `<li>` with a link or button inside. Multi-action items are not selectable as a whole, only their inner actions are.
- The accessible name of an item is its label text plus supporting text.
- Keyboard: Tab moves focus into the list (first item, or the selected item if there is one) and out of it. Down and Right arrow move to the next element and wrap to the top; Up and Left move to the previous element and wrap to the bottom. Space or Enter activates the focused item or action. In multi-action lists, arrows also move between the actions inside one item.
- Do not rely on color alone for selection. Add a checkmark, a checkbox or radio, or another non-color cue.
- Each target is at least 48x48dp. Avoid interactive elements in slots that make the item hard to navigate with a screen reader.
- Swipe actions must have an alternative such as a "more" icon button (single tap, double tap or long press).

## Do / Don't

- Do place supporting visuals (thumbnails, avatars) at the leading edge so the eye can scan one column.
- Don't put visuals in the middle of a row, it breaks alignment of names and values.
- Do use one selection interaction per item (a checkmark OR a trailing control, not both).
- Don't mix checkboxes into a single-select list or radio buttons into a multi-select list.
- Do use segmented gaps and filled items to define groups in contained lists.
- Don't overuse dividers, keep them for uncontained or complex lists.
- Do keep supporting text to one to three lines and truncate when the screen is narrow.
- Do adjust margins or switch to two columns on wide screens so lines stay between 40 and 60 characters (up to 120 on large screens).
- Don't scale a list wider without adjusting text length.
- Do use circular or expressive shapes for people avatars, square shapes for products or videos.

## Minimal implementation

```html
<ul class="md-list" role="listbox" aria-label="Choose a bread">
  <li class="md-list-item" role="option" aria-selected="true" tabindex="0">
    <span class="md-list-item__leading material-symbols-outlined">check</span>
    <span class="md-list-item__content">
      <span class="md-list-item__label">Sourdough</span>
      <span class="md-list-item__supporting">Baked this morning</span>
    </span>
    <span class="md-list-item__trailing">4.50</span>
  </li>
  <li class="md-list-item" role="option" aria-selected="false" tabindex="-1">
    <span class="md-list-item__content">
      <span class="md-list-item__label">Wheat</span>
    </span>
  </li>
</ul>
```

```css
.md-list { list-style: none; margin: 0; padding: 0; background: var(--md-sys-color-surface);
  border-radius: var(--md-sys-shape-corner-large); display: flex; flex-direction: column; gap: 2px; }
.md-list-item { position: relative; display: flex; align-items: center; gap: 12px; min-height: 56px;
  padding: 10px 16px; border-radius: var(--md-sys-shape-corner-extra-small); cursor: pointer;
  color: var(--md-sys-color-on-surface); font: var(--md-sys-typescale-body-large-weight)
  var(--md-sys-typescale-body-large-size)/var(--md-sys-typescale-body-large-line-height) var(--md-sys-typescale-body-large-font); }
.md-list-item::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: currentColor; opacity: 0; pointer-events: none; }
.md-list-item:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); border-radius: var(--md-sys-shape-corner-medium); }
.md-list-item:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; border-radius: var(--md-sys-shape-corner-large); }
.md-list-item:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-list-item[aria-selected="true"] { background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container); border-radius: var(--md-sys-shape-corner-large); }
.md-list-item__content { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.md-list-item__supporting { font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height); color: var(--md-sys-color-on-surface-variant); }
.md-list-item[aria-selected="true"] .md-list-item__supporting { color: inherit; }
.md-list-item__leading, .md-list-item__trailing { color: var(--md-sys-color-on-surface-variant); flex: none; }
.md-list-item__trailing { font-size: var(--md-sys-typescale-label-small-size); }
.md-list-item[aria-disabled="true"] { opacity: 0.38; pointer-events: none; }
```

A React or Vue component should expose: `items`, `selectionMode` (single-action, multi-action, single-select, multi-select), `selected`, `segmented` boolean, and slots for leading, content and trailing. Handle arrow key roving focus on the container.

## Tokens

Full token list: ../tokens/md.comp.list.md (common set, includes expressive, expand, reorder and reveal tokens). System values: ../tokens/md.sys.state.md, ../tokens/md.sys.shape.md, ../tokens/md.sys.measurement.md.
