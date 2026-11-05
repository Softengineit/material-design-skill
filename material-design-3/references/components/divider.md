# Divider

A divider is a thin 1dp line that groups content into sections or shows that nested items belong together, without being a focal point.

## When to use / when not to use

Use a divider only when open space cannot group the content on its own. Dividers group things; they do not separate every individual item. Use them to:
- Split larger sections of unrelated content (full-width), on a surface or inside a card or list.
- Separate an interactive area from a non-interactive one in a card (full-width).
- Separate related items inside one section, such as emails or songs in a list (inset), alongside an anchoring element like an avatar or icon.
- Separate side-by-side content on large screens, for example paragraph text from an image (vertical).

Do not add a divider after every piece of content; too many lines look cluttered. Lists whose items share a repetitive format usually do not need dividers; margins are enough. Keep the line visible but never bold.

## Variants

- Full-width divider: spans 100% of its container. For sections of different content and for interactive versus non-interactive areas.
- Inset divider: indented from the leading edge (16dp) to line up with content next to an avatar or icon; trailing margin 0dp.
- Middle-inset divider: indented 16dp on both sides; for example between body text and a row of selection chips.
- Vertical divider: a vertical line between columns on large screens.

When both kinds appear on one screen, full-width marks a change of content type and inset marks nested items, so the lines reflect the information hierarchy.

## Anatomy

1. Divider: one line, md.sys.color.outline-variant, 1dp thick. No other parts.

## Specs

| Attribute | Value |
|---|---|
| Thickness | 1dp (md.comp.divider.thickness) |
| Color | md.sys.color.outline-variant (md.comp.divider.color) |
| Full-width length | 100% |
| Inset: leading margin / trailing margin | 16dp / 0dp |
| Middle inset: leading / trailing margin | 16dp / 16dp |
| Space between divider and supporting text | 4dp |
| Right margin (when used in a row) | 8dp |
| Bottom margin | 8dp |
| Corner shape | none |
| Elevation | none (level0) |
| Typescale | none (no text) |

Inside other components the divider may use a different role: a dialog divider uses md.sys.color.outline, a full-screen dialog divider uses md.sys.color.surface-variant, and a side sheet divider uses md.sys.color.outline.

## States and interaction

A divider is static. It has no enabled, hover, focus, pressed, disabled or selected state and no state layer. It does not respond to input and should never be used as a drag handle or resizer; use a dedicated control for that.

## Accessibility

- A divider is decorative, so it has no contrast requirement. The grouping it shows must also exist in the content structure (headings, list semantics, spacing, type styles).
- Use `<hr>` for a horizontal divider; it already has the `separator` role. Add `aria-hidden="true"` when the line carries no meaning that screen readers need, or keep the default role when it marks a real section boundary.
- For a vertical divider use `<hr aria-orientation="vertical">` or `<div role="separator" aria-orientation="vertical">`.
- Never rely on the divider alone to tell groups apart; people using screen readers or high-contrast modes may not perceive it.
- Dividers are not focusable and have no keyboard behavior.

## Do / Don't

- Do use a full-width divider between the information part of a card and its "Read more" action area.
- Caution: use full-width dividers sparingly; a line after every block clutters the page.
- Do combine full-width (sections) and inset (nested items) to mirror the hierarchy.
- Do drop dividers in lists of repetitive items and rely on spacing.
- Do pair inset dividers with an anchoring element (avatar, icon) so the indent aligns with the text.
- Do use a vertical divider on large screens between text and media.
- Don't make the divider bold or high contrast; it should be visible, not prominent.

## Minimal implementation

Full-width, inset, middle-inset and vertical dividers. A framework component should accept `inset` (none | start | middle) and `vertical` props and render an `<hr>`.

```html
<ul class="md-list">
  <li class="md-list__item">Inbox</li>
  <hr class="md-divider md-divider--inset">
  <li class="md-list__item">Starred</li>
</ul>

<hr class="md-divider">

<p>Body text</p>
<hr class="md-divider md-divider--middle">
<div class="chips">...</div>

<div class="two-columns">
  <article>Text column</article>
  <hr class="md-divider md-divider--vertical" aria-orientation="vertical">
  <figure>Media column</figure>
</div>
```

```css
.md-divider {
  border: none; margin: 0;
  block-size: 1px; inline-size: 100%;
  background: var(--md-sys-color-outline-variant);
  flex: none;
}
.md-divider--inset  { margin-inline-start: 16px; inline-size: auto; }
.md-divider--middle { margin-inline: 16px; inline-size: auto; }
.md-divider--vertical {
  inline-size: 1px; block-size: auto; align-self: stretch;
  margin-inline: 8px;
}
.two-columns { display: flex; gap: 16px; }
/* inside a dialog: background var(--md-sys-color-outline) */
```

## Tokens

- ../tokens/md.comp.divider.md (color and thickness)
- ../tokens/md.comp.dialog.md, ../tokens/md.comp.full-screen-dialog.md, ../tokens/md.comp.sheet.md (divider colors inside those components)
- ../tokens/md.comp.list.md (lists where inset dividers are common)
