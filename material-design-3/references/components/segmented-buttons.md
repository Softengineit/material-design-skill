# Segmented buttons

A segmented button is a single outlined pill split into 2 to 5 segments that lets people pick one option (single-select) or several (multi-select) to choose, switch views or sort.

Status: no longer recommended since the M3 Expressive update (May 2025). New work should use the connected button group (see button-groups.md), which does the same job with the updated look. Keep this reference for maintaining existing UIs or for teams that have not moved to Expressive.

## When to use / when not to use

Use a segmented button for a simple choice between 2 and 5 scoped options: switch between restaurants and bars, pick a drink size, filter by price range, choose Day / Week / Month.

Do not use it:
- For more than 5 options or for complex choices; use chips instead.
- At the full width of a large screen or pane; the labels end up floating in too much padding.
- When you are on M3 Expressive; use the connected button group.

## Variants

- Single-select: exactly one segment is selected at a time. Behaves like a radio group. Example: beverage size.
- Multi-select: any number of segments, from none to all, can be selected. Behaves like a set of checkboxes. Example: price range filter.

Each segment holds label text, an icon, or both. Use one label type for every segment in the set.

## Anatomy

1. Container: fully rounded outline (1dp, md.sys.color.outline) around the whole set.
2. Segments: 2 to 5 equal divisions of the container width, each separated by the outline.
3. Icon (optional): 18dp, leading. When a segment has both icon and label, the icon is replaced by a checkmark when selected.
4. Label text (optional): short, centered, sentence case.
5. Selected icon: a checkmark shown in the selected state so selection is not shown by color alone.
6. State layer and focus indicator per segment.

## Specs

| Attribute | Value |
|---|---|
| Container height | 40dp (density steps remove 4dp each) |
| Container width | fits the labels; set a max width on large screens |
| Segment width | container width divided by the number of segments |
| Corner shape | md.sys.shape.corner.full |
| Outline | 1dp, md.sys.color.outline |
| Horizontal padding per segment | min 12dp |
| Space between icon and label | 8dp |
| Icon size | 18dp |
| Label typescale | md.sys.typescale.label-large |
| Label alignment | center |
| Elevation | level0 at rest, hover, pressed |
| Touch target | 48dp |

Colors (md.comp.outlined-segmented-button.*):

| State | Container | Label and icon |
|---|---|---|
| Unselected | transparent | md.sys.color.on-surface |
| Selected | md.sys.color.secondary-container | md.sys.color.on-secondary-container |
| Disabled | transparent, outline on-surface at 0.12 | on-surface at 0.38 |

## States and interaction

Unselected: enabled, disabled, hovered, focused, pressed. Selected: selected, hovered, focused, pressed.

- Hovered: state layer in the label color at md.sys.state.hover.state-layer-opacity (0.08).
- Focused: state layer at md.sys.state.focus.state-layer-opacity (0.1) plus the focus ring (3dp, md.sys.color.secondary, 2dp outer offset).
- Pressed: the token file maps pressed state layer opacity to md.sys.state.focus.state-layer-opacity (0.1).
- Disabled: label and icon on-surface at 0.38, outline on-surface at 0.12.
- Selecting: container fills with secondary-container, text switches to on-secondary-container, and a checkmark appears (replacing the icon when there is one).
- Single-select: picking a segment deselects the previous one. Multi-select: each segment toggles independently.

## Accessibility

- Single-select: `role="radiogroup"` on the container, each segment `role="radio"` with `aria-checked`. Multi-select: each segment is a `<button aria-pressed>` or `role="checkbox"` with `aria-checked`.
- Keyboard: Tab moves to the component, arrow keys move between segments, Space or Enter selects or unselects the focused segment. In multi-select, Space or Enter can select an unselected segment, unselect a selected one, or select all.
- Initial focus goes to the first segment (left in LTR, right in RTL), whatever the selection state.
- Accessible name: the visible label (Relevance, Distance). For icon-only segments describe the meaning (Inexpensive for one currency symbol).
- Outline contrast with the surface at least 3:1 so segments stay distinguishable.
- Selection must be shown by the checkmark plus color, never color alone.
- Each segment needs a 48dp target; the 40dp container needs extra vertical target space.

## Do / Don't

- Do use 2 to 5 segments. Don't go above 5; use chips.
- Do keep labels short and of similar length (Day, Week, Month). Don't let a segment wrap to a new line.
- Do use one label type for all segments (all text or all icons). Don't mix icon-only and text segments.
- Caution: icon-only segments must be unmistakable (walk, transit, drive).
- Do keep margins from the viewport edge and cap segment padding on wide screens. Don't stretch across a large screen.
- Do place it in bottom sheets or full-screen dialogs when needed.
- Do keep the outline at 3:1 contrast. Don't use a faint outline.

## Minimal implementation

Single-select, three text segments. A framework component should render a radiogroup container and one segment per option, holding the selected value.

```html
<div class="md-segmented" role="radiogroup" aria-label="Period">
  <button type="button" role="radio" aria-checked="true"  class="md-segmented__seg"><span class="md-segmented__check" aria-hidden="true">✓</span>Day</button>
  <button type="button" role="radio" aria-checked="false" class="md-segmented__seg">Week</button>
  <button type="button" role="radio" aria-checked="false" class="md-segmented__seg">Month</button>
</div>
```

```css
.md-segmented {
  display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr;
  height: 40px; max-width: 480px;
  border: 1px solid var(--md-sys-color-outline);
  border-radius: var(--md-sys-shape-corner-full); overflow: hidden;
}
.md-segmented__seg {
  position: relative; isolation: isolate;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-width: 48px; padding: 0 12px; border: none; background: transparent; cursor: pointer;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  white-space: nowrap;
}
.md-segmented__seg + .md-segmented__seg { border-inline-start: 1px solid var(--md-sys-color-outline); }
.md-segmented__seg::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-segmented__seg:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-segmented__seg:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-segmented__seg:focus-visible::after,
.md-segmented__seg:active::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-segmented__seg[aria-checked="true"] { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.md-segmented__check { display: none; font-size: 18px; }
.md-segmented__seg[aria-checked="true"] .md-segmented__check { display: inline; }
.md-segmented__seg:disabled { color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); cursor: default; }
```

## Tokens

- ../tokens/md.comp.outlined-segmented-button.md (full list)
- ../tokens/md.comp.button-group.md (connected button group, the recommended replacement)
- ../tokens/md.sys.state.md, ../tokens/md.sys.typescale.md
