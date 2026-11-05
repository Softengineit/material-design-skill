# Side sheets

A side sheet is a surface anchored to the side edge of the window that shows secondary content and actions (filters, details, settings) without replacing the main content.

## When to use / when not to use

Use a side sheet when:
- People need supplementary content or controls that relate to the main content: filters, item details, settings, a list of actions.
- On medium and expanded windows (tablet, desktop), the sheet can stay open beside the content: use a standard side sheet.
- On compact windows (mobile), the sheet must cover the content temporarily: use a modal side sheet.
- The content inside the sheet may have its own sub-navigation (a back button inside the sheet).

Do not use a side sheet when:
- The content is primary navigation: use a navigation rail or drawer.
- The content is a short message needing a decision: use a dialog.
- The content fits better at the bottom on a phone (quick actions, pickers): use a bottom sheet.
- The content needs horizontal scrolling or wide tables; a sheet is narrow.

## Variants

- Standard side sheet: sits beside the content, which shrinks to make room; stays visible while people work with the main content. Container surface, elevation level0, square corners (or corner large when detached with 16dp margins).
- Modal side sheet: slides over the content with a scrim; must be dismissed before using the content underneath. Container surface-container-low, elevation level1, corner large on the start edge (16dp radius toward the content). Supports predictive back on Android.

A modal sheet on small screens can become a standard sheet on larger screens.

## Anatomy

Standard side sheet:
1. Container (required, only required element)
2. Headline
3. Close icon button (required for accessibility)
4. Divider (optional)
5. Content (optional)

Modal side sheet adds:
6. Back icon button (optional, top start)
7. Action buttons (optional, bottom, left-aligned)
8. Scrim

## Specs

| Part | Value |
| --- | --- |
| Container width | 256dp default (md.comp.sheet.side.docked.container.width), max 400dp, resizable to the layout |
| Container height | 100% of the window |
| Standard container | → md.sys.color.surface, elevation → md.sys.elevation.level0, shape → md.sys.shape.corner.none |
| Modal container | → md.sys.color.surface-container-low, elevation → md.sys.elevation.level1, shape → md.sys.shape.corner.large.start |
| Detached container shape | → md.sys.shape.corner.large, with 16dp margins from the window edges |
| Start and end padding | 24dp (16dp start padding when there is a leading icon button) |
| Space between top elements (back, headline, close) | 12dp |
| Headline | → md.sys.typescale.title-large, → md.sys.color.on-surface-variant |
| Icon buttons | 24dp icon in a 48dp target, → md.sys.color.on-surface-variant |
| Divider | → md.sys.color.outline (outline-variant in the color guidance) |
| Bottom actions row | 72dp high, 16dp top padding, 24dp bottom padding, left-aligned |
| Action label (text button) | → md.sys.color.primary; hover, focus, pressed state layers primary at 0.08 / 0.1 / 0.1 |
| Focus indicator | → md.sys.color.secondary, 3dp, outer offset 2dp |
| Scrim (modal) | same as other modal surfaces, scrim color at low opacity |

## States and interaction

The sheet itself has no hover or pressed state. States belong to the elements inside it:
- Icon buttons (back, close): enabled, hover 0.08, focus 0.1, pressed 0.1 state layer on on-surface-variant.
- Action buttons: text or filled buttons with their own states; the sheet tokens give primary label and primary state layers at 0.08 hover, 0.1 focus, 0.1 pressed.
- Open and closed: the sheet animates in from the edge with an enter and exit transition. A standard sheet pushes the body content, which keeps a margin on its trailing edge. A modal sheet slides over it with a scrim.

Behavior:
- Scrolls vertically on its own, independent of the page; never horizontally.
- Placed on the trailing edge (right in LTR) so it does not collide with navigation on the leading edge. Can be inset 16dp but not more.
- In RTL it moves to the left edge and all elements mirror.
- Predictive back (Android, modal): the sheet detaches from the top and bottom edges and scales toward the gesture while the previous screen shows behind.
- Close with the close button, the scrim (modal), Escape, or the back gesture.

## Accessibility

- Role: `role="dialog"` with `aria-labelledby` pointing to the headline. Modal sheets add `aria-modal="true"` and trap focus; standard sheets do not trap focus.
- A close affordance (close icon button) is required in every sheet.
- Focus order inside the sheet: headline, close, then content and actions (for example Cancel, Save).
- Keyboard: Tab moves between enabled icon buttons and actions; Space or Enter activates the focused element; Escape closes a modal sheet. Return focus to the element that opened the sheet when it closes.
- Icon buttons need labels ("Close", "Back").
- Targets are 48dp.

## Do / Don't

- Do place the sheet along the window edge, usually the right side, with at most a 16dp inset.
- Don't push the sheet far from the edges; it hides content and confuses scrolling.
- Do always include a close icon button.
- Don't ship a sheet without a close affordance; people cannot tell if it is permanent.
- Do let the sheet scroll vertically when content is taller than the window.
- Don't allow horizontal scrolling or layouts that look horizontally scrollable.
- Do use a divider to separate action buttons from content, or user content from system content.
- Do use elevation, fill and tone to make the main action stand out among the action buttons.

## Minimal implementation

```html
<div class="md-sheet-scrim" hidden></div>
<aside class="md-side-sheet md-side-sheet--modal" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
  <header class="md-side-sheet__header">
    <button class="md-side-sheet__icon" aria-label="Back"><span class="material-symbols-outlined">arrow_back</span></button>
    <h2 class="md-side-sheet__headline" id="sheet-title">Filters</h2>
    <button class="md-side-sheet__icon" aria-label="Close"><span class="material-symbols-outlined">close</span></button>
  </header>
  <div class="md-side-sheet__content">
    <!-- lists, chips, form controls -->
  </div>
  <hr class="md-side-sheet__divider">
  <footer class="md-side-sheet__actions">
    <button class="md-btn md-btn--filled">Save</button>
    <button class="md-btn md-btn--text">Cancel</button>
  </footer>
</aside>
```

```css
.md-side-sheet { position: fixed; top: 0; right: 0; height: 100%; width: 256px; max-width: 400px;
  display: flex; flex-direction: column; box-sizing: border-box; background: var(--md-sys-color-surface); }
.md-side-sheet--modal { background: var(--md-sys-color-surface-container-low); box-shadow: var(--md-sys-elevation-level1);
  border-radius: var(--md-sys-shape-corner-large) 0 0 var(--md-sys-shape-corner-large); z-index: 2; }
.md-sheet-scrim { position: fixed; inset: 0; background: var(--md-sys-color-scrim); opacity: 0.32; z-index: 1; }
.md-side-sheet__header { display: flex; align-items: center; gap: 12px; padding: 12px 24px 12px 16px; }
.md-side-sheet__headline { flex: 1; margin: 0; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-title-large-weight) var(--md-sys-typescale-title-large-size)/var(--md-sys-typescale-title-large-line-height)
  var(--md-sys-typescale-title-large-font); }
.md-side-sheet__icon { width: 48px; height: 48px; border: 0; background: none; cursor: pointer;
  border-radius: var(--md-sys-shape-corner-full); color: var(--md-sys-color-on-surface-variant); }
.md-side-sheet__icon:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
.md-side-sheet__icon:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-side-sheet__content { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 0 24px; }
.md-side-sheet__divider { border: 0; border-top: 1px solid var(--md-sys-color-outline-variant); margin: 0; }
.md-side-sheet__actions { display: flex; gap: 8px; height: 72px; box-sizing: border-box; padding: 16px 24px 24px; }
[dir="rtl"] .md-side-sheet { right: auto; left: 0; }
[dir="rtl"] .md-side-sheet--modal { border-radius: 0 var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) 0; }
```

For a standard sheet, drop the fixed positioning and place the `<aside>` as the last column of the page layout so the body shrinks. A React or Vue component should expose `open`, `modal`, `headline`, `showBack`, slots for content and actions, and emit `close` and `back`.

## Tokens

Side sheet tokens are in ../tokens/md.comp.sheet.md (md.comp.sheet.side.* for side sheets, md.comp.sheet.bottom.* for bottom sheets). Buttons inside: ../tokens/md.comp.text-button.md, ../tokens/md.comp.filled-button.md. Dividers: ../tokens/md.comp.divider.md.
