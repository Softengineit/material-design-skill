# Motion

Material 3 has two motion systems. The physics system (M3 Expressive, May 2025) drives components with springs grouped into motion schemes (expressive, standard). The older easing and duration tokens still drive screen transitions and work as a fallback on the web.
Use motion to show where things come from and go to, keep it short, and respect the reduced-motion setting.

## Duration tokens

| Token | Value | Use |
|---|---|---|
| md.sys.motion.duration.short1 | 50ms | Tiny utility changes |
| short2 | 100ms | Icon swaps, ripple start |
| short3 | 150ms | Small color or opacity changes |
| short4 | 200ms | Selection controls, exits of small elements |
| medium1 | 250ms | Standard enter of small elements |
| medium2 | 300ms | Standard on-screen transitions |
| medium3 | 350ms | Medium-area moves |
| medium4 | 400ms | FAB expanding to a sheet, emphasized enter |
| long1 | 450ms | Large expressive transitions |
| long2 | 500ms | Card expanding to full screen, emphasized on-screen |
| long3 | 550ms | Large transitions |
| long4 | 600ms | Largest user-triggered transitions |
| extra-long1 | 700ms | Ambient motion without user input |
| extra-long2 | 800ms | Ambient |
| extra-long3 | 900ms | Ambient |
| extra-long4 | 1000ms | Carousel auto-advance |

Choosing a duration:
- Scale with the area covered: small region short, full screen long.
- Exits are faster than enters (exit 200ms, enter 400 to 500ms) because the user's attention has already moved on.
- Durations above 600ms are for ambient motion only.

## Easing tokens

| Token | CSS value | Use |
|---|---|---|
| md.sys.motion.easing.emphasized | cubic-bezier(0.2, 0, 0, 1) on the web (the true curve is a two-segment path; CSS uses standard as the fallback) | Begin and end on screen, temporary exits |
| emphasized.decelerate | cubic-bezier(0.05, 0.7, 0.1, 1) | Entering the screen |
| emphasized.accelerate | cubic-bezier(0.3, 0, 0.8, 0.15) | Leaving the screen permanently |
| standard | cubic-bezier(0.2, 0, 0, 1) | Small utility transitions that begin and end on screen |
| standard.decelerate | cubic-bezier(0, 0, 0, 1) | Small element entering |
| standard.accelerate | cubic-bezier(0.3, 0, 1, 1) | Small element leaving |
| legacy | cubic-bezier(0.4, 0, 0.2, 1) | M2 compatibility only |
| legacy.decelerate | cubic-bezier(0, 0, 0.2, 1) | M2 compatibility |
| legacy.accelerate | cubic-bezier(0.4, 0, 1, 1) | M2 compatibility |
| linear | cubic-bezier(0, 0, 1, 1) | Progress and color interpolation only |

Suggested pairs:

| Easing | Duration | Transition |
|---|---|---|
| Emphasized | 500ms | Begin and end on screen |
| Emphasized decelerate | 400ms | Enter the screen |
| Emphasized accelerate | 200ms | Exit the screen |
| Standard | 300ms | Begin and end on screen (small) |
| Standard decelerate | 250ms | Enter (small) |
| Standard accelerate | 200ms | Exit (small) |

Rules:
- Emphasized is the M3 default: fast take-off, soft landing. Standard is for small utilitarian pieces (text field focus, checkbox) and is the web fallback for emphasized.
- An element that exits permanently (dismissed sheet) accelerates off screen. One that exits temporarily (drawer the user can pull back) uses emphasized so it comes to rest just off screen.
- Never ease with `ease-in-out` or `linear` for spatial motion.

## Spring tokens (motion physics system)

A spring is defined by stiffness and damping ratio (plus initial velocity at runtime). Two kinds of tokens:
- Spatial: position, size, rotation, corner radius. May overshoot and bounce.
- Effects: color, opacity, elevation. Damping 1, no overshoot.

Three speeds each: fast (small components: switches, buttons, chips), default (partial-screen: sheets, expanded rail), slow (full-screen).

| Token | Expressive damping / stiffness | Standard damping / stiffness |
|---|---|---|
| md.sys.motion.spring.fast.spatial | 0.6 / 800 | 0.9 / 1400 |
| md.sys.motion.spring.default.spatial | 0.8 / 380 | 0.9 / 700 |
| md.sys.motion.spring.slow.spatial | 0.8 / 200 | 0.9 / 300 |
| md.sys.motion.spring.fast.effects | 1 / 3800 | 1 / 3800 |
| md.sys.motion.spring.default.effects | 1 / 1600 | 1 / 1600 |
| md.sys.motion.spring.slow.effects | 1 / 800 | 1 / 800 |

CSS variables: `--md-sys-motion-spring-<speed>-<kind>-damping` and `-stiffness` hold the standard scheme; the `-expressive` suffixed variants hold the expressive scheme.

- The scheme is chosen once at product level; tokens keep the same names, so switching scheme changes nothing in component code.
- Expressive is the recommended scheme (hero moments, key interactions). Standard is for utilitarian products with minimal bounce.
- Most component motion uses only two tokens: fast spatial and fast effects. Button press shape morphs use fast spatial.
- Springs can be interrupted and retargeted with their current velocity, which tweens cannot do. Prefer a JS spring (Web Animations with a precomputed keyframe set, or libraries such as Motion One, react-spring, Framer Motion `type: "spring"`) for gesture-driven or interruptible motion.

Web conversion of springs to curves (for CSS transitions that will not be interrupted):

| Spring | cubic-bezier | Duration |
|---|---|---|
| Expressive fast spatial | 0.42, 1.67, 0.21, 0.90 | 350ms |
| Expressive default spatial | 0.38, 1.21, 0.22, 1.00 | 500ms |
| Expressive slow spatial | 0.39, 1.29, 0.35, 0.98 | 650ms |
| Expressive fast effects | 0.31, 0.94, 0.34, 1.00 | 150ms |
| Expressive default effects | 0.34, 0.80, 0.34, 1.00 | 200ms |
| Expressive slow effects | 0.34, 0.88, 0.34, 1.00 | 300ms |
| Standard fast spatial | 0.27, 1.06, 0.18, 1.00 | 350ms |
| Standard default spatial | 0.27, 1.06, 0.18, 1.00 | 500ms |
| Standard slow spatial | 0.27, 1.06, 0.18, 1.00 | 750ms |
| Standard fast effects | 0.31, 0.94, 0.34, 1.00 | 150ms |
| Standard default effects | 0.34, 0.80, 0.34, 1.00 | 200ms |
| Standard slow effects | 0.34, 0.88, 0.34, 1.00 | 300ms |

Note that y values above 1 produce the overshoot; browsers accept them in `cubic-bezier()`.

## Transition patterns

Transitions still use easing and duration tokens. Six patterns:

- Container transform: a container (card, list item, FAB, search box, chip) grows into the detail view and shrinks back. Strongest relationship between states and the most expressive. Use for hero moments and shallow hierarchies; avoid in deep hierarchies where it repeats too often. Persistent elements (the container, a hero image) stay visible; other content fades out then in. On the web: View Transitions API with a shared `view-transition-name`, or FLIP with `transform` and `clip-path` under emphasized easing, 500ms.
- Forward and backward: moving down or up one level (inbox to thread). Use the platform default. Android style: slide a short distance along x with a fade (also called shared axis X). Enter 400ms emphasized decelerate, exit 200ms emphasized accelerate.
- Lateral: peers at the same level (tabs, carousel pages, gallery). Content slides as one group with no fade so the swipe gesture is implied. Do not use for hierarchical navigation or for top-level destinations.
- Top level: navigation bar, rail or drawer destinations. The old screen fades out quickly, then the new one fades in (fade through). No shared elements, because destinations are unrelated. Exit 200ms accelerate, enter 250 to 400ms decelerate.
- Enter and exit: a component appears over the current screen. Within bounds (dialog, menu, snackbar, tooltip, FAB): expand along x or y from the edge it belongs to (menu at top grows downward, snackbar at bottom grows upward); do not scale from center or move on z. Beyond bounds (sheets, drawers, app bars, navigation bar): slide in from their edge, with a shape change on Android. Bottom sheet enters with emphasized decelerate and exits with emphasized accelerate; drawer enters and exits with emphasized.
- Skeleton loaders: placeholder blocks with a gentle pulse running from top-left to bottom-right while content loads, then the content fades in on top. Prevents layout jumps.

Quality rules for every transition:
- One main direction per transition; group elements and move them together.
- Fade old content fully out before new content fades in. Cross-fades, if unavoidable, must be short and hidden during the fastest part of the move.
- No jump cuts between screens unless efficiency clearly wins (opening a menu in a pro tool).
- Keep transitions plain. Bouncy springs are for components and hero moments, not for frequent navigation.
- Keep a consistent spatial model: the drawer always comes from the start edge, notifications from the top, sheets and keyboard from the bottom.

## Reduced motion

When the OS setting for reduced motion is on:
- Replace slides, scale and container transforms with short fades.
- Disable parallax, shape morphing, bouncing springs and auto-advancing carousels.
- Keep state changes visible (a selected chip still changes color), just not animated.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .sheet, .drawer, .page { transition-property: opacity; transition-duration: 150ms; }
}
```

In JS check `matchMedia('(prefers-reduced-motion: reduce)').matches` before starting spring or View Transition animations and fall back to opacity.

## CSS snippet

```css
:root {
  --md-ease-emphasized: var(--md-sys-motion-easing-emphasized);           /* 0.2, 0, 0, 1 */
  --md-ease-enter: var(--md-sys-motion-easing-emphasized-decelerate);     /* 0.05, 0.7, 0.1, 1 */
  --md-ease-exit: var(--md-sys-motion-easing-emphasized-accelerate);      /* 0.3, 0, 0.8, 0.15 */
  --md-spring-fast-spatial: cubic-bezier(0.42, 1.67, 0.21, 0.9);          /* expressive, 350ms */
  --md-spring-fast-effects: cubic-bezier(0.31, 0.94, 0.34, 1);            /* 150ms */
}

/* Small component: color change (effects) and shape morph (spatial) */
.chip {
  transition:
    background-color 150ms var(--md-spring-fast-effects),
    color 150ms var(--md-spring-fast-effects),
    border-radius 350ms var(--md-spring-fast-spatial);
}

/* Bottom sheet: enter decelerate 400ms, exit accelerate 200ms */
.sheet { transform: translateY(100%); transition: transform var(--md-sys-motion-duration-short4) var(--md-ease-exit); }
.sheet[open] { transform: translateY(0); transition: transform var(--md-sys-motion-duration-medium4) var(--md-ease-enter); }

/* Top-level fade through: old out 200ms, new in 250ms after a short delay */
.page-exit { animation: md-fade-out var(--md-sys-motion-duration-short4) var(--md-ease-exit) forwards; }
.page-enter { animation: md-fade-in var(--md-sys-motion-duration-medium1) var(--md-ease-enter) 90ms both; }
@keyframes md-fade-out { to { opacity: 0; } }
@keyframes md-fade-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; } }

/* Hover elevation (effects): 200ms standard */
.elevated-card { transition: box-shadow var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard); }
```

Container transform with the View Transitions API:

```css
::view-transition-old(card), ::view-transition-new(card) {
  animation-duration: var(--md-sys-motion-duration-long2); /* 500ms */
  animation-timing-function: var(--md-ease-emphasized);
}
.card { view-transition-name: card; }
```

```js
if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.startViewTransition(() => openDetail());
} else {
  openDetail();
}
```
