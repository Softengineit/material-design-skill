# Sliders

A slider lets people pick a value, or a pair of values, from a continuous or stepped range by dragging a handle along a track, with the change applied immediately.

## When to use / when not to use

Use a slider when:
- The value is on a scale and people benefit from seeing the whole range (volume, brightness, filter intensity, temperature).
- The result of the change can be shown right away.
- A relative scale is enough, or an exact value is shown next to it.

Do not use a slider when:
- The value must be typed precisely: use a text field (or pair the slider with one).
- The choice is between a few discrete options: use a segmented button, chips, or radio buttons.
- The value only applies after a save or submit action, and the effect cannot be previewed.
- A range selection would be vertical (too much cognitive load).

## Variants

- Standard slider (was "continuous"): one handle, the active track starts at the minimum. Can have an inset icon (sizes M, L, XL only).
- Centered slider: one handle, the active track grows from the middle toward the value. For ranges with zero or a default in the center (-50 to 50).
- Range slider: two handles, the active track lies between them. For a minimum and maximum. Horizontal only.

Configurations (M3 Expressive, May 2025):
- Orientation: horizontal (default) or vertical (zero at the bottom).
- Size: XS (default), S, M, L, XL. Larger sizes mean larger targets and more emphasis; XL is for hero moments where the slider is the main element on the page.
- Stop indicators (was "discrete" slider): the handle snaps to fixed values. Every slider also has an end stop on the inactive track for contrast.
- Value indicator: a label with the current value that appears while the handle is pressed or dragged. Optional when the value is shown elsewhere.
- Inset icon: standard slider only, M, L and XL only.

## Anatomy

1. Active track (primary): from the minimum to the handle (standard), from the center to the handle (centered), between the handles (range)
2. Inactive track (secondary-container): the rest of the range
3. Handle: a thin vertical bar (4dp wide) that narrows to 2dp when pressed or focused
4. Stop indicators (optional): 4dp dots on the track; on-secondary-container on the inactive track, on-primary on the active track
5. Value indicator (optional): inverse-surface pill above the handle with inverse-on-surface label-large text
6. Inset icon (optional): inside the active track; moves to the inactive track when there is no room, for example at zero

## Specs

| Attribute | XS | S | M | L | XL |
| --- | --- | --- | --- | --- | --- |
| Track height (active and inactive are equal) | 16dp | 24dp | 40dp | 56dp | 96dp |
| Handle height | 44dp | 44dp | 44dp (token: medium.active.handle.height 44dp; guideline table says 52dp) | 68dp | 108dp |
| Handle width | 4dp | 4dp | 4dp | 4dp | 4dp |
| Track outer corner | 8dp | 8dp | 12dp | 16dp | 28dp |
| Inset icon size | not allowed | not allowed | 24dp (6dp padding) | 24dp (6dp padding) | 32dp (8dp padding) |

Common values:

| Part | Value |
| --- | --- |
| Active track color | → md.sys.color.primary |
| Inactive track color | → md.sys.color.secondary-container |
| Track inner corners (next to the handle) | 2dp; outer corners → md.sys.shape.corner.full |
| Handle color | → md.sys.color.primary, shape corner full, elevation → md.sys.elevation.level1, 6dp space on each side of the handle (space75) |
| Handle outline when two handles overlap (range) | 1dp on-primary |
| Stop indicator | 4dp, corner full, on-secondary-container on inactive track, on-primary on active track, 4dp trailing space |
| Value indicator | container → md.sys.color.inverse-surface, text → md.sys.color.inverse-on-surface, → md.sys.typescale.label-large, 12dp above the handle |
| Label container (value label) | 28dp high, primary with inverse-on-surface label-medium text; guideline table: 44dp high x 48dp wide container |
| State layer | 40dp around the handle, primary |
| Track elevation | level0 |
| Touch target | 48dp on the handle |

## States and interaction

| State | What changes |
| --- | --- |
| Enabled | Handle 4dp wide, primary, elevation level1 |
| Hover | State layer primary at 0.08, handle 4dp, cursor changes |
| Focus | State layer primary at 0.1, handle narrows to 2dp |
| Pressed or dragged | State layer primary at 0.1, handle narrows to 2dp, value indicator appears |
| Disabled | Handle on-surface at 0.38 and elevation level0; active track on-surface at 0.38; inactive track on-surface at 0.12; stop indicators on-surface at 0.38 (selected ones inverse-on-surface) |

Behavior:
- Drag the handle to change the value; with stops, the handle snaps to the nearest stop.
- Tap or click on the track to jump the handle there (or to the nearest stop).
- The value takes effect immediately. If a text field shows the value, both stay in sync and the field comes right after the slider in tab order.
- Range sliders show one value indicator at a time, on the handle being moved.
- At zero, the inset icon may swap (volume to mute).
- In RTL, horizontal values increase from right to left.

## Accessibility

- Role: native `<input type="range">` (role slider) with `min`, `max`, `step`, `value`; or a custom element with `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` for a readable value, and `aria-orientation="vertical"` when vertical. A range slider is two sliders with their own labels (Minimum price, Maximum price).
- The accessible name matches the adjacent text label (`<label for>` or `aria-labelledby`). Stepper icon buttons outside the slider have the button role and their own labels.
- Keyboard: Tab moves focus to the handle. Arrow keys change the value by one step or one stop. Space plus arrows (or Page Up / Page Down) change it by a larger interval. Home and End jump to the first and last values.
- Initial focus lands on the handle.
- Contrast: the end of the inactive track needs 3:1 against the background. Keep the end stop indicator, or place icons or text with 3:1 contrast at each end.
- The handle target is 48dp; the handle narrowing on press is the visual feedback, plus the value indicator.

## Do / Don't

- Do use a horizontal range slider.
- Don't use a range slider vertically.
- Do let inset icons move from the active to the inactive track when space runs out.
- Don't add an inset icon to XS or S sliders (track under 40dp).
- Don't put an inset icon on a centered or range slider; the start of the range becomes unclear.
- Do keep active and inactive tracks the same height.
- Do keep the number of stop indicators small enough to stay readable.
- Do add plus and minus icons or text at the ends when it helps explain the range.
- Do reserve XL for a page where the slider is the main control.
- Do apply the value immediately while dragging.

## Minimal implementation

Native range input styled to the XS standard slider. The active track is drawn with a gradient driven by a custom property that a few lines of JS keep in sync.

```html
<label class="md-slider-label" for="vol">Volume</label>
<div class="md-slider" style="--p: 40%">
  <input class="md-slider__input" id="vol" type="range" min="0" max="100" step="1" value="40"
         aria-valuetext="40 percent">
  <output class="md-slider__value" for="vol" aria-hidden="true">40</output>
</div>
<script>
  document.querySelectorAll('.md-slider__input').forEach(el => el.addEventListener('input', e => {
    const p = (el.value - el.min) / (el.max - el.min) * 100;
    el.parentElement.style.setProperty('--p', p + '%');
    el.setAttribute('aria-valuetext', el.value + ' percent');
    el.nextElementSibling.value = el.value;
  }));
</script>
```

```css
.md-slider { position: relative; height: 44px; display: flex; align-items: center; }
.md-slider__input { -webkit-appearance: none; appearance: none; width: 100%; height: 16px; margin: 0;
  background: linear-gradient(to right, var(--md-sys-color-primary) 0 calc(var(--p) - 6px), transparent calc(var(--p) - 6px) calc(var(--p) + 6px),
    var(--md-sys-color-secondary-container) calc(var(--p) + 6px) 100%);
  border-radius: 8px; outline: none; cursor: pointer; }
.md-slider__input::-webkit-slider-thumb { -webkit-appearance: none; width: 4px; height: 44px;
  background: var(--md-sys-color-primary); border-radius: var(--md-sys-shape-corner-full);
  box-shadow: var(--md-sys-elevation-level1); transition: width var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard); }
.md-slider__input::-moz-range-thumb { width: 4px; height: 44px; border: 0; background: var(--md-sys-color-primary);
  border-radius: var(--md-sys-shape-corner-full); }
.md-slider__input:active::-webkit-slider-thumb, .md-slider__input:focus-visible::-webkit-slider-thumb { width: 2px; }
.md-slider__input:focus-visible { box-shadow: 0 0 0 3px var(--md-sys-color-secondary); }
.md-slider__input:disabled { opacity: 0.38; cursor: default; }
.md-slider::after { content: ""; position: absolute; right: 4px; width: 4px; height: 4px; border-radius: 50%;
  background: var(--md-sys-color-on-secondary-container); } /* end stop indicator */
.md-slider__value { position: absolute; bottom: calc(100% - 4px); left: var(--p); transform: translateX(-50%);
  padding: 4px 12px; border-radius: var(--md-sys-shape-corner-full); background: var(--md-sys-color-inverse-surface);
  color: var(--md-sys-color-inverse-on-surface); font-size: var(--md-sys-typescale-label-large-size); opacity: 0; }
.md-slider:has(.md-slider__input:active) .md-slider__value, .md-slider:has(.md-slider__input:focus-visible) .md-slider__value { opacity: 1; }
```

A React or Vue component should expose `variant` ("standard" | "centered" | "range"), `min`, `max`, `step`, `value` (number or [min, max]), `size` (xs to xl), `orientation`, `stops` (boolean or array), `showValue`, `insetIcon`, `disabled`, and emit `input` continuously and `change` on release.

## Tokens

Common set and size sets (xsmall, small, medium, large, xlarge): ../tokens/md.comp.slider.md. Swap `md.comp.slider.xsmall.*` values with the desired size tokens to change size.
