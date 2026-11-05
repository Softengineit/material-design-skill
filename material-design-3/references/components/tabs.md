# Tabs

Tabs are a single row of peers that switch the content region below them between related groups of content at the same level of hierarchy.

## When to use / when not to use

Use tabs when:
- Content splits into a few related categories that share a topic (Flights, Trips, Explore).
- People need to switch quickly between those groups within one screen.
- Two levels of grouping are needed: primary tabs on top, secondary tabs inside the content.
- There are fewer than three top-level destinations on mobile (a navigation bar needs three to five).

Do not use tabs when:
- The content is sequential and must be read in order (chapters, steps): use headings, spacing or a stepper.
- The items are app-level destinations on mobile: use a navigation bar.
- Each tab would show the same content with a different filter: use filter chips or a segmented button.
- More than four fixed tabs are needed: use scrollable tabs.

## Variants

- Primary tabs: at the top of the content pane under the app bar. Main content destinations. Active indicator 3dp, rounded on top, hugs the label (inset 2dp on each side, minimum length 24dp). Active label and icon are primary. Can show icons above or beside the label.
- Secondary tabs: inside a content area, below primary tabs, for a second level of grouping. Active indicator 2dp, full tab width. Active label on-surface. Same behavior as primary tabs.

Layout modes for both:
- Fixed: all tabs visible, equal widths based on the widest tab; four tabs maximum.
- Scrollable: tab width follows its label, the set scrolls horizontally, first tab offset 52dp from the leading edge. For many tabs or long labels.

## Anatomy

1. Container (full width, surface, with a 1dp divider on its bottom edge)
2. Tab: label (title-small), optional icon (24dp), optional badge (small or large, up to 4 characters)
3. Active indicator (underline)
4. Divider (1dp, surface-variant, inside the container height)

## Specs

| Part | Primary tab | Secondary tab |
| --- | --- | --- |
| Container height, label only | 48dp | 48dp |
| Container height, icon and label (stacked) | 64dp | 64dp |
| Container color | → md.sys.color.surface | → md.sys.color.surface |
| Container shape | → md.sys.shape.corner.none | → md.sys.shape.corner.none |
| Container elevation | → md.sys.elevation.level0 (same on hover and pressed) | → md.sys.elevation.level0 |
| Active indicator | 3dp high, → md.sys.color.primary, shape 3dp top corners, min length 24dp, inset 2dp | 2dp high, → md.sys.color.primary, full tab width |
| Active label color | → md.sys.color.primary | → md.sys.color.on-surface |
| Inactive label color | → md.sys.color.on-surface-variant | → md.sys.color.on-surface-variant |
| Label typescale | → md.sys.typescale.title-small | → md.sys.typescale.title-small |
| Icon size | 24dp, active primary, inactive on-surface-variant | 24dp, active on-surface, inactive on-surface-variant |
| Divider | 1dp, → md.sys.color.surface-variant (outline-variant in the color guidance) | same |
| Padding | 16dp horizontal inside each tab; 8dp between inline icon and text; 4dp between text and badge; a badge overlaps a stacked icon by 6dp | same |
| Scrollable offset | first tab 52dp from the leading edge | same |
| Focus indicator | → md.sys.color.secondary, 3dp, inner offset -3dp | same |
| Touch target | 48dp high; tabs are at least 48dp wide | same |

## States and interaction

| State | Primary, active | Primary, inactive | Secondary (all) |
| --- | --- | --- | --- |
| Enabled | label and icon primary, indicator shown | label and icon on-surface-variant | active label on-surface, inactive on-surface-variant |
| Hover | state layer primary at 0.08 | state layer on-surface at 0.08, label on-surface | state layer on-surface at 0.08, label on-surface |
| Focus | state layer primary at 0.1, focus ring | state layer on-surface at 0.1 | state layer on-surface at 0.1 |
| Pressed | state layer primary at 0.1, ripple | state layer primary at 0.1, label on-surface | state layer on-surface at 0.1 |

Behavior:
- Tapping a tab moves the indicator to it (it slides into position) and swaps the content below.
- In the content area of fixed tabs, swiping left or right also changes tab. Avoid other swipeable content there, or use a different gesture direction.
- Scrollable tabs scroll as a set; do not loop them infinitely.
- On page scroll, tabs can stay fixed at the top or scroll away and come back on scroll up. Tabs attached to an app bar move with it as one unit and never scroll behind it.
- Labels sit on one line; a second line with truncation is possible but scrollable tabs are a better answer for long labels.
- Badges update or disappear once the tab content has been viewed.

## Accessibility

- Roles: container `role="tablist"`, each tab `role="tab"` with `aria-selected` and `aria-controls` pointing to its panel, each panel `role="tabpanel"` with `aria-labelledby`. Only the active tab is in the tab order (`tabindex="0"`, others `-1`).
- Keyboard: arrow keys move focus between tabs (Left and Right for a horizontal list); Space or Enter activates the focused tab; Tab leaves the tab list and moves into the panel. Do not use Space or Enter to move between tabs. Home and End can jump to the first and last tab.
- Scrollable tabs are accessible because tabs grow with their labels; make off-screen tabs reachable with the keyboard and scroll them into view on focus.
- Icon-only tabs need a descriptive accessible name ("Video format media content", not "Video camera"). Use icon-only tabs only with globally known icons.
- Do not apply density by default; keep 48x48 CSS pixel targets, and keep the control that changes density at 48x48 too.
- The active tab is shown by the indicator and the color change together, not color alone.

## Do / Don't

- Do group related content of equal weight under tabs.
- Don't use tabs for sequential content such as chapters.
- Do use icons that are globally recognized when there is no text.
- Don't mix tabs with icon and text with tabs that have only text.
- Do offset the first scrollable tab by 52dp so people see there is more.
- Don't truncate labels unless there is no other way.
- Do keep fixed tabs to four or fewer.
- Do use different gesture directions for other swipeable content near tabs.
- Don't put horizontally swipeable items in the content area of swipeable tabs.
- Do let tabs scroll off and return when the page scrolls up.
- Don't scroll tabs behind an app bar; they move together.
- Do place secondary tabs below primary tabs.

## Minimal implementation

```html
<div class="md-tabs" role="tablist" aria-label="Trip sections">
  <button class="md-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1" tabindex="0">
    <span class="material-symbols-outlined" aria-hidden="true">flight</span>Flights
  </button>
  <button class="md-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">
    <span class="material-symbols-outlined" aria-hidden="true">luggage</span>Trips
  </button>
  <button class="md-tab" role="tab" id="t3" aria-selected="false" aria-controls="p3" tabindex="-1">
    <span class="material-symbols-outlined" aria-hidden="true">explore</span>Explore
  </button>
</div>
<section id="p1" role="tabpanel" aria-labelledby="t1">...</section>
<section id="p2" role="tabpanel" aria-labelledby="t2" hidden>...</section>
<section id="p3" role="tabpanel" aria-labelledby="t3" hidden>...</section>
```

```css
.md-tabs { display: flex; width: 100%; height: 48px; background: var(--md-sys-color-surface);
  border-bottom: 1px solid var(--md-sys-color-surface-variant); box-sizing: border-box; }
.md-tab { position: relative; flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 0 16px; border: 0; background: none; cursor: pointer; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-title-small-weight) var(--md-sys-typescale-title-small-size)/var(--md-sys-typescale-title-small-line-height)
  var(--md-sys-typescale-title-small-font); }
.md-tab .material-symbols-outlined { font-size: 24px; }
.md-tab::before { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; }
.md-tab:hover::before { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-tab:active::before { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-tab:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -3px; }
.md-tab[aria-selected="true"] { color: var(--md-sys-color-primary); }
.md-tab[aria-selected="true"]::after { content: ""; position: absolute; bottom: 0; left: 16px; right: 16px;
  height: 3px; min-width: 24px; background: var(--md-sys-color-primary); border-radius: 3px 3px 0 0; }
/* secondary variant */
.md-tabs--secondary .md-tab[aria-selected="true"] { color: var(--md-sys-color-on-surface); }
.md-tabs--secondary .md-tab[aria-selected="true"]::after { left: 0; right: 0; height: 2px; border-radius: 0; }
/* scrollable variant */
.md-tabs--scrollable { overflow-x: auto; padding-left: 52px; scrollbar-width: none; }
.md-tabs--scrollable .md-tab { flex: none; }
```

JS: on ArrowLeft and ArrowRight move focus and `tabindex` between tabs; on click, Space or Enter set `aria-selected`, show the matching panel, and hide the others. A React or Vue component should expose `variant` ("primary" | "secondary"), `scrollable`, `tabs` (label, icon, badge, panelId), `activeIndex`, and emit `change`.

## Tokens

Primary tabs: ../tokens/md.comp.primary-navigation-tab.md. Secondary tabs: ../tokens/md.comp.secondary-navigation-tab.md. Badges: ../tokens/md.comp.badge.md.
