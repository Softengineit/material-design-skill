# Button groups

A button group is an invisible container that lays out related buttons or icon buttons in one row and changes their shape, width and spacing when they are pressed or selected.

## When to use / when not to use

Use a button group when several actions belong together and should read as one set, for example Back, Pause, Next in a media player, or a row of filters.

- Standard group: for related actions that react to each other. Buttons animate width and shape and nudge their neighbors.
- Connected group: for picking options, switching views or sorting content. It replaces the segmented button, which is no longer recommended. Use it only with toggle buttons in a single-select or multi-select pattern. Do not use a connected group when none of the buttons can be toggled.

Do not put standard icon buttons or text buttons in a group; they have no container, so the shape change is invisible. Buttons placed outside the group are not affected by the group.

## Variants

- Standard button group: buttons keep their own shape and color style. On press or selection the pressed button grows wider (15% width multiplier) and morphs shape, and the adjacent buttons briefly shrink. The group hugs the width of its buttons. Works with filled, tonal, outlined and elevated styles, and with button sizes XS to XL.
- Connected button group: buttons sit 2dp apart with a shared outer shape (fully round, or square with a size-based radius) and small inner corners. Selecting a button only changes that button's shape; neighbors do not move. Should span the width of its parent surface, with a max width on large windows.

Configurations for both: size XS, S, M, L, XL; default shape round or square; selection mode single-select, multi-select, or selection-required.

## Anatomy

1. Container: invisible, adds padding between buttons and sets shape rules. It has no color tokens and holds no buttons by default.
2. Children: buttons and icon buttons (any mix). Common layouts: label buttons only, label buttons plus icon buttons, extra small icon buttons, large icon buttons.

Color comes entirely from the child button style (filled, tonal, outlined, elevated, or the toggle versions).

## Specs

Standard button group (md.comp.button-group.standard.*):

| Size | Container height | Space between buttons | Pressed width multiplier |
|---|---|---|---|
| XS | 32dp | 18dp | 15% |
| S | 40dp | 12dp (space150) | 15% |
| M | 56dp | 8dp (space100) | 15% |
| L | 96dp | 8dp (space100) | 15% |
| XL | 136dp | 8dp (space100) | 15% |

The larger gap on XS and S keeps each 48dp touch target clear. Width animation uses md.sys.motion.spring.fast.spatial.stiffness and .damping.

Connected button group (md.comp.button-group.connected.*):

| Size | Container height | Space between | Outer shape | Inner corner at rest | Inner corner pressed | Inner corner selected |
|---|---|---|---|---|---|---|
| XS | 32dp | 2dp (space25) | corner.full | corner-value.small (8dp) | corner-value.extra-small (4dp) | 50% |
| S | 40dp | 2dp | corner.full | corner-value.small (8dp) | corner-value.extra-small (4dp) | 50% |
| M | 56dp | 2dp | corner.full | corner-value.small (8dp) | corner-value.extra-small (4dp) | 50% |
| L | 96dp | 2dp | corner.full | corner-value.large (16dp) | corner-value.medium (12dp) | 50% |
| XL | 136dp | 2dp | corner.full | corner-value.large-increased (20dp) | corner-value.large (16dp) | 50% |

The guideline page lists the inner (and square-outer) corners as XS 4dp, S 8dp, M 8dp, L 16dp, XL 20dp; the token file gives 8dp for XS. Use the tokens in code. XS and S connected groups have a minimum width of 48dp per button.

Heights, paddings, label typescales and colors of each button come from the button and icon button specs (see buttons.md and icon-buttons.md).

## States and interaction

Each child button uses its own state tokens (hover 0.08, focus 0.1, pressed 0.1 state layer, disabled 0.38 label on 0.1 container).

- Standard group, pressed: the pressed button widens by 15% and morphs to its pressed corner; adjacent buttons shrink to compensate, then everything springs back.
- Standard group, selected toggle: the button switches round to square (or square to round) and takes the selected colors from the button spec.
- Connected group, unselected states: enabled, disabled, hovered, focused, pressed. Pressed only reduces that button's inner corner.
- Connected group, selected states: enabled, hovered, focused, pressed. Selected inner corners become 50% (fully round on that side).
- Density: the group height follows the density of its children (0 to -3).

## Accessibility

- The container is not focusable and needs no label. Use a plain `<div>` for a standard group; for a connected single-select group use `role="radiogroup"` with `aria-checked` on children, or `aria-pressed` on each toggle button in multi-select.
- Initial focus lands on the first button, not the container.
- Keyboard: Tab enters the group (first button), arrow keys move between buttons, Space or Enter activates or selects the focused button.
- Every button needs a 48x48dp target. Do not reduce the XS and S inner padding.
- Label each button following the button and icon button guidance (icon buttons need `aria-label`).
- Keep the same DOM order at every breakpoint; buttons that collapse into an overflow menu go at the trailing end.

## Do / Don't

- Do keep every button in a group the same size and the same shape; change width and color instead.
- Do use connected groups for closely related, selectable options (sizes, view modes, filters).
- Don't mix color styles inside a connected group; selection becomes unclear.
- Don't mix sizes often; reserve it for a hero moment. Reserve a different shape for the selected button or for real contrast.
- Don't let a group wrap to a second line; stack several groups instead (they do not interact vertically).
- Don't stretch icon buttons past the "wide" width setting.
- Do add a max width to a connected group on large windows.
- Do keep the primary action the largest or most prominent button at every breakpoint.

## Minimal implementation

Connected button group, small size, single-select, tonal toggle buttons. A framework component should render a container with one button per option and track the selected index.

```html
<div class="md-btn-group md-btn-group--connected" role="radiogroup" aria-label="Transport mode">
  <button type="button" role="radio" aria-checked="true"  class="md-seg">Walk</button>
  <button type="button" role="radio" aria-checked="false" class="md-seg">Bike</button>
  <button type="button" role="radio" aria-checked="false" class="md-seg">Drive</button>
</div>
```

```css
.md-btn-group--connected {
  display: flex; gap: var(--md-sys-measurement-space25); /* 2dp */
  height: 40px; width: 100%; max-width: 480px;
}
.md-seg {
  position: relative; isolation: isolate; overflow: hidden;
  flex: 1; min-width: 48px; border: none; cursor: pointer;
  background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
  font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) / var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font);
  border-radius: var(--md-sys-shape-corner-small); /* inner corners 8dp */
  transition: border-radius var(--md-sys-motion-duration-short3);
}
.md-seg:first-child { border-start-start-radius: var(--md-sys-shape-corner-full); border-end-start-radius: var(--md-sys-shape-corner-full); }
.md-seg:last-child  { border-start-end-radius: var(--md-sys-shape-corner-full); border-end-end-radius: var(--md-sys-shape-corner-full); }
.md-seg::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-seg:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-seg:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-seg:active { border-radius: var(--md-sys-shape-corner-extra-small); }
.md-seg[aria-checked="true"] {
  background: var(--md-sys-color-secondary); color: var(--md-sys-color-on-secondary);
  border-radius: var(--md-sys-shape-corner-full);
}
```

For a standard group, use `gap: 12px` (small size), let each child be a normal button, and animate `flex-grow` of the pressed item by 15% with a spring-like transition.

## Tokens

- ../tokens/md.comp.button-group.md (standard and connected, all sizes)
- ../tokens/md.comp.button.md and ../tokens/md.comp.icon-button.md (child button sizes, colors, shapes)
- ../tokens/md.sys.motion.md (fast spatial spring)
