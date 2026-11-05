# Elevation

Elevation is the z distance between two surfaces, expressed as six levels (0 to 5). In Material 3 elevation is shown mostly by surface color tiers, with shadows used only where a surface needs extra separation or sits over busy content.
Tokens carry only the dp distance; the platform decides how to render it. On the web use the box-shadow values in `assets/material-tokens.css`.

## Levels

| Token | Height | Typical use |
|---|---|---|
| md.sys.elevation.level0 | 0dp | Flat surfaces, most components at rest |
| md.sys.elevation.level1 | 1dp | Elevated cards, elevated buttons, elevated chips, modal sheets and drawers, banners |
| md.sys.elevation.level2 | 3dp | Scrolled app bars, menus, navigation bar, rich tooltips, toolbars, hovered level-1 components |
| md.sys.elevation.level3 | 6dp | FAB, extended FAB, dialogs, date and time pickers, search |
| md.sys.elevation.level4 | 8dp | Hovered FAB, dragged cards; never a resting level |
| md.sys.elevation.level5 | 12dp | Reserved for interaction states; never a resting level |

Rules:
- Resting elevation is level 0 to 3. Levels 4 and 5 appear only during hover, focus or drag.
- Use few levels. The fewer levels a screen uses, the more each one means.
- Keep the default resting level of each Material component; do not raise a card to look "important".
- Interaction raises elevation by one level and all similar components must react the same way (every elevated button goes 1 to 2 on hover, every FAB goes 3 to 4).
- `md.sys.elevation.surface-tint-color` (primary) and the tinted overlay approach are deprecated. Do not tint surfaces with primary at elevation; use the surface container roles.

## Component levels at rest, hover, pressed

| Component | Rest | Hover | Focus | Pressed | Dragged |
|---|---|---|---|---|---|
| Elevated button | 1 | 2 | 1 | 1 | |
| Elevated card | 1 | 2 | 1 | 1 | 4 |
| Elevated chip | 1 | 2 | 1 | 1 | 4 |
| Filled, tonal, outlined, text button | 0 | 0 | 0 | 0 | |
| Filled and outlined card | 0 | 0 (outlined 1 on hover in some kits) | 0 | 0 | 3 |
| FAB, extended FAB | 3 | 4 | 3 | 3 | |
| FAB lowered variant | 1 | 2 | 1 | 1 | |
| FAB inside navigation rail | 0 | | | | |
| Dialog (modal) | 3 | | | | |
| Full-screen dialog | 0 | | | | |
| Menu, rich tooltip | 2 | | | | |
| Top app bar not scrolled / scrolled | 0 / 2 | | | | |
| Navigation bar, toolbar | 2 | | | | |
| Navigation rail, tabs, list, slider, icon buttons, segmented buttons, button groups, split button, carousel, chips | 0 | | | | |
| Modal bottom sheet, modal side sheet, modal navigation drawer, banner | 1 | | | | |
| Docked side sheet, standard drawer | 0 | | | | |
| Search bar, date picker, time picker | 3 | | | | |
| Snackbar | 0 (uses inverse-surface color for separation) | | | | |

Disabled components drop to level 0 (elevated button) or keep level 1 (elevated card).

## Tonal color versus shadows

Material 3 shows elevation in three ways. Prefer them in this order.

1. Tonal difference. Give overlapping regions different surface container roles. Example: body on `surface`, navigation bar on `surface-container`, a dialog on `surface-container-high`. Edges show because tones differ, no shadow needed. The tiers from lowest to highest emphasis are `surface-container-lowest`, `-low`, `-container`, `-high`, `-highest`. They are not tied to a level; choose by hierarchy and keep the same mapping across breakpoints.
2. Shadow. Add a shadow when the surface floats over varied content (FAB over a scrolling list, card over an image) or when interaction should feel like a lift (hover, drag). Shadow size and blur grow with the level: small and sharp means close, large and soft means far.
3. Scrim. Behind modals and expanded navigation drawers, darken the rest of the UI with `scrim` at 32% opacity to focus attention.

Default mapping of surface container roles to components:
- surface-container-low: elevated buttons, elevated cards
- surface-container: top app bar, bottom app bar, navigation bar, navigation rail, navigation drawer, toolbar
- surface-container-high: FAB (surface variant), dialogs, menus, search
- surface-container-highest: filled text field, switch track (off), input chips

When to show a visible shadow:
- Protect elements over a patterned or image background where a tonal edge is not enough (chips or buttons over photos).
- Encourage interaction: lift on hover, focus or drag, and lower again when a higher surface appears.
- FAB and dialogs always carry their shadow because they float over arbitrary content.
- Interactive floating elements must still have an accessible edge: either 3:1 tonal contrast with the surface below or a shadow.

Do not: put shadows on everything (that is M2), stack several shadow levels in one region, or use scale or z-axis motion to imply elevation changes in enter/exit transitions (M3 expands along x or y instead).

## Shadow values for the web

From `material-tokens.css` (two layered shadows per level, key shadow at 30% and ambient at 15% black):

```css
--md-sys-elevation-level0: none;
--md-sys-elevation-level1: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
--md-sys-elevation-level2: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15);
--md-sys-elevation-level3: 0px 1px 3px 0px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15);
--md-sys-elevation-level4: 0px 2px 3px 0px rgba(0,0,0,0.3), 0px 6px 10px 4px rgba(0,0,0,0.15);
--md-sys-elevation-level5: 0px 4px 4px 0px rgba(0,0,0,0.3), 0px 8px 12px 6px rgba(0,0,0,0.15);
```

These use the `shadow` role (#000000) in both themes. In dark theme shadows are less visible, which is expected; tonal tiers carry most of the separation there.

## CSS patterns

```css
.elevated-card {
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--md-sys-elevation-level1);
  transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
}
.elevated-card:hover { box-shadow: var(--md-sys-elevation-level2); }
.elevated-card.dragging { box-shadow: var(--md-sys-elevation-level4); }

.fab {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  box-shadow: var(--md-sys-elevation-level3);
}
.fab:hover { box-shadow: var(--md-sys-elevation-level4); }

.dialog {
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--md-sys-elevation-level3);
}
.dialog-backdrop {
  background: color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent);
}

.top-app-bar { background: var(--md-sys-color-surface); }
.top-app-bar.scrolled {
  background: var(--md-sys-color-surface-container);
  /* level2 by color change; add box-shadow level2 only if content behind is busy */
}

.nav-bar { background: var(--md-sys-color-surface-container); }
```

Z-order on the web: pair each elevation level with a `z-index` so stacking matches the visual hierarchy (for example level1 = 1, level2 = 2, level3 = 3 for FAB and dialogs, modals above everything with their scrim).

## Checklist

- Each overlapping region has a different surface container role.
- Resting components use their default level; only hover, focus and drag change it.
- Shadows appear only on floating elements (FAB, dialogs, menus, dragged items) or over busy backgrounds.
- Scrim at 32% behind modal surfaces.
- No primary-tinted overlays for elevation.
- Floating interactive elements keep a 3:1 edge contrast or a shadow.
