# Interaction states, inputs and selection

How an M3 component shows what it is doing (enabled, hover, focus, pressed, dragged, disabled, selected) and how it responds to touch, pointer and keyboard.
State visuals come from a translucent state layer in the content color, plus a focus ring and optional elevation.

## The states

| State | Meaning | Visual |
|---|---|---|
| Enabled | interactive, resting | default styling |
| Disabled | not interactive | reduced color and elevation, no state layer, not focusable |
| Hover | cursor is over it | state layer 8% |
| Focused | reached by keyboard or voice | state layer 10% plus focus ring |
| Pressed | tap or click in progress | ripple state layer 10%, sometimes elevation change |
| Dragged | pressed and moved | state layer 16%, often elevation |
| Selected | chosen from a set | checkmark, checkbox, surface color change, or active indicator |
| Activated | current destination or active item | active indicator in navigation and tabs |
| Error | invalid input | error color on outline, label, supporting text, icon |

Rules that apply to all states:
- Every state must have two visual cues (for example color change plus icon, or state layer plus ring) so it does not rely on color alone.
- Apply states the same way on every component.
- States combine: selected + hover, selected + focused, pressed + focused, activated + hover.
- At most one element hovered, one focused, one pressed and one dragged at a time per layout. Any number of disabled elements.

## State layers

- A state layer is a semi-transparent overlay between the container and the content. It takes the color of the content (the "on" color: on-secondary-container for a secondary-container button, primary for a surface container with primary text) and a fixed opacity per state.
- Only one state layer at a time per element.
- The state layer covers the whole component, an element inside it, or a circle over part of it (icon buttons, checkboxes, radio buttons).
- State layer circle size is 40 dp; the interactive target is 48 dp.

| State | State layer opacity |
|---|---|
| Hover | 8% |
| Focus | 10% |
| Pressed | 10% |
| Dragged | 16% |

Disabled values (from the M3 component token specs; not contrast checked, since disabled is exempt):

| Part | Disabled |
|---|---|
| Container | on-surface at 12% opacity |
| Content (label, icon, outline) | on-surface at 38% opacity |

- Hover appears and disappears with a short fade.
- Pressed uses a ripple that starts at the pointer position and fills the shape.
- In code: implement with a `::before` pseudo-element: `position: absolute; inset: 0; background: currentColor; opacity: 0; transition: opacity 150ms;` then `:hover::before { opacity: 0.08 }`, `:focus-visible::before { opacity: 0.10 }`, `:active::before { opacity: 0.10 }`, `[data-dragged]::before { opacity: 0.16 }`. Set `color` to the on-color so `currentColor` is right.
- In code (tokens): `--md-sys-state-hover-state-layer-opacity: 0.08; --md-sys-state-focus-state-layer-opacity: 0.10; --md-sys-state-pressed-state-layer-opacity: 0.10; --md-sys-state-dragged-state-layer-opacity: 0.16;`.
- In code (disabled): `button:disabled { background: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent); color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); box-shadow: none; pointer-events: none; }`.

## Focus ring

- Keyboard focus shows a ring around the component in addition to the focus state layer. The ring is 3 dp thick, drawn outside the component with a small offset, in a high contrast color (secondary or primary depending on the component).
- Pointer clicks do not need the ring; keyboard and voice focus do.
- In code: `:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }`. Never remove the outline without replacing it.

## Which components take which states

| State | Inherited by | Not inherited by |
|---|---|---|
| Disabled | buttons, cards, checkboxes, chips, list items, radio buttons, switches, text fields | app bars, badges, dialogs, FABs, menus, navigation bar/drawer/rail, sheets, tabs, tooltips |
| Hover | buttons, cards, checkbox, chips, date and time pickers, list items, slider, switch, text fields | app bars, badges, dialogs, menus, navigation bar/drawer/rail, sheets, tabs |
| Focused | buttons, cards, checkbox, chips, date and time pickers, list items, selection controls, text fields | app bars, badges, banner, dialogs, navigation bar/drawer/rail, sheets |
| Pressed | buttons, cards, checkbox, chips, list items, text fields | app bars, badges, bottom navigation, dialogs, menus, sheets, tabs |
| Dragged | cards, chips, list items, sliders | app bars, badges, buttons, dialogs, menus, navigation bar/drawer/rail |

- The interactive items inside a container (the icon buttons in an app bar, the items in a menu, the destinations in a navigation bar) get the state, never the whole container.
- If a FAB's action is unavailable, remove the FAB instead of disabling it.
- Components that need a fixed position (app bars) never get a dragged state.
- Disabled elements cannot be focused, pressed or dragged and show no hover.
- In code: put hover and focus styles on the `<button>` inside `<header>`, not on `<header>`; use the `disabled` attribute (or `aria-disabled="true"` when the element must stay in the tab order to explain why).

## Selection

- Selection is shown by a checkmark icon, a checkbox, a change of surface color, or a mix.
- Components with a selected state: cards, checkboxes, chips, data tables, icon buttons, list items, menu items, pickers, radio buttons, segmented buttons, sliders, switch.
- Components with an active indicator (only one item selected at a time): navigation bar, navigation drawer, navigation rail, tabs. Indicator color and shape vary per component.
- Selection works by tap, cursor, keyboard and voice.

Touch:
- Enter selection mode with a long press or a shortcut such as tapping an avatar. Tap other items to add them. Exit by unselecting every item or by running a toolbar action.
- Long press and drag selects a batch. Do not use that combination for batch selection if it already means pick up and move (cards, calendar events).

Pointer (desktop):
- If selection is the primary task (a data table of rows to act on), show checkboxes always.
- If selection is secondary, show a checkbox on an item when hovered, and show checkboxes on all items once one is selected.
- In code: `aria-selected`, `aria-checked` or `aria-pressed` on the item; `role="listbox"` or `role="grid"` with `aria-multiselectable="true"` on the container; show the checkbox with `.row:hover .checkbox, .list[data-has-selection] .checkbox { visibility: visible }`.

## Gestures (touch)

| Gesture | Expected result |
|---|---|
| Tap | navigate or activate |
| Double tap | zoom in or out |
| Long press | reveal extra options, enter selection mode |
| Scroll and pan | move through content vertically, horizontally or freely |
| Swipe | move between peer views (tabs) or reveal actions on a list item |
| Drag | reorder, move an element, slide surfaces in and out |
| Pick up and move (long press then drag) | reorder content |
| Pinch | scale, open to full screen |
| Compound (pan then pinch) | maps and canvases |
| Predictive back (Android) | swipe from the edge previews the previous screen; user can commit or cancel. Works on bottom sheet, navigation bar, navigation rail, search bar, side sheet |

- Elements must respond to gestures in real time, following the finger.
- Swipe actions and predictive back mirror in RTL.
- In code: use Pointer Events (`pointerdown`, `pointermove`, `pointerup`) with `touch-action` set on the element so the browser does not fight the gesture; keep native scrolling where possible.

## Inputs (mouse, trackpad, stylus, keyboard)

- Any device can get an external mouse, trackpad, stylus or keyboard. Design for touch, pointer and keyboard on every breakpoint.

| Input event | Expected behavior |
|---|---|
| Mouse or trackpad moves | show a cursor |
| Primary click | same feedback as a tap (ripple), but can be handled separately from touch |
| Secondary click (right click, two-finger click) | open a context menu with options for the clicked object |
| Hover | show hover state; show a tooltip where one exists |
| Click and drag over text | select text, highlight in one color, no touch handles |
| Mouse wheel, two-finger drag | scroll vertically; horizontal scroll on carousels and horizontal fields |
| Trackpad pinch | zoom |
| Physical keyboard attached | hide the virtual keyboard; show it again when detached |

Cursors:
- Default: arrow pointer.
- Links and clickable images: hand.
- Edges of resizable elements: resize arrows.
- Over text: I-beam. Single click places the caret, double click selects a word, triple click selects a paragraph.
- Stylus: usually no cursor, unless it shows brush size or shape.
- In code: `cursor: pointer` on links and clickable images only (not on every button, which keeps the default arrow in M3), `cursor: col-resize` or `row-resize` on drag handles, `cursor: text` is automatic on text.

Text selection:
- Touch selection always shows touch handles, even with a mouse attached.
- Mouse, trackpad or stylus selection shows the I-beam and a right-click context menu, even on a touch device.
- Touch drag in a text area scrolls; mouse drag selects.
- In code: use `::selection { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); }` for a single highlight color.

Keyboard conventions:
- Enter: activate the focused button or link, submit a form, send a message.
- Space: play or pause media; toggle switches and checkboxes.
- Tab and Shift+Tab: move focus in logical order (left to right, top to bottom); focused element shows the focus ring.
- Arrow keys: move within a composite component (menu, tabs, grid, radio group, slider).
- Escape: close menus, dialogs, bottom sheets and other modals; drop focus and selection; hide the text caret without deleting typed text.
- Shortcuts: two or more keys by default; document them; a single-key shortcut must be remappable, scoped to a focused component, or at least switchable off.
- In code: handle `keydown` for `Escape` on every overlay; use `role="menu"` with roving `tabindex` and arrow-key handlers; never rely on `click` alone for custom controls.
