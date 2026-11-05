# Buttons

A button lets people trigger one discrete action with a short text label and an optional leading icon.

## When to use / when not to use

Material 3 has 10 button-like components: button, toggle button, icon button, toggle icon button, split button, standard button group, connected button group, FAB, extended FAB, and FAB menu. Pick by emphasis:

- High emphasis (the main action of a screen): FAB, extended FAB, FAB menu, filled button, split button, standard button group. Examples: Create, Compose, Save, Confirm, Send.
- Medium emphasis (important but not the main task): tonal button, elevated button (only when the button needs separation from a busy background), outlined button. Examples: Reply, View all, Add to cart, Cancel or escape a flow.
- Low emphasis (optional or supplementary): connected button group (switch page content, like Walk, Bike, Drive), text button (Learn more, Change account), icon button (Bookmark, Star).

Rules of hierarchy:
- One high-emphasis button per screen. Other buttons must look less important.
- Mix styles on the same screen to focus attention: filled next to text, filled next to outlined, outlined next to text.
- Do not stack buttons vertically when there is room to put them side by side.

Use a button for a discrete action in dialogs, modals, forms, cards and toolbars. Do not use buttons for everything; too many on one screen break the hierarchy. Move low-priority actions to overflow menus, chips, text links or icon buttons. Do not use text buttons as links; use hyperlinked body text for that and never underline a text button.

## Variants

Two variants:
- Default: performs an action on press.
- Toggle (selection): binary on/off state like Save or Favorite. Changes color and shape when selected. Use an outlined icon when unselected and a filled icon when selected (or a heavier weight if no filled version exists). No toggle exists for the text color style.

Five color styles (configurations), in decreasing emphasis:
- Elevated: tonal look plus a level 1 shadow. Use only when the button must stand out from a patterned or image background.
- Filled: primary container. The strongest button after the FAB. For final actions like Save, Join now, Confirm. Ideally one per page. May use tertiary colors.
- Tonal: secondary-container fill. For a lower-priority action that still needs more weight than an outline, like Next in onboarding.
- Outlined: 1dp stroke, no fill at rest. For secondary actions next to a filled button. Place on plain backgrounds; on images add a custom contrasting fill or use filled instead. Looks very close to chips, be careful.
- Text: no container until interaction. Lowest priority, often inside cards, dialogs, snackbars. In dialogs, align text buttons to the trailing edge.

Five sizes: extra small, small (default), medium, large, extra large.
Two shapes: round (fully rounded) and square (radius depends on size). Both morph to a squarer shape when pressed; toggle buttons also swap shape at rest when selected (round becomes square, square becomes round).

Small-button horizontal padding: 16dp is recommended; 24dp is the legacy value and no longer recommended.

## Anatomy

1. Container (fill, outline, or invisible for text style). Width fits the label; it may stretch with the layout but never be narrower than the label.
2. Label text: 1 to 3 words, sentence case, single line, never wrapped or truncated.
3. Icon (optional): 20dp at the default size, leading side (left in LTR, right in RTL). Never two icons, never stacked above the label.
4. State layer: overlay in the label color at hover, focus and pressed opacity.
5. Focus indicator: 3dp ring, md.sys.color.secondary, 2dp outside the container.

## Specs

Sizes (from md.comp.button, same for all color styles):

| Size | Height | Leading / trailing space | Icon | Icon-label gap | Label typescale | Square corner | Pressed corner | Outline width |
|---|---|---|---|---|---|---|---|---|
| Extra small | 32dp | 12dp | 20dp | 4dp (space50) | label-large | corner.medium (12dp) | corner.small (8dp) | 1dp |
| Small (default) | 40dp | 16dp (space200) | 20dp | 8dp (space100) | label-large | corner.medium (12dp) | corner.small (8dp) | 1dp |
| Medium | 56dp | 24dp (space300) | 24dp | 8dp (space100) | title-medium | corner.large (16dp) | corner.medium (12dp) | 1dp |
| Large | 96dp | 48dp (space600) | 32dp | 12dp (space150) | headline-small | corner.extra-large (28dp) | corner.large (16dp) | 2dp |
| Extra large | 136dp | 64dp (space800) | 40dp | 16dp (space200) | headline-large | corner.extra-large (28dp) | corner.large (16dp) | 3dp |

Round shape is md.sys.shape.corner.full at every size. Selected toggle shape at rest: round button takes the square radius of its size, square button takes corner.full.

Color per style (default, toggle unselected, toggle selected). Label and icon always share one color.

| Style | Container | Label and icon | Elevation rest / hover / pressed |
|---|---|---|---|
| Elevated | surface-container-low | primary | level1 / level2 / level1 (disabled level0) |
| Elevated unselected | surface-container-low | primary | same |
| Elevated selected | primary | on-primary | same |
| Filled | primary | on-primary | level0 / level1 / level0 |
| Filled unselected | surface-container | on-surface-variant | same |
| Filled selected | primary | on-primary | same |
| Tonal | secondary-container | on-secondary-container | level0 / level1 / level0 |
| Tonal unselected | secondary-container | on-secondary-container | same |
| Tonal selected | secondary | on-secondary | same |
| Outlined | none, outline outline-variant | on-surface-variant | level0 |
| Outlined unselected | none, outline outline-variant | on-surface-variant | level0 |
| Outlined selected | inverse-surface | inverse-on-surface | level0 |
| Text | none | primary | level0 |

All color tokens above are md.sys.color.* names. Shadow color is md.sys.color.shadow.

## States and interaction

- Enabled: colors from the table above.
- Hovered: state layer in the label color at md.sys.state.hover.state-layer-opacity (0.08). Filled and tonal go to elevation level1, elevated goes to level2.
- Focused: state layer at md.sys.state.focus.state-layer-opacity (0.1) plus the focus ring (3dp, secondary, 2dp offset). Elevation stays at rest value.
- Pressed: state layer at md.sys.state.pressed.state-layer-opacity (0.1). Corner radius morphs to the pressed shape with the fast spatial spring (md.sys.motion.spring.fast.spatial.*). Elevation returns to rest value.
- Disabled: container on-surface at 0.1 opacity, label and icon on-surface at 0.38 opacity, elevation level0. Outlined keeps an outline-variant stroke at reduced opacity.
- Selected (toggle only): container and label switch to the selected colors, resting shape swaps round to square, icon switches outlined to filled.
- Other color roles may be used if container and label keep a 3:1 contrast, for example tertiary with on-tertiary.

## Accessibility

- Use a native `<button>` (role button). For a toggle button add `aria-pressed="true|false"`.
- Keyboard: Tab moves focus to the button, Space or Enter activates it.
- Touch target: extra small (32dp) and small (40dp) buttons must still have a 48x48dp target; add transparent margin or padding.
- Contrast: 3:1 against the background, measured on the container for elevated, filled and tonal, and on the label text for outlined and text styles.
- The accessible name must match the visible label (Done, Send, Reply); extra context can be added.
- At 200% text size the label should fit in two lines on Android; prefer short strings.
- Keep DOM order identical across breakpoints even if buttons move visually.
- For rapid repeated clicks on the web, use a damped motion curve so animations do not pile up.

## Do / Don't

- Do use sentence case ("See all recipes"). Don't use all caps.
- Do let the container width follow the label. Don't set a fixed width smaller than the label, and don't wrap the label.
- Do keep icon and label grouped and centered as the button widens. Don't push them to opposite edges.
- Do place the icon before the label (leading side). Don't center an icon above the label and don't use two icons.
- Do keep toggle labels about the same length in both states ("Start" / "Reset"). Don't swap in a much longer label.
- Do use filled for the single important action, text or outlined for alternatives. Don't fill a screen with many buttons.
- Don't stretch a button across a very wide window; constrain its width or place it next to other content.
- Caution: elevated buttons add emphasis, use them sparingly; outlined buttons can be mistaken for chips.

## Minimal implementation

Filled button, small size, round shape. A React or Vue component should render the same three nodes: container (the button), optional icon, label.

```html
<button class="md-button md-button--filled" type="button">
  <span class="md-button__icon" aria-hidden="true">+</span>
  <span class="md-button__label">Add to cart</span>
</button>
```

```css
.md-button {
  position: relative; overflow: hidden; isolation: isolate;
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--md-sys-measurement-space100);
  height: 40px; padding: 0 var(--md-sys-measurement-space200);
  border: none; border-radius: var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font);
  font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
  line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking);
  white-space: nowrap; cursor: pointer;
  transition: border-radius var(--md-sys-motion-duration-short3), box-shadow var(--md-sys-motion-duration-short3);
}
.md-button::after { /* state layer */
  content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1;
}
.md-button--filled { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.md-button:hover::after  { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-button:hover { box-shadow: var(--md-sys-elevation-level1); }
.md-button:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-button:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-button:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-button:active { border-radius: var(--md-sys-shape-corner-small); box-shadow: none; }
.md-button:disabled {
  background: color-mix(in srgb, var(--md-sys-color-on-surface) 10%, transparent);
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  box-shadow: none; cursor: default;
}
.md-button__icon { width: 20px; height: 20px; font-size: 20px; }
```

Other styles change only the container and label colors: tonal uses secondary-container / on-secondary-container, outlined uses a 1px outline-variant border with on-surface-variant text, text uses transparent background with primary text, elevated uses surface-container-low with primary text and `box-shadow: var(--md-sys-elevation-level1)` at rest.

## Tokens

- ../tokens/md.comp.button.md (common tokens, all sizes, all color styles, toggle states)
- ../tokens/md.comp.filled-button.md, ../tokens/md.comp.filled-tonal-button.md, ../tokens/md.comp.elevated-button.md, ../tokens/md.comp.outlined-button.md, ../tokens/md.comp.text-button.md (legacy per-style sets)
- ../tokens/md.sys.state.md, ../tokens/md.sys.shape.md, ../tokens/md.sys.measurement.md
