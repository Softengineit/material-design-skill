# Extended FAB

An extended FAB is a floating action button with a text label (and optional icon) for the single primary action of a screen, used when the icon alone would not be clear or when more emphasis is wanted.

## When to use / when not to use

Use an extended FAB:
- On long scrolling screens where one action must stay reachable (Checkout, Publish, New task).
- When a text label is needed to understand the action, for example a plane icon alone is vague but "Find flights" is clear.
- When the primary action needs more weight than a FAB gives.

Do not use it:
- More than once on a screen. Several FABs fight for attention.
- As one option in a set of actions next to other buttons. Use a filled button there.
- On top of toolbars, inside cards or dialogs, or in the upper half of a mobile screen.
- Together with a floating toolbar (a plain FAB can pair with one, an extended FAB cannot).
- With an icon and no label. The label is mandatory.

## Variants

Three sizes, matching the FAB sizes so one can morph into the other:
- Small extended FAB: 56dp high. Replaces the baseline extended FAB (which used label-large text and more padding, now not recommended).
- Medium extended FAB: 80dp high, title-large text. For larger breakpoints.
- Large extended FAB: 96dp high, headline-small text. For a single very prominent action, also acceptable in compact windows.

Six color styles, all with equal contrast: primary-container (default), secondary-container, tertiary-container, primary, secondary, tertiary. Surface styles are baseline-only and not recommended. A "lowered" elevation variant (level1) exists in tokens.

## Anatomy

1. Container: rounded rectangle that hugs its content and grows or shrinks with the label length. Keep 16dp margins from the window edges.
2. Label text: 1 to 2 words that describe the action. Never wrap or truncate; remember localization can lengthen it.
3. Icon (optional): placed before the label (left in LTR, right in RTL). Must match the label's meaning.
4. State layer in the icon/label color, focus ring (3dp, md.sys.color.secondary, 2dp offset).

## Specs

| Size | Height | Leading / trailing space | Icon size | Icon-label gap | Label typescale | Corner shape token | Elevation rest / hover / focus / pressed |
|---|---|---|---|---|---|---|---|
| Small | 56dp | 16dp (space200) | 24dp | 8dp (space100) | md.sys.typescale.title-medium | md.sys.shape.corner.large (16dp) | level3 / level4 / level3 / level3 |
| Medium | 80dp | 26dp | 28dp | 12dp (space150) | md.sys.typescale.title-large | md.sys.shape.corner.large-increased (20dp) | level3 / level4 / level3 / level3 |
| Large | 96dp | 28dp | 36dp | 16dp (space200) | md.sys.typescale.headline-small | md.sys.shape.corner.extra-large (28dp) | level3 / level4 / level3 / level3 |
| Baseline (not recommended) | 56dp, min width 80dp | 16dp leading, 20dp trailing | 24dp | 12dp (space150) | md.sys.typescale.label-large | md.sys.shape.corner.large (16dp) | level3 / level4 / level3 / level3 |

Lowered variant: level1 at rest and pressed, level2 on hover.

| Color style | Container | Label, icon and state layer |
|---|---|---|
| primary-container (default) | md.sys.color.primary-container | md.sys.color.on-primary-container |
| secondary-container | md.sys.color.secondary-container | md.sys.color.on-secondary-container |
| tertiary-container | md.sys.color.tertiary-container | md.sys.color.on-tertiary-container |
| primary | md.sys.color.primary | md.sys.color.on-primary |
| secondary | md.sys.color.secondary | md.sys.color.on-secondary |
| tertiary | md.sys.color.tertiary | md.sys.color.on-tertiary |

## States and interaction

- Enabled: level3 elevation, colors as above.
- Hovered: state layer 0.08 (md.sys.state.hover.state-layer-opacity), elevation level4.
- Focused: state layer 0.1, focus ring, elevation level3.
- Pressed: state layer 0.1, elevation level3.
- No disabled state: hide the extended FAB if its action is unavailable.
- Custom colors: the state layer color must equal the icon and label color.

Behaviors:
- Appearing: the surface expands with an enter transition.
- Expanding: can grow into any surface via the container transform pattern.
- Scrolling: collapses into a FAB when scrolling down and expands again when scrolling up. During expansion the shape changes, the icon slides to the leading side and the label fades in.
- Responsive: in a collapsed navigation rail show a FAB; when the rail expands, morph it into an extended FAB.

## Accessibility

- Use `<button type="button">`. Icon and label are one focusable element. No tooltip is needed because the label is visible.
- Keyboard: Tab moves focus to it, Space or Enter activates it.
- Focus order: prioritize it (after app bar and navigation bar on mobile, skipping body content).
- Accessible name: starts with the same first word as the visible label ("Create" visible, "Create a new invite" as full name). Icon and label must express one purpose.
- Placement: lower trailing corner in compact and medium windows (center-aligned is also fine); bottom right (in both LTR and RTL) or inside the expanded navigation rail in larger windows. Never cover another interactive element.
- Height is 56dp or more, so the touch target is already met.

## Do / Don't

- Do show one prominent action with one extended FAB. Don't put two on the same screen.
- Do use a filled button when the action is part of a group (Back + Finish setup). Don't use an extended FAB there.
- Do keep the label short ("Save") and add an icon for context. Don't let the text wrap ("Save draft in folder").
- Do omit the icon when the label is enough. Don't show an icon without a label.
- Do float it above the UI, clear of app bars and navigation bars. Don't dock it over a toolbar.
- Don't place it in the upper half of a mobile screen, on cards, or in dialogs.
- Don't add a tooltip; the label is already visible.
- Do mirror icon and label order in RTL.

## Minimal implementation

Small extended FAB, primary-container. A framework component should accept `label`, optional `icon`, `size` and `color`, and render container > icon > label.

```html
<button class="md-extended-fab" type="button" aria-label="Compose a new message">
  <svg class="md-extended-fab__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25z"/></svg>
  <span class="md-extended-fab__label">Compose</span>
</button>
```

```css
.md-extended-fab {
  position: fixed; inset-inline-end: 16px; inset-block-end: 16px;
  display: inline-flex; align-items: center; gap: var(--md-sys-measurement-space100);
  height: 56px; padding: 0 var(--md-sys-measurement-space200);
  border: none; cursor: pointer; white-space: nowrap; isolation: isolate; overflow: hidden;
  border-radius: var(--md-sys-shape-corner-large);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  font-family: var(--md-sys-typescale-title-medium-font);
  font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: var(--md-sys-typescale-title-medium-weight);
  line-height: var(--md-sys-typescale-title-medium-line-height);
  letter-spacing: var(--md-sys-typescale-title-medium-tracking);
  box-shadow: var(--md-sys-elevation-level3);
  transition: box-shadow var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
}
.md-extended-fab::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-extended-fab:hover { box-shadow: var(--md-sys-elevation-level4); }
.md-extended-fab:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-extended-fab:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-extended-fab:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-extended-fab:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-extended-fab__icon { width: 24px; height: 24px; fill: currentColor; flex: none; }
/* medium: height 80px, padding 0 26px, gap 12px, icon 28px, title-large, radius large-increased */
/* large:  height 96px, padding 0 28px, gap 16px, icon 36px, headline-small, radius extra-large */
```

## Tokens

- ../tokens/md.comp.extended-fab.md (small, medium, large, baseline, six color styles, lowered, states)
- ../tokens/md.comp.fab.md (for the FAB it collapses into)
- ../tokens/md.sys.typescale.md, ../tokens/md.sys.elevation.md, ../tokens/md.sys.state.md
