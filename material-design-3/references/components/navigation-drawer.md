# Navigation drawer

A navigation drawer is a side panel, permanent or modal, that lists five or more destinations and app-level actions such as switching accounts.

Note: since the M3 Expressive update (May 2025) the navigation drawer is no longer recommended. New designs should use the expanded navigation rail, which does the same job and adapts better across window sizes. Keep this reference for existing products or when a team asks for a drawer explicitly.

## When to use / when not to use

Use a navigation drawer when:
- The app has 5 or more top-level destinations.
- There are 2 or more levels of navigation hierarchy (sections with subheads).
- People need to jump quickly between unrelated destinations.
- You are replacing a navigation rail or bar on large screens (expanded, large, extra-large) and cannot use the expanded navigation rail.

Do not use a navigation drawer when:
- Another primary navigation component (navigation bar, rail) is already on the screen. Pick one per breakpoint: bar for compact, rail for medium and expanded, standard drawer for expanded and larger.
- There are only 3 to 5 destinations on a small screen: use a navigation bar.
- You are on M3 Expressive: use the expanded navigation rail (modal or standard).

## Variants

- Standard navigation drawer: part of the layout, pushes content. Can be permanently visible (quick switching) or dismissible through a menu icon (content first). For expanded, large and extra-large windows. Container surface, elevation level0.
- Modal navigation drawer: slides over the content with a scrim that blocks interaction, does not change the layout grid. For compact and medium windows, usable anywhere. Opened by an action outside the drawer (menu icon in an app bar or rail). Container surface-container-low, elevation level1.

## Anatomy

1. Sheet (container), anchored to the start edge (left in LTR, right in RTL), rounded on the end edge
2. Headline (optional, title-small)
3. Destination item: icon (optional, 24dp) and label text (required)
4. Active indicator (pill behind the active item)
5. Badge label text (optional, trailing count)
6. Section label / subhead (optional)
7. Divider (optional, full width, between groups)
8. Scrim (modal only)

## Specs

| Part | Value |
| --- | --- |
| Container width | 360dp |
| Container height | 100% |
| Container shape | → md.sys.shape.corner.large.end (0, 16, 16, 0 dp) |
| Container color, standard | → md.sys.color.surface, elevation → md.sys.elevation.level0 |
| Container color, modal | → md.sys.color.surface-container-low, elevation → md.sys.elevation.level1 |
| Left and right padding of the sheet | 28dp |
| Active indicator | 336dp wide, 56dp high, → md.sys.shape.corner.full (28dp radius), 12dp inner padding, 0dp between items |
| Active indicator color | → md.sys.color.secondary-container |
| Icon size | 24dp |
| Label typescale | → md.sys.typescale.label-large; active label uses the prominent (bold) weight |
| Active icon and label color | → md.sys.color.on-secondary-container |
| Inactive icon and label color | → md.sys.color.on-surface-variant |
| Headline | → md.sys.typescale.title-small, → md.sys.color.on-surface-variant |
| Large badge label | → md.sys.typescale.label-large, → md.sys.color.on-surface-variant |
| Divider | → md.sys.color.outline |
| Scrim | → md.ref.palette.neutral-variant20 at 0.4 opacity |
| Focus indicator | → md.sys.color.secondary, 3dp, inner offset -3dp |
| Label alignment | start |
| Touch target | each item is 56dp high, above the 48dp minimum |

## States and interaction

| State | Active item | Inactive item |
| --- | --- | --- |
| Enabled | Indicator secondary-container, filled icon and bold label on-secondary-container | Outlined icon and label on-surface-variant, no indicator |
| Hover | State layer on-secondary-container at 0.08 | State layer on-surface at 0.08, icon and label on-surface |
| Focus | State layer at 0.1 and focus ring | State layer on-surface at 0.1 |
| Pressed | State layer at 0.1 with ripple through the indicator | State layer on-secondary-container at 0.1 |

Behavior:
- One destination is always active. Tapping another item fills its icon, shows the indicator in place, and navigates.
- The drawer scrolls on its own when the list is taller than the window; body content stays still.
- Modal drawer closes when an item is selected, the scrim is tapped, or the user swipes toward the anchoring edge.
- Dismissible standard drawer opens and closes from a visible navigation menu icon in the app bar and stays open until the icon is tapped again.
- Enter and exit transitions are used when the drawer appears. When the window changes size, animate the rail into the drawer and back.
- On web below 320 CSS pixels wide, swap the drawer for a navigation bar.

## Accessibility

- Web: `<nav aria-label="Main">` containing a list of links; active item has `aria-current="page"`. A modal drawer is `role="dialog" aria-modal="true"` with a label, and the scrim is a button-like element that closes it.
- Initial focus lands on the first destination. Tab focuses the first destination, arrow keys move between destinations, Space or Enter selects and moves focus to the new section when relevant. Escape should close a modal drawer.
- The accessible name of an item is the destination name; make it more descriptive when the label is vague ("Recents" becomes "Recent images").
- Mark the active destination with a filled icon, a bold label and the indicator, not with color alone. Icons are either on all items or on none.
- Keep 48dp minimum targets (items are 56dp).

## Do / Don't

- Do use a drawer for five or more primary destinations or more than one hierarchy level.
- Don't put two primary navigation components on one screen.
- Do open the drawer from the start edge (left in LTR).
- Do separate groups with full-width dividers.
- Don't put a divider between every item.
- Do keep labels short; truncate if they overflow.
- Don't wrap labels and don't shrink the text to fit.
- Do use recognizable icons and put them before the text.
- Don't give icons to some items and not others.
- Do use a filled icon for the selected destination.
- Don't keep the same outlined icon style on the selected item.

## Minimal implementation

```html
<div class="md-drawer-scrim" hidden></div>
<nav class="md-drawer md-drawer--standard" aria-label="Main">
  <h2 class="md-drawer__headline">Mail</h2>
  <a class="md-drawer__item" href="/inbox" aria-current="page">
    <span class="material-symbols-outlined" aria-hidden="true">inbox</span>
    <span class="md-drawer__label">Inbox</span>
    <span class="md-drawer__badge">24</span>
  </a>
  <a class="md-drawer__item" href="/sent">
    <span class="material-symbols-outlined" aria-hidden="true">send</span>
    <span class="md-drawer__label">Sent</span>
  </a>
  <hr class="md-drawer__divider">
  <h3 class="md-drawer__section">Labels</h3>
  <a class="md-drawer__item" href="/work">
    <span class="material-symbols-outlined" aria-hidden="true">label</span>
    <span class="md-drawer__label">Work</span>
  </a>
</nav>
```

```css
.md-drawer { width: 360px; height: 100%; padding: 12px; box-sizing: border-box; overflow-y: auto;
  background: var(--md-sys-color-surface); border-radius: 0 var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) 0;
  display: flex; flex-direction: column; }
.md-drawer--modal { position: fixed; top: 0; left: 0; z-index: 2; background: var(--md-sys-color-surface-container-low);
  box-shadow: var(--md-sys-elevation-level1); }
.md-drawer-scrim { position: fixed; inset: 0; z-index: 1; background: var(--md-ref-palette-neutral-variant20); opacity: 0.4; }
.md-drawer__headline, .md-drawer__section { margin: 0; padding: 18px 16px; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-title-small-weight) var(--md-sys-typescale-title-small-size)/var(--md-sys-typescale-title-small-line-height)
  var(--md-sys-typescale-title-small-font); }
.md-drawer__item { position: relative; display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 16px 0 16px;
  border-radius: var(--md-sys-shape-corner-full); text-decoration: none; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size)/var(--md-sys-typescale-label-large-line-height)
  var(--md-sys-typescale-label-large-font); }
.md-drawer__item::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: currentColor; opacity: 0; }
.md-drawer__item:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-drawer__item:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-drawer__item:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-drawer__item[aria-current="page"] { background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container); font-weight: 700; }
.md-drawer__item[aria-current="page"] .material-symbols-outlined { font-variation-settings: "FILL" 1; }
.md-drawer__label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.md-drawer__divider { border: 0; border-top: 1px solid var(--md-sys-color-outline); margin: 0 16px; }
```

A React or Vue component should expose `variant` ("standard" | "modal"), `open`, `items` (grouped, with icon, label, href, badge), `activeHref`, and emit `close` on scrim click, Escape, and item selection (modal).

## Tokens

Full token list: ../tokens/md.comp.navigation-drawer.md. Replacement component: ../tokens/md.comp.nav-rail.md (expanded navigation rail).
