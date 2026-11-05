# Icon buttons

An icon button is a compact button that shows only a system icon and triggers a common action (open a menu, search) or toggles a binary state (favorite, bookmark).

## When to use / when not to use

Use icon buttons for frequent, easy-to-recognize actions in app bars, toolbars, cards, or directly on the background. Use the default variant to open something (menu, search). Use the toggle variant for on/off actions such as Favorite or Bookmark.

Do not use a toggle icon button for an action without a selected state (an overflow menu button, for example). Only use a few icon buttons at once; in dense layouts group them in a toolbar or a standard button group. Do not apply density by default, because it pushes the touch target under 48dp.

Pick the color style by emphasis: filled (highest) for key actions like Download or Delete, tonal as a middle ground for secondary actions next to a filled one (Raise hand next to End call), outlined for medium emphasis (browsing arrows), standard (lowest) for low emphasis or on colorful surfaces. Use a container (filled, tonal, outlined) whenever the icon needs separation from a busy background.

## Variants

- Default icon button: performs an action. Uses a filled icon.
- Toggle icon button: selected or unselected. Outlined icon when unselected, filled icon when selected (or semibold, then bold, if no filled glyph exists, so selection is shown by two properties, not color alone).

Configurations:
- Color styles: filled (default), tonal, outlined, standard.
- Sizes: extra small 32dp, small 40dp (default), medium 56dp, large 96dp, extra large 136dp.
- Shapes: round (default) and square. Both morph to a squarer shape when pressed; toggle buttons swap round and square at rest when selected.
- Widths: narrow, default, wide (horizontal padding changes, icon stays centered).

## Anatomy

1. Container: visible for filled, tonal and outlined; invisible at rest for standard (appears with the state layer).
2. Icon: a clear system icon, 24dp at the default size.
3. State layer: same color as the icon.
4. Focus indicator: 3dp ring, md.sys.color.secondary, 2dp outer offset.

## Specs

Sizes (md.comp.icon-button.<size>.*), same for all color styles:

| Size | Container height | Icon | Leading/trailing space narrow / default / wide | Square corner | Pressed corner | Selected shape (round / square) | Outline width |
|---|---|---|---|---|---|---|---|
| Extra small | 32dp | 20dp | 4dp / 6dp / 10dp | corner.medium (12dp) | corner.small (8dp) | medium / full | 1dp |
| Small (default) | 40dp | 24dp | 4dp / 8dp / 14dp | corner.medium (12dp) | corner.small (8dp) | medium / full | 1dp |
| Medium | 56dp | 24dp | 12dp / 16dp / 24dp | corner.large (16dp) | corner.medium (12dp) | large / full | 1dp |
| Large | 96dp | 32dp | 16dp / 32dp / 48dp | corner.extra-large (28dp) | corner.large (16dp) | extra-large / full | 2dp |
| Extra large | 136dp | 40dp | 32dp / 48dp / 72dp | corner.extra-large (28dp) | corner.large (16dp) | extra-large / full | 3dp |

Round shape is md.sys.shape.corner.full at every size. Container width = icon + leading + trailing space. Elevation is level0 for all icon buttons (no shadow at any state).

Colors (default, toggle unselected, toggle selected):

| Style | Container | Icon |
|---|---|---|
| Filled | primary | on-primary |
| Filled unselected | surface-container | on-surface-variant |
| Filled selected | primary | on-primary |
| Tonal | secondary-container | on-secondary-container |
| Tonal unselected | secondary-container | on-secondary-container |
| Tonal selected | secondary | on-secondary |
| Outlined | none, outline outline-variant | on-surface-variant |
| Outlined unselected | none, outline outline-variant | on-surface-variant |
| Outlined selected | inverse-surface | inverse-on-surface |
| Standard | none | on-surface-variant |
| Standard unselected | none | on-surface-variant |
| Standard selected | none | primary |

All color tokens are md.sys.color.* names. No label typescale: icon buttons have no text. Other roles are allowed if container and icon keep 3:1 contrast (tertiary / on-tertiary for example).

The older per-style token sets (md.comp.filled-icon-button, filled-tonal-icon-button, outlined-icon-button) are deprecated; they used disabled container opacity 0.12 and surface-container-highest for the unselected filled container.

## States and interaction

- Enabled: table colors.
- Hovered: state layer at 0.08 (md.sys.state.hover.state-layer-opacity).
- Focused: state layer at 0.1 plus focus ring.
- Pressed: state layer at 0.1 and corner radius morphs to the pressed shape of the size.
- Disabled: container on-surface at 0.1, icon on-surface at 0.38; outlined keeps an outline-variant stroke; standard only dims the icon.
- Selected (toggle): colors switch to the selected row, resting shape swaps (round becomes square and the reverse), icon switches to filled or heavier weight.
- Hover on web: show a tooltip with the action name ("Add to favorites"), not the icon name.
- In a standard button group, pressing an icon button changes its width and nudges neighbors (see button-groups.md).

## Accessibility

- Use `<button type="button">` with `aria-label` describing the action (Add to favorites, Bookmark, Send message). For toggles add `aria-pressed`.
- Keyboard: Tab focuses an enabled icon button, Space or Enter activates it.
- Touch target: at least 48x48dp, including extra small (32dp) and small (40dp) sizes and when nested in app bars; add transparent padding or margin. Do not apply density by default; if you offer denser layouts, the density control itself must stay 48x48 CSS px.
- Icon contrast at least 3:1 with the surface or container.
- Selection must be shown by two properties (fill or weight plus color).
- Provide a tooltip on web (hover and focus).

## Do / Don't

- Do use icons whose meaning is obvious (heart for Favorite). Don't use ambiguous glyphs.
- Do give icons a container when they sit on images or busy surfaces. Don't rely on a bare icon over a photo.
- Do use color styles to make the primary action stand out when mixing button types.
- Do use the same size for buttons of equal importance (calculator keys). Do use size or color to emphasize the main action (play versus skip).
- Do use toggle icon buttons only when the icon can be selected. Don't make an overflow menu button a toggle.
- Do switch outlined to filled on selection, or semibold when no filled version exists.
- Don't apply density by default; keep 48dp targets.
- Don't use the filled style everywhere; it is for high emphasis only.

## Minimal implementation

Standard toggle icon button (favorite), small size, round. A framework component should expose `label`, `selected`, `style`, `size`, `shape`, `width` and render one button with one icon.

```html
<button class="md-icon-button md-icon-button--standard" type="button"
        aria-label="Add to favorites" aria-pressed="false" title="Add to favorites">
  <svg class="md-icon-button__icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
          fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>
```

```css
.md-icon-button {
  position: relative; isolation: isolate; overflow: visible;
  display: inline-grid; place-items: center;
  width: 40px; height: 40px; padding: 0; border: none; cursor: pointer;
  border-radius: var(--md-sys-shape-corner-full);
  background: transparent; color: var(--md-sys-color-on-surface-variant);
  transition: border-radius var(--md-sys-motion-duration-short3);
}
.md-icon-button::before { /* 48dp touch target */
  content: ""; position: absolute; inset: -4px;
}
.md-icon-button::after { /* state layer */
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: currentColor; opacity: 0; z-index: -1;
}
.md-icon-button:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-icon-button:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-icon-button:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-icon-button:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-icon-button:active { border-radius: var(--md-sys-shape-corner-small); }
.md-icon-button:disabled { color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); cursor: default; }
.md-icon-button__icon { width: 24px; height: 24px; }
/* toggle selected: filled glyph, primary color, square resting shape */
.md-icon-button--standard[aria-pressed="true"] { color: var(--md-sys-color-primary); border-radius: var(--md-sys-shape-corner-medium); }
.md-icon-button--standard[aria-pressed="true"] path { fill: currentColor; }
/* filled: background primary, color on-primary; tonal: secondary-container / on-secondary-container;
   outlined: border 1px solid outline-variant, color on-surface-variant */
```

## Tokens

- ../tokens/md.comp.icon-button.md (all sizes, widths, shapes, four color styles, toggle states)
- ../tokens/md.comp.filled-icon-button.md, ../tokens/md.comp.filled-tonal-icon-button.md, ../tokens/md.outlined-icon-button.*.md (deprecated per-style sets)
- ../tokens/md.sys.state.md, ../tokens/md.sys.shape.md, ../tokens/md.sys.measurement.md
