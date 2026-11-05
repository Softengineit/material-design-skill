# Accessibility

Rules for making M3 interfaces usable with screen readers, keyboards, switch input, low vision and motor limits.
Covers contrast, target sizes, focus, structure, labels, alt text, text resizing and motion.

## Core approach

- Accessibility is a default in M3, not an add-on. Material components already carry the needed roles and keyboard behavior; keep that behavior when you wrap or restyle them.
- Prefer native platform controls and semantic HTML over custom widgets. A custom dialog, select or checkbox needs extra ARIA work and extra testing to behave like the native one.
- The framework follows WCAG. Treat WCAG minimums as the floor, not the target.
- Usability is a separate goal: a clear visual hierarchy (size, color, containment, spacing) with one primary action per screen helps everyone, including assistive-technology users.
- In code: `<button>`, `<a href>`, `<input>`, `<select>`, `<dialog>`, `<nav>`, `<main>` before any `<div role="...">`.

## Contrast ratios

| Content | Minimum ratio against background |
|---|---|
| Small text | 4.5:1 |
| Large text (14 pt bold or 18 pt regular and up) and graphics | 3:1 |
| Container of a clustered element (a button in a group of buttons) | 3:1 |
| Standalone prominent element (a FAB) | no 3:1 container requirement |
| Disabled states | exempt from contrast requirements |

- Essential parts of informative images follow the same 3:1 (large) and 4.5:1 (small) rules. Purely decorative parts of an illustration are exempt.
- The M3 color roles are built so that each "on" color passes against its container (on-primary on primary, on-surface on surface). Using the role pairs as designed is the easiest way to pass.
- Tone math from the M3 color system: a tone difference of 40 between two colors guarantees at least 3:1, a difference of 50 guarantees at least 4.5:1.
- Use contrasting hues (not just two similar tints) to separate primary and secondary actions.
- In code: never set text color without also setting the background it sits on; pair `color: var(--md-sys-color-on-surface)` with `background: var(--md-sys-color-surface)`.

## Target sizes and spacing

| Item | Value |
|---|---|
| Touch target minimum | 48 x 48 dp (about 9 mm physically; recommended 7 to 10 mm) |
| Pointer (mouse, stylus) target minimum | 44 x 44 dp |
| iOS convention | 44 x 44 dp |
| Space between separate targets | 8 dp or more |
| State layer (visual ripple area) | 40 dp, inside the 48 dp target |
| Typical icon size inside a 48 dp target | 24 dp (40 dp for some larger icons) |

- The target is larger than the visual element. A 24 dp icon still needs a 48 dp hit area through padding.
- A button can be shorter than 48 dp visually (for example 36 dp high) as long as its interactive area is at least 48 dp.
- Never apply density scaling by default if it would shrink any target below 48 x 48 CSS px. Density must be a user opt-in, and the control that turns it off must itself keep the 48 dp target.
- Do not add density to menus (reduces selectable space) or to alerting components like snackbars and dialogs.
- In code: `min-width: 48px; min-height: 48px;` on icon buttons, or pad a 24px icon with 12px on each side; keep `gap: 8px` between adjacent icon buttons.

## Structure: landmarks and headings (web)

- Screen readers read the DOM top to bottom. The source order, not CSS placement, decides reading order. Keep DOM order equal to the intended visual order (for a 2 x 2 card grid: top left, top right, bottom left, bottom right).
- Use the eight ARIA landmark roles: navigation, search, main, banner, complementary, contentinfo, region, form.
- Exactly one each of main, banner and contentinfo per page.
- When a landmark appears more than once (two navigation areas, several regions), give each a unique label. Every region must be labeled. Do not repeat the role word in the label ("Primary", not "Primary navigation").
- Headings follow the content hierarchy, not visual styling. One H1 for the page title. Never skip a level (no H2 straight to H4). Visual size of a heading does not need to match its level.
- In code: `<header>` = banner, `<nav aria-label="Primary">`, `<main>`, `<aside>` = complementary, `<footer>` = contentinfo, `<section aria-labelledby="...">` = region, `<form aria-label="...">`.

## Keyboard navigation and focus order

- Every primary and secondary user journey must be completable with Tab, Shift+Tab, arrow keys, Enter, Space and Escape.
- Default tab order follows DOM order, left to right, top to bottom. Use it. Only override for a custom component or an unusual pattern.
- Tab moves between interactive elements. Arrow keys move inside a composite component (menu items, grid cells, tabs, radio group). Enter activates a link or button and submits a form from a focused field. Space toggles switches and checkboxes and plays or pauses media. Escape closes menus, dialogs and sheets, clears selection, and removes focus indicators.
- Group a set of related controls as one tab stop and use arrow keys inside it when a long row of items would otherwise create many tab stops.
- Define initial focus for each screen: focus the element that serves the most common goal (a search field on a search page).
- Dialog focus: on open, move focus into the dialog (usually to its first interactive element or primary field). On close, return focus to the element that opened it. If the dialog opened automatically, send focus to the next logical element on close.
- Modal floating panes block interaction behind them and close on outside interaction. Non-modal panes allow focus to move in and out and must sit in the logical reading order.
- Co-planar and docked panes: focus order must match the visual arrangement.
- In code: `tabindex="0"` only on custom interactive elements; `tabindex="-1"` for programmatic focus targets; never positive tabindex values. Use `inert` or `aria-modal="true"` on dialogs and restore focus with the saved `document.activeElement`.

## Focus indicator

- A keyboard-focused element shows a visible ring-shaped focus indicator plus the focus state layer (10% opacity of the content color).
- The indicator is 3 dp thick and sits outside the component bounds with a small offset.
- Only one element is focused at a time. Focus can combine with hover, selected or activated.
- Disabled elements cannot receive focus.
- In code: `:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }` and never `outline: none` without a replacement.

## Keyboard shortcuts

- Custom shortcuts use two or more keys by default (Ctrl+Z, not Z).
- Publish a list or help page of all custom shortcuts.
- If a single-key shortcut is needed: best option is to remap it to include a modifier; next best is to fire it only when the relevant component has focus; last resort is a setting to turn it off.

## Labels for screen readers

Needs a label:
- Icon-only buttons and links, or buttons whose visible text lacks context (a pencil icon for "Edit").
- Interactive images.
- Visual status cues: progress bars, error icons, status icons.
- Meaningful images, diagrams, illustrations.
- Generic link or button text when several share the same wording on a page ("Learn more", "Save").

Does not need a label:
- Non-interactive visible text (already read).
- Buttons whose visible text is complete ("Download image").

Label writing rules:
- Describe purpose, not appearance: "Search", not "Magnifying glass"; "Voice search", not "Microphone".
- Never include the role in the label. The role is announced automatically; "Submit button" is read as "Submit button button".
- Keep labels short and specific to content, purpose and behavior.
- Mark decorative images and icons as hidden.
- Assign a role to every custom interactive element so assistive technology knows how it behaves.
- In code: `aria-label` on icon buttons, `aria-labelledby` to reuse visible text, `aria-describedby` for extra context, `alt=""` plus `aria-hidden="true"` on decorative SVG icons, `role="progressbar"` with `aria-valuenow` on custom progress.

## Alt text for images

- Alt text is read in place of the image and shows when the image fails to load. Keep it at or under 140 characters (the writing page says up to 125). Long alt text gets cut off by some readers.
- Decorative image (removing it loses nothing): `alt=""`. No caption either.
- Do not start with "image of" or "picture of"; the reader already announces "image".
- Describe the meaning in context, not every detail. In a shop, name the product, not the room around it.
- Do not repeat the caption. Do not use one word in the caption and a different word in the alt ("vintage" in one, "antique" in the other).
- Change the alt text when the same image is reused in a different context.
- Text embedded in an image is invisible to screen readers. Put that information in the alt text or in adjacent text.
- Naming the image type helps only for charts, infographics, maps, graphs, screenshots, headshots and diagrams.
- Charts: use the pattern "Summary of [data type] + [why the chart is shown]". State the takeaway and the one or two key numbers, not every data point. For open-ended analysis charts, describe the structure and point to the data source instead of inventing a conclusion. Prefer interactive charts with tooltips over static images.
- Animations and GIFs: summarize the action like a title ("A tooltip labeled star appears on hover"). Long videos use audio description instead of alt text.
- In code: `<img alt="...">`, `<svg role="img" aria-label="...">`, `<figure><figcaption>` for captions that help everyone.

## Text resizing and truncation

- The UI must still work when text is scaled up by at least 200%.
- When text scales: text and line height scale by the multiplier; padding and spacing between elements stay at 1x (a button keeps 8 dp top and bottom, 24 dp left and right).
- Components without text (progress indicators, checkboxes, radio buttons, icons) do not scale with text size.
- Scaled size = default size x multiplier (14 pt at 2x = 28 pt). If the OS does not control text size, offer 1.5x and 2x in-app.
- No content or function may be lost when text grows or when a translation is longer (other languages average 1.5 times the length of English).
- Preferred fixes in order: wrap text and let the container grow; reflow (stack side-by-side buttons vertically); allow vertical scrolling (never both directions); for fixed-space labels in top app bars, navigation bars, rails and fixed tabs, keep the label at 1x and show the enlarged text in a touch-and-hold tooltip.
- Truncation with an ellipsis is acceptable only if the full text is reachable through a tooltip, link or expanded view. An ellipsis with no way to read the rest is not accessible.
- In code: use `rem` or `em` for font sizes, `px` for padding; avoid fixed heights on text containers; `min-height` instead of `height`; `@media (prefers-reduced-motion)` is separate, see below.

## Motion

- Motion should mark key moments only. It distracts, so use it sparingly.
- Users who turn on reduced motion must still get every state change and every piece of information, just without the non-essential animation.
- In code: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` or disable only decorative animations and keep opacity fades.

## Quick checklist before shipping

- Every interactive element reachable and operable with keyboard alone, with a visible 3 px focus ring.
- Every icon-only control has an `aria-label` describing its purpose.
- Every informative image has alt text; decorative ones have `alt=""`.
- Small text 4.5:1, large text and clustered controls 3:1.
- Every target at least 48 x 48 px with 8 px between neighbors.
- One H1, no skipped heading levels, landmarks with unique labels.
- Dialogs trap and restore focus; Escape closes them.
- Layout survives 200% text zoom with no clipped or hidden content.
- Non-essential motion stops under `prefers-reduced-motion`.
