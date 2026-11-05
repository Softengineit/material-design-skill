# Snackbar

A snackbar is a short, low-priority message about a process the app performed or will perform, shown near the bottom of the screen without interrupting what the person is doing.

## When to use / when not to use

Use a snackbar when:
- You confirm a completed or upcoming process ("Email archived", "Saved in Vacation album").
- The message is low priority and needs no response, or at most one optional action such as Undo.
- People should be able to keep using the page while the message is visible.

Do not use a snackbar when:
- The message is high priority and requires a decision: use a dialog.
- The message needs an icon, styled text, or inline links: use a dialog, a card, or inline text.
- The snackbar would be the only way to reach a core feature.
- You would show more than one at a time, or stack them.

| Component | Priority | User action |
| --- | --- | --- |
| Snackbar | Low | Optional, disappears on its own |
| Dialog | High | Required, blocks the app until handled |

## Variants

One variant with layout configurations:
- Single line (48dp)
- Single line with action
- Two lines (68dp)
- Two lines with action
- Two lines with a longer action placed on a third line

Behavior types:
- Dismissive (auto-dismiss after 4 to 10 seconds, no action).
- Non-dismissive (has an action, stays until acted on or dismissed).

## Anatomy

1. Container (opaque, inverse-surface, slight shadow)
2. Supporting text (the message, 1 line, up to 2 on compact)
3. Action (optional): one text button with colored label, for example Undo
4. Close icon button (optional): a 24dp close icon

## Specs

| Part | Value |
| --- | --- |
| Container height | 48dp single line (md.comp.snackbar.with-single-line.container.height), 68dp two lines |
| Container color | → md.sys.color.inverse-surface, fully opaque (slight transparency allowed only if text stays readable) |
| Container shape | → md.sys.shape.corner.extra-small (4dp) |
| Container elevation | → md.sys.elevation.level3, shadow → md.sys.color.shadow |
| Padding | 16dp start; 8dp end when there is an action or close icon, 16dp otherwise; 8dp between text and action |
| Supporting text | → md.sys.typescale.body-medium, → md.sys.color.inverse-on-surface |
| Action label | → md.sys.typescale.label-large, → md.sys.color.inverse-primary |
| Action state layers | inverse-primary at 0.08 hover, 0.1 focus, 0.1 pressed |
| Close icon | 24dp, → md.sys.color.inverse-on-surface, state layers inverse-on-surface at 0.08 / 0.1 / 0.1 |
| Width, compact | window width minus fixed side margins (for example 16dp each side) |
| Width, medium and expanded | grows with the text, ideal line length 40 to 60 characters, flexible distance from the trailing edge |
| Margin from the bottom edge | fixed on compact, raised above a FAB or docked toolbar when needed |
| Touch target | action and close button 48dp |

## States and interaction

The container has no interaction states. The action and the close icon have:

| State | Action text button | Close icon button |
| --- | --- | --- |
| Enabled | label inverse-primary | icon inverse-on-surface |
| Hover | state layer inverse-primary at 0.08 | state layer inverse-on-surface at 0.08 |
| Focus | state layer at 0.1 and focus ring | state layer at 0.1 and focus ring |
| Pressed | state layer at 0.1 with ripple | state layer at 0.1 |

Behavior:
- Appears without warning, slides or fades in from the bottom, in front of the main content but above FABs and docked toolbars, never over navigation.
- Without an action, auto-dismisses after 4 to 10 seconds depending on platform. With an action, stays until the action is taken or it is closed.
- Only one snackbar at a time. A new one with updated information may replace the current one immediately. Never stack, never place side by side.
- Do not animate other components (such as the FAB) together with the snackbar; a full-width snackbar may push a FAB up.
- On compact windows it grows from 48dp to 68dp for two lines while keeping its distance from the edges. On wider windows it stays on one line, left or center aligned in a consistent spot, never flush to an edge.

## Accessibility

- Role: `role="status"` (polite live region, announced when the text changes) on a container that exists in the DOM before the message appears. Do not use assertive announcements. If the snackbar appears at launch, it is announced after the page title.
- Focus: do not move focus to the snackbar when it appears, and do not trap focus inside it. Offer a documented keyboard shortcut (for example Alt+G) to move focus to an actionable snackbar. When focus leaves the snackbar, return it to the element that triggered it, or the next logical element.
- Keyboard: Tab moves between the action and the close button; Escape dismisses a focused snackbar.
- Web requirement for auto-dismissing snackbars: also give the same feedback inline near the trigger (a Save button becomes "Saved"), or give the snackbar an action so it does not auto-dismiss. Actionable snackbars never auto-dismiss.
- Keep the default inverse colors so the snackbar stands out from the page and keeps contrast.
- Do not let the snackbar fully cover a focused element; keep it small enough that the focused element remains visible.

## Do / Don't

- Do keep the text to one line when possible, two at most on mobile.
- Don't add icons to the message; pick another component if an icon is needed.
- Don't use bold, styled text or inline links; use the action button instead.
- Do give the action a colored label that differs from the message text.
- Don't make the action a filled or elevated button.
- Do offer Undo for reversible processes.
- Don't add a Dismiss action to a snackbar that disappears on its own.
- Do widen the container on large screens for longer text.
- Don't change the container shape much.
- Do place it in front of the content and above the FAB.
- Don't place it in front of or behind a FAB, in front of navigation, or over frequently used targets.
- Don't stack snackbars or show them side by side.

## Minimal implementation

```html
<div class="md-snackbar-region" role="status" aria-live="polite">
  <div class="md-snackbar" id="snack" hidden>
    <span class="md-snackbar__text">Email archived</span>
    <button class="md-snackbar__action" type="button">Undo</button>
    <button class="md-snackbar__close" type="button" aria-label="Close">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
</div>
```

```css
.md-snackbar-region { position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 3; display: flex;
  justify-content: flex-start; pointer-events: none; }
.md-snackbar { pointer-events: auto; display: flex; align-items: center; gap: 8px; min-height: 48px;
  max-width: 100%; padding: 0 8px 0 16px; box-sizing: border-box; border-radius: var(--md-sys-shape-corner-extra-small);
  background: var(--md-sys-color-inverse-surface); color: var(--md-sys-color-inverse-on-surface);
  box-shadow: var(--md-sys-elevation-level3); font: var(--md-sys-typescale-body-medium-weight)
  var(--md-sys-typescale-body-medium-size)/var(--md-sys-typescale-body-medium-line-height) var(--md-sys-typescale-body-medium-font);
  animation: md-snackbar-in var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate); }
.md-snackbar__text { flex: 1; padding: 14px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.md-snackbar__action, .md-snackbar__close { position: relative; height: 40px; min-width: 48px; border: 0;
  background: none; cursor: pointer; border-radius: var(--md-sys-shape-corner-full); }
.md-snackbar__action { padding: 0 8px; color: var(--md-sys-color-inverse-primary);
  font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) var(--md-sys-typescale-label-large-font); }
.md-snackbar__close { width: 48px; color: var(--md-sys-color-inverse-on-surface); }
.md-snackbar__action::after, .md-snackbar__close::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: currentColor; opacity: 0; }
.md-snackbar__action:hover::after, .md-snackbar__close:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-snackbar__action:active::after, .md-snackbar__close:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-snackbar__action:focus-visible, .md-snackbar__close:focus-visible { outline: 3px solid var(--md-sys-color-inverse-primary); outline-offset: 2px; }
@keyframes md-snackbar-in { from { opacity: 0; transform: translateY(8px); } }
@media (min-width: 600px) { .md-snackbar-region { right: auto; left: 24px; } .md-snackbar { max-width: 560px; } }
```

JS: show by removing `hidden` and setting the text; if there is no action, hide after 4 to 10 seconds; on Escape while focused, hide. A React or Vue component should expose `message`, `action` ({label, onClick}), `closable`, `duration` (ignored when an action exists), and a queue so only one snackbar shows at a time.

## Tokens

Full token list: ../tokens/md.comp.snackbar.md. Alternative for high-priority messages: ../tokens/md.comp.dialog.md.
