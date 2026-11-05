# Components overview

Material Design 3 components are the interactive building blocks of a UI. M3 groups them into six categories by purpose. This file helps pick the right component for a need; each component has its own reference file in this folder.

## Categories

| Category | Purpose | Components |
| --- | --- | --- |
| Action | Let people do something | Buttons, button groups, FAB, extended FAB, FAB menu, icon buttons, segmented buttons, split buttons |
| Containment | Hold and group content | Bottom sheets, side sheets, cards, carousel, dialogs, dividers, lists, tooltips |
| Communication | Tell people what is happening | Badges, loading indicator, progress indicators, snackbar, tooltips |
| Navigation | Move between views | App bars, navigation bar, navigation drawer, navigation rail, tabs, toolbars, search |
| Selection | Pick options or toggle settings | Checkbox, chips, menus, radio button, sliders, switch, date pickers, time pickers |
| Text input | Enter text | Text fields (with select and autocomplete), search |

M3 Expressive (2025) changed several recommendations. When a page says a component is "not recommended", pick the replacement:

| Not recommended any more | Use instead |
| --- | --- |
| Navigation drawer | Expanded navigation rail (navigation-rail.md) |
| Baseline navigation rail (80dp) | Collapsed navigation rail (96dp) |
| Baseline navigation bar (80dp) | Flexible navigation bar (64dp, vertical or horizontal items) |
| Indeterminate circular progress for short waits | Loading indicator |
| Baseline list and baseline menu | Expressive list, vertical menu |
| Divided search style | Contained search style |

## Need to component

| Need | Component | File |
| --- | --- | --- |
| Trigger the main action on a screen | FAB (or extended FAB with a label) | fab.md, extended-fab.md |
| Several related primary actions from one FAB | FAB menu | fab-menu.md |
| A normal action: submit, save, cancel | Button (filled, tonal, elevated, outlined, text) | buttons.md |
| One action with a few alternatives | Split button | split-button.md |
| Group related buttons, toggle between options | Button group, segmented buttons | button-groups.md, segmented-buttons.md |
| A compact action with only an icon | Icon button (plain, filled, tonal, outlined) | icon-buttons.md |
| Frequently used actions for the current page | Toolbar | toolbars.md |
| Page title, navigation icon, top actions | App bar (top app bar, search app bar) | app-bars.md |
| 3 to 5 top-level destinations on phone or tablet | Navigation bar | navigation-bar.md |
| 3 to 7 destinations on tablet or desktop, optional FAB | Navigation rail (collapsed) | navigation-rail.md |
| 5 or more destinations, sections, large screens | Expanded navigation rail (replaces drawer) | navigation-rail.md, navigation-drawer.md |
| Switch between related content groups in one screen | Tabs (primary, secondary) | tabs.md |
| Find items by typing a query | Search | search.md |
| Scan a vertical set of items and act on one | List | lists.md |
| Show content and actions about one subject | Card (elevated, filled, outlined) | cards.md |
| Browse a set of visual items horizontally | Carousel | carousel.md |
| Secondary content from the bottom of a phone screen | Bottom sheet | bottom-sheets.md |
| Secondary content or filters beside the main content | Side sheet | side-sheets.md |
| An important prompt that needs a decision | Dialog | dialogs.md if present, otherwise ../tokens/md.comp.dialog.md |
| Separate groups of content | Divider | dividers.md if present, otherwise ../tokens/md.comp.divider.md |
| A temporary set of actions or options from a control | Menu | menus.md |
| Right-click or long-press actions on an item | Context menu (menu) | menus.md |
| Name an icon-only button | Plain tooltip | tooltips.md |
| Explain a feature with a title, text and a button | Rich tooltip | tooltips.md |
| Low-priority confirmation at the bottom ("Email archived", Undo) | Snackbar | snackbar.md |
| A count or dot on a navigation item or icon | Badge | badges.md |
| A wait of 200ms to 5s with unknown progress | Loading indicator | loading-indicator.md |
| A wait over 5s, known or unknown progress | Progress indicator (linear, circular) | progress-indicators.md |
| Pick several items from a list | Checkbox | checkbox.md |
| Pick exactly one item from up to five visible options | Radio button | radio-button.md |
| Turn one setting on or off, effective immediately | Switch | switch.md |
| Filter, select, enter or trigger with compact pills | Chips (assist, filter, input, suggestion) | chips.md |
| Pick a value or a range on a scale | Slider (standard, centered, range) | sliders.md |
| Pick one option from a long list, save space | Select (text field with menu) | text-fields.md, menus.md |
| Type free text | Text field (filled, outlined) | text-fields.md |
| Type with suggestions | Autocomplete (text field with filtered menu) | text-fields.md |
| Pick a date or a date range | Date picker | date-pickers.md |
| Pick a time | Time picker (dial, input) | time-pickers.md |

## Quick decision rules

- Selection controls: checkbox for many of a list, radio for one of a list (5 or fewer), switch for one standalone setting, select menu for one of many when space is short, chips for filters that stay visible.
- Navigation by window size: compact uses a navigation bar (or modal expanded rail from a menu icon); medium uses a navigation bar or a rail; expanded and larger use a rail. Never show a bar and a rail together. Tabs are for content within a screen, not app destinations.
- Messages by priority: snackbar for low priority with optional action; dialog for high priority needing a decision; tooltip for optional explanation; badge for counts.
- Waiting by duration: under 200ms nothing; 200ms to 5s loading indicator; over 5s progress indicator, determinate when possible.
- Sheets by placement: bottom sheet on phones for quick actions and pickers; side sheet on tablets and desktop for filters and details; dialog for a focused decision.
- Menus vs toolbars: menu for actions needed on demand; toolbar for actions always visible.

## Shared conventions in every component file

- Sizes are in dp (1dp = 1 CSS px on the web).
- Token names like `md.comp.button.container.color → md.sys.color.primary` map to CSS variables in ../../assets/material-tokens.css as `--md-sys-color-primary`. Shape tokens map to `--md-sys-shape-corner-*`, typescale to `--md-sys-typescale-<role>-<size|weight|line-height|font>`, elevation to `--md-sys-elevation-level0` to `level5`, state layer opacities to `--md-sys-state-*`.
- State layer opacities: hover 0.08, focus 0.1, pressed 0.1, dragged 0.16. Disabled content is usually on-surface at 0.38 and disabled containers on-surface at 0.12.
- Focus indicator: 3dp, secondary color, inner offset -3dp or outer offset 2dp depending on the component.
- Touch targets: 48x48dp minimum for every interactive element, even when the visual is smaller.
- Do not apply density by default; keep targets at 48 CSS pixels.
- Full token lists live in ../tokens/md.comp.<component>.md; system tokens in ../tokens/md.sys.*.md.
