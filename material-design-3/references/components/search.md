# Search

Search is a rounded text field (search bar) that, when focused, shows suggestions and results in a list (search view), so people can find items by typing a query.

## When to use / when not to use

Use search when:
- The product holds many items to manage (files, messages, contacts, products) and people need to find one quickly.
- You want to search inside one view ("Search your messages"): use a search bar under the title.
- Search is the main, global function: use the search app bar variant of the top app bar.
- Search is secondary: use a search icon button in the app bar that opens focused search.

Do not use search when:
- The content is small enough to scan: a list, tabs or filter chips are enough.
- You need a filter on structured values: use filter chips, a select, or a slider.
- You need free text that is not a query: use a text field.

## Variants

One component, "search" (search bar plus search view), with these configurations:
- Style:
  - Contained (M3 Expressive, February 2025, recommended): a persistent filled pill container; when focused the bar keeps its shape and grows wider (margins go from 24dp to 12dp), and results sit in a separate filled container below, with 2dp gap in the docked layout.
  - Divided (baseline, not recommended): a divider line separates the bar from the results.
- Layout of focused search:
  - Full-screen: fills the window. Default for compact windows.
  - Docked: a floating container below the bar with a scrim behind. For medium and expanded windows.

## Anatomy

1. Search bar container (pill, 56dp high)
2. Leading icon: a non-functional search icon, or a navigation icon button (menu, back arrow)
3. Supporting (hinted) text, replaced by the input text when typing
4. Input text
5. Trailing icon buttons (optional, one or two: voice search, overflow, location) and/or an avatar (30dp). Focused search can add a clear (x) button
6. Container for suggestions and results: empty by default, filled with a list component. Can use category labels (Recent, Contacts), leading icons, avatars, filter chips, and gaps between groups

## Specs

Search bar, unfocused (md.comp.search-bar):

| Part | Value |
| --- | --- |
| Container height | 56dp |
| Container width | min 360dp, max 720dp |
| Container shape | → md.sys.shape.corner.full |
| Container color | → md.sys.color.surface-container-high |
| Container elevation | → md.sys.elevation.level3 (token), no shadow by default in practice |
| Outer margins, contained | 24dp unfocused (space300), 12dp focused (space150) |
| Inner padding | 16dp leading and trailing (space200); contained style with actions 4dp (space50), without actions 16dp |
| Icon size | 24dp, icon to label gap 4dp from the tap target, 16dp label space |
| Leading icon color | → md.sys.color.on-surface |
| Trailing icon color | → md.sys.color.on-surface-variant |
| Supporting text | → md.sys.typescale.body-large, → md.sys.color.on-surface-variant |
| Input text | → md.sys.typescale.body-large, → md.sys.color.on-surface |
| Avatar | 30dp, corner full, 48dp target |
| Focus indicator | → md.sys.color.secondary, 3dp, outer offset 2dp |
| Motion (contained) | → md.sys.motion.spring.fast.spatial |

Search view, focused (md.comp.search-view):

| Part | Value |
| --- | --- |
| Full-screen container | full width and height, shape corner none, header 72dp (contained bar 56dp) |
| Docked container | width 360dp to 720dp, height 240dp min to 2/3 of the window, shape → md.sys.shape.corner.extra-large (contained: bar corner full, results corner medium, 2dp gap) |
| Background, contained | → md.sys.color.surface-container-low (full-screen), results container → md.sys.color.surface-container-high |
| Container color | → md.sys.color.surface-container-high, elevation level3 |
| Header padding | 16dp leading and trailing; contained margins 12dp |
| Divider (divided style) | → md.sys.color.outline |
| Header text | input on-surface, supporting on-surface-variant, body-large |

Container contrast: surface-container-high is right on a white or tonal background. Do not put it on a surface-container background; keep at least two surface container steps between them.

## States and interaction

Search bar:

| State | What changes |
| --- | --- |
| Enabled | Pill container, hinted text on-surface-variant |
| Hover | State layer on-surface at 0.08, supporting text on-surface-variant |
| Focus | Focus ring secondary 3dp outside the container; the bar widens (margins 24dp to 12dp) and opens focused search |
| Pressed | State layer on-surface at 0.1 with ripple |

Suggestions and results reuse list item states (enabled, hover, focus, pressed). Inside focused search, each element keeps its own states.

Behavior:
- Focused search can show history before typing, show suggestions or results while typing, or wait for a submitted query.
- Submit with Enter, or pick a suggestion directly. After a query, the input text stays visible but is no longer focused, and results scroll under the bar.
- Show a clear status that a search is active (search icon, "Results" label).
- The back icon releases focus, clears suggestions, and restores the bar.
- The bar can scroll away with content and reappear on scroll up, or stay fixed at the top.
- Predictive back on Android: the full-screen search detaches from the edge and reveals the previous screen.
- The bar stays inside its pane and scales in width with it; inner elements anchor to the two ends.

## Accessibility

- Role: `<input type="search">` (role searchbox) inside a `<form role="search">`. Android uses text field, iOS search field. The hinted text is the accessible name (`aria-label` or a visually hidden label matching the hint; a placeholder alone is not enough).
- Suggestions: use a list; when it appears the screen reader must announce it (`aria-live="polite"` on a status, or the combobox pattern with `aria-expanded`, `aria-controls`, `aria-activedescendant`).
- Initial focus lands on the first interactive element: the leading icon button if there is one, otherwise the text field.
- Keyboard: Tab and Shift+Tab move between interactive elements; Space or Enter activates the field; arrow keys move between result items; Escape or the back button closes focused search.
- Label every icon button (menu, back, voice search, clear) with its action.
- Touch targets are 48dp (the avatar is 30dp inside a 48dp target).

## Do / Don't

- Do keep the search bar at the top, close to the content it searches.
- Do use surface-container-high on white or tonal surfaces.
- Don't put a surface-container-high bar on a surface-container background; it blends in.
- Do keep the leading slot to one navigation icon button or one decorative search icon.
- Do use at most two trailing icon buttons, or an avatar plus one icon button.
- Do keep the contained bar shape the same when focused; only the margins change.
- Do give results variety: icons, category labels, avatars, filter chips, gaps between groups.
- Do use full-screen on compact windows and docked on medium and larger windows.
- Don't rely on the placeholder alone for the accessible name.

## Minimal implementation

```html
<form class="md-search" role="search">
  <div class="md-search__bar">
    <span class="md-search__leading material-symbols-outlined" aria-hidden="true">search</span>
    <input class="md-search__input" type="search" name="q" placeholder="Search your messages"
           aria-label="Search your messages" aria-controls="results" aria-expanded="false" autocomplete="off">
    <button class="md-search__action" type="button" aria-label="Voice search">
      <span class="material-symbols-outlined">mic</span></button>
    <img class="md-search__avatar" src="me.jpg" alt="Account: Ana">
  </div>
  <ul class="md-search__results" id="results" role="listbox" hidden></ul>
</form>
```

```css
.md-search { position: relative; margin: 0 24px; transition: margin var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized); }
.md-search:focus-within { margin: 0 12px; }
.md-search__bar { display: flex; align-items: center; height: 56px; min-width: 360px; max-width: 720px;
  padding: 0 4px 0 16px; border-radius: var(--md-sys-shape-corner-full);
  background: var(--md-sys-color-surface-container-high); position: relative; }
.md-search__bar::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--md-sys-color-on-surface); opacity: 0; pointer-events: none; }
.md-search__bar:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-search__bar:focus-within { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-search__leading { color: var(--md-sys-color-on-surface); margin-right: 16px; }
.md-search__input { flex: 1; min-width: 0; border: 0; background: none; outline: none;
  color: var(--md-sys-color-on-surface); font: var(--md-sys-typescale-body-large-weight)
  var(--md-sys-typescale-body-large-size)/var(--md-sys-typescale-body-large-line-height) var(--md-sys-typescale-body-large-font); }
.md-search__input::placeholder { color: var(--md-sys-color-on-surface-variant); }
.md-search__action { width: 48px; height: 48px; border: 0; background: none; border-radius: var(--md-sys-shape-corner-full);
  color: var(--md-sys-color-on-surface-variant); cursor: pointer; }
.md-search__avatar { width: 30px; height: 30px; border-radius: 50%; margin: 9px; }
.md-search__results { list-style: none; margin: 2px 0 0; padding: 8px 0; max-height: 66vh; overflow: auto;
  background: var(--md-sys-color-surface-container-high); border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level3); position: absolute; left: 0; right: 0; z-index: 1; }
@media (max-width: 599px) { .md-search__results { position: fixed; inset: 56px 0 0 0; max-height: none; border-radius: 0;
  background: var(--md-sys-color-surface-container-low); } }
```

Fill `.md-search__results` with list items (see lists.md). A React or Vue component should expose `value`, `placeholder`, `leadingAction`, `trailingActions` (max 2), `avatar`, `suggestions`, `layout` ("docked" | "fullscreen"), and emit `search`, `select`, `clear`, `close`.

## Tokens

Unfocused bar: ../tokens/md.comp.search-bar.md. Focused search (styles and layouts): ../tokens/md.comp.search-view.md. Results list: ../tokens/md.comp.list.md. Search app bar: ../tokens/md.comp.app-bar.md.
