# Cards

A card is a flexible container that groups content and actions about one subject (an image, headline, text, buttons) into a single scannable surface.

## When to use / when not to use

Use a card to present related information on one topic, such as an album, a trip, an article summary, or a product, with a clear hierarchy between image, headline, subhead, supporting text and actions. Cards also work as entry points to a detail screen. Several cards can form a grid, a vertical list, or a carousel.

Do not force content into cards when plain spacing, headings or dividers would give a simpler hierarchy (for example a list of albums). On compact screens, consider swapping cards for list items, keeping the same controls. On large screens avoid stretching cards across the full width; use columns, rows or carousels.

All three variants are equally legible, so pick by style only.

## Variants

- Elevated card: surface-container-low with a level1 shadow. More separation than filled, less than outlined.
- Filled card: surface-container-highest, no shadow. The subtlest separation from the background.
- Outlined card: surface with a 1dp outline-variant stroke. A visible boundary gives it the most emphasis.

## Anatomy

Only the container is required. A common layout:
1. Container (holds everything; size follows content; expresses elevation).
2. Image, thumbnail (avatar, logo) or video.
3. Headline (subject, for example album name).
4. Subhead (byline, tagged location).
5. Supporting text (summary or description; can contain a link).
6. Actions: buttons (Learn more, Add to cart), icon buttons (Save, Heart, star rating), chips, sliders, checkboxes, an overflow menu in the top-right or bottom-right corner.
7. Dividers: full-width to mark expandable regions, inset to separate related content.

Content is grouped in blocks with different emphasis. Text is start-aligned.

## Specs

| Variant | Container color | Outline | Corner shape | Elevation rest / hover / focus / pressed / dragged | Disabled | Icon |
|---|---|---|---|---|---|---|
| Elevated | md.sys.color.surface-container-low | none | md.sys.shape.corner.medium (12dp) | level1 / level2 / level1 / level1 / level4 | container surface at 0.38 opacity, level1 | md.sys.color.primary, 24dp |
| Filled | md.sys.color.surface-container-highest | none | md.sys.shape.corner.medium (12dp) | level0 / level1 / level0 / level0 / level3 | container on-surface at 0.38 opacity, level0 | md.sys.color.primary, 24dp |
| Outlined | md.sys.color.surface | 1dp md.sys.color.outline-variant (on-surface when focused) | md.sys.shape.corner.medium (12dp) | level0 / level1 / level0 / level0 / level3 | outline md.sys.color.outline at 0.12 opacity | md.sys.color.primary, 24dp |

Layout: 16dp left and right inner padding; at most 8dp between cards in a collection; label text start-aligned. Shadow color md.sys.color.shadow, surface tint md.sys.color.surface-tint. No fixed height or label typescale: headlines usually use title-medium or title-large, subheads body-medium or label-large, supporting text body-medium.

## States and interaction

States apply only to directly actionable cards (the whole card is one target). Non-actionable cards have no hover, ripple or focus; only the controls inside do.

- Hovered: state layer on-surface at 0.08 (md.sys.state.hover.state-layer-opacity); elevation rises one level (elevated to level2, filled and outlined to level1).
- Focused: state layer on-surface at 0.1, focus ring 3dp md.sys.color.secondary with 2dp outer offset; outlined card stroke becomes on-surface.
- Pressed: state layer on-surface at 0.1 with a ripple; elevation back to rest.
- Dragged: state layer on-surface at 0.16 (md.sys.state.dragged.state-layer-opacity); elevation level4 (elevated) or level3 (filled, outlined). The card floats above everything except app bars and navigation, and must not push other elements aside.
- Disabled: container at 0.38 opacity (elevated: surface, filled: on-surface) or outline at 0.12 (outlined).

Behaviors:
- Expanding: use a container transform to open a card into a detail view; reserve it for hero moments. Forward/backward transitions are the simpler default for navigation.
- Swipe: one swipe action per card (dismiss, archive, flag), performed anywhere on the card. Cards must not contain swipeable content such as an image carousel, and no part may detach on swipe.
- Pick up and move: raise elevation while dragging to reorder.
- Scrolling: content taller than the card is cut off, not scrolled; expand the card instead. On mobile, cards never scroll internally (it would create two scrollbars); the page scrolls. On desktop, internal scrolling is allowed.
- Collections: cards are coplanar (same resting elevation). Filters and sort controls go outside the collection and apply to every card.

## Accessibility

- A card is either a container with actions inside (no role, not focusable) or a directly actionable surface with no nested actions (`<a>` with role link or `<button>` with role button). Never stack actions on an actionable surface.
- Keyboard: Tab moves to the next actionable element. For a directly actionable card, the card itself is the tab stop; for a non-actionable card, each button and link inside is visited in order before focus leaves the card. Space or Enter performs the action or opens a secondary menu; inside the menu, arrows move, Space or Enter selects, Tab exits.
- Screen readers read the informative content in order (heading, image alt, body text, buttons). Hide purely decorative images with `alt=""` or `aria-hidden="true"`.
- Any drag or swipe needs a single-pointer alternative, such as a menu (opened by tap or long press) with Move up, Move down, Delete. Do not cover the card with that menu while it is in the dragged state.
- Text or icons placed on images need a scrim or a bounding shape to keep contrast.
- Keep the same element order across breakpoints.

## Do / Don't

- Do group cards in grids, lists or carousels. Don't cardify content that spacing or dividers already organize.
- Do give text and images an obvious hierarchy. Caution: text over images needs a scrim for contrast.
- Do expand a card to reveal more. Don't scroll inside a card on mobile.
- Do assign one swipe action at most. Don't put swipeable content inside a card and don't let parts detach.
- Do raise elevation when a card is picked up. Don't let it bump other elements.
- Do use multiple columns, rows or carousels on large screens. Don't stretch a card across a wide screen.
- Do keep filter and sort controls outside the collection.

## Minimal implementation

Elevated card, non-actionable, with image, headline, subhead, supporting text and two actions. A framework component should accept slots (media, header, content, actions) and a `variant` prop, and switch to a button or link element when `actionable` is set.

```html
<article class="md-card md-card--elevated">
  <img class="md-card__media" src="trip.jpg" alt="">
  <div class="md-card__body">
    <h3 class="md-card__headline">World tour 2026</h3>
    <p class="md-card__subhead">12 cities, 40 days</p>
    <p class="md-card__text">A route through Lisbon, Marrakech and Cape Town with stops you can edit.</p>
  </div>
  <div class="md-card__actions">
    <button class="md-btn md-btn--text" type="button">Share</button>
    <button class="md-btn md-btn--filled" type="button">View details</button>
  </div>
</article>
```

```css
.md-card {
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: var(--md-sys-shape-corner-medium);
  color: var(--md-sys-color-on-surface);
}
.md-card--elevated { background: var(--md-sys-color-surface-container-low); box-shadow: var(--md-sys-elevation-level1); }
.md-card--filled   { background: var(--md-sys-color-surface-container-highest); }
.md-card--outlined { background: var(--md-sys-color-surface); border: 1px solid var(--md-sys-color-outline-variant); }
.md-card__media { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.md-card__body { padding: 16px; display: grid; gap: 4px; }
.md-card__headline {
  margin: 0; font-family: var(--md-sys-typescale-title-medium-font); font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: var(--md-sys-typescale-title-medium-weight); line-height: var(--md-sys-typescale-title-medium-line-height);
}
.md-card__subhead, .md-card__text {
  margin: 0; font-family: var(--md-sys-typescale-body-medium-font); font-size: var(--md-sys-typescale-body-medium-size);
  line-height: var(--md-sys-typescale-body-medium-line-height);
}
.md-card__subhead { color: var(--md-sys-color-on-surface-variant); }
.md-card__actions { display: flex; justify-content: flex-end; gap: 8px; padding: 0 16px 16px; }
/* directly actionable card: render as <button class="md-card md-card--elevated md-card--actionable"> */
.md-card--actionable { position: relative; isolation: isolate; border: none; text-align: start; cursor: pointer; font: inherit; }
.md-card--actionable::after { content: ""; position: absolute; inset: 0; background: var(--md-sys-color-on-surface); opacity: 0; z-index: -1; }
.md-card--actionable:hover { box-shadow: var(--md-sys-elevation-level2); }
.md-card--actionable:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-card--actionable:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-card--actionable:focus-visible::after, .md-card--actionable:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
```

Use `.md-btn` styles from buttons.md for the actions.

## Tokens

- ../tokens/md.comp.elevated-card.md, ../tokens/md.comp.filled-card.md, ../tokens/md.comp.outlined-card.md
- ../tokens/md.comp.divider.md, ../tokens/md.comp.button.md, ../tokens/md.comp.icon-button.md (content inside)
- ../tokens/md.sys.elevation.md, ../tokens/md.sys.state.md (dragged opacity 0.16)
