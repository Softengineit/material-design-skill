# FAB menu

A FAB menu opens from a FAB and shows 2 to 6 related actions as large pill-shaped items floating above the content, with the FAB turned into a close button.

## When to use / when not to use

Use a FAB menu when the primary action of a screen has several closely related options, for example Share with 3 to 5 targets, or New with playlist, collection and station. It replaces the M2 speed dial and any stack of small FABs.

Do not use it:
- With a single item. Use a plain FAB.
- For unrelated actions grouped under one FAB.
- Opened from an extended FAB or any component other than a FAB.
- When the FAB sits next to a floating toolbar or a navigation rail; the extra layer adds clutter. A plain FAB is fine there.

## Variants

One variant, one size. It pairs with any FAB size (FAB, medium, large).

Three color sets. Match the set to the FAB color style:
- Primary set: for primary or primary-container FABs. Close button primary / on-primary, items primary-container / on-primary-container.
- Secondary set: for secondary or secondary-container FABs. Close button secondary / on-secondary, items secondary-container / on-secondary-container.
- Tertiary set: for tertiary or tertiary-container FABs. Close button tertiary / on-tertiary, items tertiary-container / on-tertiary-container.

On web the FAB menu is built from a FAB plus the standard menu component, so it inherits menu specs and states; the recommended gap between FAB and menu is 4dp.

## Anatomy

1. Close button: 56dp circle that takes the place of the FAB and shares its top trailing corner as anchor. Contrasting color (the "tone" role, for example primary) against the items.
2. Menu items (2 to 6): fully rounded list items with a leading icon and a label, stacked above the close button, aligned to the trailing edge. Each item hugs its content; widths differ by label length.
3. State layers and focus indicators on the close button and on each item.

Icons differentiate the items; keep them unless there is a real reason. Labels are mandatory.

## Specs

| Element | Height | Width | Corner shape | Icon size | Label typescale | Leading / trailing space | Icon-label gap | Gap to next element | Elevation rest / hover / focus / pressed |
|---|---|---|---|---|---|---|---|---|---|
| Close button | 56dp | 56dp | md.sys.shape.corner.full | 20dp | none | centered | none | 8dp (space100) above it to the first item | level3 / level4 / level3 / level3 |
| Menu item | 56dp | hugs content, min 48dp | md.sys.shape.corner.full | 24dp | md.sys.typescale.title-medium | 24dp (space300) | 8dp (space100) | 4dp (space50) between items | level0 at rest; level4 hover, level3 focus and pressed |

Menu item measurements equal the medium button spec. Shadow color md.sys.color.shadow.

| Color set | Close button container / icon | Item container / icon and label |
|---|---|---|
| Primary | md.sys.color.primary / on-primary | md.sys.color.primary-container / on-primary-container |
| Secondary | md.sys.color.secondary / on-secondary | md.sys.color.secondary-container / on-secondary-container |
| Tertiary | md.sys.color.tertiary / on-tertiary | md.sys.color.tertiary-container / on-tertiary-container |

Placement: the FAB keeps 16dp margins (24dp in large and extra large windows). The close button aligns with the top of the original FAB, so with a medium FAB the menu bottom margin is 40dp and with a large FAB it is 56dp.

## States and interaction

Close button: enabled, hovered (state layer 0.08, elevation level4), focused (state layer 0.1, level3), pressed (state layer 0.1, level3). State layer color equals the icon color.

Menu item: enabled (level0), hovered (state layer 0.08, level4), focused (state layer 0.1, level3), pressed (state layer 0.1, level3). State layer color equals the item label color.

Behaviors:
- Opening: the FAB morphs into the close button; items appear with the enter transition, starting from the FAB's top trailing corner.
- Scrolling: when the window is short (landscape phone), items scroll, and they scroll behind the close button, never over it.
- Expanding: an item can morph into any surface with the container transform pattern.
- RTL: anchor to the left edge and mirror icon and label order.
- The menu must never fully cover another interactive element and its focus indicator.

## Accessibility

- Close button: role button, label "Toggle menu", with `aria-expanded="true|false"`. On web, the FAB that opens the menu should have `aria-haspopup="menu"` and `aria-controls` pointing at the menu, and its label should describe the menu it opens.
- Items: role button (or `menuitem` inside `role="menu"` on web), accessible name equal to the visible text ("Reply all").
- Initial focus stays on the close button when the menu opens, then moves through items from top to bottom.
- Keyboard: Tab moves to the next interactive element, Space or Enter activates the focused button or item. On web, follow menu keyboard rules (arrow keys, Escape closes).
- All elements are at least 48x48dp with enough spacing by default.
- Keep the close button reachable and unobstructed at all times.

## Do / Don't

- Do use 2 to 6 items. Don't open a menu with one item.
- Do keep the icon and the label on every item. Don't drop labels; only drop icons when unavoidable.
- Do let each item hug its text with equal padding. Don't force equal widths or fixed widths, and don't truncate.
- Do keep every element fully rounded. Don't change the shapes to square.
- Do pair the color set with the FAB style (primary with primary or primary-container). Don't mix sets.
- Do place a plain FAB next to a toolbar. Don't open a FAB menu beside a toolbar or navigation rail.
- Do let items scroll behind the close button on short screens. Don't let them cover it.
- Do increase margins to 24dp on desktop and use a larger FAB there.

## Minimal implementation

Primary color set, open state. A framework component should hold `open` state, render the trigger FAB when closed, and render close button plus items when open.

```html
<div class="md-fab-menu" dir="ltr">
  <ul class="md-fab-menu__items" role="menu" id="share-menu">
    <li><button class="md-fab-menu__item" role="menuitem" type="button"><span class="ico" aria-hidden="true">✉</span>Email</button></li>
    <li><button class="md-fab-menu__item" role="menuitem" type="button"><span class="ico" aria-hidden="true">🔗</span>Copy link</button></li>
    <li><button class="md-fab-menu__item" role="menuitem" type="button"><span class="ico" aria-hidden="true">💬</span>Message</button></li>
  </ul>
  <button class="md-fab-menu__close" type="button" aria-label="Toggle menu" aria-expanded="true" aria-controls="share-menu">✕</button>
</div>
```

```css
.md-fab-menu {
  position: fixed; inset-inline-end: 16px; inset-block-end: 16px;
  display: flex; flex-direction: column; align-items: flex-end; gap: var(--md-sys-measurement-space100);
}
.md-fab-menu__items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; align-items: flex-end; gap: var(--md-sys-measurement-space50); max-height: 70vh; overflow-y: auto; }
.md-fab-menu__item, .md-fab-menu__close {
  position: relative; isolation: isolate; overflow: hidden; border: none; cursor: pointer;
  display: inline-flex; align-items: center; height: 56px; border-radius: var(--md-sys-shape-corner-full);
}
.md-fab-menu__item {
  gap: var(--md-sys-measurement-space100); padding: 0 var(--md-sys-measurement-space300); min-width: 48px;
  background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container);
  font-family: var(--md-sys-typescale-title-medium-font); font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: var(--md-sys-typescale-title-medium-weight); line-height: var(--md-sys-typescale-title-medium-line-height);
  white-space: nowrap;
}
.md-fab-menu__item .ico { width: 24px; height: 24px; display: inline-grid; place-items: center; }
.md-fab-menu__close {
  width: 56px; height: 56px; justify-content: center; font-size: 20px;
  background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary);
  box-shadow: var(--md-sys-elevation-level3);
}
.md-fab-menu__item::after, .md-fab-menu__close::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-fab-menu__item:hover::after, .md-fab-menu__close:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-fab-menu__item:hover, .md-fab-menu__close:hover { box-shadow: var(--md-sys-elevation-level4); }
.md-fab-menu__item:focus-visible, .md-fab-menu__close:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; box-shadow: var(--md-sys-elevation-level3); }
.md-fab-menu__item:focus-visible::after, .md-fab-menu__close:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-fab-menu__item:active::after, .md-fab-menu__close:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
```

## Tokens

- ../tokens/md.comp.fab-menu.md (close button, menu item, three color sets, states)
- ../tokens/md.comp.fab.md (the FAB that opens the menu)
- ../tokens/md.comp.menu.md (web implementation inherits menu specs)
