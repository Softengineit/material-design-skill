# Badges

A badge is a small error-colored dot or pill anchored on the upper trailing corner of an icon that signals a notification, a count, or a status for that destination.

## When to use / when not to use

Use a badge on a navigation destination icon (navigation bar, navigation rail, app bar, tab) to show that something is new or how many items wait there. Hide the badge once the person opens that destination (for unread notifications).

Do not use badges to decorate, to show static labels, or anywhere they could be cut off by the screen edge or overlap neighboring text. Do not move a badge to an arbitrary position or place it over the icon. Keep the default error color; custom colors create conflicts with other UI colors.

## Variants

- Small badge: a 6dp dot with no text. Means "something new" without a count. Use it in tight spaces such as app bars, where a large badge might hit the edge.
- Large badge: a 16dp tall pill with label text (a count or a short status). It grows in width as the text grows but keeps the same anchor point. Content is at most 4 characters, including a trailing "+" (999+).

## Anatomy

1. Small badge: circle only.
2. Large badge container: fully rounded, error color.
3. Large badge label: on-error text in label-small.
4. Anchor: inside the icon bounding box, at the upper trailing edge. In RTL the badge moves to the upper leading (left) corner.

Configurations seen in navigation: inactive or active destination, with or without label, each with small badge, large badge, or large badge at max character count.

## Specs

| Variant | Size (H x W) | Corner radius | Container color | Label color | Label typescale | Offset from icon top trailing corner to badge bottom leading corner | Padding | Elevation |
|---|---|---|---|---|---|---|---|---|
| Small | 6dp x 6dp | md.sys.shape.corner.full (3dp effective) | md.sys.color.error | none | none | 6dp down x 6dp in | none | level0 |
| Large, one digit | 16dp x 16dp | md.sys.shape.corner.full (8dp effective) | md.sys.color.error | md.sys.color.on-error | md.sys.typescale.label-small | 14dp down x 12dp in | 4dp horizontal between label and container edge | level0 |
| Large, max characters | 16dp x 34dp | md.sys.shape.corner.full (8dp effective) | md.sys.color.error | md.sys.color.on-error | md.sys.typescale.label-small | 14dp down x 12dp in | 4dp | level0 |

The same colors apply in the navigation bar and the navigation rail. No hover, focus or pressed elevation changes: a badge is not interactive.

## States and interaction

A badge has no interaction states of its own. It follows the state of its host destination:
- Inactive or active destination, with or without label: the badge keeps its size and anchor.
- When the destination is selected and the badge meant "unread", hide the badge.
- The large badge width animates as the count changes; the anchor does not move.
- Counts above the limit are truncated: 1,234 becomes 999+.

## Accessibility

- The badge is not focusable. Its information must be part of the host element's accessible name: "Inbox, 24 new messages", or "Chats, new notification" for a small badge.
- Screen readers announce the destination first, then the badge value. A numeric badge reads its number; a dot badge reads "New notification".
- Keep the default colors; error on surface and on-error on error already give at least 3:1 contrast. If custom roles are unavoidable, verify 3:1.
- Use `aria-live="polite"` on a visually hidden text node if counts change while the page is open, so updates are announced without stealing focus.
- Make sure the badge never covers the icon, which would reduce icon legibility.

## Do / Don't

- Do mirror the badge to the leading corner in RTL. Don't place badges at random positions or on top of the icon.
- Do use the default error color. Don't use custom colors unless they keep 3:1 contrast.
- Do truncate to 4 characters with "+" (999+). Don't let the label overflow or get cut off by another element.
- Do use a large badge where there is room, for example beside a navigation rail item. Caution: in app bars prefer the small badge.
- Do put a large badge at the trailing edge when the icon is followed by text (tabs). Don't let a large badge overlap the icon and text.
- Do hide the badge once the destination is visited.

## Minimal implementation

Icon button with a large badge. A framework component should wrap the icon in a relative container and render the badge as a sibling, with a `count` prop (undefined = small dot) and a formatter that caps at 999+.

```html
<button class="md-nav-icon" type="button" aria-label="Inbox, 24 new messages">
  <svg class="md-nav-icon__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4v16h16V4zm-2 10h-4a2 2 0 0 1-4 0H6V6h12v8z" fill="currentColor"/></svg>
  <span class="md-badge md-badge--large" aria-hidden="true">24</span>
</button>

<button class="md-nav-icon" type="button" aria-label="Chats, new notification">
  <svg class="md-nav-icon__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H7l-3 3V4z" fill="currentColor"/></svg>
  <span class="md-badge" aria-hidden="true"></span>
</button>
```

```css
.md-nav-icon {
  position: relative; display: inline-grid; place-items: center;
  width: 48px; height: 48px; border: none; background: transparent; cursor: pointer;
  color: var(--md-sys-color-on-surface-variant);
}
.md-nav-icon__icon { width: 24px; height: 24px; }
/* icon box is 24x24 centered in 48x48, so its top-right corner is at 12px from the button edges */
.md-badge {
  position: absolute; box-sizing: border-box;
  top: 12px; right: 12px;                 /* icon top trailing corner */
  width: 6px; height: 6px;
  transform: translate(0, 0);              /* small: 6dp down x 6dp in from the corner */
  background: var(--md-sys-color-error);
  border-radius: var(--md-sys-shape-corner-full);
}
.md-badge--large {
  width: auto; min-width: 16px; height: 16px; padding: 0 4px;
  display: inline-grid; place-items: center;
  top: 12px; right: 12px; transform: translate(50%, -50%) translate(-6px, 7px); /* 14dp down x 12dp in */
  color: var(--md-sys-color-on-error);
  font-family: var(--md-sys-typescale-label-small-font);
  font-size: var(--md-sys-typescale-label-small-size);
  font-weight: var(--md-sys-typescale-label-small-weight);
  line-height: var(--md-sys-typescale-label-small-line-height);
  letter-spacing: var(--md-sys-typescale-label-small-tracking);
  white-space: nowrap;
}
[dir="rtl"] .md-badge { right: auto; left: 12px; }
[dir="rtl"] .md-badge--large { transform: translate(-50%, -50%) translate(6px, 7px); }
```

Count formatting in JS: `const label = count > 999 ? "999+" : String(count);`

## Tokens

- ../tokens/md.comp.badge.md (color, size, large label typescale)
- ../tokens/md.comp.navigation-bar.md, ../tokens/md.comp.navigation-rail.md (host components)
- ../tokens/md.sys.typescale.md (label-small)
