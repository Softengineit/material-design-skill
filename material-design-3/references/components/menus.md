# Menus

A menu is a temporary surface that opens from a control (button, icon button, text field, right-click) and lists a set of choices or actions.

## When to use / when not to use

Use a menu when:
- A set of actions or options is needed only on demand, for example an overflow menu, a select menu, a text field dropdown, or a context menu on an image or on selected text.
- You want to save space compared with a group of radio buttons or chips.
- Options can be single-select or multi-select.

Do not use a menu when:
- Actions must stay visible all the time: use a toolbar.
- On compact screens with many or long options: a bottom sheet gives more room.
- The choice needs rich content per option, or a long explanatory layout: use a dialog or a list.
- Items need direct actions inside them (buttons, switches). A menu item performs exactly one action.

## Variants

- Vertical menu (M3 Expressive, November 2025, recommended): rounded container (corner large), item shape morphing, gaps, submenu motion, two color styles:
  - Standard: surface-based, low emphasis. Container surface-container-low, selected item tertiary-container.
  - Vibrant: tertiary-based, high emphasis. Container tertiary-container, selected item tertiary. Use sparingly.
  Layout options: standard (continuous) or grouped (items separated by a 2dp gap into rounded groups; gaps are not available on web, use dividers instead).
- Menu (baseline): square-ish container (corner extra-small, 4dp), surface-container, 48dp items, selected item secondary-container. Still supported, not the latest style.

Dropdown menu and exposed dropdown menu are both called "menu" in M3, they only differ by the element that opens them.

## Anatomy

Vertical menu:
1. Container
2. Menu item (with leading icon optional, label text, trailing icon optional, badge optional, trailing text optional such as a keyboard shortcut, supporting text optional)
3. Section label text (optional)
4. Gap (optional) or divider (optional) between groups

Baseline menu: container, list item, leading icon, trailing icon, trailing text, divider.

## Specs

Vertical menu (md.comp.menus):

| Part | Value |
| --- | --- |
| Container shape | → md.sys.shape.corner.large (16dp); active (focused submenu) corner large, inactive submenu corner small |
| Container elevation | → md.sys.elevation.level2 at rest, same on hover and pressed |
| Container color, standard | → md.sys.color.surface-container-low |
| Container color, vibrant | → md.sys.color.tertiary-container |
| Item height | 44dp |
| Item padding | leading 16dp, trailing 16dp (space200), top and bottom 8dp (space100), 12dp between elements (space150) |
| Item shape | → md.sys.shape.corner.extra-small; first and last child corner medium on the outer corners; selected corner medium |
| Label text | → md.sys.typescale.label-large |
| Supporting text | → md.sys.typescale.body-small |
| Trailing supporting text | → md.sys.typescale.label-large |
| Leading and trailing icon size | 20dp |
| Label color, standard | → md.sys.color.on-surface; icons and supporting text on-surface-variant |
| Label color, vibrant | → md.sys.color.on-tertiary-container; icons on-tertiary-container |
| Selected item, standard | container tertiary-container, text and icons on-tertiary-container |
| Selected item, vibrant | container tertiary, text and icons on-tertiary |
| Gap between groups | 2dp (space25), group shape corner small, group padding 2dp |
| Focus indicator | → md.sys.color.secondary, 3dp, inner offset -3dp |

Baseline menu (md.comp.menu):

| Part | Value |
| --- | --- |
| Container | → md.sys.color.surface-container, → md.sys.shape.corner.extra-small (4dp), elevation level2, width 112dp min to 280dp max |
| Item height | 48dp, horizontal padding 12dp, 12dp between elements |
| Label | → md.sys.typescale.label-large, → md.sys.color.on-surface |
| Icons | 24dp, → md.sys.color.on-surface-variant |
| Selected item | → md.sys.color.secondary-container, text on-secondary-container |
| Divider | 1dp, → md.sys.color.surface-variant, 8dp padding above and below |

On web, density levels (0 to -3) shrink the top and bottom padding of items.

## States and interaction

| State | Standard style | Vibrant style |
| --- | --- | --- |
| Enabled | label on-surface, icons on-surface-variant | label and icons on-tertiary-container |
| Hover | state layer on-surface 0.08 | state layer on-tertiary-container 0.08, icons tertiary |
| Focus | state layer 0.1, focus ring secondary 3dp | state layer 0.1 on-tertiary-container |
| Pressed | state layer 0.1, ripple | state layer 0.1 |
| Active (item whose submenu is open) | state layer on-surface at 0.08 | state layer on-tertiary-container at 0.08 |
| Selected | container tertiary-container, content on-tertiary-container, shape corner medium | container tertiary, content on-tertiary |
| Disabled | label, icons and texts at 0.38 opacity. Keep disabled items visible instead of removing them | same, 0.38 on on-tertiary-container |
| Selected and disabled | container at 0.38 opacity, text at 0.38 | text at 0.38 |

Behavior:
- Opens below, beside or in front of its trigger. If it would be cut off, flip to the other side (above, left or right). At the top of the screen it expands downward.
- While open, the trigger keeps its look and shows a pressed state, even when opened by keyboard shortcut. Choosing an item does not change the trigger icon.
- Enter and exit transitions link the menu to its trigger. On dense desktop UIs, menus can open instantly.
- Submenus open beside the parent item, never over it. When focus moves between submenus, the active one gets corner large and the inactive one corner small.
- Single-select: picking an item unselects the previous one and usually closes the menu. Multi-select: the menu stays open until dismissed.
- Scrollable menus show a persistent scrollbar and must not use gaps.
- A text field inside the menu can filter items (autocomplete); items ease to their new positions.

## Accessibility

- Web roles: `role="menu"` on the container, `role="menuitem"` (or `menuitemradio` / `menuitemcheckbox` for selectable items with `aria-checked`) on items. The trigger has `aria-haspopup="menu"` and `aria-expanded`. Each item's accessible name equals its visible text; icons are decorative (`aria-hidden="true"`).
- Initial focus goes to the first item when the menu opens.
- Keyboard: Tab lands on the menu trigger. Space or Enter opens a closed menu, or activates the focused item. Up and Down arrows open a closed menu, or move focus between items. Left and Right open or close a submenu. Typing a letter jumps to the next item starting with it. Escape closes the menu.
- Closing: selecting an item, Escape, clicking outside, or the system back button. Where focus returns afterward is up to the app, usually the trigger.
- Disabled items can receive focus but cannot be activated. Dividers and gaps are never focusable.
- Selected items must be shown with more than color: shape change plus a checkmark is recommended. Contrast between selected and unselected items is at least 3:1.
- Targets are at least 48x48dp (the 44dp item height still needs a 48dp hit area). Do not put buttons or switches inside items.

## Do / Don't

- Do show an unavailable action as a disabled item (for example "Redo") rather than hiding it.
- Do group related items with one or two gaps (Android) or dividers (web, scrollable menus, text field dropdowns).
- Don't change the gap size, and don't use gaps in a scrollable menu.
- Do place submenus beside the parent item on large screens.
- Don't rely on submenus on mobile; use a bottom sheet or a new screen.
- Do let disabled items receive focus.
- Don't let a divider or gap receive focus.
- Do use the vibrant style only for a few prominent menus.
- Don't add slots with multiple actions; keep each item to a single action and standard padding.

## Minimal implementation

```html
<button class="md-menu-trigger" aria-haspopup="menu" aria-expanded="true" aria-controls="m1">More</button>
<div class="md-menu" id="m1" role="menu" aria-label="More options">
  <div class="md-menu-item" role="menuitem" tabindex="0">
    <span class="md-menu-item__icon material-symbols-outlined" aria-hidden="true">content_cut</span>
    <span class="md-menu-item__label">Cut</span>
    <span class="md-menu-item__trailing">Ctrl+X</span>
  </div>
  <div class="md-menu-item" role="menuitemradio" aria-checked="true" tabindex="-1">
    <span class="md-menu-item__icon material-symbols-outlined" aria-hidden="true">check</span>
    <span class="md-menu-item__label">Single spacing</span>
  </div>
  <div class="md-menu-item" role="menuitem" aria-disabled="true" tabindex="-1">
    <span class="md-menu-item__label">Redo</span>
  </div>
</div>
```

```css
.md-menu { display: flex; flex-direction: column; min-width: 112px; max-width: 280px; padding: 4px;
  background: var(--md-sys-color-surface-container-low); border-radius: var(--md-sys-shape-corner-large);
  box-shadow: var(--md-sys-elevation-level2); }
.md-menu-item { position: relative; display: flex; align-items: center; gap: 12px; height: 44px;
  padding: 8px 16px; border-radius: var(--md-sys-shape-corner-extra-small); cursor: pointer;
  color: var(--md-sys-color-on-surface); font: var(--md-sys-typescale-label-large-weight)
  var(--md-sys-typescale-label-large-size)/var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font); }
.md-menu-item:first-child { border-radius: var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium)
  var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small); }
.md-menu-item:last-child { border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small)
  var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium); }
.md-menu-item::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; }
.md-menu-item:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-menu-item:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-menu-item:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-menu-item__icon { font-size: 20px; color: var(--md-sys-color-on-surface-variant); }
.md-menu-item__label { flex: 1; }
.md-menu-item__trailing { color: var(--md-sys-color-on-surface-variant); }
.md-menu-item[aria-checked="true"] { background: var(--md-sys-color-tertiary-container);
  color: var(--md-sys-color-on-tertiary-container); border-radius: var(--md-sys-shape-corner-medium); }
.md-menu-item[aria-checked="true"] .md-menu-item__icon { color: inherit; }
.md-menu-item[aria-disabled="true"] { opacity: 0.38; pointer-events: none; }
```

A React or Vue component should manage: open state tied to the trigger, positioning with flip, roving focus with arrow keys and type-ahead, Escape and outside click to close, `vibrant` and `grouped` props, and `selectionMode` (none, single, multi).

## Tokens

Vertical menu: ../tokens/md.comp.menus.md (standard and vibrant sets, horizontal menu set). Baseline menu: ../tokens/md.comp.menu.md.
