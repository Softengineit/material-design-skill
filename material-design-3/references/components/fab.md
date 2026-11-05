# Floating action button (FAB)

A FAB is a raised, icon-only button that floats above all content and triggers the single most important action on a screen.

## When to use / when not to use

Use a FAB for the primary, constructive action of a screen: Create, Compose, Favorite, Share, Start a process. It stays in place while content scrolls and appears in front of everything else.

Do not use a FAB for:
- Minor or overflow actions, or actions that already exist elsewhere on the screen.
- Destructive actions (Archive, Trash), alerts or errors.
- Narrow tasks like cutting text, or controls that belong in a toolbar (volume, font color).
- A screen where the primary action is already obvious (for example a photo feed where images are the action). Not every screen needs a FAB.

Never show more than one FAB on a screen, and never give individual cards their own FAB. When a label is needed, use an extended FAB. When several related actions are needed, use a FAB menu.

## Variants

Variants are sizes, not colors:
- FAB (56dp): the smallest recommended size, best in compact windows where other actions share the screen.
- Medium FAB (80dp): recommended for most situations, compact and medium windows.
- Large FAB (96dp): for a very prominent primary action, best at expanded and larger breakpoints (tablets, desktop).
- Small FAB (40dp): still exists but no longer recommended. Use a larger size.

Six color styles, all equally legible, choose by taste:
- Primary container / on-primary-container (default)
- Secondary container / on-secondary-container
- Tertiary container / on-tertiary-container
- Primary / on-primary
- Secondary / on-secondary
- Tertiary / on-tertiary
Surface FABs (surface-container-high with primary icon) are baseline-only and no longer recommended. A "lowered" variant with elevation level1 instead of level3 also exists in the tokens.

## Anatomy

1. Container: square with rounded corners, elevated with a shadow. It must contrast with the surface under it and must not be covered by other elements such as badges.
2. Icon: a filled (not outlined) icon that is clear on its own (add, edit, message). On web, show a tooltip with the text label on hover and on focus.
3. State layer: same color as the icon.
4. Focus indicator: 3dp ring in md.sys.color.secondary, 2dp outer offset.

## Specs

| Size | Width x height | Corner shape token | Icon size | Elevation rest / hover / focus / pressed | Lowered elevation rest / hover / pressed |
|---|---|---|---|---|---|
| Small (not recommended) | 40dp x 40dp | md.sys.shape.corner.medium (12dp) | 24dp | level3 / level4 / level3 / level3 | level1 / level2 / level1 |
| FAB (default) | 56dp x 56dp | md.sys.shape.corner.large (16dp) | 24dp | level3 / level4 / level3 / level3 | level1 / level2 / level1 |
| Medium | 80dp x 80dp | md.sys.shape.corner.large-increased (20dp) | 28dp | level3 / level4 / level3 / level3 | level1 / level2 / level1 |
| Large | 96dp x 96dp | md.sys.shape.corner.extra-large (28dp) | 36dp | level3 / level4 / level3 / level3 | level1 / level2 / level1 |

Color styles (md.comp.fab.<style>.*):

| Style | Container color | Icon and state layer color |
|---|---|---|
| primary-container (default) | md.sys.color.primary-container | md.sys.color.on-primary-container |
| secondary-container | md.sys.color.secondary-container | md.sys.color.on-secondary-container |
| tertiary-container | md.sys.color.tertiary-container | md.sys.color.on-tertiary-container |
| primary | md.sys.color.primary | md.sys.color.on-primary |
| secondary | md.sys.color.secondary | md.sys.color.on-secondary |
| tertiary | md.sys.color.tertiary | md.sys.color.on-tertiary |
| surface (baseline, not recommended) | md.sys.color.surface-container-high | md.sys.color.primary |

Shadow color: md.sys.color.shadow. There is no label typescale; the FAB has no text. Padding is the centered icon inside the square container.

## States and interaction

- Enabled: elevation level3, container and icon colors from the table.
- Hovered: state layer at md.sys.state.hover.state-layer-opacity (0.08), elevation rises to level4.
- Focused: state layer at md.sys.state.focus.state-layer-opacity (0.1), focus ring, elevation level3.
- Pressed: state layer at md.sys.state.pressed.state-layer-opacity (0.1), elevation level3.
- Disabled: do not disable a FAB. If the action is unavailable, hide the FAB.
- With a custom color mapping, keep the state layer color equal to the icon color (for the primary style, md.sys.color.primary is the icon-on-container role, so state layer uses on-primary).

Behaviors:
- Appearing: scales out from its center; the icon can animate too.
- Screen transitions: the FAB hides and reappears, in the same position if possible, and only if still relevant.
- Expanding: can morph into any surface with the container transform pattern, or into a FAB menu.
- Scrolling: stays fixed. (An extended FAB may collapse to a FAB on scroll.)
- Tabs: the FAB briefly disappears and reappears when the tab content changes; it is not animated with body content.

## Accessibility

- Use `<button type="button">` with `aria-label` describing the action ("Compose a new message"), not the icon name.
- Keyboard: Tab lands on the FAB, Space or Enter activates it.
- Focus order: put the FAB early (after app bar and navigation bar on mobile) so assistive tech reaches the primary action fast. Show a tooltip on focus on the web.
- Icon to container contrast at least 3:1. Container to background contrast must be sufficient.
- All sizes are at least 48dp except small (40dp), which needs a 48x48dp touch target.
- Placement: bottom trailing corner in compact and medium windows; upper leading area (inside the navigation rail) in expanded windows. Test with users.
- The FAB may partially overlap an interactive element but must never hide its focus indicator.

## Do / Don't

- Do use simple, well-known icons (add, edit, message). Don't use vague or open-ended icons.
- Do use the FAB for positive primary actions. Don't use it for minor, overflow, unclear or destructive actions.
- Do omit the FAB when the screen does not need it. Don't show several FABs at once.
- Do place the FAB in a navigation rail on large screens. Don't give each card its own FAB.
- Do keep icon contrast above 3:1. Don't use low-contrast icon and container pairs.
- Do hide and re-show the FAB when switching pages. Don't keep it frozen while the page under it changes.
- Do switch to an extended FAB when a label is required, and to a FAB menu when several actions apply.

## Minimal implementation

Default FAB (56dp, primary-container). A framework component should render one button with an icon child and expose `size` (fab | medium | large) and `color` (primary-container | ...) props.

```html
<button class="md-fab" type="button" aria-label="Compose a new message" title="Compose">
  <svg class="md-fab__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25z"/></svg>
</button>
```

```css
.md-fab {
  position: fixed; inset-inline-end: 16px; inset-block-end: 16px;
  display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border: none; cursor: pointer;
  isolation: isolate; overflow: hidden;
  border-radius: var(--md-sys-shape-corner-large);
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  box-shadow: var(--md-sys-elevation-level3);
  transition: box-shadow var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
}
.md-fab::after { content: ""; position: absolute; inset: 0; background: currentColor; opacity: 0; z-index: -1; }
.md-fab:hover { box-shadow: var(--md-sys-elevation-level4); }
.md-fab:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-fab:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; box-shadow: var(--md-sys-elevation-level3); }
.md-fab:focus-visible::after { opacity: var(--md-sys-state-focus-state-layer-opacity); }
.md-fab:active { box-shadow: var(--md-sys-elevation-level3); }
.md-fab:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-fab__icon { width: 24px; height: 24px; fill: currentColor; }
/* size modifiers */
.md-fab--medium { width: 80px; height: 80px; border-radius: var(--md-sys-shape-corner-large-increased); }
.md-fab--medium .md-fab__icon { width: 28px; height: 28px; }
.md-fab--large { width: 96px; height: 96px; border-radius: var(--md-sys-shape-corner-extra-large); }
.md-fab--large .md-fab__icon { width: 36px; height: 36px; }
```

## Tokens

- ../tokens/md.comp.fab.md (all sizes, six color styles, lowered and branded variants, states)
- ../tokens/md.fab.surface.md (baseline surface FAB, not recommended)
- ../tokens/md.sys.elevation.md, ../tokens/md.sys.state.md, ../tokens/md.sys.shape.md
