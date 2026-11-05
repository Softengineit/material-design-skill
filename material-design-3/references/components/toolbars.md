# Toolbars

A toolbar is a container of slots that holds actions for the current page, either docked at the bottom of the window or floating above the content.

## When to use / when not to use

Use a toolbar to group actions that relate to the page the person is on. It can hold many actions and show more of them in larger windows. Two variants:
- Docked toolbar: full-width bar at the bottom. Best for global actions that stay the same across several pages. It replaces the bottom app bar (still supported, no longer recommended).
- Floating toolbar: a pill that floats over the content. Best for contextual actions tied to the body content (text editing, selection mode). Can be horizontal or vertical and can be paired with a FAB.

Do not show a toolbar and a navigation bar at the same time; both sit at the bottom. Show the navigation bar on primary pages and the toolbar on secondary pages. If a floating toolbar is used for local navigation (tabs between related pages), do not also show a navigation bar. When actions do not fit, add an overflow menu instead of adding more controls.

## Variants

- Docked toolbar: 64dp high, straight corners, spans 100% width, always at the bottom of the window. On web and large screens it may be rounded and placed elsewhere, with dividers to organize many items.
- Floating toolbar, horizontal: 64dp high, fully rounded, elevation level3 (can be removed when the background is visually distinct), at least 16dp from the window edge.
- Floating toolbar, vertical: 64dp wide, for larger breakpoints, placed on the edge opposite the navigation rail with at least 24dp margin. Not recommended in compact windows.
- Floating toolbar with FAB: a FAB (56dp or 80dp medium) sits 8dp from the toolbar for the one highest-priority action.
- Bottom app bar (baseline, not recommended): 80dp high (72dp with FAB), surface-container, elevation level2, straight corners.

Two color configurations:
- Standard: surface-container background, low emphasis, keeps attention on the content.
- Vibrant: primary-container background, high emphasis, draws attention to the controls or signals a temporary mode such as editing.

## Anatomy

1. Container: the bar or pill. It has no interaction of its own.
2. Slots: ordered spaces for elements. Common elements are icon buttons, buttons, text fields; images and custom components are allowed.
3. Optional FAB beside a floating toolbar.

Icon buttons give an even hierarchy. Emphasize at most one action, through a filled icon button, a custom color role, a wide icon button, or a paired FAB.

## Specs

| Variant | Height / width | Corner shape | Container color (standard / vibrant) | Leading and trailing space | Space between items | Outer margin | Elevation |
|---|---|---|---|---|---|---|---|
| Docked | 64dp high, 100% wide | md.sys.shape.corner.none | surface-container / primary-container | 16dp (space200) | 4dp min, 32dp max (32dp default) | none | level0 |
| Floating horizontal | 64dp high, hugs content | md.sys.shape.corner.full | surface-container / primary-container | 8dp (space100) | 4dp (space50) | 16dp (space200) from window edge | level3 (optional) |
| Floating vertical | 64dp wide, hugs content | md.sys.shape.corner.full | surface-container / primary-container | 8dp (space100) | 4dp (space50) | 24dp (space300) from window edge | level3 (optional) |
| Bottom app bar (baseline) | 80dp high, 72dp with FAB | md.sys.shape.corner.none | surface-container | 16dp | 8dp | none | level2 |

Items inside (md.comp.toolbar.<standard|vibrant>.*):

| Element | Standard | Vibrant |
|---|---|---|
| Icon and label color | md.sys.color.on-surface-variant | md.sys.color.on-primary-container |
| Standard icon button state layer | on-surface-variant | on-primary-container |
| Toggle button selected container / content | secondary-container / on-secondary-container | surface-container / on-surface |
| Filled icon button | primary / on-primary | primary / on-primary |
| Disabled icon or label | on-surface at 0.38 | on-surface at 0.38 |

Paired FAB (md.comp.toolbar.floating.fab.*): 56dp (corner.large, icon 24dp, elevation level1) or medium 80dp (corner.large-increased, icon 28dp, elevation level2); 8dp (space100) gap to the toolbar; standard color secondary-container / on-secondary-container, vibrant color tertiary-container / on-tertiary-container.

Label typescale for text in toolbar buttons follows the button spec (label-large). All elements need a 48x48dp target.

## States and interaction

The container has no states. The elements inside use their own states:
- Hovered: state layer at 0.08 (md.sys.state.hover.state-layer-opacity) in the icon color.
- Focused: state layer at 0.1 plus focus ring.
- Pressed: state layer at 0.1, with a ripple on touch.
- Selected toggle: container becomes secondary-container (standard) or surface-container (vibrant).
- Disabled: icon and label at 0.38 opacity of on-surface.

Scroll behavior: a docked toolbar stays or animates off screen. A floating toolbar stays, animates off screen, or collapses into one high-emphasis action (on Compose, into a FAB). Never collapse and slide off at the same time.

Resizing: docked items are evenly spaced in compact windows, centered or edge-aligned around a central key action in medium and larger windows. A floating toolbar only grows to fit its items; trailing actions collapse into an overflow menu at small breakpoints and reappear at larger ones. Multiple floating toolbars are allowed only in large windows (for example undo/redo in one, editing tools in another).

RTL: mirror icons and text direction; if order matters (a Next button on the trailing edge), reverse the order too.

## Accessibility

- On web the container has `role="toolbar"` with an `aria-label`; on mobile a plain container is fine. For a vertical toolbar add `aria-orientation="vertical"`.
- Initial focus lands on the first interactive element. Tab or arrow keys move between elements, Space or Enter activates the focused one.
- Each element follows its own accessibility rules (icon buttons need `aria-label` and tooltips on web).
- Every control keeps a 48x48dp target, including in the 64dp bar.
- Controls must stay reachable when the content scrolls or the toolbar collapses.

## Do / Don't

- Do keep docked toolbar corners straight. Don't round them (it suggests the bar expands).
- Do show only the essential actions and put the rest in an overflow menu. Don't overload the bar with controls.
- Do keep the floating toolbar fully inside the window. Don't let it run past the edge.
- Do emphasize one action (filled icon button or FAB). Don't emphasize several with bold primary colors, such as a filled button plus a FAB.
- Do keep control designs consistent. Don't mix many different control types in one toolbar.
- Don't use square icon buttons in a floating toolbar; they clash with the round pill. Square is fine in a docked toolbar.
- Don't use wide icon buttons in vertical toolbars.
- Don't add extra empty space beyond the items in a floating toolbar.
- Don't use several toolbars in a compact window; use one.
- Don't show a navigation bar together with a toolbar that has navigation controls.
- Do use a toolbar for local navigation on a specific page, keeping it distinct from global navigation.

## Minimal implementation

Floating horizontal toolbar, standard color, with one filled (emphasized) action. A framework component should render a container and accept children or an `actions` array; each child is a normal icon button.

```html
<div class="md-toolbar md-toolbar--floating" role="toolbar" aria-label="Text formatting">
  <button class="md-tb-btn" type="button" aria-label="Bold" aria-pressed="false">B</button>
  <button class="md-tb-btn" type="button" aria-label="Italic" aria-pressed="false">I</button>
  <button class="md-tb-btn" type="button" aria-label="Underline" aria-pressed="true">U</button>
  <button class="md-tb-btn md-tb-btn--filled" type="button" aria-label="Insert link">🔗</button>
  <button class="md-tb-btn" type="button" aria-label="More options" aria-haspopup="menu">⋮</button>
</div>
```

```css
.md-toolbar--floating {
  position: fixed; inset-block-end: 16px; inset-inline: 0; margin-inline: auto; width: max-content; max-width: calc(100% - 32px);
  display: flex; align-items: center; gap: var(--md-sys-measurement-space50);
  height: 64px; padding: 0 var(--md-sys-measurement-space100);
  background: var(--md-sys-color-surface-container);
  border-radius: var(--md-sys-shape-corner-full);
  box-shadow: var(--md-sys-elevation-level3);
}
.md-tb-btn {
  position: relative; isolation: isolate; display: inline-grid; place-items: center;
  width: 48px; height: 48px; border: none; background: transparent; cursor: pointer;
  border-radius: var(--md-sys-shape-corner-full);
  color: var(--md-sys-color-on-surface-variant);
  font: var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) var(--md-sys-typescale-label-large-font);
}
.md-tb-btn::after { content: ""; position: absolute; inset: 4px; border-radius: inherit; background: currentColor; opacity: 0; z-index: -1; }
.md-tb-btn:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-tb-btn:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: -2px; }
.md-tb-btn:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-tb-btn[aria-pressed="true"] { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); background-clip: content-box; padding: 4px; }
.md-tb-btn--filled { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); background-clip: content-box; padding: 4px; }
/* vibrant: toolbar background primary-container, icon color on-primary-container,
   selected toggle surface-container / on-surface */
/* docked: position fixed bottom, width 100%, border-radius 0, padding 0 16px, gap 32px, no shadow */
```

## Tokens

- ../tokens/md.comp.toolbar.md (docked, floating, standard and vibrant colors, paired FAB)
- ../tokens/md.comp.bottom-app-bar.md (baseline bottom app bar, not recommended)
- ../tokens/md.comp.icon-button.md, ../tokens/md.comp.fab.md (elements placed inside)
