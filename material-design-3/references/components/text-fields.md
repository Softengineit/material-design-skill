# Text fields

A text field lets people enter and edit text inside a clearly bounded container, with a label, optional icons, and supporting or error text below.

## When to use / when not to use

Use a text field when:
- Someone must type information: name, email, password, address, payment details, a message.
- The entry belongs in a form or a dialog.
- You need a select (dropdown) or autocomplete: these are text fields with a menu attached (md.comp.filled-select, md.comp.outlined-select, md.comp.filled-autocomplete).

Do not use a text field when:
- The input is a search query: use the search component.
- The value comes from a small fixed set: use radio buttons, chips, or a segmented button.
- The value is on or off: use a switch or checkbox.
- The value is a date or time: use a date picker or time picker (their input modes are built on text fields).

## Variants

Both variants have the same features and behavior; the difference is visual emphasis.
- Filled text field: tonal container (surface-container-highest) with rounded top corners and square bottom corners, and a 1dp active indicator line on the bottom edge that becomes 2dp primary when focused. Higher emphasis.
- Outlined text field: transparent container with a 1dp outline on all sides and 4dp corners; the outline becomes 3dp primary when focused and the label floats into a notch on the top edge. Lower emphasis, good for long forms.

Pick one variant per region. Both can appear in one UI if they are separated by section (for example outlined in a dialog, filled in the page). Never mix them in the same form.

Configurations: supporting text, leading icon, trailing icon, both icons, prefix, suffix, character counter, single line, multi-line (grows), text area (fixed height, scrolls), read-only, required (asterisk).

## Anatomy

1. Container (filled: tonal fill plus bottom active indicator; outlined: outline stroke)
2. Label text: centered in an empty field, floating at the top when populated or focused (body-small size when populated)
3. Input text (body-large) and caret (primary)
4. Leading icon (optional, 24dp)
5. Trailing icon (optional, 24dp): clear, show password, dropdown arrow, voice, error icon, or a 24dp image
6. Prefix and suffix text (optional, on-surface-variant)
7. Supporting text (optional, body-small) or error text; character counter at the trailing end
8. Active indicator (filled) or outline (outlined)

## Specs

| Part | Filled | Outlined |
| --- | --- | --- |
| Container height | 56dp (also the target size) | 56dp |
| Container shape | → md.sys.shape.corner.extra-small.top (4dp top corners) | → md.sys.shape.corner.extra-small (4dp all corners) |
| Container color | → md.sys.color.surface-container-highest | transparent, outline → md.sys.color.outline 1dp |
| Active indicator or outline, enabled | 1dp, → md.sys.color.on-surface-variant | 1dp, → md.sys.color.outline |
| Active indicator or outline, hover | 1dp, on-surface | 1dp, on-surface |
| Active indicator or outline, focus | 2dp, → md.sys.color.primary | 3dp, → md.sys.color.primary |
| Padding | 16dp horizontal without icons, 12dp with icons, 8dp top and bottom, 16dp between icon and text | same; populated label has 4dp horizontal padding in the notch |
| Label | → md.sys.typescale.body-large, → md.sys.color.on-surface-variant; populated size → md.sys.typescale.body-small; focus color primary | same |
| Input text | → md.sys.typescale.body-large, → md.sys.color.on-surface; placeholder, prefix and suffix on-surface-variant | same |
| Caret | → md.sys.color.primary | same |
| Icons | 24dp, → md.sys.color.on-surface-variant | same |
| Supporting text | → md.sys.typescale.body-small, → md.sys.color.on-surface-variant, 4dp top padding, 16dp to the counter, 16dp side padding | same |
| Elevation | level0 at rest, hover and pressed | level0 |
| Hover state layer | → md.sys.color.on-surface at 0.08 on the container | none (outline darkens instead) |
| Focus ring (outlined) | not needed, the 3dp outline is the indicator | → md.sys.color.secondary token exists for keyboard focus |

Select and autocomplete menus: container surface-container, corner extra-small, elevation level2, items 48dp with label-large, selected item surface-container-highest.

## States and interaction

| State | What changes (filled) | What changes (outlined) |
| --- | --- | --- |
| Enabled, empty | label centered on-surface-variant, indicator 1dp on-surface-variant | label centered, outline 1dp outline |
| Enabled, populated | label floats to the top in body-small | label floats into the top outline notch |
| Hover | state layer on-surface 0.08, indicator on-surface, label on-surface-variant | outline on-surface 1dp, label on-surface |
| Focus | indicator 2dp primary, label primary, caret primary | outline 3dp primary, label primary |
| Error | indicator error, label error, supporting text error, trailing error icon error; hover uses on-error-container for indicator and label; focus keeps error | outline error, same text rules |
| Disabled | container on-surface at 0.04; indicator, label, input, icons and supporting text on-surface at 0.38 | outline on-surface at 0.12; text and icons on-surface at 0.38 |
| Read-only | styled like enabled, clearly labeled as read-only, not editable | same |

Behavior:
- Focusing an empty field animates the label from the middle to the top.
- Single-line fields scroll the text horizontally when it exceeds the width. Multi-line fields grow downward and push content. Text areas keep a fixed height and scroll vertically; prefer text areas on the web for long answers.
- Clear icon appears only when there is input. A dropdown arrow means a nested selection menu.
- Error text replaces supporting text (same slot) so the layout does not jump. Error text says how to fix the error, or the most likely error if several are possible. Show an error icon in the trailing slot.
- Required fields show an asterisk after the label and explain it in supporting text or once at the top of the form.
- Do not apply density by default; keep 48x48 CSS pixel targets.
- On large screens, bound the field width with margins or a container; do not stretch it to the full window.

## Accessibility

- Role: native `<input>` or `<textarea>` (role textbox) with a `<label for>` whose text equals the visible label, including the asterisk when required. Select uses `role="combobox"` with `aria-expanded` and a `role="listbox"` menu.
- Supporting text is linked with `aria-describedby`. Error text uses `role="alert"` (or `aria-live="assertive"`) and `aria-invalid="true"` on the input. If both supporting and error text exist, supporting text is announced first.
- Prefix and suffix have readable names ("Euro", "at gmail dot com") through `aria-describedby` or visually hidden text with a unique id.
- Character counter is announced as "Character count, 5 of 20".
- Interactive trailing icons are buttons with an action label ("Show password" / "Hide password", "Clear"). A non-interactive error icon is labeled "Error".
- Keyboard: Tab lands on the field (and then on interactive icons). Enter submits in single-line forms.
- Contrast: the outline or active indicator needs at least 3:1 against the background.
- Adjacent (external) labels, aligned to the leading edge of the container, may replace the internal label.

## Do / Don't

- Do keep label text short and fully visible.
- Don't truncate label text, and don't let it wrap to two lines.
- Do separate filled and outlined fields by region if both are used.
- Don't mix the two variants in one form.
- Do swap supporting text for error text in the same slot.
- Don't show error text in addition to supporting text; it shifts the layout.
- Do show an error icon with the error state.
- Do mark every required field with an asterisk and explain it.
- Do use a text area instead of a growing multi-line field on the web.
- Don't stretch fields across the full width of a large screen with fixed margins.
- Do make sure the outline has 3:1 contrast with the background.

## Minimal implementation

Outlined text field with a floating label, supporting text, and an error state driven by `aria-invalid`.

```html
<div class="md-field">
  <input class="md-field__input" id="email" type="email" placeholder=" " aria-describedby="email-help" required>
  <label class="md-field__label" for="email">Email*</label>
  <span class="md-field__outline" aria-hidden="true"></span>
  <span class="md-field__trailing material-symbols-outlined" aria-hidden="true">error</span>
  <div class="md-field__supporting" id="email-help">Use your company address</div>
</div>
```

```css
.md-field { position: relative; display: grid; padding-top: 8px; width: 100%; max-width: 480px; }
.md-field__input { height: 56px; padding: 0 16px; box-sizing: border-box; border: 0; background: none; outline: none;
  color: var(--md-sys-color-on-surface); caret-color: var(--md-sys-color-primary);
  font: var(--md-sys-typescale-body-large-weight) var(--md-sys-typescale-body-large-size)/var(--md-sys-typescale-body-large-line-height)
  var(--md-sys-typescale-body-large-font); }
.md-field__outline { position: absolute; inset: 8px 0 auto 0; height: 56px; pointer-events: none; box-sizing: border-box;
  border: 1px solid var(--md-sys-color-outline); border-radius: var(--md-sys-shape-corner-extra-small); }
.md-field:hover .md-field__outline { border-color: var(--md-sys-color-on-surface); }
.md-field__input:focus ~ .md-field__outline { border: 3px solid var(--md-sys-color-primary); }
.md-field__label { position: absolute; left: 16px; top: 24px; padding: 0 4px; margin-left: -4px; pointer-events: none;
  color: var(--md-sys-color-on-surface-variant); background: var(--md-sys-color-surface);
  font-size: var(--md-sys-typescale-body-large-size); line-height: var(--md-sys-typescale-body-large-line-height);
  transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard); }
.md-field__input:focus ~ .md-field__label, .md-field__input:not(:placeholder-shown) ~ .md-field__label {
  top: 0; font-size: var(--md-sys-typescale-body-small-size); line-height: var(--md-sys-typescale-body-small-line-height); }
.md-field__input:focus ~ .md-field__label { color: var(--md-sys-color-primary); }
.md-field__trailing { position: absolute; right: 12px; top: 24px; display: none; color: var(--md-sys-color-error); }
.md-field__supporting { padding: 4px 16px 0; color: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-sys-typescale-body-small-size); line-height: var(--md-sys-typescale-body-small-line-height); }
.md-field__input[aria-invalid="true"] ~ .md-field__outline { border-color: var(--md-sys-color-error); }
.md-field__input[aria-invalid="true"] ~ .md-field__label,
.md-field__input[aria-invalid="true"] ~ .md-field__supporting { color: var(--md-sys-color-error); }
.md-field__input[aria-invalid="true"] ~ .md-field__trailing { display: block; }
.md-field__input:disabled ~ .md-field__outline { border-color: var(--md-sys-color-on-surface); opacity: 0.12; }
.md-field__input:disabled, .md-field__input:disabled ~ .md-field__label { opacity: 0.38; }
/* filled variant: give .md-field__outline no side borders, a 1dp bottom border, 4px top radius only,
   and give the input background var(--md-sys-color-surface-container-highest). */
```

A React or Vue component should expose `variant` ("filled" | "outlined"), `label`, `value`, `type`, `supportingText`, `errorText`, `leadingIcon`, `trailingIcon` (with its own action label), `prefix`, `suffix`, `maxLength` (shows the counter), `multiline` or `textarea`, `required`, `disabled`, `readonly`, and emit `input` and `change`.

## Tokens

Filled: ../tokens/md.comp.filled-text-field.md. Outlined: ../tokens/md.comp.outlined-text-field.md. Select menus: ../tokens/md.comp.filled-select.md, ../tokens/md.comp.outlined-select.md. Autocomplete: ../tokens/md.comp.filled-autocomplete.md, ../tokens/md.comp.outlined-autocomplete.md.
