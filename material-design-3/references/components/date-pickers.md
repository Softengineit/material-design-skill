# Date pickers

A date picker lets people choose a single date or a date range, either from a calendar grid or by typing, in a docked dropdown or a modal dialog.

## When to use / when not to use

Use a date picker whenever a form needs a date: event date, reservation, flight or hotel range. Pick the variant by context:
- Docked date picker: medium and expanded windows (tablet, desktop). A text field with a calendar dropdown below it; typing and picking are both available at once. Good for near and distant dates.
- Modal date picker: compact windows (mobile), shown as a dialog, full screen on phones for bigger targets. Good for dates near today.
- Modal date input: typing a date or range in a dialog. Use it as the default for dates far away, such as a birth date, or offer a plain text field with a format hint in forms.

Do not use the modal date picker for dates in the distant past or future (use modal input or docked). Do not scale the picker up on large screens; its size is fixed.

## Variants

- Docked: outlined text field, then a 360dp x 456dp panel with month and year menu buttons, previous and next arrows, weekday labels, the day grid, and Cancel / OK text buttons. Month or year menus replace the grid when opened.
- Modal: 360dp x 524dp dialog with a 120dp header (headline and supporting text), a menu button for the year, arrows, weekday labels, the day grid, a divider and text buttons. Configurations: single date, date range (128dp header, vertical month scrolling with month subheads and an in-range highlight), year selection grid.
- Modal date input: 328dp x 512dp dialog with the same header, one or two outlined text fields (MM/DD/YYYY by default), a divider and text buttons. Configurations: single date, date range.
- Full-screen (compact windows): headline, supporting text, close icon, Save text button, divider, month labels, day grid.

Modal picker and modal input swap with the edit (pencil) and calendar icon buttons.

## Anatomy

Docked: outlined text field, month menu button, year menu button, previous and next icon buttons, weekday labels, unselected date, today's date, outside-month date, selected date, text buttons, container. Open menu: header, menu, selected and unselected list items.

Modal: headline, supporting text, header, container, edit icon button, previous and next icon buttons, year menu button, weekdays, today's date, unselected date, selected date, in-range indicator and in-range date (range mode), month subhead (range mode), divider, text buttons.

Modal input: headline, supporting text, header, container, calendar icon button, outlined text field(s), divider, text buttons.

## Specs

| Variant | Container size | Container color | Corner shape | Elevation | Header | Date cell | Selected date | Today | Text typescales |
|---|---|---|---|---|---|---|---|---|---|
| Docked | 360dp x 456dp | md.sys.color.surface-container-high | md.sys.shape.corner.large (16dp) | level3 | 64dp high, menu buttons 40dp high, corner.full, label-large on-surface-variant | 48dp x 48dp, corner.full, 40dp state layer, body-large on-surface | primary container, on-primary text | 1dp primary outline, primary text | weekdays body-large on-surface; outside-month dates on-surface at 0.38; menu list items 48dp, body-large, selected surface-variant |
| Modal | 360dp x 524dp | md.sys.color.surface-container-high | md.sys.shape.corner.extra-large (28dp) | level3 | 120dp x 360dp; headline headline-large on-surface-variant; supporting text label-large on-surface-variant | 40dp x 40dp, corner.full, 40dp state layer, body-large on-surface | primary / on-primary | 1dp primary outline, primary text | weekdays body-large on-surface |
| Modal, range | same | same | same | level3 | 128dp high, headline title-large | same | start and end primary / on-primary | same | in-range indicator secondary-container 40dp high corner.full, in-range text on-secondary-container, month subhead title-small on-surface-variant |
| Modal, year grid | same | same | same | level3 | same | year cell 72dp x 36dp, corner.full | primary / on-primary | | unselected year body-large on-surface-variant |
| Modal date input | 328dp x 512dp | md.sys.color.surface-container-high | md.sys.shape.corner.extra-large | level3 | 120dp x 328dp; headline headline-large; supporting label-large; both on-surface-variant | outlined text field | | | divider outline-variant |

Other colors from the guideline: icon buttons on-surface-variant, text buttons primary, divider outline-variant. Every interactive element keeps a 48x48dp target; do not increase density.

## States and interaction

Date and year cells: enabled, disabled, hovered, focused, pressed (ripple).
- Hovered: state layer in the cell text color at 0.08.
- Focused: state layer at 0.1 and focus ring.
- Pressed: state layer at 0.1 with a ripple.
- Disabled: text at 0.38 opacity (also used for outside-month dates in docked).
- Selected: primary fill, on-primary text. Today: primary outline and text. Range: start and end selected, dates between get the secondary-container band.

Navigation:
- Docked: arrows or month and year dropdown menus; the calendar opens right under the field when the field is focused or the calendar icon is activated.
- Modal: swipe horizontally for months, tap the year to open the year grid and scroll vertically; in range mode scroll months vertically and tap start then end.
- Appearing: modal pickers use the dialog enter and exit transition. Close with OK (confirm), Cancel, or a tap outside; full-screen pickers add a close (x) icon and a Save button. Focus stays in the dialog until then.

## Accessibility

- Always offer typed entry: the text field in the docked picker, the edit icon in the modal picker. The calendar icon is the only entry point to the picker, and the field and the icon are separate tab stops.
- Text field: accessible name states the purpose (Event date) and matches the placeholder; helper text gives the format (MM/DD/YYYY by default) and serves as the field description.
- Format the typed value only after Enter or blur; never insert slashes while typing (input masks confuse screen reader users). Accept dashes, spaces, slashes, dots and missing leading zeros.
- Grid: `role="grid"` for the month, weekday cells as column headers, each date as a `gridcell` button whose label is the full date ("Monday, August 17, 2026"). Weekday abbreviations get a tooltip on hover only (they are not focusable).
- Previous and next month and year buttons and the month and year dropdowns are buttons with their visible label; show keyboard shortcuts in their tooltips and descriptions.
- Keyboard: Enter closes the calendar and saves the selection; Page Up / Page Down move to the same date in the previous or next month; Home / End move to the first or last day of the month; Shift + Page Up / Page Down move a year; Shift + M opens the month list; Shift + Y opens the year list; arrows move between days.
- Remove the optional Clear button when not needed, to save tab stops.
- Date text contrast at least 4.5:1 with the background.
- Modal: `role="dialog"`, `aria-modal="true"`, labelled by the headline, focus trapped and returned on close.

## Do / Don't

- Do use modal date input as the default for far-away dates such as a birthday in 1979.
- Do allow a plain text field with a format hint in forms.
- Don't use the modal calendar picker for distant dates.
- Don't scale the picker responsively to a larger size on big screens.
- Do keep 48dp targets; don't add density.
- Do format after entry; don't mask while typing.
- Do show the full date to screen readers, not just the number.

## Minimal implementation

Reduced modal date picker: header, month navigation, a 7-column grid, actions. A framework component should own the visible month, selected date and open state, generate the grid from the month, and render each day as a gridcell button with a full-date label.

```html
<div class="md-datepicker" role="dialog" aria-modal="true" aria-labelledby="dp-head">
  <header class="md-datepicker__header">
    <p class="md-datepicker__support">Select date</p>
    <h2 id="dp-head" class="md-datepicker__headline">Mon, Aug 17</h2>
  </header>
  <div class="md-datepicker__nav">
    <button type="button" class="md-dp-menu" aria-haspopup="listbox">August 2026 ▾</button>
    <button type="button" class="md-dp-icon" aria-label="Previous month">‹</button>
    <button type="button" class="md-dp-icon" aria-label="Next month">›</button>
  </div>
  <div class="md-datepicker__grid" role="grid" aria-label="August 2026">
    <div role="row"><span role="columnheader" title="Sunday">S</span><span role="columnheader" title="Monday">M</span><!-- ... --></div>
    <div role="row">
      <button type="button" role="gridcell" class="md-dp-day" aria-label="Sunday, August 16, 2026">16</button>
      <button type="button" role="gridcell" class="md-dp-day" aria-selected="true" aria-label="Monday, August 17, 2026">17</button>
      <button type="button" role="gridcell" class="md-dp-day md-dp-day--today" aria-label="Tuesday, August 18, 2026, today">18</button>
    </div>
  </div>
  <div class="md-datepicker__actions">
    <button type="button" class="md-btn md-btn--text">Cancel</button>
    <button type="button" class="md-btn md-btn--text">OK</button>
  </div>
</div>
```

```css
.md-datepicker {
  width: 360px; height: 524px; display: flex; flex-direction: column;
  background: var(--md-sys-color-surface-container-high); color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-extra-large); box-shadow: var(--md-sys-elevation-level3);
}
.md-datepicker__header { height: 120px; box-sizing: border-box; padding: 16px 24px 12px; display: flex; flex-direction: column; justify-content: flex-end; border-bottom: 1px solid var(--md-sys-color-outline-variant); color: var(--md-sys-color-on-surface-variant); }
.md-datepicker__support { margin: 0 0 36px; font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) var(--md-sys-typescale-label-large-font); }
.md-datepicker__headline { margin: 0; font: var(--md-sys-typescale-headline-large-weight) var(--md-sys-typescale-headline-large-size) / var(--md-sys-typescale-headline-large-line-height) var(--md-sys-typescale-headline-large-font); }
.md-datepicker__nav { display: flex; align-items: center; padding: 4px 12px; }
.md-dp-menu { margin-inline-end: auto; height: 40px; padding: 0 8px 0 16px; border: none; background: none; border-radius: var(--md-sys-shape-corner-full); color: var(--md-sys-color-on-surface-variant); font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) var(--md-sys-typescale-label-large-font); cursor: pointer; }
.md-dp-icon { width: 48px; height: 48px; border: none; background: none; border-radius: var(--md-sys-shape-corner-full); color: var(--md-sys-color-on-surface-variant); font-size: 24px; cursor: pointer; }
.md-datepicker__grid { padding: 0 12px; }
.md-datepicker__grid [role="row"] { display: grid; grid-template-columns: repeat(7, 48px); }
.md-datepicker__grid [role="columnheader"] { height: 48px; display: grid; place-items: center; font: var(--md-sys-typescale-body-large-size) var(--md-sys-typescale-body-large-font); }
.md-dp-day {
  position: relative; width: 48px; height: 48px; padding: 0; border: none; background: none; cursor: pointer;
  color: var(--md-sys-color-on-surface); font: var(--md-sys-typescale-body-large-size) var(--md-sys-typescale-body-large-font);
}
.md-dp-day::before { content: ""; position: absolute; inset: 4px; border-radius: var(--md-sys-shape-corner-full); z-index: -1; } /* 40dp state layer */
.md-dp-day:hover::before { background: color-mix(in srgb, currentColor 8%, transparent); }
.md-dp-day:focus-visible { outline: none; } .md-dp-day:focus-visible::before { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-dp-day--today { color: var(--md-sys-color-primary); } .md-dp-day--today::before { border: 1px solid var(--md-sys-color-primary); }
.md-dp-day[aria-selected="true"] { color: var(--md-sys-color-on-primary); } .md-dp-day[aria-selected="true"]::before { background: var(--md-sys-color-primary); border: none; }
.md-dp-day:disabled { color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); cursor: default; }
.md-datepicker__actions { margin-top: auto; display: flex; justify-content: flex-end; gap: 8px; padding: 8px 12px 12px; }
```

Modal day cells use 40dp per the tokens; the 48dp cell above keeps the full touch target in one element.

## Tokens

- ../tokens/md.comp.date-picker.md (docked, modal, range, year selection, menus, all states)
- ../tokens/md.comp.date-input.md (modal date input)
- ../tokens/md.comp.outlined-text-field.md, ../tokens/md.comp.text-button.md, ../tokens/md.comp.divider.md (parts reused)
