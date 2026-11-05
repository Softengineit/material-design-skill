# Radio button

A radio button lets people pick exactly one option from a small set where all options are visible.

## When to use / when not to use

Use radio buttons when:
- Only one option can be selected from a list.
- There are five or fewer options and you want all of them visible at once.
- The choice should take effect immediately (or be saved with the surrounding form or dialog).

Do not use radio buttons when:
- Several options can be selected at the same time: use checkboxes.
- The option is a setting that turns on or off: use a switch.
- Space is tight or there are more than five options: use a select menu (dropdown). Note that a dropdown costs extra clicks and attention.
- Options are nested. Do not nest radio buttons inside a selected radio button.

## Variants

There is a single variant with two selection states:
- Unselected: an outlined ring, on-surface-variant.
- Selected: a ring with a filled inner dot, primary.

Each has enabled, hover, focus, pressed and disabled states.

## Anatomy

1. Radio icon (20dp): the ring, plus the inner dot when selected
2. State layer (40dp circle around the icon)
3. Adjacent label text (required, on-surface, same color whether selected or not)
4. Touch target (48dp)
5. Group: a vertical stack of radio buttons under a group title

## Specs

| Part | Value |
| --- | --- |
| Icon size | 20dp (md.comp.radio-button.icon.size) |
| State layer size | 40dp |
| Target size | 48dp x 48dp |
| Unselected icon color | → md.sys.color.on-surface-variant |
| Selected icon color | → md.sys.color.primary |
| Disabled icon color | → md.sys.color.on-surface at 0.38 opacity (selected and unselected) |
| Label color | → md.sys.color.on-surface, unchanged by selection or interaction |
| Label typescale | → md.sys.typescale.body-large (list item style) or body-medium in dense forms |
| Shape | circular (→ md.sys.shape.corner.full) |
| Padding | icon centered in the 48dp target; 16dp between icon and label in a list item |
| Container color | none, the control sits on the surface |
| Elevation | none |

## States and interaction

| State | Unselected | Selected |
| --- | --- | --- |
| Enabled | ring on-surface-variant | ring and dot primary |
| Hover | icon on-surface, state layer on-surface at 0.08 | icon primary, state layer primary at 0.08 |
| Focus | icon on-surface, state layer on-surface at 0.1, focus ring | icon primary, state layer primary at 0.1 |
| Pressed | icon on-surface, state layer primary at 0.1 with ripple | icon primary, state layer on-surface at 0.1 |
| Disabled | icon on-surface at 0.38 | icon on-surface at 0.38 |

Behavior:
- Clicking or tapping the icon or its label selects the option and unselects the other one in the group.
- A group may start with one option selected (recommended) or none. Once selected, a group cannot go back to no selection. Offer a "None" or "Not applicable" option, or a separate "Clear selection" action, when opting out matters.
- The selection applies immediately unless it lives in a dialog or page that must be saved.
- Do not apply density by default: targets must stay 48x48 CSS pixels. If a denser layout is offered, the control to revert it must itself be 48x48.

## Accessibility

- Native HTML: `<input type="radio" name="group">` with a `<label for>`. The group is a `<fieldset>` with a `<legend>` or an element with `role="radiogroup"` and `aria-labelledby` pointing to the title. Custom implementations use `role="radio"` with `aria-checked`.
- The accessible name of each radio is its visible label; the group's name is its title.
- Keyboard: Tab moves into the group to the selected radio, or the first one if none is selected. Shift+Tab moves into the group to the selected radio, or the last one if none is selected. Arrow keys move focus and select the previous or next radio, wrapping between first and last. Space selects the focused radio; it does nothing if already selected.
- Touch target 48x48dp even though the icon is 20dp and the state layer 40dp.
- Selection is shown by the inner dot and the primary color, so it does not rely on color alone.

## Do / Don't

- Do use radio buttons when only one option can be chosen.
- Do use checkboxes when several options can be chosen.
- Don't nest radio buttons under another radio button.
- Don't let two radio buttons in one group be selected at once.
- Do keep the list to five options or fewer; consider a dropdown when space is limited.
- Do pre-select one option in the group.
- Do stack radio buttons vertically.
- Don't lay them out horizontally.
- Do give every radio button its own clear label, and make the label clickable.

## Minimal implementation

```html
<fieldset class="md-radio-group">
  <legend class="md-radio-group__title">Sort by</legend>
  <label class="md-radio">
    <input type="radio" name="sort" value="relevance" checked>
    <span class="md-radio__icon"></span>
    <span class="md-radio__label">Relevance</span>
  </label>
  <label class="md-radio">
    <input type="radio" name="sort" value="date">
    <span class="md-radio__icon"></span>
    <span class="md-radio__label">Date</span>
  </label>
  <label class="md-radio">
    <input type="radio" name="sort" value="price" disabled>
    <span class="md-radio__icon"></span>
    <span class="md-radio__label">Price</span>
  </label>
</fieldset>
```

```css
.md-radio-group { border: 0; padding: 0; margin: 0; display: flex; flex-direction: column; }
.md-radio-group__title { padding: 0 0 8px; color: var(--md-sys-color-on-surface);
  font: var(--md-sys-typescale-title-small-weight) var(--md-sys-typescale-title-small-size)/var(--md-sys-typescale-title-small-line-height)
  var(--md-sys-typescale-title-small-font); }
.md-radio { display: flex; align-items: center; gap: 16px; min-height: 48px; cursor: pointer;
  color: var(--md-sys-color-on-surface); font: var(--md-sys-typescale-body-large-weight)
  var(--md-sys-typescale-body-large-size)/var(--md-sys-typescale-body-large-line-height) var(--md-sys-typescale-body-large-font); }
.md-radio input { position: absolute; opacity: 0; width: 48px; height: 48px; margin: 0; cursor: pointer; }
.md-radio__icon { position: relative; width: 20px; height: 20px; box-sizing: border-box; border-radius: 50%;
  border: 2px solid var(--md-sys-color-on-surface-variant); margin: 14px; flex: none; }
.md-radio__icon::before { content: ""; position: absolute; inset: -12px; border-radius: 50%; /* 40dp state layer */
  background: var(--md-sys-color-on-surface); opacity: 0; }
.md-radio__icon::after { content: ""; position: absolute; inset: 3px; border-radius: 50%;
  background: var(--md-sys-color-primary); transform: scale(0); transition: transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard); }
.md-radio:hover .md-radio__icon::before { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-radio input:focus-visible + .md-radio__icon::before { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-radio input:focus-visible + .md-radio__icon { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-radio input:active + .md-radio__icon::before { opacity: var(--md-sys-state-pressed-state-layer-opacity); background: var(--md-sys-color-primary); }
.md-radio input:checked + .md-radio__icon { border-color: var(--md-sys-color-primary); }
.md-radio input:checked + .md-radio__icon::before { background: var(--md-sys-color-primary); }
.md-radio input:checked + .md-radio__icon::after { transform: scale(1); }
.md-radio input:disabled + .md-radio__icon { opacity: 0.38; border-color: var(--md-sys-color-on-surface); }
.md-radio input:disabled + .md-radio__icon::after { background: var(--md-sys-color-on-surface); }
.md-radio:has(input:disabled) { cursor: default; }
```

A React or Vue component should wrap the native input, expose `name`, `value`, `checked`, `disabled`, `label`, and emit `change`. A RadioGroup wrapper sets the shared `name`, the title, and the controlled value.

## Tokens

Full token list: ../tokens/md.comp.radio-button.md. Alternatives: ../tokens/md.comp.checkbox.md, ../tokens/md.comp.switch.md, ../tokens/md.comp.filled-select.md.
