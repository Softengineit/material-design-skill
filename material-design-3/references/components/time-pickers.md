# Time pickers

A time picker is a modal dialog where people set hours, minutes and (in 12h mode) AM or PM, either on a clock dial or by typing into two large fields.

## When to use / when not to use

Use a time picker when:
- Someone sets a specific time: an alarm, a meeting start, a reminder.
- Touch selection on a mobile screen should be easy (dial), or keyboard entry should be fast (input).
- The time format (12h or 24h) comes from system settings and must be respected.

Do not use a time picker when:
- The value needs fine granularity such as seconds or milliseconds (a stopwatch): use text fields or a dedicated control.
- The time is a rough period of day (morning, evening): use chips or radio buttons.
- Space is too small for the dial and the input picker fits better: use the input variant alone.

## Variants

- Time picker dial: a round clock face (256dp) where people tap a number or drag the selector; the selected value also shows in large time selector fields above. 12h dial puts all numbers on one ring; 24h dial puts 0 to 11 on the outer ring and 12 to 23 on the inner ring. Layouts: vertical (default on mobile portrait) and horizontal (landscape or wide windows, fields and dial side by side).
- Time picker input: two text fields for hour and minute (plus AM/PM selector in 12h mode), for keyboard entry. Reachable from the dial with the keyboard icon button; the clock icon switches back.

## Anatomy

Dial variant:
1. Container (dialog surface) with scrim behind
2. Headline (for example "Select time")
3. Time selector containers for hour and minute, with a colon separator; the selected one is highlighted
4. Period selector (AM / PM) with outline, selected period filled
5. Clock dial container with clock dial labels
6. Clock dial selector: center dot, track line and handle on the selected number
7. Icon button (keyboard icon to switch to input)
8. Text buttons (Cancel, OK)

Input variant: container, headline, hour and minute input fields with labels under them ("Hour", "Minute") and a separator, period selector, icon button (clock icon to switch to dial), text buttons.

## Specs

| Part | Dial (md.comp.time-picker) | Input (md.comp.time-input) |
| --- | --- | --- |
| Container | → md.sys.color.surface-container-high, → md.sys.shape.corner.extra-large (28dp), elevation → md.sys.elevation.level3, width and height dynamic | same |
| Container padding | 24dp on all sides, headline left-aligned | 24dp |
| Headline | → md.sys.typescale.label-medium, → md.sys.color.on-surface-variant | same |
| Time selector / input field | 96dp wide (114dp in 24h vertical), 80dp high, → md.sys.shape.corner.small | 96dp wide, 72dp high, corner small |
| Time selector text | → md.sys.typescale.display-large | → md.sys.typescale.display-medium, supporting label body-small on-surface-variant |
| Time selector unselected | container → md.sys.color.surface-container-highest, text on-surface | container surface-container-highest, text on-surface |
| Time selector selected / focused | container → md.sys.color.primary-container, text on-primary-container | container primary-container, text on-primary-container, outline 2dp primary |
| Separator | → md.sys.color.on-surface | same |
| Period selector | vertical 52x80dp, horizontal 216x38dp, corner small, outline 1dp → md.sys.color.outline, label title-medium | 52x72dp, corner small, outline 1dp outline |
| Period selected | → md.sys.color.tertiary-container, text on-tertiary-container | same |
| Period unselected | text on-surface-variant | same |
| Clock dial | 256dp, corner full, → md.sys.color.surface-container-highest; labels body-large, unselected on-surface, selected on-primary | not present |
| Dial selector | handle 48dp primary corner full; center 8dp primary; track 2dp primary | not present |
| Focus indicator | state layers only | → md.sys.color.secondary, 3dp, outer offset 2dp |
| Touch targets | dial numbers 48x48dp | fields and buttons 48dp minimum |

## States and interaction

Time selector, period selector and dial numbers have enabled, hover, focus and pressed states:

| State | Time selector (selected / unselected) | Period selector (selected / unselected) |
| --- | --- | --- |
| Hover | state layer on-primary-container / on-surface at 0.08 | state layer on-tertiary-container / on-surface-variant at 0.08 |
| Focus | state layer at 0.1 | state layer at 0.1 |
| Pressed | state layer at 0.1 | state layer at 0.1 |

Behavior:
- Opens like a dialog with enter and exit transitions, above a scrim, and keeps focus until OK, Cancel, or a tap outside closes it.
- Tapping the hour field makes the dial show hours; tapping the minute field shows minutes. Tapping a number or dragging the handle updates the field at once.
- Typing in the input variant updates the value; the keyboard and clock icon buttons switch between variants.
- Vertical layout in portrait; horizontal layout in landscape or when height is short. If even the horizontal dial does not fit without scrolling, fall back to the input variant. The picker never scrolls and must never be cropped by the screen edge.
- Do not apply density to the dial on a small viewport; use the input picker instead.
- 24h mode is set outside the component (system settings); in 24h mode there is no AM/PM selector.

## Accessibility

- Container: `role="dialog" aria-modal="true" aria-labelledby` pointing to the headline. Focus is trapped while open; Escape acts as Cancel.
- Hour and minute: text inputs labeled "Hour" and "Minute" (`inputmode="numeric"`), even in the dial variant, so keyboard users never depend on the dial.
- AM/PM: a radio group ("AM", "PM"); on Android Views it is exposed as checkboxes in a list.
- Dial numbers: buttons labeled "{value} hours of {total}" or "{value} minutes of {total}" (for example "Hour 7 of 12").
- Icon buttons: "Toggle input picker" (keyboard icon) and "Toggle dial picker" (clock icon). Text buttons: "Cancel", "OK".
- Keyboard: Tab moves between enabled time slots and controls; Space or Enter activates the focused slot; arrow keys may move around the dial.
- When a screen is too small for the dial, show the input picker by default.
- Dial targets are 48x48dp.

## Do / Don't

- Do offer the input picker from any dial picker through the keyboard icon.
- Do make the input picker the default when a dial is not needed or the screen is small.
- Don't apply density to the dial on a constrained viewport; switch to the input picker.
- Do switch to the horizontal layout in landscape so nothing is cropped.
- Don't let the picker scroll or get cut off by the screen edge.
- Do keep hours and minutes in separate fields.
- Don't show the AM/PM selector in 24h mode.
- Do use the dial for quick touch selection and the input for keyboard entry.

## Minimal implementation

Input variant (the dial needs JS geometry; the structure below is the one a dial should wrap).

```html
<div class="md-scrim"></div>
<div class="md-timepicker" role="dialog" aria-modal="true" aria-labelledby="tp-title">
  <h2 class="md-timepicker__headline" id="tp-title">Enter time</h2>
  <div class="md-timepicker__row">
    <label class="md-timepicker__field">
      <input type="text" inputmode="numeric" maxlength="2" value="07" aria-label="Hour">
      <span class="md-timepicker__support">Hour</span>
    </label>
    <span class="md-timepicker__sep" aria-hidden="true">:</span>
    <label class="md-timepicker__field">
      <input type="text" inputmode="numeric" maxlength="2" value="30" aria-label="Minute">
      <span class="md-timepicker__support">Minute</span>
    </label>
    <fieldset class="md-timepicker__period"><legend class="sr-only">Period</legend>
      <label><input type="radio" name="period" value="AM" checked><span>AM</span></label>
      <label><input type="radio" name="period" value="PM"><span>PM</span></label>
    </fieldset>
  </div>
  <div class="md-timepicker__actions">
    <button class="md-icon-btn" aria-label="Toggle dial picker"><span class="material-symbols-outlined">schedule</span></button>
    <span style="flex:1"></span>
    <button class="md-btn md-btn--text">Cancel</button>
    <button class="md-btn md-btn--text">OK</button>
  </div>
</div>
```

```css
.md-scrim { position: fixed; inset: 0; background: var(--md-sys-color-scrim); opacity: 0.32; }
.md-timepicker { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 24px;
  background: var(--md-sys-color-surface-container-high); border-radius: var(--md-sys-shape-corner-extra-large);
  box-shadow: var(--md-sys-elevation-level3); color: var(--md-sys-color-on-surface); }
.md-timepicker__headline { margin: 0 0 20px; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-label-medium-weight) var(--md-sys-typescale-label-medium-size) var(--md-sys-typescale-label-medium-font); }
.md-timepicker__row { display: flex; align-items: flex-start; gap: 12px; }
.md-timepicker__field { display: flex; flex-direction: column; gap: 8px; }
.md-timepicker__field input { width: 96px; height: 72px; box-sizing: border-box; text-align: center; border: 0; outline: none;
  background: var(--md-sys-color-surface-container-highest); border-radius: var(--md-sys-shape-corner-small);
  color: var(--md-sys-color-on-surface); font-size: var(--md-sys-typescale-display-medium-size); }
.md-timepicker__field input:focus { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container);
  box-shadow: inset 0 0 0 2px var(--md-sys-color-primary); }
.md-timepicker__support { font-size: var(--md-sys-typescale-body-small-size); color: var(--md-sys-color-on-surface-variant); }
.md-timepicker__sep { font-size: var(--md-sys-typescale-display-medium-size); line-height: 72px; }
.md-timepicker__period { display: flex; flex-direction: column; width: 52px; height: 72px; margin: 0; padding: 0;
  border: 1px solid var(--md-sys-color-outline); border-radius: var(--md-sys-shape-corner-small); overflow: hidden; }
.md-timepicker__period label { flex: 1; display: grid; place-items: center; cursor: pointer; color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-title-medium-weight) var(--md-sys-typescale-title-medium-size) var(--md-sys-typescale-title-medium-font); }
.md-timepicker__period label:first-of-type { border-bottom: 1px solid var(--md-sys-color-outline); }
.md-timepicker__period input { position: absolute; opacity: 0; }
.md-timepicker__period label:has(input:checked) { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.md-timepicker__actions { display: flex; align-items: center; gap: 8px; margin-top: 24px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
```

A React or Vue component should expose `value` ({hour, minute}), `format` ("12h" | "24h"), `mode` ("dial" | "input"), `layout` ("vertical" | "horizontal"), and emit `confirm` and `cancel`. The dial draws a 256dp circle, places 12 (or 24) 48dp buttons on the ring(s), and rotates a 2dp track and 48dp handle toward the selected value.

## Tokens

Dial variant: ../tokens/md.comp.time-picker.md. Input variant: ../tokens/md.comp.time-input.md. Buttons: ../tokens/md.comp.text-button.md, ../tokens/md.comp.icon-button.md. Related: ../tokens/md.comp.date-picker.md.
