# Checkbox

A checkbox is an 18dp square control that lets people select one or more related options from a list, with a selected, unselected, and indeterminate state.

## When to use / when not to use

Use checkboxes to:
- Select several related options from a list (toppings, genres, filters).
- Show a list with sub-selections under a parent checkbox (select all).
- Turn an item on or off in a desktop environment.
- Visually group similar options.

Compared with the other selection controls: radio buttons pick one option from a list; switches handle standalone or wordier settings. Do not use switches for a list of related options; checkboxes take less space and show the items belong together. On large screens, group checkboxes in a contained region such as a side sheet.

## Variants

One component with three selection states:
- Unselected: outlined square.
- Selected: filled square with a checkmark.
- Indeterminate: filled square with a dash, used on a parent checkbox when only some children are selected.

Each state also has an error version (unselected, selected, indeterminate).

## Anatomy

1. Container: 18dp square with 2dp corners; 2dp outline when unselected, solid fill when selected or indeterminate.
2. Icon: 18dp checkmark or dash, centered.
3. State layer: 40dp circle (md.sys.shape.corner.full) around the container.
4. Adjacent text label (outside the component): on-surface, unchanged by selection or interaction.
5. Focus indicator: 3dp, md.sys.color.secondary, 2dp outer offset.

## Specs

| Attribute | Value |
|---|---|
| Container size | 18dp x 18dp |
| Container shape | rounded corners 2dp |
| Icon size | 18dp, centered |
| State layer | 40dp, md.sys.shape.corner.full |
| Touch target | 48dp |
| Elevation | level0 in all states |
| Label typescale (adjacent text) | md.sys.typescale.body-large, color md.sys.color.on-surface |

Colors (md.comp.checkbox.*):

| State | Container / outline | Icon | State layer color |
|---|---|---|---|
| Unselected enabled | 2dp outline on-surface-variant, no fill | none | on-surface (hover, focus), primary (pressed) |
| Unselected hover, focus, pressed | 2dp outline on-surface | none | as above |
| Unselected disabled | 2dp outline on-surface at 0.38 | none | none |
| Selected enabled | fill primary, no outline | on-primary | primary (hover, focus), on-surface (pressed) |
| Selected disabled | fill on-surface at 0.38 | surface | none |
| Indeterminate | same as selected | dash in on-primary | same as selected |
| Error unselected | 2dp outline error | none | error |
| Error selected or indeterminate | fill error | on-error | error |

All color tokens are md.sys.color.* names.

## States and interaction

- Enabled: colors above.
- Hovered: state layer at md.sys.state.hover.state-layer-opacity (0.08); unselected outline darkens to on-surface.
- Focused: state layer at 0.1, plus focus ring.
- Pressed: state layer at 0.1 with a ripple (primary for unselected, on-surface for selected).
- Disabled: 0.38 opacity on outline or fill; icon surface on a selected disabled box.
- Error: outline or fill and state layer switch to error; use when a required selection is missing or invalid.
- Selection: clicking the box or its label toggles it immediately. If the checkbox turns a feature on or off, apply the change at once.
- Parent and children: checking the parent checks every child; unchecking it unchecks every child; a mixed set makes the parent indeterminate; checking an indeterminate parent checks all children.
- Selected items are visually heavier than unselected ones.

## Accessibility

- Use a native `<input type="checkbox">` wrapped in or linked to a `<label>`, so clicking the text toggles the box and screen readers read the label followed by the role and state. Set `indeterminate = true` in JS for the mixed state (and `aria-checked="mixed"` on a custom control).
- Keyboard: Tab moves focus to the checkbox, Space toggles it (Enter may also be supported on some platforms). In a group, Tab moves between checkboxes.
- Accessible name equals the adjacent label; add context if the label alone is ambiguous.
- Touch target 48x48dp; the 40dp state layer sits inside it. Do not apply density by default; if offered, keep the density control itself at 48dp.
- Error state must be explained in text (helper or error message), not by color alone.
- Keep contrast at least 3:1 between the outline or fill and the background.

## Do / Don't

- Do use checkboxes for several related options, with a parent checkbox to select all. Don't use switches for such a list.
- Do keep labels short and scannable.
- Do let the label be a click target. Don't make only the 18dp square clickable.
- Do make the indeterminate state check all children when activated.
- Don't change the label color on selection; it stays on-surface.
- Don't shrink the target below 48dp by applying density by default.

## Minimal implementation

Native checkbox with a custom-drawn box. A framework component should render label > input + box + text, forward `checked`, `indeterminate`, `disabled` and `error` props, and emit change events.

```html
<label class="md-checkbox">
  <input class="md-checkbox__input" type="checkbox" name="topping" value="cheese" checked>
  <span class="md-checkbox__box" aria-hidden="true">
    <svg class="md-checkbox__icon" viewBox="0 0 18 18"><path class="check" d="M7 13.4 3.6 10l1.4-1.4 2 2 6-6L14.4 6z"/><path class="dash" d="M4 8h10v2H4z"/></svg>
  </span>
  <span class="md-checkbox__label">Extra cheese</span>
</label>
```

```css
.md-checkbox {
  display: inline-flex; align-items: center; gap: 8px; min-height: 48px; cursor: pointer;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-body-large-font); font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
}
.md-checkbox__input { position: absolute; width: 48px; height: 48px; margin: 0; opacity: 0; cursor: pointer; }
.md-checkbox__box {
  position: relative; width: 18px; height: 18px; box-sizing: border-box; flex: none;
  border: 2px solid var(--md-sys-color-on-surface-variant); border-radius: 2px;
  display: grid; place-items: center; margin: 15px; /* 48dp target */
}
.md-checkbox__box::before { /* 40dp state layer */
  content: ""; position: absolute; inset: -13px; border-radius: var(--md-sys-shape-corner-full);
  background: var(--md-sys-color-on-surface); opacity: 0;
}
.md-checkbox__icon { width: 18px; height: 18px; fill: var(--md-sys-color-on-primary); }
.md-checkbox__icon path { display: none; }
.md-checkbox:hover .md-checkbox__box { border-color: var(--md-sys-color-on-surface); }
.md-checkbox:hover .md-checkbox__box::before { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-checkbox__input:focus-visible + .md-checkbox__box { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-checkbox__input:focus-visible + .md-checkbox__box::before { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-checkbox__input:active + .md-checkbox__box::before { opacity: var(--md-sys-state-pressed-state-layer-opacity); background: var(--md-sys-color-primary); }
.md-checkbox__input:checked + .md-checkbox__box,
.md-checkbox__input:indeterminate + .md-checkbox__box { background: var(--md-sys-color-primary); border-color: transparent; }
.md-checkbox__input:checked + .md-checkbox__box::before,
.md-checkbox__input:indeterminate + .md-checkbox__box::before { background: var(--md-sys-color-primary); }
.md-checkbox__input:checked + .md-checkbox__box .check { display: block; }
.md-checkbox__input:indeterminate + .md-checkbox__box .dash { display: block; }
.md-checkbox__input:disabled + .md-checkbox__box { border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); }
.md-checkbox__input:disabled:checked + .md-checkbox__box { background: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); }
.md-checkbox__input:disabled:checked + .md-checkbox__box .md-checkbox__icon { fill: var(--md-sys-color-surface); }
.md-checkbox--error .md-checkbox__box { border-color: var(--md-sys-color-error); }
.md-checkbox--error .md-checkbox__input:checked + .md-checkbox__box { background: var(--md-sys-color-error); }
.md-checkbox--error .md-checkbox__icon { fill: var(--md-sys-color-on-error); }
```

JS for a parent checkbox: `parent.indeterminate = someChecked && !allChecked; parent.checked = allChecked;`

## Tokens

- ../tokens/md.comp.checkbox.md (all states, error, disabled)
- ../tokens/md.comp.radio-button.md, ../tokens/md.comp.switch.md (the alternative selection controls)
- ../tokens/md.sys.state.md
