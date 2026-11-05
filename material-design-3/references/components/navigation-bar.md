# Navigation bar

A navigation bar sits at the bottom of a compact or medium window and gives access to 3 to 5 top-level destinations of equal importance.

## When to use / when not to use

Use a navigation bar when:
- The product has three to five main pages, on mobile or tablet (compact and medium window sizes).
- The destinations are fixed and the same on every screen.
- Bottom placement makes them easy to reach with a thumb.

Do not use a navigation bar when:
- There are fewer than three destinations: use tabs.
- There are more than five destinations: use tabs to group related content, or hide the navigation behind a menu icon with a modal expanded navigation rail.
- The window is expanded or larger (desktop): use a navigation rail instead.
- The item is a single task (like opening one email), not a destination.
- You need swipe between sections. Swiping is not supported between destinations.

Breakpoint guide: compact uses a navigation bar or a modal navigation rail; medium uses a navigation bar or a navigation rail; expanded and larger use a navigation rail.

## Variants

- Flexible navigation bar (M3 Expressive, May 2025, recommended): 64dp tall, no shadow in practice (container elevation token level2 but the bar sits flush on the surface-container color), two item layouts:
  - Vertical items (default, compact windows): icon above label, items stretch to share the width equally.
  - Horizontal items (medium windows): icon and label side by side inside the indicator, fixed item width, items centered with outer margins.
- Navigation bar (baseline): 80dp tall, vertical items only, active label on-surface. No longer recommended.

## Anatomy

1. Container (full window width, bottom of the window)
2. Navigation item, each with:
   - Icon (24dp, outlined when inactive, filled when active)
   - Label text (required, 1 to 2 words)
   - Active indicator (pill behind the icon, or behind icon and label in horizontal layout)
   - Small badge (optional, 6dp dot) or large badge (optional, 16dp with a number)

## Which height to build

Build the baseline 80dp bar (icon above a label, 64x32dp indicator, 12dp label) unless the product already uses the 2025 flexible bar. At 64dp the labels sit tight against the bottom edge on phones with a home indicator; the 80dp bar reads better and remains spec-compliant. Whatever the height, keep 8px side padding, equal item widths, and the labels on one line.

## Specs

Flexible navigation bar (md.comp.nav-bar):

| Part | Value |
| --- | --- |
| Container height | 64dp |
| Container color | → md.sys.color.surface-container |
| Container shape | → md.sys.shape.corner.none |
| Container elevation | → md.sys.elevation.level2 (token), hover and pressed unchanged |
| Item spacing | 0dp between items (space0) |
| Vertical item: active indicator | 56dp wide, 32dp high, → md.sys.shape.corner.full, 4dp from icon to label, 6dp between icon container and label (space75) |
| Horizontal item: active indicator | 40dp high, 16dp leading and trailing space, 4dp between icon and label |
| Icon size | 24dp |
| Label typescale | → md.sys.typescale.label-medium (active label uses prominent weight, bold) |
| Active indicator color | → md.sys.color.secondary-container |
| Active icon color | → md.sys.color.on-secondary-container |
| Active label color | → md.sys.color.secondary |
| Inactive icon and label color | → md.sys.color.on-surface-variant |
| Small badge | 6dp, → md.sys.color.error |
| Large badge | 16dp, radius 8dp, → md.sys.color.error |
| Focus indicator | → md.sys.color.secondary, 3dp, inner offset -3dp |
| Touch target | 48dp minimum per item |

Baseline navigation bar (md.comp.navigation-bar): container 80dp, indicator 64x32dp, active label on-surface, container surface-container, elevation level2.

## States and interaction

State layer color is on-secondary-container (active items and inactive items in the flexible bar).

| State | What changes |
| --- | --- |
| Enabled, inactive | Outlined icon, on-surface-variant icon and label, no indicator |
| Enabled, active | Filled icon (or semibold weight if no filled version), indicator secondary-container, icon on-secondary-container, label secondary in bold |
| Hover | State layer at 0.08. On an inactive item, the indicator can appear in a reduced form as a cue |
| Focus | State layer at 0.1 plus the focus ring |
| Pressed | State layer at 0.1 and a ripple through the indicator |

Behavior:
- Tapping an inactive item navigates with a top-level transition. The icon fills and the indicator grows from the center of the icon, on one axis only.
- Choose to preserve state (scroll position, tab, search) per destination, or reset it, depending on the product.
- Re-selecting the active item scrolls that page back to the top.
- The bar can hide on scroll down and reappear on scroll up. Never hide it when a screen reader is active.
- Dialogs, bottom sheets, drawers or the keyboard may cover the bar temporarily, never permanently.
- A FAB goes above the bar, right-aligned, not over it.
- With large text settings the bar grows vertically; labels may wrap. The full label must stay visible up to 2x text size.

## Accessibility

- Web roles: a `<nav aria-label="Main">` containing a list of links or buttons; mark the active destination with `aria-current="page"`. On Android the role may not be announced.
- Accessible name is the destination name. Make it more specific when the visible label is ambiguous ("Library" becomes "Music library").
- Keyboard: Tab moves between items. Space or Enter selects the focused item. Initial focus lands on the first item.
- Active destination must be shown by more than color: filled icon plus bold label plus the indicator. Icons need 3:1 contrast with the container.
- Touch target 48x48dp per item. Badges are decorative unless they carry a count; then include the count in the accessible name.

## Do / Don't

- Do keep three to five destinations with brief, clear labels.
- Don't put more than five items, labels would collide and translations would not fit.
- Don't remove labels from items.
- Don't use a navigation bar for two destinations; use tabs.
- Don't scroll the bar or move its destinations; positions are fixed.
- Do use filled icons for the active item and outlined icons for the others.
- Don't use an outlined icon on the active item, and don't use several or low-contrast icon colors.
- Do show the active indicator on one item only.
- Don't wrap, truncate or shrink labels to fit.
- Do right-align a FAB above the bar; don't cover the bar with it.
- Don't use a navigation bar on desktop layouts.

## Minimal implementation

```html
<nav class="md-navbar" aria-label="Main">
  <a class="md-navbar__item" href="/home" aria-current="page">
    <span class="md-navbar__indicator"><span class="material-symbols-outlined">home</span></span>
    <span class="md-navbar__label">Home</span>
  </a>
  <a class="md-navbar__item" href="/browse">
    <span class="md-navbar__indicator"><span class="material-symbols-outlined">explore</span></span>
    <span class="md-navbar__label">Browse</span>
  </a>
  <a class="md-navbar__item" href="/library">
    <span class="md-navbar__indicator"><span class="material-symbols-outlined">library_music</span>
      <span class="md-navbar__badge" aria-label="3 new">3</span></span>
    <span class="md-navbar__label">Library</span>
  </a>
</nav>
```

```css
.md-navbar { position: fixed; inset: auto 0 0 0; height: 64px; display: flex;
  background: var(--md-sys-color-surface-container); }
.md-navbar__item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; min-height: 48px; text-decoration: none; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-label-medium-weight) var(--md-sys-typescale-label-medium-size)/var(--md-sys-typescale-label-medium-line-height)
  var(--md-sys-typescale-label-medium-font); }
.md-navbar__indicator { position: relative; display: grid; place-items: center; width: 56px; height: 32px;
  border-radius: var(--md-sys-shape-corner-full); transition: background-color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard); }
.md-navbar__indicator::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--md-sys-color-on-secondary-container); opacity: 0; }
.md-navbar__item:hover .md-navbar__indicator::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-navbar__item:active .md-navbar__indicator::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-navbar__item:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-navbar__item[aria-current="page"] { color: var(--md-sys-color-secondary); font-weight: 700; }
.md-navbar__item[aria-current="page"] .md-navbar__indicator { background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container); }
.md-navbar__item[aria-current="page"] .material-symbols-outlined { font-variation-settings: "FILL" 1; }
.md-navbar__badge { position: absolute; top: 2px; right: 12px; min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 8px; background: var(--md-sys-color-error); color: var(--md-sys-color-on-error);
  font-size: var(--md-sys-typescale-label-small-size); line-height: 16px; }
```

For horizontal items (medium windows) switch `.md-navbar__item` to `flex-direction: row`, put the label inside the indicator, and give the indicator `height: 40px; padding: 0 16px; width: auto`. A React or Vue component should expose `items` (icon, filledIcon, label, href, badge), `activeIndex`, and `layout` ("vertical" | "horizontal").

## Tokens

Flexible navigation bar: ../tokens/md.comp.nav-bar.md. Baseline: ../tokens/md.comp.navigation-bar.md. Badge colors: ../tokens/md.comp.badge.md.
