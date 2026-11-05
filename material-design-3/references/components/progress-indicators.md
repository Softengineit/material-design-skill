# Progress indicators

A progress indicator shows the status of an ongoing process, either as a horizontal bar (linear) or a ring (circular), with known (determinate) or unknown (indeterminate) duration.

## When to use / when not to use

Use a progress indicator when:
- A process takes more than 5 seconds (loading an app, submitting a form, saving, downloading).
- Progress can be measured (determinate), or at least the process is known to be running (indeterminate).
- A whole group of items is loading: one indicator for the group.

Do not use a progress indicator when:
- The wait is under 200ms: show the content.
- The wait is 200ms to 5s and progress is unknown: use a loading indicator.
- Every item in a list would get its own indicator. Use one for the group unless items load independently.
- The element is narrower than 40dp (linear).

| Expected wait | Recommendation |
| --- | --- |
| Instant (under 200ms) | No indicator |
| Short (200ms to 5s) | Loading indicator |
| Long (over 5s) | Progress indicator |

Use the same variant for the same kind of process everywhere in the product.

## Variants

- Linear progress indicator: a track that fills from the leading edge to the trailing edge. Best on the edge of a container (top of a page, edge of a card). Mirrored in RTL.
- Circular progress indicator: a ring that fills clockwise from the top. Best centered in an element (page, card, button). Not mirrored in RTL. Size 24dp to 240dp.

Configurations for both:
- Behavior: determinate (default) or indeterminate. Switch from indeterminate to determinate when progress becomes known.
- Track thickness: fixed 4dp, or configurable (thick sample 8dp) in M3 Expressive.
- Shape: flat (default) or wavy (M3 Expressive). Wavy adds amplitude and wavelength and increases the container height; it is for longer processes where an expressive style fits. Avoid wavy in very small sizes.
- Four-color (baseline token sets): the active indicator cycles through four colors.

## Anatomy

1. Active indicator: the filled part, primary color. Appears as a dot at very low percentages.
2. Track: the unfilled part, secondary-container.
3. Stop indicator (linear determinate only): a 4dp dot at the end of the track, primary. Required when the track has less than 3:1 contrast with the surface behind it.

## Specs

| Variant / config | Value |
| --- | --- |
| Linear, default | height 4dp, active indicator 4dp, track 4dp, 4dp gap between active indicator and track (space50), stop indicator 4dp |
| Linear, thick | height 8dp, active indicator 8dp, track 8dp, gap 4dp, stop indicator 4dp with 2dp trailing space |
| Linear, wavy | container height 10dp (thick 14dp), amplitude 3dp, wavelength 40dp (indeterminate 20dp) |
| Linear inset | 4dp from each edge of the screen or element, minimum |
| Circular, default | size 40dp, active indicator 4dp, track 4dp, 4dp gap |
| Circular, thick | size 52dp, active indicator 8dp, track 8dp, gap 4dp |
| Circular, wavy | size 48dp, amplitude 1.6dp, wavelength 15dp |
| Circular size range | 24dp to 240dp; very large sizes only on large windows |
| Active indicator color | → md.sys.color.primary |
| Track color | → md.sys.color.secondary-container (baseline linear track: surface-container-highest) |
| Stop indicator color | → md.sys.color.primary |
| Shapes | active indicator, track and stop indicator → md.sys.shape.corner.full (baseline sets used corner none) |
| Elevation | none |
| Inside a button | active indicator takes the button label or icon color, track removed, flat shape |

Baseline sets (not recommended any more): md.comp.linear-progress-indicator (4dp, square corners) and md.comp.circular-progress-indicator (48dp, 4dp stroke).

## States and interaction

The component is not interactive. It has no hover, focus, pressed or disabled state. Its states are:
- Determinate at N%: the active indicator covers N% of the track with a 4dp gap before the track resumes. At 0 to 1% it appears as a dot.
- Indeterminate: the active indicator grows and shrinks repeatedly along the track (linear) or around the ring (circular).
- Complete: the active indicator fills the track and the component usually disappears.

Motion: linear runs leading to trailing edge; circular starts at the top and goes clockwise. Determinate values must reflect real progress. When more information arrives, animate from indeterminate to determinate rather than swapping components.

Placement:
- Top of a page: the whole page is loading.
- Edge of a card: only the card content is loading. If the card expands, put it on the expanding edge.
- Circular centered on the loading element, or in the empty space where new items will appear.
- In a button: a small circular indicator for short indeterminate actions; do not add one to every button in a list.

## Accessibility

- Role: `role="progressbar"`. Determinate: `aria-valuemin="0" aria-valuemax="100" aria-valuenow="N"`. Indeterminate: omit `aria-valuenow`. Native `<progress>` also works for linear.
- `aria-label` describes the process and the affected content: "Loading news article", "Refreshing page", "Loading my episodes".
- Contrast: the active indicator needs 3:1 against the surface or component behind it. When the linear track has less than 3:1 with its surroundings, keep the stop indicator so the end of the track is visible.
- Linear indicators are mirrored in RTL; circular ones are not.
- Respect `prefers-reduced-motion` for indeterminate and wavy animations (slower or static fallback).
- Not interactive, so no touch target requirement.

## Do / Don't

- Do show one indicator for a group of loading items.
- Don't show a separate indicator for each activity in the group.
- Do use circular indicators in buttons for short indeterminate actions under 5 seconds.
- Don't put progress indicators on every button in a list.
- Do use the stop indicator when the indicator sits in a low-contrast container.
- Don't remove the stop indicator unless the indicator has at least 3:1 contrast with every adjacent surface.
- Do make sure the indicator color has at least 3:1 contrast against the surface it sits on.
- Don't use a color under 3:1 contrast.
- Do keep the same variant for the same process across the product.
- Do span the full width of the element for linear indicators, with 4dp end padding minimum.

## Minimal implementation

```html
<div class="md-progress" role="progressbar" aria-label="Loading news article"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" style="--value: 40">
  <div class="md-progress__active"></div>
  <div class="md-progress__track"></div>
  <div class="md-progress__stop"></div>
</div>

<div class="md-progress md-progress--indeterminate" role="progressbar" aria-label="Loading my episodes">
  <div class="md-progress__active"></div>
  <div class="md-progress__track"></div>
</div>
```

```css
.md-progress { position: relative; display: flex; align-items: center; gap: 4px; height: 4px;
  width: 100%; padding: 0 4px; box-sizing: border-box; }
.md-progress__active { height: 4px; width: calc(var(--value, 0) * 1%); flex: none;
  background: var(--md-sys-color-primary); border-radius: var(--md-sys-shape-corner-full);
  transition: width var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard); min-width: 4px; }
.md-progress__track { height: 4px; flex: 1; background: var(--md-sys-color-secondary-container);
  border-radius: var(--md-sys-shape-corner-full); }
.md-progress__stop { position: absolute; right: 4px; width: 4px; height: 4px;
  border-radius: var(--md-sys-shape-corner-full); background: var(--md-sys-color-primary); }
.md-progress--indeterminate .md-progress__active { position: absolute; left: 4px; right: 4px; width: auto;
  animation: md-progress-indet 1.5s var(--md-sys-motion-easing-standard) infinite; }
@keyframes md-progress-indet {
  0%   { left: 4px; right: 100%; }
  50%  { left: 30%; right: 30%; }
  100% { left: 100%; right: 4px; }
}
@media (prefers-reduced-motion: reduce) { .md-progress--indeterminate .md-progress__active { animation-duration: 3s; } }
[dir="rtl"] .md-progress { flex-direction: row-reverse; }
[dir="rtl"] .md-progress__stop { right: auto; left: 4px; }
```

For the circular variant, use an SVG circle with `stroke="var(--md-sys-color-primary)"`, `stroke-width="4"`, `stroke-linecap="round"`, and set `stroke-dasharray` / `stroke-dashoffset` from the value; add a second circle underneath for the track in secondary-container with a 4dp gap. A React or Vue component should expose `variant` ("linear" | "circular"), `value` (number or undefined for indeterminate), `thick`, `wavy`, `size` (circular), `label`, and `showStopIndicator`.

## Tokens

Current token set (linear and circular, flat and wavy, default and thick): ../tokens/md.comp.progress-indicator.md. Baseline sets: ../tokens/md.comp.linear-progress-indicator.md and ../tokens/md.comp.circular-progress-indicator.md. Short waits: ../tokens/md.comp.loading-indicator.md.
