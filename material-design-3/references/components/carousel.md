# Carousel

A carousel is a horizontally scrolling row of visual items (images, video, optional short text) whose items change size as they move and snap into a layout.

## When to use / when not to use

Use a carousel to let people browse many visual items in one row: photo collections, featured movies or apps, event feeds, immersive full-screen media. Research found people expect around 10 items in a multi-item carousel and that a partially visible item is a strong cue that more content follows.

Do not use a carousel for text-heavy content (use the uncontained layout or a row of cards instead), for items that must be read in full at once, or when the page cannot also offer a non-scrolling way to see every item (see Accessibility). Do not put arrow buttons inside, beside, or over the carousel.

Pick the layout by goal:

| Layout | Best for |
|---|---|
| Multi-browse | browsing many visual items at once (photos), dynamic layouts |
| Uncontained | customized or text-heavy items, stacked image and text, classic carousel behavior |
| Uncontained multi-aspect ratio | items of different widths (9:16 up to 16:9); only when widths really vary |
| Hero | spotlighting one very large item (movie, featured app) with a peek at the next |
| Center-aligned hero | the same, with the large item centered between two small ones |
| Full-screen | vertical video or image feeds, immersive experiences; portrait only |

## Variants

Six layouts: multi-browse, uncontained, uncontained multi-aspect ratio, hero, center-aligned hero, full-screen. Any layout can be start-aligned or center-aligned; center-aligned hero is the common centered one.

Two scroll modes:
- Default scrolling: items stop anywhere. Only for uncontained layouts.
- Snap scrolling: items snap to the layout grid on release. Required for multi-browse, hero and full-screen; fine for uncontained too.

## Anatomy

1. Container: a rectangle of any size, md.sys.color.surface. How many items are visible depends on layout and breakpoint.
2. Large carousel item: has a configurable max width; must stay large enough that its image is recognizable.
3. Medium carousel item: width adapts to the remaining space (multi-browse only).
4. Small carousel item: 40dp to 56dp wide; the "peek" that signals more content.
5. Item text (optional): brief; full title and label on large items, title hidden on medium, abbreviated label on small.

Items have a parallax effect: the visual moves at a different speed than its container.

## Specs

Per-layout measurements:

| Layout | Leading / trailing padding | Top / bottom padding | Gap between items | Items shown | Item corner radius |
|---|---|---|---|---|---|
| Multi-browse | 16dp / 16dp | 8dp | 8dp | at least one large, one medium, one small | 28dp (md.sys.shape.corner.extra-large) |
| Uncontained | 16dp leading, items bleed past the trailing edge | 8dp | 8dp | equal-size large items | 28dp |
| Uncontained multi-aspect ratio | 16dp leading only | 8dp | 8dp | items from 9:16 to 16:9 | 28dp |
| Hero | 16dp / 16dp | 8dp | 8dp | one large, one small | 28dp |
| Center-aligned hero | 16dp / 16dp | 8dp | 8dp | one large centered, two small | 28dp |
| Full-screen | 0dp | 0dp | 16dp | one edge-to-edge item | none (fills the window) |

Alignment is vertically centered (centered in full-screen). Large item width is dynamic or user-set; medium is dynamic; small is 40dp to 56dp.

Carousel item tokens (md.comp.carousel-item.*):

| Attribute | Value |
|---|---|
| Container color | md.sys.color.surface |
| Container shape | md.sys.shape.corner.extra-large |
| Elevation rest / hover / focus / pressed | level0 / level1 / level0 / level0 |
| Optional outline | 1dp md.sys.color.outline (on-surface when focused) |
| Disabled | container at 0.38 opacity; outline at 0.12 |
| Focus ring | 3dp md.sys.color.secondary, 2dp outer offset |
| Text | no fixed typescale; use title-medium or label-large for a title and label-medium for a short label |

Show all button below the carousel: 4dp padding. Header arrow icon button: 48dp, next to the header in the same row.

## States and interaction

Items are the interactive parts: enabled, hovered, focused, pressed, disabled.
- Hovered: state layer on-surface at 0.08, elevation level1.
- Focused: state layer on-surface at 0.1, focus ring.
- Pressed: state layer on-surface at 0.1 with a ripple, and the item shape changes slightly.
- Disabled: 0.38 opacity.

Scrolling: items resize as they travel through the layout and snap into place on release in snap mode. In full-screen layouts items must snap to the container edges and never stop halfway.

Breakpoints: compact windows comfortably show up to three items (only three if they carry text); larger windows show more and bigger items. Full-screen always shows one.

Reduced motion: remove parallax, stop items from growing as they enter, make all items the same size, and let the row reach the window edges so nothing clips. In hero layouts the small item is then only partly visible.

## Accessibility

- Container: a group with a label (`role="group"` or `region` with `aria-roledescription="carousel"` and `aria-label`). Do not make the container itself focusable.
- Items: each is a focusable element (button or link) with a label that includes its position and the total ("Item 3 of 10, Beach sunset").
- Keyboard: Tab lands on the first item; Tab or Left/Right arrows move between items; Up/Down arrows leave the carousel to the next element (for example the Show all button); Space or Enter activates the focused item.
- On vertically scrolling pages, provide a way to see all items without horizontal scrolling: a Show all button under the carousel that opens a vertical page of all items, or, if the carousel has a header, a 48dp arrow icon button beside the header. Keep the header on the "all items" page. Full-screen carousels are exempt.
- Do not add arrows or other controls inside, over, or beside the carousel; put any controls above or below it.
- Honor `prefers-reduced-motion` as described above.
- Touch targets: items are far larger than 48dp; small items (40dp wide) should still have a 48dp tall target.

## Do / Don't

- Do set the large item size so images and text stay readable. Don't shrink items until the image is unrecognizable.
- Do use snap scrolling for multi-browse, hero and full-screen. Don't free-scroll a full-screen carousel.
- Caution: in compact windows show more than three items only when the imagery is simple.
- Caution: keep item text to two lines in compact windows unless the background is a flat color.
- Do use the uncontained layout or cards when items need a lot of text.
- Do add a Show all button or header arrow. Don't place arrows inside the carousel or over its edges.
- Don't use the full-screen layout in landscape.
- Do use the multi-aspect-ratio layout only when item widths really differ.

## Minimal implementation

Multi-browse style carousel using CSS scroll snapping, with a Show all button. A framework component should render the container, one focusable item per entry with "n of total" labels, and compute item widths from the container width (large = user max, small = 40 to 56px).

```html
<section aria-roledescription="carousel" aria-label="Featured albums">
  <ul class="md-carousel" role="list">
    <li class="md-carousel__item md-carousel__item--large">
      <a href="/album/1" aria-label="Item 1 of 6, Morning light"><img src="a1.jpg" alt=""><span class="md-carousel__label">Morning light</span></a>
    </li>
    <li class="md-carousel__item md-carousel__item--medium">
      <a href="/album/2" aria-label="Item 2 of 6, City walk"><img src="a2.jpg" alt=""></a>
    </li>
    <li class="md-carousel__item md-carousel__item--small">
      <a href="/album/3" aria-label="Item 3 of 6, Coast"><img src="a3.jpg" alt=""></a>
    </li>
    <!-- more items -->
  </ul>
  <button class="md-btn md-btn--text md-carousel__show-all" type="button">Show all</button>
</section>
```

```css
.md-carousel {
  display: flex; gap: 8px; padding: 8px 16px; margin: 0; list-style: none;
  overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
  background: var(--md-sys-color-surface);
}
.md-carousel__item { flex: none; scroll-snap-align: start; height: 200px; }
.md-carousel__item--large  { width: min(70%, 320px); }
.md-carousel__item--medium { width: 25%; }
.md-carousel__item--small  { width: 48px; }  /* 40 to 56dp */
.md-carousel__item a {
  position: relative; display: block; width: 100%; height: 100%; overflow: hidden; isolation: isolate;
  border-radius: var(--md-sys-shape-corner-extra-large); color: var(--md-sys-color-on-surface);
}
.md-carousel__item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.md-carousel__item a::after { content: ""; position: absolute; inset: 0; background: var(--md-sys-color-on-surface); opacity: 0; }
.md-carousel__item a:hover { box-shadow: var(--md-sys-elevation-level1); }
.md-carousel__item a:hover::after { opacity: var(--md-sys-state-hover-state-layer-opacity); }
.md-carousel__item a:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }
.md-carousel__item a:active::after { opacity: var(--md-sys-state-pressed-state-layer-opacity); }
.md-carousel__label {
  position: absolute; left: 16px; bottom: 16px; padding: 4px 8px;
  background: color-mix(in srgb, var(--md-sys-color-scrim) 40%, transparent); color: #fff;
  border-radius: var(--md-sys-shape-corner-small);
  font-family: var(--md-sys-typescale-label-large-font); font-size: var(--md-sys-typescale-label-large-size);
}
.md-carousel__item--small .md-carousel__label, .md-carousel__item--medium .md-carousel__label { display: none; }
.md-carousel__show-all { margin: 4px 16px; }
@media (prefers-reduced-motion: reduce) {
  .md-carousel__item { width: min(70%, 320px); } /* all items same size, no parallax */
}
```

JS: on scroll, recompute which item is large, medium or small from its distance to the leading edge and update the class, animating width with the standard easing; skip resizing under reduced motion.

## Tokens

- ../tokens/md.comp.carousel-item.md (item color, shape, states, optional outline)
- ../tokens/md.sys.shape.md (extra-large), ../tokens/md.sys.state.md, ../tokens/md.sys.motion.md
