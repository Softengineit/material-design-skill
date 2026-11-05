# App bars

An app bar sits at the top of the page and shows what the page is (headline, optional subtitle or logo), a navigation control, and at most one or two essential actions.

## When to use / when not to use

Use an app bar on every page that needs a title and a way to navigate (Back or Menu). Put the one action that changes or exits the whole page there (Send, Save, Edit). Global controls like Search or Notifications are also acceptable.

Do not use the app bar as the place for many actions; use a toolbar for that. Avoid an overflow menu in the app bar when you can. Do not shrink the bar below its default height, do not round its corners, and do not transform it into a search app bar on scroll.

Choosing a variant:
- Search app bar: home pages where search is the main entry point.
- Small: dense layouts, or the collapsed state of a page that has been scrolled.
- Medium flexible: a bigger headline that can collapse into a small bar on scroll.
- Large flexible: when the page headline should be the hero.

## Variants

- Search app bar: a 56dp fully rounded search field replaces the headline. Leading element (logo or icon button), hint text that always contains the word "Search" (Search, Search inbox, Search Photos), trailing icons inside or outside the field and an optional avatar. Tapping opens the search view. Up to two trailing icons plus avatar on mobile, up to four trailing icons on large screens.
- Small: 64dp. Title-large headline, optional label-medium subtitle, centered text option (this replaces the old center-aligned variant), logo can replace the text.
- Medium flexible: 112dp (136dp with subtitle). Headline-medium headline, label-large subtitle, text may wrap to two lines, can hold images and a filled icon button.
- Large flexible: 120dp (152dp with subtitle). Display-small headline, title-medium subtitle.
- Baseline medium (112dp, headline-small) and baseline large (152dp, headline-medium) still exist but are no longer recommended; use the flexible versions.

Text alignment: leading edge (default) or centered.

## Anatomy

1. Container: full width, straight corners, surface color; switches to surface-container on scroll.
2. Leading button: Menu (opens the modal expanded navigation rail) or Back arrow. Leading space 4dp.
3. Headline: page, section or product name. Never truncated; wraps to at most two lines only in flexible bars.
4. Subtitle (optional), leading-aligned or centered with the headline.
5. Trailing elements: up to two icon buttons, most used first. Can be replaced by one filled or tonal icon button (default or wide). Trailing space 4dp, no space between icon buttons.
6. Optional image or logo. In small bars it can replace the text; in other bars it sits above the text.

Search app bar parts: container, leading icon button, hinted search text, trailing icon or avatar, search container.

## Specs

| Variant | Height (with subtitle) | Headline typescale | Subtitle typescale | Container color flat / on scroll | Headline / subtitle color | Leading / trailing icon color | Icon size | Shape | Elevation flat / on scroll |
|---|---|---|---|---|---|---|---|---|---|
| Search | 64dp bar, 56dp field | md.sys.typescale.body-large (hint) | none | surface / surface-container; field surface-container / surface-container-highest | on-surface-variant (hint) | on-surface / on-surface-variant | 24dp, avatar 32dp | bar corner.none, field corner.full | level0 / level2 |
| Small | 64dp | md.sys.typescale.title-large | md.sys.typescale.label-medium | surface / surface-container | on-surface / on-surface-variant | on-surface / on-surface-variant | 24dp | corner.none | level0 / level2 |
| Medium flexible | 112dp (136dp) | md.sys.typescale.headline-medium | md.sys.typescale.label-large | surface / surface-container | on-surface / on-surface-variant | on-surface / on-surface-variant | 24dp | corner.none | level0 / level2 |
| Large flexible | 120dp (152dp) | md.sys.typescale.display-small | md.sys.typescale.title-medium | surface / surface-container | on-surface / on-surface-variant | on-surface / on-surface-variant | 24dp | corner.none | level0 / level2 |
| Medium (baseline) | 112dp | md.sys.typescale.headline-small | md.sys.typescale.label-large | surface / surface-container | on-surface | on-surface / on-surface-variant | 24dp | corner.none | level0 / level2 |
| Large (baseline) | 152dp | md.sys.typescale.headline-medium | md.sys.typescale.title-medium | surface / surface-container | on-surface | on-surface / on-surface-variant | 24dp | corner.none | level0 / level2 |

Padding: leading space and trailing space 4dp (space50) around the icon buttons, 0dp between icon buttons; search field has 8dp (space100) leading and trailing space inside. The search field fills the space between the leading and trailing elements up to 312dp, then grows to only 50% of the remaining space. Color tokens are md.sys.color.* names.

## States and interaction

The container itself has no interactive states, only scroll states:
- Flat (top of page): surface color, elevation level0, same color as the background.
- On scroll: container fills with surface-container (elevation level2 token exists but the separation is meant to come from the color, not a drop shadow). The search field moves to surface-container-highest.
- Alternative: keep the container transparent on scroll and give every icon button a filled container so the actions float over content; narrow-width icon buttons for Back save space.
- Medium and large flexible bars compress into a small bar on scroll and stay small until the page is scrolled back to the top.
- The bar can stay fixed or hide on scroll down and reappear on scroll up; it may also animate in and out with a secondary row such as chips.

Elements inside use their own states: icon buttons hover 0.08, focus 0.1, pressed 0.1 state layers with a ripple on touch.

## Accessibility

- Use `<header>` containing the bar, with the headline as an `<h1>` (role heading). The accessible name of the title equals the visible text, plus extra context if useful.
- Initial focus goes to the leading button. Tab moves to each interactive element in order, Space or Enter activates.
- Label icon buttons by their action ("View on map"), and show tooltips on web.
- Keep actions reachable while the content scrolls.
- Search field: container surface-container and label on-surface-variant by default; on dark backgrounds use surface-bright. Any custom pair must keep 3:1 contrast.
- Every icon button keeps a 48x48dp target inside the 64dp bar.
- RTL: the layout mirrors automatically when elements are aligned to leading and trailing edges.

## Do / Don't

- Do use one filled or tonal icon button for the important action. Don't put two filled or tonal buttons in the bar.
- Do keep straight corners. Don't curve the container.
- Do keep the default height and full window width. Don't make it shorter.
- Do wrap a long headline to two lines in a medium or large flexible bar. Don't wrap text in a small bar and never truncate.
- Do use filled icons for trailing actions. Caution: outlined icons are acceptable, especially for unselected toggles.
- Do put the most used trailing action closest to the leading edge.
- Don't use three icons plus an avatar in a search app bar on mobile; move extras to a toolbar.
- Don't use the leading logo to open an expanded navigation rail.
- Do give the search hint at least 3:1 contrast with its container. Don't use custom low-contrast colors.
- Don't change the headline or subtitle sizes, and don't add many actions.

## Minimal implementation

Small app bar with leading Back button, headline, subtitle and two trailing icon buttons. A framework component should take `title`, `subtitle`, `leading`, `actions`, `variant`, `centered` and a `scrolled` flag.

```html
<header class="md-app-bar" data-scrolled="false">
  <button class="md-app-bar__icon" type="button" aria-label="Back">←</button>
  <div class="md-app-bar__text">
    <h1 class="md-app-bar__headline">Trip details</h1>
    <p class="md-app-bar__subtitle">Lisbon, 3 days</p>
  </div>
  <button class="md-app-bar__icon" type="button" aria-label="Share">⇪</button>
  <button class="md-app-bar__icon" type="button" aria-label="Edit">✎</button>
</header>
```

```css
.md-app-bar {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; width: 100%; height: 64px;
  padding: 0 var(--md-sys-measurement-space50); box-sizing: border-box;
  background: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-none);
  transition: background-color var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}
.md-app-bar[data-scrolled="true"] { background: var(--md-sys-color-surface-container); }
.md-app-bar__icon {
  width: 48px; height: 48px; flex: none; border: none; background: transparent; cursor: pointer;
  border-radius: var(--md-sys-shape-corner-full); font-size: 24px;
  color: var(--md-sys-color-on-surface-variant);
}
.md-app-bar__icon:first-child { color: var(--md-sys-color-on-surface); }
.md-app-bar__icon:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
.md-app-bar__icon:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -2px; }
.md-app-bar__text { flex: 1; min-width: 0; padding: 0 var(--md-sys-measurement-space50); }
.md-app-bar__headline {
  margin: 0; white-space: nowrap; overflow: hidden;
  font-family: var(--md-sys-typescale-title-large-font); font-size: var(--md-sys-typescale-title-large-size);
  font-weight: var(--md-sys-typescale-title-large-weight); line-height: var(--md-sys-typescale-title-large-line-height);
}
.md-app-bar__subtitle {
  margin: 0; color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-label-medium-font); font-size: var(--md-sys-typescale-label-medium-size);
  font-weight: var(--md-sys-typescale-label-medium-weight); line-height: var(--md-sys-typescale-label-medium-line-height);
}
/* centered text: .md-app-bar__text { text-align: center; } with equal leading/trailing widths */
/* medium flexible: height 112px, headline-medium, text block on its own row under the buttons */
/* large flexible: height 120px, display-small */
```

Toggle `data-scrolled` from a scroll listener (`window.scrollY > 0`) or an IntersectionObserver on a sentinel at the top of the page.

## Tokens

- ../tokens/md.comp.app-bar.md (search, small, medium flexible, large flexible, baseline medium and large, on-scroll colors)
- ../tokens/md.comp.top-app-bar.md (baseline small, small centered, medium, large)
- ../tokens/md.comp.search-bar.md and ../tokens/md.comp.search-view.md (search field and the view it opens)
