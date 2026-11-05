# Loading indicator

A loading indicator is an animated, shape-morphing mark that tells people a short indeterminate process (200ms to 5s) is running.

## When to use / when not to use

Use a loading indicator when:
- A background process takes between 200ms and 5s and its progress cannot be measured, or does not need to be shown.
- You would otherwise have used an indeterminate circular progress indicator (M3 Expressive recommends this component instead).
- You implement pull-to-refresh (Jetpack Compose).
- A button or small area needs to show that its action is still running.

Do not use it when:
- The wait is under 200ms: show the content directly, no indicator.
- The wait is longer than 5s: use a progress indicator (linear or circular), ideally determinate.
- The process starts as indeterminate and will become determinate: start with an indeterminate progress indicator and switch to a determinate one. Never morph a loading indicator into a progress indicator.
- As decoration. It must always reflect a real ongoing process.

Wait time guide:

| Expected wait | Recommendation |
| --- | --- |
| Instant (under 200ms) | No indicator |
| Short (200ms to 5s) | Loading indicator |
| Long (over 5s) | Progress indicator |

## Variants

Only one variant (M3 Expressive, added May 2025), with two configurations:
- Default (uncontained): the active indicator sits directly on a surface. Color primary.
- Contained: the active indicator sits inside a circular container. Use it when the indicator floats over other content and needs more contrast, and always for pull-to-refresh. Container primary-container, indicator on-primary-container.

## Anatomy

1. Active indicator: a looping morph through seven Material 3 shapes.
2. Container (optional): a full-round circle behind the indicator.

## Specs

| Part | Value |
| --- | --- |
| Container size | 48dp x 48dp (md.comp.loading-indicator.container.width / height) |
| Active indicator size | 38dp (md.comp.loading-indicator.active-indicator.size), leaves a margin inside the 48dp |
| Container shape | → md.sys.shape.corner.full |
| Active indicator color, default | → md.sys.color.primary |
| Container color, default token | → md.sys.color.secondary-container (container hidden in the default configuration) |
| Active indicator color, contained | → md.sys.color.on-primary-container |
| Container color, contained | → md.sys.color.primary-container |
| Allowed size range | 24dp to 240dp, 48dp by default. Keep the container to indicator ratio (48:38) when scaling |
| Elevation | none |

There is no label, no typescale and no padding token. Reserve very large sizes (toward 240dp) for large and extra-large windows such as desktop.

## States and interaction

The loading indicator has no hover, focus, pressed or disabled state. It is not interactive. Its only states are:
- Visible and animating: a process is running.
- Hidden: the process is finished or the user navigated away.

Pull-to-refresh behavior (Compose):
- The gesture must cross a threshold before the refresh starts. Releasing before the threshold or reversing the gesture cancels it.
- The indicator stays in view until the refresh is complete and the new content is visible. It must not scroll off-screen.

Placement:
- Loading a page or container: center the indicator in that element.
- Loading more items under existing content: put it in the empty space where the new content will appear, do not overlap existing content.
- Inside a button: replace or sit next to the label while the action runs.

Scale the indicator with the window so it stays proportional to the empty space around it, up to 240dp.

## Accessibility

- Role: `role="progressbar"` without `aria-valuenow` (indeterminate). Add `aria-label` that says what is loading, for example "Loading news articles" or "Refreshing page".
- Consider `aria-busy="true"` on the region being loaded and `aria-live="polite"` on a status message when the result arrives.
- Contrast: the active indicator needs at least 3:1 against the surface or component it sits on. The container itself has no contrast requirement.
- Pull-to-refresh is a gesture and is not accessible on its own. Offer a single-pointer alternative, such as a refresh button in the app bar or a menu item.
- Respect `prefers-reduced-motion`: keep a visible but calmer animation (for example a slow rotation or fade) instead of the full morph.
- No touch target requirement because it is not interactive.

## Do / Don't

- Do move from an indeterminate progress indicator to a determinate one when progress becomes known.
- Don't turn a loading indicator into a determinate progress indicator.
- Do keep the pull-to-refresh indicator visible until the refresh finishes, so people know the whole screen is refreshing.
- Don't let it scroll away, people may think the refresh belongs to one card only.
- Do check that the indicator has at least 3:1 contrast with whatever is behind it.
- Don't use it on a surface where contrast falls under 3:1; switch to the contained configuration.
- Do center it on the page, or in the empty space where new content will land.
- Don't cover existing content with it.

## Minimal implementation

The real component morphs between seven shapes. A framework-free approximation uses CSS animation on an SVG path or a rounded element. Keep the 48dp container and 38dp indicator sizes.

```html
<div class="md-loading" role="progressbar" aria-label="Loading articles">
  <div class="md-loading__indicator"></div>
</div>

<div class="md-loading md-loading--contained" role="progressbar" aria-label="Refreshing page">
  <div class="md-loading__indicator"></div>
</div>
```

```css
.md-loading { width: 48px; height: 48px; display: grid; place-items: center;
  border-radius: var(--md-sys-shape-corner-full); }
.md-loading__indicator { width: 38px; height: 38px; background: var(--md-sys-color-primary);
  animation: md-loading-morph 2.4s var(--md-sys-motion-easing-standard) infinite; }
.md-loading--contained { background: var(--md-sys-color-primary-container); }
.md-loading--contained .md-loading__indicator { background: var(--md-sys-color-on-primary-container); }
@keyframes md-loading-morph {
  0%   { border-radius: 50%; transform: rotate(0deg); }
  25%  { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  50%  { border-radius: 20%; transform: rotate(180deg); }
  75%  { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
  100% { border-radius: 50%; transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .md-loading__indicator { animation: md-loading-spin 3s linear infinite; border-radius: 50%; }
  @keyframes md-loading-spin { to { transform: rotate(360deg); } }
}
```

A React or Vue component should expose `contained` (boolean), `size` (24 to 240, default 48) and `label` (the aria-label). Scale the inner indicator to `size * 38 / 48`.

## Tokens

Full token list: ../tokens/md.comp.loading-indicator.md. Related: ../tokens/md.comp.circular-progress-indicator.md and ../tokens/md.comp.linear-progress-indicator.md for the long-wait alternatives.
