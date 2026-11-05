# Navigation rail

A navigation rail is a vertical strip on the leading edge of medium and larger windows that holds 3 to 7 destinations, an optional menu button and an optional FAB, and can expand to show labels and secondary destinations.

## When to use / when not to use

Use a navigation rail when:
- The window is medium, expanded, large or extra-large (tablet, desktop).
- There are 3 to 7 top-level destinations, possibly with a primary action (FAB).
- You want persistent vertical navigation while content scrolls.
- You need what a navigation drawer used to do: the expanded rail (standard or modal) replaces the navigation drawer in M3 Expressive.

Do not use a navigation rail when:
- The window is compact: use a navigation bar. Exception: a modal expanded rail can open from a menu icon on a phone.
- A navigation bar is already visible. Never show both.
- Navigation should be horizontal: that is a navigation bar.
- Medium windows with only a few destinations: a navigation bar may fit better.

## Variants

- Collapsed navigation rail (M3 Expressive, May 2025, replaces the baseline rail): 96dp wide (80dp narrow), vertical items with icon above label. Must stay visible, never hidden.
- Expanded navigation rail (replaces the navigation drawer): 220dp to 360dp wide, horizontal items with icon beside label, can show secondary destinations. Two layouts:
  - Standard (default): sits beside the content and pushes it.
  - Modal: overlays the content at elevation level2 with corner large, opened from a menu icon. For dense layouts or many destinations. Supports predictive back on Android.
  Expanded behavior: transition to the collapsed rail, or hide entirely when collapsed (immersive experiences only).
- Navigation rail (baseline): 80dp wide, not recommended any more.

Collapsed and expanded rails share the same look and can transform into each other with the menu button.

## Anatomy

1. Container (leading edge, full height)
2. Menu button (optional, top-aligned, toggles collapsed and expanded; its icon changes when expanded)
3. FAB or extended FAB (optional, top-aligned, resting elevation level0 inside the rail)
4. Navigation item: icon (24dp), label text (required, one word), active indicator
5. Small badge (6dp) or large badge (16dp with label) on the icon (collapsed) or beside the label (expanded)
6. Divider (optional, on the edge next to the content)

Items can be aligned as a group to the top or to the center (center is easier to reach on tablets). Menu and FAB always stay at the top.

## Specs

Collapsed and expanded rail (md.comp.nav-rail):

| Part | Value |
| --- | --- |
| Collapsed container width | 96dp (narrow 80dp), top space 44dp, 4dp between items (space50) |
| Expanded container width | 220dp minimum to 360dp maximum, top space 44dp, 0dp between items, trailing space 20dp |
| Container color | → md.sys.color.surface, elevation level0, shape corner none (container fill can be removed if contrast stays 3:1) |
| Modal expanded container | → md.sys.color.surface-container, elevation → md.sys.elevation.level2, shape → md.sys.shape.corner.large |
| Item container height | 64dp (short 56dp), 6dp vertical space (space75) |
| Vertical item (collapsed) | indicator 56x32dp, 4dp icon to label, 16dp leading and trailing space, label → md.sys.typescale.label-medium |
| Horizontal item (expanded) | indicator 56dp high, 16dp leading and trailing space (space200), 8dp icon to label (space100), label → md.sys.typescale.label-large |
| Active indicator shape | → md.sys.shape.corner.full |
| Active indicator color | → md.sys.color.secondary-container |
| Active icon color | → md.sys.color.on-secondary-container |
| Active label color | → md.sys.color.secondary (vertical), on-secondary-container (horizontal, inside the indicator) |
| Inactive icon and label | → md.sys.color.on-surface-variant |
| Icon size | 24dp |
| Header space minimum (above items when there is a menu or FAB) | 40dp (space500) |
| Badge | small 6dp error; large 16dp radius 8dp, error with on-error label-small |
| Touch target | full width of the rail, at least 48dp high |

Baseline rail (md.comp.navigation-rail): 80dp wide, indicator 56x32dp (56dp tall without labels), active label on-surface in prominent weight, menu icon on-surface-variant.

## States and interaction

State layer color is on-secondary-container for both active and inactive items.

| State | What changes |
| --- | --- |
| Enabled, inactive | Outlined icon and label on-surface-variant |
| Enabled, active | Filled icon (semibold weight if no filled version), indicator secondary-container, icon on-secondary-container, label secondary |
| Hover | State layer 0.08 |
| Focus | State layer 0.1 and focus ring |
| Pressed | State layer 0.1 and ripple through the indicator |

Behavior:
- Tapping a destination navigates with a top-level transition; the icon fills and the indicator grows from its center.
- Items stay fixed while the page scrolls vertically. When content scrolls horizontally under the rail, add a divider or raise the rail to level1.
- The menu button toggles collapsed and expanded. When expanding, the page content reflows, and the FAB becomes an extended FAB.
- The expanded modal rail closes with predictive back (Android), Escape, or scrim tap.
- With larger text settings, items grow vertically and labels may wrap. Full labels must remain visible up to 2x text size.

## Accessibility

- Web: `<nav aria-label="Main">` with a list of links, `aria-current="page"` on the active item. The modal expanded rail is `role="dialog" aria-modal="true"`. The menu button has `aria-expanded` and `aria-controls`.
- Initial focus lands on the first interactive element (menu, FAB, or first item). Tab and arrow keys move between elements; Space or Enter activates.
- Accessible name is the label; make it more descriptive when the label is vague ("Recent" becomes "Recent images").
- The target area spans the full rail width even when the indicator hugs the content.
- Active and inactive icons need at least 3:1 contrast against the container. Do not use more than two colors for destinations.
- Show the active item with a filled icon and the indicator, not with color alone.

## Do / Don't

- Do place the rail on the leading edge (left in LTR, right in RTL) and keep it in the same place on every screen.
- Don't lay the rail out horizontally; use a navigation bar for that.
- Do keep the FAB and menu at the top of the rail.
- Don't put the FAB below the destinations.
- Do write short one-word labels; break a long label on two lines or hyphenate if needed.
- Don't truncate labels with an ellipsis and don't shrink the type size.
- Do show the active indicator on one item only.
- Don't use the same outlined icon for active and inactive items.
- Do use a logo at the top only if it cannot be mistaken for a button; never use the logo as the menu button.
- Don't hide the collapsed rail; only an expanded rail may hide in immersive layouts.
- Don't use a rail and a navigation bar at the same time.

## Minimal implementation

```html
<nav class="md-rail" aria-label="Main">
  <button class="md-rail__menu" aria-label="Open navigation menu" aria-expanded="false">
    <span class="material-symbols-outlined">menu</span>
  </button>
  <a class="md-rail__item" href="/home" aria-current="page">
    <span class="md-rail__indicator"><span class="material-symbols-outlined">home</span></span>
    <span class="md-rail__label">Home</span>
  </a>
  <a class="md-rail__item" href="/timer">
    <span class="md-rail__indicator"><span class="material-symbols-outlined">timer</span></span>
    <span class="md-rail__label">Timer</span>
  </a>
</nav>
```

```css
.md-rail { position: sticky; top: 0; width: 96px; height: 100vh; padding-top: 44px; box-sizing: border-box;
  display: flex; flex-direction: column; align-items: center; gap: 4px; background: var(--md-sys-color-surface); }
.md-rail__menu { width: 48px; height: 48px; margin-bottom: 40px; border: 0; background: none;
  border-radius: var(--md-sys-shape-corner-full); color: var(--md-sys-color-on-surface-variant); cursor: pointer; }
.md-rail__item { width: 100%; min-height: 64px; display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 4px; padding: 6px 16px; box-sizing: border-box; text-decoration: none;
  color: var(--md-sys-color-on-surface-variant); font: var(--md-sys-typescale-label-medium-weight)
  var(--md-sys-typescale-label-medium-size)/var(--md-sys-typescale-label-medium-line-height) var(--md-sys-typescale-label-medium-font); }
.md-rail__indicator { position: relative; display: grid; place-items: center; width: 56px; height: 32px;
  border-radius: var(--md-sys-shape-corner-full); }
.md-rail__indicator::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--md-sys-color-on-secondary-container); opacity: 0; }
.md-rail__item:hover .md-rail__indicator::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-rail__item:active .md-rail__indicator::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-rail__item:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-rail__item[aria-current="page"] { color: var(--md-sys-color-secondary); font-weight: 700; }
.md-rail__item[aria-current="page"] .md-rail__indicator { background: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container); }
.md-rail__item[aria-current="page"] .material-symbols-outlined { font-variation-settings: "FILL" 1; }
/* expanded: .md-rail--expanded { width: 220px; align-items: stretch; } items become row layout,
   indicator height 56px with padding 0 16px, label inside the indicator, label-large */
```

A React or Vue component should expose `expanded` (boolean), `modal` (boolean), `items`, `activeHref`, optional `fab` and `menu` slots, and animate between the two widths.

## Tokens

Collapsed and expanded rail: ../tokens/md.comp.nav-rail.md. Baseline rail: ../tokens/md.comp.navigation-rail.md. FAB inside the rail: ../tokens/md.comp.fab.md and ../tokens/md.comp.extended-fab.md.
