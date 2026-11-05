# Applying Material Design 3 in each web language or framework

The rules are the same everywhere: tokens as the single source of values, the component anatomy from the component references, state layers, focus rings, 48px targets. What changes is where the tokens live and how a component is packaged. This file gives the mapping per environment.

## Plain HTML, CSS and JavaScript

- Link `assets/material-tokens.css` before any other stylesheet.
- Load fonts and icons from Google Fonts:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Flex:opsz,wght@8..144,400;8..144,500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
  ```
- Write one CSS class per component variant (`.md-button`, `.md-button--filled`, `.md-button--tonal`), following the minimal implementation in each component file. BEM-style naming keeps the anatomy visible.
- Dark theme: `<html data-theme="dark">` or rely on `prefers-color-scheme`. Both are handled by the token file.
- Dialogs: use `<dialog>` and `showModal()`. Menus and sheets: a container with `role="menu"` or `role="dialog"` and focus management in a few lines of JS.
- `assets/examples/starter.html` is a complete working page.

## React (and Next.js, Remix, Preact)

- Import the token CSS once in the root (`import './material-tokens.css'`).
- One component per Material component, with props that match the guideline's variants: `<Button variant="filled" size="medium" icon={<Icon name="add" />}>Save</Button>`.
- Keep CSS in modules or a global stylesheet using the `--md-sys-*` variables. With CSS-in-JS (styled-components, Emotion, vanilla-extract) still reference the custom properties (`background: var(--md-sys-color-primary)`), do not copy hex values into JS.
- State layer and focus ring come from CSS (`:hover`, `:focus-visible`), not from React state. Use React state only for selected, open, expanded, value.
- Forward refs and spread remaining props onto the native element so `aria-*` and `disabled` work.
- `assets/examples/react-button.jsx` shows the pattern (button, icon button, text field).
- MUI: its default theme is Material 2. If the project already uses MUI, create a theme that sets `palette` from the `--md-sys-color-*` values, `shape.borderRadius` to the shape tokens, `typography` to the type scale, and override `MuiButton` to the 40px height, 16px horizontal padding and full corner shape. For a new project prefer hand-written components or `@material/web` (works inside React through a thin wrapper, see the Web Components section).

## Vue 3 (and Nuxt)

- Import the token CSS in `main.ts` or `app.vue`.
- Single-file components with `<style scoped>` that use the variables. Scoped styles plus global tokens is the right split.
- Expose variants through props with validators: `variant: { type: String, default: 'filled', validator: v => ['filled','tonal','outlined','text','elevated'].includes(v) }`.
- Use `v-model` for selection controls (checkbox, switch, radio, text field, slider) so the native semantics stay intact.
- `assets/examples/vue-card.vue` shows a card with the three variants.
- Vuetify 3 targets Material 3 with its "blueprints" (`md3` blueprint); set its theme colors from the same role names. It is acceptable when speed matters more than spec precision.

## Angular

- Angular Material 17.2 added Material 3 themes; from Angular Material 18 they are the default. Define the theme in Sass:
  ```scss
  @use '@angular/material' as mat;
  html {
    @include mat.theme((
      color: (primary: mat.$violet-palette, tertiary: mat.$orange-palette, theme-type: light),
      typography: Roboto,
      density: 0,
    ));
  }
  ```
  This emits `--mat-sys-primary`, `--mat-sys-on-surface`, `--mat-sys-body-large` and so on. The names map one to one to `--md-sys-color-primary`, `--md-sys-color-on-surface`, `--md-sys-typescale-body-large-*`. For custom components written outside Angular Material, either use the `--mat-sys-*` variables or alias them to the `--md-sys-*` names in a global stylesheet.
- Prefer the Angular Material components when they exist (button, FAB, chips, dialog, snackbar, tabs, sidenav, form field, slider, toggle). Build the missing M3 Expressive pieces (split button, button groups, FAB menu, toolbar, loading indicator) by hand with the component references.

## Svelte, SolidJS, Qwik, Astro

- Same as the plain HTML approach wrapped in components. Svelte's scoped `<style>` and Solid's `class` props both work with global custom properties.
- Astro: put the token CSS in the layout; components can be plain `.astro` files.

## Web Components and Lit

- `@material/web` (Material Web Components, by Google) implements M3 with exact tokens: `md-filled-button`, `md-outlined-text-field`, `md-fab`, `md-dialog`, `md-tabs`, `md-navigation-bar` (in labs), and more. It is in maintenance mode (no new components planned) but it remains the most spec-accurate ready-made option on the web.
  ```html
  <script type="module">
    import '@material/web/button/filled-button.js';
    import '@material/web/textfield/outlined-text-field.js';
  </script>
  <md-filled-button>Save</md-filled-button>
  ```
  Theme it with the same variables: it reads `--md-sys-color-*`, `--md-sys-typescale-*`, `--md-sys-shape-corner-*`, and per-component tokens like `--md-filled-button-container-color`.
- For your own Lit elements: adopt the token stylesheet in the document, use the variables inside `static styles`, and reflect `aria-*` attributes on the host.

## Tailwind CSS

Extend the theme with the tokens so utilities carry the role names:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'md-sys-primary': 'var(--md-sys-color-primary)',
        'md-sys-on-primary': 'var(--md-sys-color-on-primary)',
        'md-sys-surface': 'var(--md-sys-color-surface)',
        'md-sys-surface-container': 'var(--md-sys-color-surface-container)',
        'md-sys-on-surface': 'var(--md-sys-color-on-surface)',
        'md-sys-outline': 'var(--md-sys-color-outline)',
      },
      borderRadius: { 'md-xs': '4px', 'md-sm': '8px', 'md-md': '12px', 'md-lg': '16px', 'md-xl': '28px' },
      boxShadow: { 'md-1': 'var(--md-sys-elevation-level1)', 'md-3': 'var(--md-sys-elevation-level3)' },
      fontSize: { 'md-body-large': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }], 'md-label-large': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }] },
    },
  },
};
```
Then `class="bg-md-sys-primary text-md-sys-on-primary rounded-full h-10 px-6 text-md-label-large"` is a filled button. Keep the state layer and focus ring in a small plain CSS block, Tailwind alone makes them verbose.

## Flutter web

Flutter's `ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: ...))` already applies M3. Use this skill for the design decisions (which component, which role, which layout per window class) rather than for CSS. Window size classes map to `MediaQuery.sizeOf(context).width` thresholds 600, 840, 1200, 1600.

## Server-rendered templates (PHP, Laravel Blade, Django, Rails ERB, Blazor, Razor, Jinja)

- Ship `material-tokens.css` and a `material-components.css` built from the minimal implementations.
- Template partials map to components: `button.blade.php` with `$variant`, `card.html.j2`, and so on. The HTML structure is the one in the component reference; the server only fills text and attributes.
- Avoid inline `style=` attributes for colors; they bypass the theme.

## Choosing a seed color in JavaScript (any framework)

```js
import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';

const theme = themeFromSourceColor(argbFromHex('#0b57d0'));
const scheme = theme.schemes.light; // or .dark
const root = document.documentElement;
for (const [role, argb] of Object.entries(scheme.toJSON())) {
  const name = role.replace(/([A-Z])/g, '-$1').toLowerCase(); // onPrimary -> on-primary
  root.style.setProperty(`--md-sys-color-${name}`, hexFromArgb(argb));
}
```
Call it once at startup (and again when the user changes the seed) and nothing else in the code base changes. The library also exposes `SchemeTonalSpot`, `SchemeVibrant`, `SchemeExpressive`, `SchemeFidelity` and `SchemeMonochrome` for different looks, and a `contrastLevel` argument (0 default, 0.5 medium, 1 high).

## Spring motion when the project already has an animation library

Do not add an animation library just for Material. Plain CSS with the `--md-sys-motion-*` curves is the default and is enough for most screens (see `styles/motion.md`, "Web conversion of springs to curves"). When the project already ships one, pass it the M3 spring tokens so gesture-driven and interruptible motion (shape morph on press, FAB menu, sheets, expanding cards) behaves like the Android reference. Values below are the expressive scheme, damping ratio / stiffness, in the units each library expects.

| Token | Framer Motion / Motion One | react-spring | Angular Animations |
| --- | --- | --- | --- |
| spring.fast.spatial (0.6 / 800) | `{ type: "spring", stiffness: 800, damping: 34, mass: 1 }` | `{ tension: 800, friction: 34 }` | `350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)` |
| spring.default.spatial (0.8 / 380) | `{ type: "spring", stiffness: 380, damping: 31, mass: 1 }` | `{ tension: 380, friction: 31 }` | `500ms cubic-bezier(0.38, 1.21, 0.22, 1)` |
| spring.slow.spatial (0.8 / 200) | `{ type: "spring", stiffness: 200, damping: 23, mass: 1 }` | `{ tension: 200, friction: 23 }` | `650ms cubic-bezier(0.39, 1.29, 0.35, 0.98)` |
| spring.fast.effects (1 / 3800) | `{ type: "spring", stiffness: 3800, damping: 123, mass: 1 }` | `{ tension: 3800, friction: 123 }` | `150ms cubic-bezier(0.31, 0.94, 0.34, 1)` |
| spring.default.effects (1 / 1600) | `{ type: "spring", stiffness: 1600, damping: 80, mass: 1 }` | `{ tension: 1600, friction: 80 }` | `200ms cubic-bezier(0.34, 0.80, 0.34, 1)` |
| spring.slow.effects (1 / 800) | `{ type: "spring", stiffness: 800, damping: 57, mass: 1 }` | `{ tension: 800, friction: 57 }` | `300ms cubic-bezier(0.34, 0.80, 0.34, 1)` |

Damping for the libraries is derived from the ratio: damping = 2 x ratio x sqrt(stiffness x mass). Use spatial springs for position, size and shape; effects springs (ratio 1, no overshoot) for color and opacity. Svelte's built-in `spring` store takes `{ stiffness, damping }` in its own 0 to 1 scale; map fast spatial to about `{ stiffness: 0.3, damping: 0.5 }` and default spatial to `{ stiffness: 0.15, damping: 0.6 }`, then adjust by eye. Always skip the spring and use a short opacity fade when `prefers-reduced-motion` is set.
