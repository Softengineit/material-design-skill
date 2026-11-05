# Architecture: factor a Material UI so nothing is coded twice

Put every Material component in one place, drive its variants with props, and let pages only compose. Tokens live in one file, layouts live in one folder, and shared hosts (snackbar, dialog) exist once at the shell level.

## Project tree

Use this tree in any framework. Rename extensions to match (`.jsx`, `.vue`, `.svelte`, `.ts`, `.blade.php`), keep the folders.

```
src/
  tokens/
    material-tokens.css        # copied from assets/, never edited by hand
    theme.css                  # brand overrides: only --md-sys-color-* and fonts
  components/
    Button/
      Button.jsx               # markup and props
      Button.css               # scoped styles, class names .md-button*
      Button.stories.jsx       # or README.md with every variant rendered
    Card/
    TextField/
    IconButton/
    Chip/
    ...                        # one folder per Material component
  layouts/
    AppShell/                  # top app bar + navigation bar/rail/drawer + content slot
    ListDetail/
    SupportingPane/
    Feed/
    DialogHost/
    SnackbarHost/
  pages/                       # or routes/: compose layouts + components, zero CSS
    HomePage.jsx
    OrdersPage.jsx
  lib/                         # formatCurrency, formatDate, api client, store
  assets/                      # images, icons, self-hosted fonts
```

Rules that go with the tree:

- `tokens/material-tokens.css` is imported once, at the root. It is the only place a hex color or a font size is written. `theme.css` loads after it and overrides roles, never components.
- A folder in `components/` contains everything the component needs. Deleting the folder removes the component cleanly.
- `pages/` holds no CSS file and no `style=` attribute. If a page needs a style, the style belongs to a component or a layout.
- `lib/` has no markup. `components/` has no fetch calls.

## Component rules

- Variants are props, never duplicated markup. `variant`, `size`, `selected`, `disabled`, `error` map to class names: `variant="outlined"` becomes `.md-card--outlined`.
- One source of truth per token. A component reads `var(--md-sys-color-primary)`, it never defines its own `--primary`.
- Composition over configuration. A Card takes children (or slots named `media`, `header`, `actions`), not 12 props like `title`, `subtitle`, `imageUrl`, `buttonLabel`. The caller decides the content.
- Keep components dumb. A Button renders a button. It does not fetch, read the URL, or know the store. Data comes in through props, events go out through callbacks.
- Split container and presentational. `OrdersPage` (container) loads data and holds state; `OrderCard` (presentational) receives an `order` object and renders it. The presentational part is what the story renders.
- Native elements first: `<button>`, `<a>`, `<input>`, `<dialog>`, `<nav>`. Add ARIA only when nothing native fits.
- Spread unknown props onto the native element so `aria-*`, `data-*`, `id`, `type`, `form` keep working.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Component file and export | PascalCase, Material name | `Button`, `TextField`, `NavigationRail` |
| Block class | `md-` prefix, kebab-case | `.md-card` |
| Element class | BEM double underscore | `.md-card__actions`, `.md-button__label` |
| Modifier class | BEM double hyphen | `.md-card--outlined`, `.md-button--filled` |
| State attribute | data attribute, not a class | `data-selected`, `data-error` |
| Prop | camelCase, same word as the guideline | `variant`, `size`, `supportingText` |

Type the props. Use the Material variant names as literal unions so a typo fails at build time, not in production.

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;           // Material Symbols name
}
```

In plain JavaScript write the same thing in JSDoc: `@param {'filled'|'tonal'|'elevated'|'outlined'|'text'} [props.variant]`.

## Pattern per framework

**React**: `forwardRef` on every component that wraps a native element, destructure the known props, spread `...rest` last. Styles in `Button.module.css` or a global `components.css` that uses the `--md-sys-*` variables. Class name built with a small helper: `` className={`md-button md-button--${variant} ${className}`} ``. Never put `:hover` logic in state. See `assets/examples/react-button.jsx`.

**Vue 3**: `defineProps` with a `validator` listing the variant names. `<style scoped>` for the component, global tokens imported in `main.ts`. Named slots for composition: `<slot name="media" />`, `<slot name="actions" />`. `v-model` on form controls. `inheritAttrs` default so `aria-*` lands on the root element; set `inheritAttrs: false` and bind `$attrs` to the inner `<button>` when the root is a wrapper.

**Angular**: standalone components (`standalone: true`), `@Input() variant: 'filled' | 'tonal' = 'filled'`. Bind classes on the host: `host: { '[class.md-button--filled]': 'variant === "filled"' }`. Content projection with `<ng-content select="[slot=actions]">`. Component styles in `styleUrls`, encapsulation left on.

**Svelte**: `export let variant = 'filled'`, class directive `class:md-button--filled={variant === 'filled'}`, scoped `<style>` block, `<slot name="actions" />`, `{...$$restProps}` on the native element.

**Web Components / Lit**: one custom element per component (`<md-x-button>`), `static properties = { variant: { reflect: true } }` so CSS can target `:host([variant="outlined"])`. Styles in `static styles` using the global custom properties (they cross the shadow boundary). Reflect `disabled` and `aria-*` on the host. Named `<slot>` elements for composition.

**Server templates (Blade, Jinja, Razor, PHP)**: one partial per component with parameters: `@include('components.button', ['variant' => 'tonal', 'label' => 'Save'])`, `{% include "button.html.j2" with variant="tonal" %}`, `<partial name="_Button" model="...">`. The partial emits the exact markup from the component reference. CSS ships as `material-tokens.css` + `material-components.css` in static assets. No inline `style=`.

## Layout templates

### AppShell

One markup, one grid, three navigation modes chosen by width (600, 840, 1200 px are the skill's breakpoints). The navigation element is rendered once; CSS places it at the bottom (bar), left narrow (rail), or left wide (drawer).

```html
<div class="md-app-shell">
  <header class="md-app-shell__top-bar">...</header>
  <nav class="md-app-shell__nav" aria-label="Main">...</nav>
  <main class="md-app-shell__content"><!-- page goes here --></main>
  <div class="md-app-shell__snackbar"></div>
  <div class="md-app-shell__dialog"></div>
</div>
```

```css
.md-app-shell {
  display: grid;
  min-block-size: 100dvh;
  grid-template-areas: "top" "content" "nav";
  grid-template-rows: auto 1fr auto;
  background: var(--md-sys-color-surface);
}
.md-app-shell__top-bar { grid-area: top; }
.md-app-shell__nav { grid-area: nav; }
.md-app-shell__content { grid-area: content; padding: var(--md-sys-measurement-space200); }

@media (min-width: 600px) {           /* medium: rail */
  .md-app-shell {
    grid-template-areas: "nav top" "nav content";
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto 1fr;
  }
  .md-app-shell__content { padding: var(--md-sys-measurement-space300); }
}
@media (min-width: 1200px) {          /* large: drawer */
  .md-app-shell { grid-template-columns: 360px 1fr; }
}
```

Between 840 and 1199 px keep the rail (the 600 px rule still applies) unless the product has more than 7 destinations, then switch to the drawer at 840. The nav component reads a `mode` prop (`bar | rail | drawer`) from a `matchMedia` hook or from CSS alone; the destinations list is written once.

### ListDetail

```css
.md-list-detail { display: grid; grid-template-columns: 1fr; gap: var(--md-sys-measurement-space300); }
.md-list-detail__detail { display: none; }               /* under 840: one pane, detail is its own route */
@media (min-width: 840px) {
  .md-list-detail { grid-template-columns: 360px 1fr; }   /* fixed list, flexible detail */
  .md-list-detail__detail { display: block; }
}
```

Under 840 px the list and the detail are two routes (`/orders` and `/orders/42`). From 840 px the same two components render side by side. The page decides which, the components do not change.

## Shared hosts

- One `SnackbarHost` and one `DialogHost`, rendered once in `AppShell`. Pages never contain a snackbar or a `<dialog>`.
- Trigger them through a tiny store or event bus: `snackbar.show({ message: 'Saved', action: { label: 'Undo', onClick } })` and `dialog.open({ title, body, actions })`.
- The host queues snackbars (one visible at a time, 4 to 10 s), owns focus return for dialogs, and lives at the end of `<body>` so it stacks above everything without `z-index` wars.
- A page that needs confirmation calls `await dialog.confirm('Delete this order?')`, it does not render its own dialog.

## Definition of done for a component

A component is done when every line below is true. Put this list in the component README and tick it.

- Every variant in the guideline is implemented and shown in the story.
- All states render: enabled, hover, focus, pressed, disabled, selected, error (where the component has it).
- Keyboard works as the component's Accessibility section says (Tab, Enter, Space, arrows, Escape).
- Accessible name on everything interactive; `aria-*` reflects state (`aria-pressed`, `aria-expanded`, `aria-invalid`).
- Touch target is at least 48 x 48 px even when the visual is 40 px.
- Light and dark theme checked with `data-theme="dark"` on `<html>`.
- RTL checked with `dir="rtl"`; only logical properties used (`padding-inline`, `margin-inline-start`, `inset-inline-end`).
- `prefers-reduced-motion` respected.
- A story or demo page renders every variant and state side by side.
- `scripts/check_material.py` passes with zero findings on the folder.
- Props typed, README or story lists them.

## Anti-patterns

- Inline `style="color:#6750a4"`: bypasses tokens and dark mode.
- A hex color, a px radius or a ms duration inside component CSS when a token exists.
- The same Button copied into three pages with small differences: fix the component, delete the copies.
- CSS of one page leaking into another through a global `.card` selector: scope it or prefix it.
- Utility soup (`class="flex items-center px-4 h-10 rounded-full bg-purple-600"`) repeated across pages without a component: wrap it once.
- A component that fetches its own data or reads the router.
- A snackbar or dialog per page.
- `z-index: 9999` to win a stacking fight that a single host would avoid.
- Physical properties (`margin-left`) that break RTL.
- A `<div onClick>` instead of a `<button>`.
