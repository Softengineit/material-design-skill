# Dialogs

A dialog is a modal window over a scrim that stops the current task to deliver critical information or ask for a decision, and stays until the person confirms, dismisses, or completes the required action.

## When to use / when not to use

Use a dialog for prompts that must block normal operation: confirming a high-risk action (delete, discard), a required decision (Use location service?), a quick selection (list, date or time picker), or an acknowledgement.

Do not use a dialog for low or medium priority messages; use a snackbar (which can auto-dismiss) or inline UI. A dropdown menu is a less disruptive way to offer options. Dialogs interrupt screen reader flow too, so use them sparingly.

| Component | Importance | Action needed |
|---|---|---|
| Snackbar | low | optional, may auto-dismiss |
| Dialog | high | required, blocks content until acted on |

## Variants

- Basic dialog: a floating container with optional icon, optional headline, supporting text, optional divider, and one or two text buttons. Alerts, confirmations, quick selections, date and time pickers. Centered by default; can be custom-positioned on medium and expanded windows with a 56dp margin from the edges.
- Full-screen dialog: fills the screen on compact windows only. For a series of tasks (create a calendar event), forms with keyboard input, changes that are not saved instantly, or content that opens further dialogs. Header with a close (X) icon, headline and a Save or Create text button; optional divider; 56dp bottom action bar. It is the only dialog another dialog can appear over. A FAB can morph into it with a container transform. On medium and larger windows swap it for a basic dialog.

## Anatomy

Basic: 1 container, 2 icon (optional, 24dp, secondary), 3 headline (optional), 4 supporting text, 5 divider (optional), 6 button labels, 7 scrim. With an icon, icon and headline are center-aligned; without, start-aligned.

Full-screen: 1 container, 2 header region (56dp), 3 close icon (24dp), 4 headline (optional; put long or translated headlines in the content area instead), 5 text button (confirming action), 6 divider (optional).

## Specs

| Attribute | Basic dialog | Full-screen dialog |
|---|---|---|
| Container color | md.sys.color.surface-container-high | md.sys.color.surface |
| Container shape | md.sys.shape.corner.extra-large (28dp) | md.sys.shape.corner.none |
| Elevation | level3 | level0 (header and action bar level2 on scroll) |
| Width | min 280dp, max 560dp | window width, max 560dp |
| Height | dynamic | dynamic (full screen) |
| Padding | 24dp top, left, right, bottom | 24dp top, left, right; 8dp between elements |
| Icon | 24dp, md.sys.color.secondary; 16dp to headline | close icon 24dp, md.sys.color.on-surface |
| Headline | md.sys.typescale.headline-small, md.sys.color.on-surface; 16dp to body | md.sys.typescale.title-large, on-surface, start-aligned, header 56dp high |
| Supporting text | md.sys.typescale.body-medium, md.sys.color.on-surface-variant; 24dp to actions | content follows its own components |
| Actions | text buttons, md.sys.typescale.label-large, md.sys.color.primary, 8dp apart, trailing-aligned | header action label-large primary; bottom action bar 56dp, surface |
| Divider | 1dp, md.sys.color.outline | 1dp, md.sys.color.surface-variant |
| Scrim | md.sys.color.scrim | none (covers the screen) |
| Header on scroll | n.a. | md.sys.color.surface-container, level2 |

## States and interaction

The container has no hover or pressed state. Action buttons use text button states: hover state layer primary at 0.08, focus at 0.1 with focus ring, pressed at 0.1. The confirming button in a basic dialog can be disabled until a choice is made; dismissive actions are never disabled. In a full-screen dialog, never disable the confirming button.

Behavior:
- Enter and exit transition on open and close.
- Focus stays inside until an action is taken or the dialog is dismissed. The dialog must not be hidden or cut off by other elements (except that a basic dialog may cover a full-screen one).
- Scrolling: avoid it. When content must scroll, the headline stays pinned at the top and the buttons at the bottom; the page behind does not scroll.
- Full-screen: Save (or a clear verb like Send, Create) confirms; the X icon, Cancel or Back dismisses. Dismissing with unsaved changes opens a basic dialog asking to discard or keep editing. Do not show a confirmation dialog on the confirming action; only on failure (network error).
- Errors: field errors inline next to the field (text fields have built-in messages; checkboxes and radios need added text); general errors in a basic dialog. Show every error at once.
- Full-screen dialogs reset the perceived elevation so menus and simple dialogs can open above them.

## Accessibility

- Web: basic dialog uses `role="alertdialog"` (or `dialog`), `aria-modal="true"`, `aria-labelledby` pointing at the headline and `aria-describedby` at the supporting text. The accessible name is the headline. Full-screen uses `role="dialog"`.
- Initial focus goes to the first interactive element inside. Tab cycles forward through the dialog's elements (wrapping from last to first), Shift+Tab backward, Space or Enter activates, Escape closes. Return focus to the trigger on close.
- Inert or `aria-hidden` the rest of the page while open.
- Keep headlines short: at 200% text size on Android they should fit in four lines; otherwise offer a way to read the full text.
- Elements inside (text fields, buttons, lists) follow their own guidance.
- The close X is the only navigation control in a full-screen dialog's header.
- Confirmation button closest to the trailing edge (right in LTR, left in RTL); dismissive button before it.

## Do / Don't

- Do use dialogs for blocking prompts and critical decisions. Don't use them for low-priority info; use a snackbar.
- Do write a specific headline ("Use location service?"). Don't write "Are you sure?", "Warning!" or apologies.
- Do put the confirming action nearest the edge and the dismissive one to its left. Don't swap them.
- Do allow one action only when it is an acknowledgement (OK). Don't pair Cancel with "Got it" when no real choice exists.
- Do limit to two actions side by side. Caution: stacked buttons fit longer labels, confirming above dismissive. Caution: a third "Learn more" action leaves the task unfinished; use inline expansion instead.
- Do disable the confirming button until a required choice is made (basic). Don't disable it in a full-screen dialog.
- Do use clear verbs (Create, Send). Don't use Done, OK or Close as the full-screen confirmation.
- Do confirm discarding unsaved changes with a basic dialog. Don't use the confirming action to dismiss.
- Caution: shorten full-screen header text; move long headlines into the content area.
- Do show field errors inline; caution: general errors go in a basic dialog.

## Minimal implementation

Basic dialog with headline, supporting text and two actions, using the native `<dialog>` element for focus trapping and Escape. A framework component should accept `open`, `headline`, `icon`, children and an `actions` slot, and emit confirm or cancel.

```html
<dialog class="md-dialog" id="delete-dialog" aria-labelledby="dlg-title" aria-describedby="dlg-text">
  <h2 id="dlg-title" class="md-dialog__headline">Permanently delete?</h2>
  <p id="dlg-text" class="md-dialog__text">This photo will be removed from all albums and cannot be recovered.</p>
  <div class="md-dialog__actions">
    <button type="button" class="md-btn md-btn--text" data-action="cancel">Cancel</button>
    <button type="button" class="md-btn md-btn--text" data-action="confirm">Delete</button>
  </div>
</dialog>
```

```css
.md-dialog {
  min-width: 280px; max-width: 560px; width: calc(100% - 48px); box-sizing: border-box;
  padding: 24px; border: none; margin: auto;
  background: var(--md-sys-color-surface-container-high); color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-large); box-shadow: var(--md-sys-elevation-level3);
}
.md-dialog::backdrop { background: var(--md-sys-color-scrim); opacity: 0.32; }
.md-dialog__headline {
  margin: 0 0 16px;
  font-family: var(--md-sys-typescale-headline-small-font); font-size: var(--md-sys-typescale-headline-small-size);
  font-weight: var(--md-sys-typescale-headline-small-weight); line-height: var(--md-sys-typescale-headline-small-line-height);
}
.md-dialog__text {
  margin: 0 0 24px; color: var(--md-sys-color-on-surface-variant);
  font-family: var(--md-sys-typescale-body-medium-font); font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height);
}
.md-dialog__actions { display: flex; justify-content: flex-end; gap: 8px; }
.md-btn--text {
  position: relative; isolation: isolate; overflow: hidden; height: 40px; padding: 0 12px; border: none; background: none;
  border-radius: var(--md-sys-shape-corner-full); color: var(--md-sys-color-primary); cursor: pointer;
  font-family: var(--md-sys-typescale-label-large-font); font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight);
}
.md-btn--text::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-btn--text:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-btn--text:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-btn--text:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
/* with icon: add a 24px icon in secondary above the headline and text-align: center on the container */
```

JS: `dialog.showModal()` opens it with the scrim and traps focus; `dialog.close()` on either action; the browser handles Escape. Full-screen variant: `inset: 0; width: 100%; height: 100%; border-radius: 0; background: var(--md-sys-color-surface)` with a 56px header (close icon, title-large headline, primary text button).

## Tokens

- ../tokens/md.comp.dialog.md (basic dialog container, headline, supporting text, icon, divider, actions)
- ../tokens/md.comp.full-screen-dialog.md (container, header, action bar, on-scroll)
- ../tokens/md.comp.text-button.md, ../tokens/md.sys.typescale.md
