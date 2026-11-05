# Bottom sheets

A bottom sheet is a surface anchored to the bottom of a compact or medium window that shows secondary content or actions and can be dismissed to get back to the main content.

## When to use / when not to use

Use a bottom sheet on mobile and medium windows for supplementary content: a share target list, an action menu with icons and descriptions, a music player that stays visible while browsing, location details over a map, filters.

- Standard bottom sheet: content that complements the main screen and should be usable at the same time as the screen (audio player, map info). No scrim.
- Modal bottom sheet: an alternative to an inline menu or a simple dialog on mobile, especially for a long list of actions or items that need descriptions and icons. It blocks the rest of the app until dismissed. Mobile only.

Do not use a bottom sheet for the app's primary content. On desktop and large expanded windows, swap it for a side sheet or a floating sheet with the same content, and for complex multi-step tasks prefer a non-transient surface.

## Variants

- Standard: no scrim, coexists with the page, can have preset heights from a small preview to full screen. At full height it shows an app bar with a collapse icon to return to the initial position.
- Modal: sits on a scrim, opens from a user action (button, overflow icon), initial height capped at 50% of the screen, can then be pulled to full height and scrolled inside. Dismissed by tapping an item, tapping the scrim, swiping down, or a close affordance in its app bar (required when it is full screen).

Both share the same specs apart from the scrim. A "minimized" docked state uses square corners.

## Anatomy

1. Container (required): surface-container-low, 28dp top corners, sized by its content.
2. Drag handle (optional): 32dp x 4dp pill, on-surface-variant at 40% opacity, centered, with 22dp padding above and below; the whole top 48dp strip is the touch target.
3. Scrim (modal only): md.sys.color.scrim over the page. On Android the system draws it.
4. Optional content: list items, dividers, thumbnails, images, video, buttons, an app bar at full height.

## Specs

| Attribute | Value |
|---|---|
| Container color | md.sys.color.surface-container-low |
| Container shape | md.sys.shape.corner.extra-large.top (28dp top-left and top-right, 0 bottom) |
| Minimized container shape | md.sys.shape.corner.none |
| Elevation (standard and modal) | md.sys.elevation.level1 |
| Surface tint layer | md.sys.color.surface-tint |
| Drag handle | 32dp wide, 4dp high, md.sys.color.on-surface-variant at 0.4 opacity, centered, 22dp padding top and bottom |
| Drag handle focus ring | 3dp, md.sys.color.secondary, 2dp outer offset |
| Width | 100% of the window up to 640dp max |
| Top margin | 72dp (window width up to 640dp), 56dp above 640dp |
| Side margins | 0 up to 640dp, 56dp above 640dp |
| Height | variable, driven by content; modal initial height at most 50% of the screen |
| Scrim | md.sys.color.scrim (opacity handled by platform) |
| Resize touch target | top 48dp of the sheet when a drag handle is present |

There is no label typescale on the sheet itself; text inside follows the components placed in it (list items use body-large and so on).

## States and interaction

The sheet has no hover or pressed states. The drag handle is the only interactive part of the container:
- Enabled: handle at 0.4 opacity.
- Focused: focus ring around the handle.
- Pressed or activated: the sheet moves to the next preset height, or closes when at the last one.

Behaviors:
- Heights: a sheet can offer preset positions (preview, half, full). It must be able to cycle through them and close without dragging. Selecting the handle toggles heights; tapping the scrim always closes a modal sheet.
- Expansion toggle: the sheet can also just switch between collapsed and expanded for a predictable footprint.
- Scrolling: content scrolls inside the sheet when it is taller than the visible area; horizontal scrolling rows are allowed and independent of the page.
- Predictive back (Android): swiping back detaches the sheet from the side edges and previews the previous screen; release or fling commits, or cancel.
- Breakpoints: full width in compact windows; max 640dp with 56dp margins in medium and expanded (can be overridden); side sheet on desktop.

## Accessibility

- Modal sheet: `role="dialog"` with `aria-modal="true"` and an `aria-labelledby` pointing at its title; trap focus inside and return focus to the trigger on close; Escape closes it.
- Standard sheet: `role="region"` or `complementary` with an accessible name; no focus trap.
- Drag handle: a `<button>` with a label such as "Resize sheet" or "Expand". Tab moves focus to it; Space or Enter cycles through the preset heights. Label only the handle, not the container.
- Every drag action needs a single-pointer alternative: if no handle can be shown, add a button that changes the height.
- Keep the top 48dp strip as the resize target.
- Provide a visible close affordance when the sheet is full screen.

## Do / Don't

- Do keep bottom sheet content secondary. Don't put the main task in it.
- Do cap the modal sheet's initial height at 50% of the screen so the top actions stay reachable.
- Do let the handle cycle heights and the scrim close the sheet. Don't make dragging the only way to resize.
- Do use full width on mobile and a 640dp max width on tablets. Don't stretch to the full width of a large screen.
- Do swap to a side sheet on desktop.
- Do use dividers to separate groups of actions and lists for menu items.
- Don't use modal bottom sheets outside mobile apps.

## Minimal implementation

Modal bottom sheet with scrim, drag handle, title and a list of actions. A framework component should hold `open`, render the scrim and the sheet in a portal, trap focus, and expose a height cycle on the handle.

```html
<div class="md-sheet-scrim" hidden></div>
<section class="md-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" hidden>
  <button class="md-sheet__handle" type="button" aria-label="Resize sheet"></button>
  <h2 id="sheet-title" class="md-sheet__title">Share photo</h2>
  <ul class="md-sheet__list" role="list">
    <li><button type="button" class="md-sheet__item">Send in a message</button></li>
    <li><button type="button" class="md-sheet__item">Copy link</button></li>
    <li><button type="button" class="md-sheet__item">Save to device</button></li>
  </ul>
</section>
```

```css
.md-sheet-scrim { position: fixed; inset: 0; background: var(--md-sys-color-scrim); opacity: 0.32; z-index: 20; }
.md-sheet {
  position: fixed; inset-inline: 0; bottom: 0; z-index: 21;
  margin: 0 auto; width: 100%; max-width: 640px; max-height: 50vh; overflow-y: auto;
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-large) var(--md-sys-shape-corner-extra-large) 0 0;
  box-shadow: var(--md-sys-elevation-level1);
  padding-bottom: env(safe-area-inset-bottom);
}
.md-sheet[data-height="full"] { max-height: calc(100vh - 72px); }
@media (min-width: 641px) { .md-sheet[data-height="full"] { max-height: calc(100vh - 56px); } }
.md-sheet__handle {
  display: block; width: 32px; height: 4px; margin: 22px auto; padding: 0; border: none;
  border-radius: var(--md-sys-shape-corner-full);
  background: var(--md-sys-color-on-surface-variant); opacity: 0.4; cursor: pointer;
  position: relative;
}
.md-sheet__handle::before { content: ""; position: absolute; inset: -22px -16px; } /* 48dp target */
.md-sheet__handle:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; opacity: 1; }
.md-sheet__title {
  margin: 0; padding: 0 24px 8px;
  font-family: var(--md-sys-typescale-title-large-font); font-size: var(--md-sys-typescale-title-large-size);
  font-weight: var(--md-sys-typescale-title-large-weight); line-height: var(--md-sys-typescale-title-large-line-height);
}
.md-sheet__list { list-style: none; margin: 0; padding: 0; }
.md-sheet__item {
  width: 100%; min-height: 56px; padding: 0 24px; text-align: start; border: none; background: transparent; cursor: pointer;
  color: inherit; font-family: var(--md-sys-typescale-body-large-font); font-size: var(--md-sys-typescale-body-large-size);
}
.md-sheet__item:hover { background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent); }
```

JS: clicking the handle cycles `data-height` through `half`, `full`, then closes; clicking the scrim or pressing Escape closes; a standard sheet omits the scrim, `aria-modal` and the focus trap.

## Complete behaviour, with or without a library

A sheet that only slides up and closes on a button is not finished. The full behaviour, in order of importance:

1. Detents: at least half (50% of the viewport) and full (viewport minus 56px so the app bar stays visible). The sheet opens at half. The handle click and ArrowUp / ArrowDown on the focused handle cycle them; ArrowDown at half closes.
2. Drag: pointer events on the handle (`touch-action: none`, `setPointerCapture`). Dragging up grows the sheet live (no transition while dragging), dragging down translates it; on release, more than 120px down closes, more than 60px up snaps to full, more than 60px down from full snaps to half, otherwise it returns to the current detent with `--md-sys-motion-easing-emphasized` and `duration-medium2`.
3. Dismiss: scrim tap, Escape, swipe down, close icon in the header. All four, every time.
4. Scroll: the body scrolls inside the sheet (`overflow-y: auto`, `overscroll-behavior: contain`), the header and the action row stay fixed (sticky footer with `env(safe-area-inset-bottom)` padding).
5. Focus: focus moves into the sheet on open and back to the trigger on close; `<dialog>` with `showModal()` gives the trap, the scrim and Escape for free.
6. Reduced motion: no translate animation, instant open and close.

With a library, map these to its API instead of coding them: Ionic `ion-modal` with `breakpoints="[0, 0.5, 1]"` and `initialBreakpoint="0.5"`; Vaul (React) `<Drawer snapPoints={[0.5, 1]}>`; Vuetify `v-bottom-sheet`; Angular Material `MatBottomSheet` (no detents, add a height toggle); Material Web has no sheet component. Theme the library component with the surface-container-low background, extra-large top corners and the 32x4px handle.

## Tokens

- ../tokens/md.comp.sheet.md (bottom docked sheet, drag handle, side sheet)
- ../tokens/md.comp.list.md, ../tokens/md.comp.divider.md (content inside)
- ../tokens/md.sys.shape.md (extra-large.top), ../tokens/md.sys.elevation.md
