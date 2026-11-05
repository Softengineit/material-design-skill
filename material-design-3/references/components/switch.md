# Switch

A switch turns a single setting or option on or off, and the change applies immediately.

## When to use / when not to use

Use a switch when:
- One standalone item can be on or off, true or false (notifications, dark theme, camera access).
- Each item in a list is controlled independently of the others.
- The effect happens right away, with no Save step.

Do not use a switch when:
- The options are opposing views (List view / Map view): use a connected button group.
- Several items are chosen and then saved together: use checkboxes.
- Only one item of a set can be chosen: use radio buttons.
- The control is a call to action: use a button.

## Variants

One variant with three configurations:
- Without icons (default).
- Icon on the selected switch only (for example a checkmark).
- Icons on both selected and unselected (checkmark and X).

Icons must say clearly whether the switch is on or off. Avoid ambiguous icons such as a moon or a pencil.

## Anatomy

1. Track (52x32dp pill, outlined when off, filled when on)
2. Handle (was "thumb"): a circle that slides to the other end and grows when on or pressed
3. Icon (optional, 16dp, inside the handle)
4. State layer (40dp around the handle)
5. Adjacent label text (required, on-surface; supporting text on-surface-variant)

## Specs

| Part | Value |
| --- | --- |
| Track | 52dp wide, 32dp high, → md.sys.shape.corner.full, outline 2dp |
| Handle size, unselected | 16dp (20dp in the generic handle token) |
| Handle size, selected | 24dp |
| Handle size, with icon | 24dp (selected and unselected) |
| Handle size, pressed | 28dp |
| Handle shape | → md.sys.shape.corner.full, elevation → md.sys.elevation.level1 |
| State layer | 40dp, corner full |
| Target size | 48dp x 48dp |
| Icon size | 16dp |
| Unselected track | → md.sys.color.surface-container-highest with outline → md.sys.color.outline |
| Unselected handle | → md.sys.color.outline; icon → md.sys.color.surface-container-highest |
| Selected track | → md.sys.color.primary, no outline |
| Selected handle | → md.sys.color.on-primary; icon → md.sys.color.on-primary-container (token: selected.icon.color primary) |
| Label | → md.sys.color.on-surface, → md.sys.typescale.body-large; supporting text on-surface-variant body-medium |
| Focus indicator | → md.sys.color.secondary, 3dp, outer offset 2dp |
| Padding | the switch sits in a 48dp target; 16dp between label and switch in a list item |
| Elevation | handle level1 at rest, level0 when disabled; track none |

## States and interaction

| State | Unselected (off) | Selected (on) |
| --- | --- | --- |
| Enabled | track surface-container-highest + outline, handle outline 16dp | track primary, handle on-primary 24dp |
| Hover | handle on-surface-variant, state layer on-surface at 0.08 | handle primary-container, state layer primary at 0.08 |
| Focus | handle on-surface-variant, state layer on-surface at 0.1, focus ring | handle primary-container, state layer primary at 0.1 |
| Pressed | handle on-surface-variant grows to 28dp, state layer on-surface at 0.1 | handle primary-container grows to 28dp, state layer primary at 0.1 |
| Disabled | track surface-container-highest at 0.12 with on-surface outline; handle on-surface at 0.38; icon surface-container-highest at 0.38 | track on-surface at 0.12; handle surface at full opacity, elevation level0; icon on-surface at 0.38 |

Behavior:
- Tap, click, or drag the handle to toggle. The handle slides to the other end and grows from 16dp to 24dp when on.
- The action takes effect immediately.
- Do not apply density by default; targets must stay 48x48 CSS pixels.

## Accessibility

- Role: `<input type="checkbox" role="switch">` with `aria-checked`, or `<button role="switch" aria-checked>`. The accessible name is the adjacent label (`<label for>` or `aria-labelledby`).
- When the visible label is vague ("Photo album"), make the label or the accessible name more specific ("Photo album access").
- Keyboard: Tab lands on the switch handle; Space or Enter toggles it. Initial focus lands on the handle.
- Feedback: the handle grows on hover, press and drag; the cursor becomes a pointer.
- The on state is shown by handle size, position, and track fill, so it does not rely on color alone. Optional icons add another cue.
- Target 48x48dp.

## Do / Don't

- Do use a connected button group for opposing options.
- Don't use a switch to pick between two views.
- Do use checkboxes when several items are picked and saved together.
- Don't use switches for options that need a Save button.
- Do use radio buttons when only one item can be selected.
- Don't use a switch as a call to action in place of a button.
- Do use icons that clearly mean on and off (checkmark and X).
- Don't use ambiguous icons inside the handle.
- Do keep labels short and describe what happens when the switch is on.
- Don't put text such as "On" or "Off" inside the switch; it is too small to read.

## Minimal implementation

```html
<label class="md-switch-row">
  <span class="md-switch-row__text">
    <span class="md-switch-row__label">Dark theme</span>
    <span class="md-switch-row__supporting">Applies to all screens</span>
  </span>
  <span class="md-switch">
    <input type="checkbox" role="switch" checked>
    <span class="md-switch__track"><span class="md-switch__handle">
      <span class="md-switch__icon material-symbols-outlined" aria-hidden="true">check</span>
    </span></span>
  </span>
</label>
```

```css
.md-switch-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 48px;
  color: var(--md-sys-color-on-surface); cursor: pointer; }
.md-switch-row__text { display: flex; flex-direction: column; font: var(--md-sys-typescale-body-large-weight)
  var(--md-sys-typescale-body-large-size)/var(--md-sys-typescale-body-large-line-height) var(--md-sys-typescale-body-large-font); }
.md-switch-row__supporting { font-size: var(--md-sys-typescale-body-medium-size); color: var(--md-sys-color-on-surface-variant); }
.md-switch { position: relative; width: 52px; height: 32px; flex: none; display: inline-block; }
.md-switch input { position: absolute; inset: -8px; width: 68px; height: 48px; margin: 0; opacity: 0; cursor: pointer; z-index: 1; }
.md-switch__track { position: absolute; inset: 0; border-radius: var(--md-sys-shape-corner-full); box-sizing: border-box;
  background: var(--md-sys-color-surface-container-highest); border: 2px solid var(--md-sys-color-outline);
  transition: background-color var(--md-sys-motion-duration-short3), border-color var(--md-sys-motion-duration-short3); }
.md-switch__handle { position: absolute; top: 50%; left: 6px; width: 16px; height: 16px; transform: translateY(-50%);
  border-radius: 50%; background: var(--md-sys-color-outline); display: grid; place-items: center;
  transition: all var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard); }
.md-switch__handle::before { content: ""; position: absolute; width: 40px; height: 40px; border-radius: 50%;
  background: var(--md-sys-color-on-surface); opacity: 0; }
.md-switch__icon { font-size: 16px; color: var(--md-sys-color-surface-container-highest); opacity: 0; }
.md-switch:hover .md-switch__handle::before { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-switch input:active + .md-switch__track .md-switch__handle { width: 28px; height: 28px; }
.md-switch input:focus-visible + .md-switch__track { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-switch input:checked + .md-switch__track { background: var(--md-sys-color-primary); border-color: var(--md-sys-color-primary); }
.md-switch input:checked + .md-switch__track .md-switch__handle { left: 24px; width: 24px; height: 24px;
  background: var(--md-sys-color-on-primary); box-shadow: var(--md-sys-elevation-level1); }
.md-switch input:checked + .md-switch__track .md-switch__handle::before { background: var(--md-sys-color-primary); }
.md-switch input:checked + .md-switch__track .md-switch__icon { opacity: 1; color: var(--md-sys-color-on-primary-container); }
.md-switch input:disabled + .md-switch__track { opacity: 0.12; background: var(--md-sys-color-on-surface); border-color: var(--md-sys-color-on-surface); }
.md-switch input:disabled + .md-switch__track .md-switch__handle { opacity: 0.38; background: var(--md-sys-color-on-surface); box-shadow: none; }
```

A React or Vue component should wrap the native input and expose `checked`, `disabled`, `label`, `supportingText`, `icons` ("none" | "selected" | "both"), and emit `change`.

## Tokens

Full token list: ../tokens/md.comp.switch.md. Alternatives: ../tokens/md.comp.checkbox.md, ../tokens/md.comp.radio-button.md, ../tokens/md.comp.button-group.md (connected button group).
