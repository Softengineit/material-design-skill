# Layout

How M3 arranges a screen: breakpoints, the bar/rail/pane scaffold, canonical layouts, grids, spacing, density and RTL.
Layout guidance is the same for Android and web; values are in dp, which map 1:1 to CSS px.

## Vocabulary

- Breakpoint: a window width range where the layout changes (formerly "window size class").
- Adaptive design: the layout, components and structure change per context (device, input, preference), not just scale.
- Scaffold: the three-region structure of every layout: bars, rails, panes.
- Bar: top or bottom strip that frames the page (app bar, navigation bar).
- Rail: the perimeter space next to bars and around panes (navigation rail, toolbar, FAB, chat input).
- Pane: a container for one destination's content. All content lives in a pane. 1 to 3 panes per layout.
- Margin: space between the window edge and content.
- Spacer: space between two panes.
- Gap: space between elements inside a container.
- Safety region: area reserved for system UI (status bar, gesture bar). No primary content there.
- Drag handle: control that resizes or collapses a pane.
- Rulers: global alignment lines (margin, bar, title, content) used across all screens.
- Leading and trailing: start and end edges; they flip in RTL.

## Breakpoints

| Breakpoint | Width | Typical devices | Panes | Margin | Pane spacer |
|---|---|---|---|---|---|
| Compact | under 600 dp | phone portrait | 1 | 16 dp | n/a |
| Medium | 600 to 839 dp | tablet portrait, unfolded foldable portrait | 1 (recommended) or 2 | 24 dp | 24 dp |
| Expanded | 840 to 1199 dp | phone landscape, tablet landscape, foldable landscape, small desktop | 2 (recommended) or 1 | 24 dp | 24 dp |
| Large | 1200 to 1599 dp | desktop | 2 (recommended) or 1 | 24 dp | 24 dp |
| Extra-large | 1600 dp and up | desktop, ultra-wide | 2 (recommended), 1 or 3 | 24 dp | 24 dp |

- Design for breakpoints, not devices. Rotation, unfolding, split screen and window resizing all change the breakpoint at runtime.
- Height breakpoints (compact, medium, expanded) exist on Android but are rarely needed because content scrolls vertically.
- In code: `@media (min-width: 600px)`, `@media (min-width: 840px)`, `@media (min-width: 1200px)`, `@media (min-width: 1600px)`; prefer container queries for panes that resize independently.

### Recommended components per breakpoint

| Breakpoint | Navigation | Communication | Supplemental actions |
|---|---|---|---|
| Compact | navigation bar, or modal expanded navigation rail | basic or full-screen dialog | bottom sheet |
| Medium | collapsed navigation rail (single pane) or navigation bar (two panes); modal expanded rail | basic dialog | menu |
| Expanded | collapsed or standard expanded navigation rail | basic dialog | menu |
| Large | collapsed or expanded navigation rail | basic dialog | menu |
| Extra-large | expanded navigation rail (collapse it when a third pane needs room) | basic dialog | menu |

- Compact: put navigation near the bottom edge where thumbs reach. Use one pane.
- Medium: single pane by default. Two panes only for low-density content with quick actions (settings). Each pane is 50% width, no custom widths. The navigation rail can hide on secondary destinations if a back button exists. Limit interactions in the top 25% of a landscape tablet (hard to reach) and avoid essential controls hugging the bottom edge.
- Expanded: two panes is the norm; single pane only for dense media (video, games, calls, creative tools). Fixed pane default width 360 dp. Use tabs inside the pane for sorting or secondary navigation.
- Large and extra-large: fixed pane default width 412 dp. A standard side sheet can be a third pane at extra-large (side sheet max width defaults to 400 dp). Never more than three panes. Watch line length.
- Keep body text between 40 and 60 characters per line at every breakpoint by adjusting margins and type size.
- In code: `max-width: 60ch` on prose containers.

### Five questions when moving to a larger breakpoint

1. Reveal: what hidden UI can show (open the rail, show a second pane)?
2. Divide: how many panes (1 for compact and medium, 2 for expanded and large, up to 3 for extra-large)?
3. Resize: which cards, feeds, lists and panes should grow?
4. Reposition: which elements move (actions from bottom to leading edge) or anchor (centered tabs, FAB in rail)?
5. Swap: which component changes to a functional equivalent (navigation bar to rail, bottom sheet to menu, full-screen dialog to basic dialog, collapsed rail to expanded rail)?

Swap only equivalents. Never swap a button for a chip or a menu. Be careful swapping list items for cards.

## Scaffold regions

### Bars
- Top bar holds the app bar: a title plus 1 or 2 essential actions (search, back). Sits below the top safety region.
- Bottom bar holds the navigation bar: 3 to 5 primary destinations at compact and medium. Sits above the bottom safety region.
- Bars can span one pane or the full window.
- In code: `padding-top: env(safe-area-inset-top)` on the top bar, `padding-bottom: env(safe-area-inset-bottom)` on the bottom bar.

### Rails
- Compact: top and bottom rail regions hold toolbars, chat inputs, FABs and screen-specific controls, often floating above content.
- Larger: leading side rail holds the navigation rail; trailing side rail can hold a vertical toolbar or contextual controls.

### Panes
- Fixed pane: width does not change (360 dp at expanded, 412 dp at large and extra-large). Often temporary (side sheet, light list).
- Flexible pane: grows and shrinks with space. Every layout needs at least one flexible pane.
- Split-pane: two flexible panes, spacer visually centered. With a rail or drawer present, the rail plus first pane take 50% and the second pane takes 50%. Best for foldables.
- Fixed-and-flexible: common at expanded and above, either order.
- Panes can be permanent or temporary. Temporary panes push or resize neighbors when they appear.
- Containment: on most devices panes share the background color (implicit grouping). Use explicit color or outlines only to emphasize.
- In code: `display: grid; grid-template-columns: 360px 1fr; gap: 24px;` for fixed-and-flexible, `grid-template-columns: 1fr 1fr` for split.

### Pane resizing
- Drag handles resize flexible panes or fully collapse and expand a fixed pane (switching between one and two panes). Tapping, double tapping or long pressing the handle toggles sizes.
- Snap points at expanded and above: 360 dp, 412 dp, and centered split.
- Persistent resizing (default): remember the chosen width across sessions and breakpoints. If a user collapses to one full-width pane, it stays collapsed after a breakpoint change.
- Temporary resizing (supporting pane layouts): reset to the default when the pane or app closes.
- Provide keyboard-accessible controls for any resize or move of a floating pane.

### Showing multiple panes
- Co-planar: side by side. Persistent tools belong here.
- Floating: above other content, like a dialog. Temporary tasks stay floating at every breakpoint. On large screens floating is the default and the scrim is optional.
- Docked: pinned to a window edge, like a bottom sheet. At medium and expanded a docked pane can become floating or co-planar; on large screens prefer co-planar.

### Adaptive strategies
- Show and hide: panes enter or leave as space changes.
- Levitate: a pane lifts to floating or docked, placed near its trigger.
- Reflow: panes reorder or stack vertically when horizontal space is short (supporting pane moves below the primary pane in portrait).

## Canonical layouts

### Feed
- A grid of cards or list items for browsing (news, photos, social, courses).
- Compact: one column, items full width, stacked vertically.
- Medium: multiple columns, mixed item widths allowed.
- Expanded and above: more columns and wider columns.
- Items reflow on rotation, unfolding or multi-window. Order is defined by position.
- In code: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`.

### List-detail
- Parent-child content: inbox and message, contacts and contact, file list and file, settings and category.
- Visible panes: compact 1; medium 1 (recommended) or 2; expanded, large, extra-large 2.
- Compact: show list or detail, one at a time. Back button appears in the detail view only.
- Two panes: selected state appears on the list item; no back button. Use grouping to direct focus.
- Medium two-pane: use a bottom navigation bar or modal rail to keep width for the panes.
- Transitions: if nothing is selected when going to two panes, show a placeholder in the detail pane. If an item is selected, show it in detail. Going back to one pane usually shows the detail view with an app bar; apps that support multi-select may show the list with the item selected. Be consistent with what was shown before.
- Preserve state (scroll position, read status) when moving between detail items.

### Supporting pane
- Primary content takes most of the window (about two thirds). Secondary pane holds content that only matters in relation to the primary pane (comments, "up next", lesson list). If the relation is parent-child, use list-detail instead.
- Compact and medium: supporting pane goes below the primary pane, flexible width. A bottom sheet is an option at compact.
- Expanded and above: supporting pane sits on the leading or trailing side, fixed 360 dp.

### Custom layouts
- Build on a canonical layout or layer scaffold elements. Use the levitate strategy to float a focused task (shopping basket, reply box, new event) above the page.

## Grids and rulers

- Every layout sits on a column grid. Column count, width and gutter change per breakpoint: fewer columns on compact (around 4), more on medium and up (around 8), more again on large.
- Order of placement: bars and rails nearest the screen edges first, then panes.
- Rulers: margin ruler, bar and safety rulers (top and bottom), title ruler (aligns app bar title, icons and controls), content rulers (first ruler anchors hero content and headlines, secondary rulers anchor supporting text and actions), rail ruler.
- Margins can be tightened or loosened per product for density or expression. Media like a photo grid may run full bleed while a search bar keeps wider margins.
- In code: define `--layout-margin: 16px` at compact and `24px` from 600px up; align section titles and content to the same left edge across pages.

## Spacing

- Spacing groups content, directs attention and sets tone. Dense feels serious and focused; spacious feels calm.
- Implicit grouping: proximity and open space (a caption under its image, a carousel of tightly spaced items with open space around).
- Explicit grouping: outlines, dividers, shadows, containers. Also signals interactivity (list items between dividers, a card).
- Rhythm: equal horizontal spacing between cards even when heights differ.
- Similarity: same size and style for leading thumbnails, avatars and icons in a list; align them.
- Proximity: buttons sit close to the content they act on; two related buttons sit together.
- Continuity: related controls in one row, column or container (a row of size chips).
- Focal points: keep key actions, carousels and titles in the same position across pages.
- Negative space: frame the most important content with generous space.
- Spacing scales with breakpoint: desktop uses more generous spacing than mobile.
- In code: use a 4 px base scale (4, 8, 12, 16, 24, 32, 48) as CSS custom properties and never ad hoc values.

## Density

- Information density: how much content fits on screen. Change margins, spacers and padding to raise or lower it. Good for data tables, lists, long forms, dashboards, finance and news. Bad for focused or aesthetic pages.
- Density must not change automatically with breakpoint or rotation; only a user setting changes it. A desktop user may want dense; the same user on a phone may not.
- Component density scale: 0 is default, -1, -2, -3 get tighter. Each step usually removes 4 dp of vertical padding or height. Text size does not change; content stays centered in the container.
- Keep 48 x 48 dp targets even when dense. Do not apply component scaling by default if any target would drop below 48 x 48 CSS px. The density setting control itself must keep default target size.
- Do not densify menus, snackbars or dialogs.
- dp: one dp equals one physical pixel at 160 dpi. dp = (px x 160) / screen density. On the web, 1 dp = 1 CSS px.

## Bidirectionality and RTL

- Over 2 billion people read RTL (Arabic, Hebrew, Farsi, Urdu). Layouts mirror: reading starts top right, leading edge is the right edge, navigation rail sits on the right, elements that were left-aligned become right-aligned.
- Text needs both RTL alignment and RTL directionality. Setting alignment alone scrambles word order.
- Email addresses: the domain stays to the right of the username. Phone numbers, URLs and punctuation are common bugs; test them.
- List-detail, feed and supporting pane layouts all mirror.

Mirror in RTL:
- Back and forward arrows, send icons, directional icons.
- Help (question mark) icons in Urdu and Persian.
- Linear progress indicators (fill from right), except in Hebrew where they stay LTR.
- App bars (layout and arrow icons), toolbars (order of tools, FAB moves to the left), badges (move to top left of the icon), text field leading and trailing icons, chip trailing icons (go to the left), expanded navigation rail (opens from the right edge with mirrored icons).
- Swipe gestures and predictive back (a swipe-to-reveal from the right in LTR comes from the left in RTL).

Do not mirror:
- Charts and graphs (stay LTR for Persian and Urdu).
- Media player controls and progress (always LTR).
- Clocks, circular progress, circular refresh icons, any clockwise arrow. For 12-hour clocks the AM/PM label moves to the left of the time.
- Timelines and media controls in Hebrew.

In code:
- Set `dir="rtl"` on `<html>` (or `dir="auto"` on user content) and let the browser handle text direction.
- Use logical properties everywhere: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-start-start-radius`, `text-align: start`, and flex or grid (which flip automatically). Avoid `left`, `right`, `margin-left`, `float: left`.
- Flip directional icons with `[dir="rtl"] .icon-directional { transform: scaleX(-1); }` and give non-mirrored icons (clock, refresh, media) a class that is excluded.
- Wrap LTR-only content (media controls, charts, email domains) in `dir="ltr"` or use `unicode-bidi: isolate` with `<bdi>`.
