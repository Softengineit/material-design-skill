# Tooltips

A tooltip is a small surface that appears on hover, focus or long press to name or explain a UI element without taking the person away from their task.

## When to use / when not to use

Use a tooltip when:
- An icon-only button or field has no visible text and needs a short name (plain tooltip).
- An element or a new feature needs a longer explanation, a definition, or a small set of actions (rich tooltip).
- The information is helpful but not required to complete the task.

Do not use a tooltip when:
- The element already shows a text label that says the same thing.
- The information is critical (for example "this permanently deletes files"): use a dialog.
- The content needs to be read by everyone; tooltips are easy to miss.
- The trigger is an icon button and you want a persistent rich tooltip. Persistent rich tooltips go on larger elements or appear on page load.

## Variants

- Plain tooltip: one short line of text in a dark (inverse-surface) pill-like box, 24dp high. Labels icon buttons and other text-less elements. Appears above the element (below it when the element is in an app bar).
- Rich tooltip: a surface-container card with optional subhead, supporting text, and up to two text buttons or links. Appears to the bottom right of the element by default and repositions in 8dp steps to stay on screen. Can be transient (hover) or persistent (click, or on page load for feature discovery).

Rich tooltip configurations: subhead + text + two buttons; subhead + text + one button; subhead + text; text + one button; text + two buttons.

## Anatomy

Plain tooltip:
1. Container
2. Supporting text

Rich tooltip:
1. Container
2. Subhead (optional)
3. Supporting text
4. Text buttons (optional, up to two), may include an inline link

## Specs

| Part | Plain tooltip | Rich tooltip |
| --- | --- | --- |
| Container height | 24dp | dynamic |
| Padding | 8dp | 12dp top, 8dp bottom, 16dp left and right |
| Container shape | → md.sys.shape.corner.extra-small (4dp) | → md.sys.shape.corner.medium (12dp) |
| Container color | → md.sys.color.inverse-surface | → md.sys.color.surface-container |
| Container elevation | none | → md.sys.elevation.level2, shadow → md.sys.color.shadow (same at rest and hover) |
| Supporting text | → md.sys.typescale.body-small, → md.sys.color.inverse-on-surface | → md.sys.typescale.body-medium, → md.sys.color.on-surface-variant |
| Subhead | none | → md.sys.typescale.title-small, → md.sys.color.on-surface-variant, one line |
| Action label | none | → md.sys.typescale.label-large, → md.sys.color.primary |
| Action state layers | none | primary at 0.08 hover, 0.1 focus, 0.1 pressed |
| Distance from the trigger | 4dp when the trigger has a visual boundary (button), 8dp when it does not (text baseline) | bottom right of the trigger, moves in 8dp increments |
| Max width | one line, avoid wrapping | about 320dp so that two buttons fit side by side |
| Icon size | none | none |
| Touch target | not interactive | buttons 48dp |

## States and interaction

The tooltip container itself has no hover, focus or pressed state. Its states are hidden and visible, plus (rich) transient and persistent. Buttons inside a rich tooltip use text button states (hover 0.08, focus 0.1, pressed 0.1 on primary).

Behavior:
- Show on hover (desktop) or long press (mobile), and also on keyboard focus of the trigger.
- Hide 1.5 seconds after the pointer or focus leaves the trigger region. On desktop a tooltip may sit centered below the trigger and stay while the pointer moves inside the trigger.
- Opening a new tooltip closes any other open one. Only one tooltip at a time.
- Persistent rich tooltips open on click or on page load, ignore hover, and close when the person interacts with another element.
- The tooltip never covers its trigger and never goes off screen.

## Accessibility

- Role: `role="tooltip"` on the container, linked to the trigger with `aria-describedby` (plain tooltip) or `aria-details` / `aria-describedby` (rich tooltip). If the plain tooltip is the only name of an icon button, the button also needs `aria-label` so the name exists when the tooltip is hidden.
- Keyboard: a tooltip must appear on focus of the trigger, not only on hover. Escape hides it. In a rich tooltip, Tab moves top to bottom through the inline link and the buttons; Space or Enter activates the focused element.
- Never trap focus in a rich tooltip; people must be able to continue through the page.
- Keep tooltips on screen long enough to read, and let the pointer move into a rich tooltip without closing it.
- Do not hide critical information in a tooltip; it must not block important content or prevent an action.
- Label every element inside the tooltip according to its own rules (buttons, links).
- Respect `prefers-reduced-motion` for the fade or scale animation.

## Do / Don't

- Do use a plain tooltip to label icon-only buttons.
- Don't add a plain tooltip to a button that already shows the same text.
- Do use a rich tooltip for extra information and actions about an element or a new feature.
- Don't hide critical information in a tooltip; use a dialog.
- Do keep the plain tooltip text to one short line.
- Don't wrap plain tooltips or stuff several facts in them.
- Do summarize a rich tooltip in a short one-line subhead, especially when it opens automatically.
- Don't let the subhead wrap.
- Do keep the two buttons short so they sit side by side.
- Don't stack buttons.
- Don't show two tooltips at the same time.
- Don't put a persistent rich tooltip on an icon button.

## Minimal implementation

```html
<span class="md-tt-anchor">
  <button class="md-icon-btn" aria-label="Settings" aria-describedby="tt-settings">
    <span class="material-symbols-outlined">settings</span>
  </button>
  <span class="md-tooltip" role="tooltip" id="tt-settings">Settings</span>
</span>

<span class="md-tt-anchor">
  <button class="md-btn md-btn--text" aria-describedby="tt-rich">New sharing</button>
  <div class="md-tooltip md-tooltip--rich" role="tooltip" id="tt-rich">
    <div class="md-tooltip__subhead">Share with people</div>
    <div class="md-tooltip__text">Invite others to view or edit this album from the new menu.</div>
    <div class="md-tooltip__actions"><button class="md-btn md-btn--text">Learn more</button></div>
  </div>
</span>
```

```css
.md-tt-anchor { position: relative; display: inline-block; }
.md-tooltip { position: absolute; left: 50%; bottom: calc(100% + 4px); transform: translateX(-50%);
  height: 24px; padding: 0 8px; box-sizing: border-box; white-space: nowrap; z-index: 4;
  background: var(--md-sys-color-inverse-surface); color: var(--md-sys-color-inverse-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-small);
  font: var(--md-sys-typescale-body-small-weight) var(--md-sys-typescale-body-small-size)/24px var(--md-sys-typescale-body-small-font);
  opacity: 0; visibility: hidden; transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard), visibility 0s linear 1.5s; }
.md-tt-anchor:hover .md-tooltip, .md-tt-anchor:focus-within .md-tooltip { opacity: 1; visibility: visible; transition-delay: 0s; }
.md-tooltip--rich { left: 100%; bottom: auto; top: 100%; transform: none; height: auto; white-space: normal;
  width: max-content; max-width: 320px; padding: 12px 16px 8px; text-align: left;
  background: var(--md-sys-color-surface-container); color: var(--md-sys-color-on-surface-variant);
  border-radius: var(--md-sys-shape-corner-medium); box-shadow: var(--md-sys-elevation-level2);
  font: var(--md-sys-typescale-body-medium-weight) var(--md-sys-typescale-body-medium-size)/var(--md-sys-typescale-body-medium-line-height)
  var(--md-sys-typescale-body-medium-font); }
.md-tooltip__subhead { margin-bottom: 4px; font: var(--md-sys-typescale-title-small-weight) var(--md-sys-typescale-title-small-size)/var(--md-sys-typescale-title-small-line-height)
  var(--md-sys-typescale-title-small-font); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.md-tooltip__actions { display: flex; gap: 8px; margin: 8px -8px 0; }
.md-tooltip__actions .md-btn { color: var(--md-sys-color-primary); }
@media (prefers-reduced-motion: reduce) { .md-tooltip { transition: none; } }
```

JS adds: a 1.5s hide delay after the pointer leaves, Escape to hide, closing other tooltips on open, flipping when the tooltip would overflow the viewport (8dp steps), and a `persistent` mode for rich tooltips that opens on click and closes on outside interaction. A React or Vue component should expose `variant` ("plain" | "rich"), `text`, `subhead`, `actions` (max 2), `persistent`, and `placement`.

## Tokens

Plain: ../tokens/md.comp.plain-tooltip.md. Rich: ../tokens/md.comp.rich-tooltip.md. Buttons inside rich tooltips: ../tokens/md.comp.text-button.md.
