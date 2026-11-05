# Chips

A chip is a compact, contextual element shown in a set that lets people trigger a quick action, filter content, enter information, or pick a suggestion.

## When to use / when not to use

Use chips when options depend on the current situation and appear as a group: quick actions under a card, filters above a list, recipients in a To field, suggested replies. Chips speed up the current task; buttons move people through the product.

Do not use a chip for a major or final step (Save, Cancel, Next); those are buttons. Do not show a single chip alone; chips come in sets, which can wrap or scroll horizontally. Do not apply density by default (targets fall under 48dp).

Choose by purpose and author:

| Purpose | Variant | Example |
|---|---|---|
| Action (smart or cross-app) | Assist chip | Add to calendar |
| Filter a collection | Filter chip | Platform selector |
| Information entered by the person | Input chip | Gmail contact in the To field |
| Information suggested by the product | Suggestion chip | Suggested chat reply |

## Variants

- Assist chip: an action, written like a button (starts with a verb: Get, Add). Appears dynamically below primary content or at the bottom of a screen. Can show progress and confirmation, change its label (Save to Saved), or open a modal or full-screen view.
- Filter chip: a tag or noun that narrows a collection. Tapping selects it and shows a leading checkmark. Sets are either multi-select or single-select (an alternative to segmented buttons or radio buttons); do not mix modes on one page. An optional trailing icon removes the chip or opens a menu (medium and expanded windows; in compact windows the whole chip must open the menu).
- Input chip: a piece of information typed by the person (contact, search term) converted into a chip. Always has a trailing remove icon. Can be edited (reverts to text), reordered, moved between fields, selected, or expanded with a container transform. Backspace before a chip selects it; Backspace again deletes it.
- Suggestion chip: a product-generated noun or short phrase to narrow intent: quick replies, search starters.

Any chip can be flat (default, outlined) or elevated (level1 shadow, no outline). Elevate only on images or busy backgrounds.

## Anatomy

1. Container: 32dp high, 8dp corners (md.sys.shape.corner.small), outline-variant stroke when flat.
2. Label text: 20 characters or fewer, label-large, start-aligned, vertically centered. Drop articles to save space.
3. Leading icon, logo or circular image (optional): 18dp icon (primary by default, on-surface-variant for less emphasis), or a 24dp avatar.
4. Trailing icon: required on input chips (remove), optional on filter chips (remove or menu). 18dp.
5. State layer and focus ring.

## Specs

| Variant | Height | Corner | Container flat / elevated | Outline (flat) | Label color | Label typescale | Leading icon | Trailing icon | Padding no icon / with icon / between elements | Elevation flat rest / elevated rest / hover / pressed / dragged |
|---|---|---|---|---|---|---|---|---|---|---|
| Assist | 32dp | corner.small (8dp) | transparent / surface-container-low | 1dp outline-variant | on-surface | label-large | 18dp primary | none | 16dp / 8dp / 8dp | level0 / level1 / level2 / level1 / level4 |
| Filter unselected | 32dp | corner.small | transparent / surface-container-low | 1dp outline-variant | on-surface-variant | label-large | 18dp primary (on-surface-variant in older sets) | 18dp on-surface-variant | 16dp / 8dp / 8dp | level0 / level1 / level2 / level1 / level4 |
| Filter selected | 32dp | corner.small | secondary-container (flat and elevated) | 0dp | on-secondary-container | label-large | 18dp on-secondary-container (checkmark) | 18dp on-secondary-container | 16dp / 8dp / 8dp | level0 (flat hover level1) / level1 / level2 / level1 / level4 |
| Input unselected | 32dp | corner.small | transparent | 1dp outline-variant (focus on-surface-variant) | on-surface-variant | label-large | 18dp on-surface-variant, or 24dp avatar corner.full | 18dp on-surface-variant | avatar 4dp left 8dp right; icon 8dp; 8dp between | level0 / n.a. / level0 / level0 / level4 |
| Input selected | 32dp | corner.small | secondary-container | 0dp | on-secondary-container | label-large | 18dp primary | 18dp on-secondary-container | same | level0 |
| Suggestion | 32dp | corner.small | transparent / surface-container-low | 1dp outline-variant | on-surface-variant | label-large | 18dp primary | none | 16dp / 8dp / 8dp | level0 / level1 / level2 / level1 / level4 |

All colors are md.sys.color.* names. Minimum 8dp between chips and between rows. Chips with two actions (select plus remove) need a minimum container width of 88dp (or 42dp label) so both 48x48dp targets fit. The close icon target is at least 48dp.

## States and interaction

Each variant has enabled, disabled, hovered, focused, pressed and dragged, for both selected and unselected where selection exists.
- Hovered: state layer in the label color at 0.08; elevated chips rise to level2; a selected flat filter chip rises to level1.
- Focused: state layer at 0.1 and the 3dp secondary focus ring; flat outline switches to on-surface (assist) or on-surface-variant (filter, input, suggestion).
- Pressed: state layer at 0.1 with a ripple. Never use elevation to show pressed.
- Dragged: state layer at 0.16 (md.sys.state.dragged.state-layer-opacity), elevation level4.
- Disabled: label and icons on-surface at 0.38; flat outline on-surface at 0.12; elevated or selected container on-surface at 0.12.
- Selected (filter, input): container secondary-container, outline removed, checkmark added on filter chips.

Overflow: chips wrap to new rows, or scroll horizontally in a one-row field. Labels truncate when wrapped and wider than the window. For more than two rows, prefer horizontal scrolling plus a way to see all chips (see Accessibility).

## Accessibility

- Label contrast at least 3:1 with the background. Show that chips are interactive with a secondary cue: a heading such as "Select type" or "Filter results" before the set, the stronger outline color role instead of outline-variant, or a verb label or leading icon.
- Roles: an action chip is a button; a selectable chip is a checkbox (multi-select) or radio (single-select), or `gridcell` inside a grid pattern on web. The chip's accessible name is its label; images and icons inside are hidden.
- Remove icon: labelled "Remove {label}". If remove is the only action, chip and icon are one focusable element and on mobile the icon can be omitted (select then press Delete). If the chip also selects, label and remove icon are two focusable elements.
- Keyboard: Tab moves to the chip or chip group; arrows move between chips; Space or Enter activates, selects or deselects; Backspace or Delete removes a focused input chip.
- Horizontal overflow: give a way to see every chip without scrolling. Reflow method: a leading "Show all" filter chip that expands the list and pushes content down. Menu method: a leading button that opens a menu of all options (not for chips with a second action like remove).
- Minimum 48x48dp target for every chip and every secondary action; the target may extend past the visible container. Keep density controls at 48dp.
- Drop-down (menu) chips: list item labels equal their text; icons are decorative.

## Do / Don't

- Do use chips for contextual, supplemental options. Don't replace major actions (Save, Cancel) with chips.
- Do use a button for the final step. Don't finish a task with a chip.
- Do show chips in a set that can scroll. Don't show a single chip, and don't offer a filter set with one option.
- Do use an outline on plain backgrounds and elevation on images. Don't elevate chips on a plain page, and don't use elevation for the pressed state.
- Do keep labels under 20 characters ("Walking"). Don't write "Walking navigation session".
- Do write filter chips as positive nouns. Don't use negatives like "Exclude images".
- Caution: in compact windows make the whole filter chip open its menu; the trailing icon alone is too small.
- Do keep all chip sets on a page in one selection mode.

## Minimal implementation

Filter chip set, multi-select, flat style. A framework component should render one toggle per option with `selected` state, show the checkmark when selected, and accept optional leading and trailing icons.

```html
<div class="md-chip-set" role="group" aria-label="Filter results">
  <button class="md-chip md-chip--filter" type="button" role="checkbox" aria-checked="true">
    <svg class="md-chip__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg>
    <span class="md-chip__label">Docs</span>
  </button>
  <button class="md-chip md-chip--filter" type="button" role="checkbox" aria-checked="false">
    <span class="md-chip__label">Slides</span>
  </button>
  <button class="md-chip md-chip--filter" type="button" role="checkbox" aria-checked="false">
    <span class="md-chip__label">Sheets</span>
  </button>
</div>
```

```css
.md-chip-set { display: flex; flex-wrap: wrap; gap: 8px; }
.md-chip {
  position: relative; isolation: isolate; overflow: hidden;
  display: inline-flex; align-items: center; gap: 8px;
  height: 32px; padding: 0 16px; box-sizing: border-box;
  border: 1px solid var(--md-sys-color-outline-variant); border-radius: var(--md-sys-shape-corner-small);
  background: transparent; color: var(--md-sys-color-on-surface-variant); cursor: pointer;
  font-family: var(--md-sys-typescale-label-large-font); font-size: var(--md-sys-typescale-label-large-size);
  font-weight: var(--md-sys-typescale-label-large-weight); line-height: var(--md-sys-typescale-label-large-line-height);
  letter-spacing: var(--md-sys-typescale-label-large-tracking); white-space: nowrap;
}
.md-chip::before { content: ""; position: absolute; inset: -8px 0; } /* 48dp tall target */
.md-chip::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-chip:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-chip:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; border-color: var(--md-sys-color-on-surface-variant); }
.md-chip:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-chip:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-chip:disabled { color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent); border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent); cursor: default; }
.md-chip__icon { width: 18px; height: 18px; flex: none; }
.md-chip:has(.md-chip__icon) { padding-inline-start: 8px; }
.md-chip--filter[aria-checked="true"] {
  background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container);
  border-color: transparent;
}
.md-chip--filter[aria-checked="true"]:hover { box-shadow: var(--md-sys-elevation-level1); }
/* assist: color on-surface, leading icon primary. suggestion: as above without checkmark.
   input: add a trailing 18px remove icon button labelled "Remove {label}", min-width 88px when selectable.
   elevated: remove border, background surface-container-low, box-shadow level1 (hover level2). */
```

## Tokens

- ../tokens/md.comp.assist-chip.md, ../tokens/md.comp.filter-chip.md, ../tokens/md.comp.input-chip.md, ../tokens/md.comp.suggestion-chip.md
- ../tokens/md.sys.state.md (hover 0.08, focus 0.1, pressed 0.1, dragged 0.16), ../tokens/md.sys.typescale.md (label-large)
