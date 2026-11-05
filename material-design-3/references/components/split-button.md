# Split button

A split button pairs a main action button with a separate trailing menu button that opens a list of related actions, hiding the extra options until they are needed.

## When to use / when not to use

Use a split button when one action is the common case and a few related alternatives exist: Send (and Schedule send), Add, Create, Start driving (and other routes), change playback speed. It works alone or beside regular buttons, icon buttons and button groups, and it can be larger than the other buttons on the page because it already takes more room.

Do not use it when there is no main action (use a menu button or an icon button instead), when the options are not related to the main action, or when the menu would need an unusual shape or custom content. The trailing button normally opens a menu; it can be customized to open other surfaces like a card, but keep the menu standard.

## Variants

One variant. Configurations:
- Color styles: elevated, filled, tonal, outlined (same colors as buttons; there is no text style).
- Sizes: XS, S (default), M, L, XL, matching buttons and icon buttons.
- Leading button content: label + icon, label only, or icon only.

Unlike toggle buttons, the color does not change when the trailing button is selected; only a state layer, a shape morph and an icon rotation show the open state.

## Anatomy

1. Leading button: the main action. Label of one or two words, optional icon that matches the action.
2. Icon (optional) inside the leading button.
3. Label text inside the leading button.
4. Trailing button: always shows the expand/collapse (menu) icon. The icon rotates 180 degrees inward when the menu opens and back when it closes. Do not change this icon.
5. Between the two buttons there is a 2dp gap. The outer corners are fully round; the inner corners are small and morph on interaction.

In RTL the layout mirrors (menu button on the left).

## Specs

| Size | Height | Outer shape | Inner corner rest / hover / pressed | Trailing selected inner corner | Leading button leading / trailing space | Trailing button leading / trailing space | Trailing icon size | Gap | Menu icon optical offset (unselected) |
|---|---|---|---|---|---|---|---|---|---|
| XS | 32dp | corner.full | 4dp / 8dp / 8dp | 50% | 12dp / 10dp | 13dp / 13dp | 22dp | 2dp | -1dp |
| S (default) | 40dp | corner.full | 4dp / 12dp / 12dp | 50% | 16dp / 12dp | 13dp / 13dp | 22dp | 2dp | -1dp |
| M | 56dp | corner.full | 4dp / 12dp / 12dp | 50% | 24dp / 24dp | 15dp / 15dp | 26dp | 2dp | -2dp |
| L | 96dp | corner.full | 8dp / 20dp / 20dp | 50% | 48dp / 48dp | 29dp / 29dp | 38dp | 2dp | -3dp |
| XL | 136dp | corner.full | 12dp / 20dp / 20dp | 50% | 64dp / 64dp | 43dp / 43dp | 50dp | 2dp | -6dp |

Inner corner tokens: md.comp.split-button.<size>.inner-corner.corner-size (rest), .hovered.corner-size, .pressed.corner-size; trailing-button.inner-corner.selected.corner-size is 50%. Leading button label typescale, icon size and colors follow the button spec for the same size (label-large at XS and S, title-medium at M, headline-small at L, headline-large at XL).

Colors and elevation per style, from md.comp.button:

| Style | Container | Label and icon | Elevation rest / hover / pressed |
|---|---|---|---|
| Elevated | md.sys.color.surface-container-low | md.sys.color.primary | level1 / level2 / level1 |
| Filled | md.sys.color.primary | md.sys.color.on-primary | level0 / level1 / level0 |
| Tonal | md.sys.color.secondary-container | md.sys.color.on-secondary-container | level0 / level1 / level0 |
| Outlined | none, 1dp outline-variant stroke | md.sys.color.on-surface-variant | level0 |

The menu opens 4dp from the split button.

## States and interaction

Leading button: enabled, disabled, hovered, focused, pressed (and pressed with focus). Trailing button: the same plus selected (and selected with focus).

- Hovered: state layer 0.08 in the label color; inner corners grow to the hovered corner size.
- Focused: state layer 0.1 plus the 3dp secondary focus ring.
- Pressed: state layer 0.1; inner corners grow to the pressed corner size.
- Selected (trailing button, menu open): inner corner becomes 50% so the trailing button is a full pill, the icon moves from its optical offset to true center and rotates 180 degrees inward. Uses the standard motion scheme, not the expressive one.
- Disabled: container on-surface at 0.1, label and icon on-surface at 0.38, same as buttons.

Menu placement: align the menu with the trailing button when possible; otherwise align it with the leading or trailing edge of the whole component, above or below. Six fallback alignments are allowed; always share an edge with the button.

## Accessibility

- Two separate `<button>` elements. Focus lands on the leading button first, then on the trailing button (LTR and RTL both follow DOM order).
- Keyboard: Tab moves between the two buttons, Space or Enter activates the focused one. The opened menu follows menu keyboard rules (arrows, Escape).
- Leading button label equals its visible text ("Watch later").
- Trailing button: `aria-label` saying there are more options related to the main action ("More watch options"), `aria-haspopup="menu"`, `aria-expanded="true|false"`, `aria-controls` to the menu.
- Each button needs a 48x48dp target; XS (32dp) and S (40dp) need extra vertical target space.
- Label the menu according to the menu guidance.

## Do / Don't

- Do open a standard menu from the trailing button. Don't give the menu an irregular shape or odd highlight.
- Do keep the leading label to one or two words with a fitting icon. Don't use long labels like "32 minutes away".
- Do keep the expand/collapse icon on the trailing button. Don't replace it with another icon (refresh, for example).
- Do scale up to L or XL for hero moments or large breakpoints.
- Do mirror the layout in RTL.
- Do align the menu to the trailing button, 4dp away. Don't float the menu with no shared edge.

## Minimal implementation

Filled split button, small size. A framework component should render two sibling buttons inside a wrapper, hold `open` state for the trailing button, and mount a menu next to it.

```html
<div class="md-split">
  <button class="md-split__lead" type="button">
    <span class="md-split__icon" aria-hidden="true">+</span>Add
  </button>
  <button class="md-split__trail" type="button" aria-label="More add options"
          aria-haspopup="menu" aria-expanded="false" aria-controls="add-menu">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 10l5 5 5-5z" fill="currentColor"/></svg>
  </button>
</div>
```

```css
.md-split { display: inline-flex; gap: var(--md-sys-measurement-space25); height: 40px; }
.md-split__lead, .md-split__trail {
  position: relative; isolation: isolate; overflow: hidden; border: none; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary);
  transition: border-radius var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard), box-shadow var(--md-sys-motion-duration-short3);
}
.md-split__lead {
  gap: 8px; padding: 0 12px 0 16px;
  border-radius: var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-full);
  font-family: var(--md-sys-typescale-label-large-font); font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight); line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking); white-space: nowrap;
}
.md-split__trail {
  padding: 0 13px;
  border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-extra-small);
}
.md-split__trail svg { transform: translateX(-1px); transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard); }
.md-split__lead::after, .md-split__trail::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-split__lead:hover::after, .md-split__trail:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-split__lead:hover, .md-split__trail:hover { box-shadow: var(--md-sys-elevation-level1); }
.md-split__lead:hover, .md-split__lead:active { border-radius: var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-full); }
.md-split__trail:hover, .md-split__trail:active { border-radius: var(--md-sys-shape-corner-medium) var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-full) var(--md-sys-shape-corner-medium); }
.md-split__lead:focus-visible, .md-split__trail:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-split__lead:focus-visible::after, .md-split__trail:focus-visible::after,
.md-split__lead:active::after, .md-split__trail:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-split__trail[aria-expanded="true"] { border-radius: var(--md-sys-shape-corner-full); }
.md-split__trail[aria-expanded="true"] svg { transform: translateX(0) rotate(180deg); }
```

## Tokens

- ../tokens/md.comp.split-button.md (sizes, inner corners, spacing, trailing icon sizes)
- ../tokens/md.comp.button.md (colors, elevation, label typescale per style and size)
- ../tokens/md.comp.menu.md (the menu it opens)
