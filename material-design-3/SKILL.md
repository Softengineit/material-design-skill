---
name: material-design-3
description: Build production-grade front-end UI that follows Google's Material Design 3 (M3) guidelines in any web language or framework (plain HTML/CSS/JS, React, Vue, Angular, Svelte, Solid, Web Components, Lit, Tailwind, Flutter web, Blazor, PHP or Django templates), with the engineering layer large tech companies expect: reusable component architecture, layouts, performance budgets, head metadata, JSON-LD structured data, semantic HTML and a delivery checklist. Use this skill whenever the user asks for a Material, Material Design, Material You, M3, MD3, Material 3 Expressive, "Google style" or "Android style" interface, mentions a Material component by name (FAB, app bar, navigation rail, chips, snackbar, bottom sheet, text field, segmented buttons), asks for a design system with color roles, tokens, type scale, elevation or dynamic color, wants a front-end that is "pro", fast, SEO-ready or accessible, or wants to review, fix or theme existing code against Material Design rules. Also use it when the user wants Material-looking components built by hand without a library, or wants to choose and configure a Material library (Material Web, Angular Material, MUI, Vuetify, material-color-utilities).
---

# Material Design 3 for web front-end code

This skill turns the guidelines published at https://m3.material.io into rules you can apply when writing code. The guidelines are organised in three layers, and so is this skill:

1. **Foundations**: layout, accessibility, interaction states, design tokens, content writing.
2. **Styles**: color, typography, shape, elevation, motion, icons, spacing.
3. **Components**: 36 component families, each with variants, anatomy, specs, states and a minimal implementation.
4. **Engineering**: how to turn that into production code: project structure and reusable components, performance budgets, head metadata, structured data, semantic HTML, and the quality bar before shipping. Material does not cover this layer; large tech companies expect it, so this skill does.

Everything is expressed through **design tokens** (`md.sys.color.primary`, `md.sys.shape.corner.medium`, `md.comp.filled-button.container.height`). In CSS the same tokens become custom properties (`--md-sys-color-primary`). Every file in this skill refers to these names, so code written from it stays themeable and recognisable as Material.

## Workflow

### 0. Set up the project structure once

Before the first component, lay out the project as `references/engineering/architecture.md` describes: `tokens/` (the token CSS and the theme override), `components/` (one folder per Material component, variants as props, scoped styles), `layouts/` (an AppShell with the app bar and the navigation that switches bar, rail and drawer by breakpoint; list-detail and supporting-pane templates; one dialog host and one snackbar host), `pages/` that only compose layouts and components. A page never carries component CSS and a component is never copied into a page with small changes. This is what keeps a ten-page app consistent and lets a junior ship a new page in an hour.

### 1. Load the tokens first

Start every Material project by including `assets/material-tokens.css` (or copying what you need from it). It defines, as CSS custom properties:

- the 50 color roles for light and dark themes (`--md-sys-color-*`), plus the full reference palette
- the type scale (`--md-sys-typescale-<role>-font/weight/size/line-height/tracking`)
- shape corner sizes (`--md-sys-shape-corner-*`)
- elevation levels as box-shadows (`--md-sys-elevation-level0..5`)
- state layer opacities and focus indicator metrics (`--md-sys-state-*`)
- motion durations, easings and spring parameters (`--md-sys-motion-*`)
- spacing steps (`--md-sys-measurement-space*`)

In a framework that does not use plain CSS (Tailwind config, CSS-in-JS, Sass maps, Flutter `ThemeData`, Blazor theme object), translate these values into that system but keep the token names in identifiers. Never hard-code a hex color, a corner radius, a font size or a duration in component code when a token exists for it. Hard-coded values are the first thing that breaks theming and dark mode.

For a brand color other than the baseline purple, generate the scheme with `scripts/make_scheme.mjs` (Google's own algorithm: `node scripts/make_scheme.mjs '#1e7a4a' --variant vibrant --contrast all`, after `npm i @material/material-color-utilities`) and load its output after the token file; it overrides only the `--md-sys-color-*` variables and component code does not change. Never type tones by hand. `references/styles/color-schemes.md` explains variants (tonal-spot, vibrant, fidelity, neutral...), custom colors (success, warning), contrast levels, several schemes on one screen and brand integration; `references/styles/color.md` lists the roles and their pairing rules.

### 2. Pick the components

Read `references/components/_overview.md` to map a need to a component ("choose one option from a short list" -> segmented buttons or radio buttons; "temporary message" -> snackbar; "primary destination switching on phone" -> navigation bar; on desktop -> navigation rail or drawer). Then open the reference file for each component you will build. Each one follows the same structure: when to use, variants, anatomy, specs table, states, accessibility, do/don't, minimal HTML + CSS implementation, and a pointer to the component's token file.

Read the reference before writing a component, even one you know well. M3 changed many details compared to Material 2 (no raised buttons, tonal surfaces instead of shadows, 40dp button height with 16dp side padding, 56dp FAB, surface-container tiers, 3dp focus ring) and M3 Expressive (2025) changed more (button size scale xs to xl, shape morphing on press, split buttons, FAB menu, toolbars, loading indicator, spring motion).

### 3. Apply the styles

- **Color**: always pair a container role with its `on-` role (`surface-container` with `on-surface`, `primary` with `on-primary`). Backgrounds use `surface`; cards and sheets use the `surface-container-*` tiers to show hierarchy, not shadows. See `references/styles/color.md`.
- **Typography**: use the 15 type roles. Body text is `body-large` (16px/24px) or `body-medium` (14px/20px); buttons and chips use `label-large` (14px/20px, weight 500); card titles use `title-medium`. See `references/styles/typography.md`.
- **Shape**: buttons and chips are fully rounded or `corner-small`, cards `corner-medium` (12px), dialogs and sheets `corner-extra-large` (28px). See `references/styles/shape.md`.
- **Elevation**: level 0 for most things at rest, level 1 for elevated cards and bars with content scrolled under them, level 3 for dialogs, menus, FABs. See `references/styles/elevation.md`.
- **Motion**: short durations (100 to 300 ms) with the `standard` or `emphasized` easing; respect `prefers-reduced-motion`. See `references/styles/motion.md`.
- **Icons**: Material Symbols, 24px, `aria-hidden` when decorative. See `references/styles/icons.md`.
- **Spacing**: multiples of 4px, with 8, 16 and 24 as the usual rhythm. See `references/styles/spacing.md`.

### 4. Make every interactive element complete

Each interactive component needs, in this order of priority:

1. A **48x48 px minimum touch target** (padding or a pseudo-element can extend it beyond the 40px visual height of a button).
2. A **state layer**: an overlay in the content color at 8% opacity on hover, 10% on focus and pressed, 16% when dragged. Implement it as `::before` or `::after` with `background: currentColor; opacity: var(--md-sys-state-hover-state-layer-opacity)`.
3. A **visible focus indicator**: 3px ring in `--md-sys-color-secondary` (`outline: 3px solid`, offset 2px), shown on `:focus-visible`.
4. A **disabled state**: container at 12% and content at 38% of `on-surface`, `pointer-events` kept so the tooltip still works, `aria-disabled` or the native `disabled` attribute.
5. **Semantics**: native elements first (`<button>`, `<input type="checkbox">`, `<dialog>`, `<nav>`), ARIA roles only when no native element fits (`role="tablist"`, `role="switch"`, `role="menu"`). Keyboard behaviour as listed in each component's Accessibility section.

`references/foundations/interaction-states.md` and `references/foundations/accessibility.md` have the full rules.

### 5. Lay the page out

Use the window size classes from `references/foundations/layout.md`:

| Class | Width | Typical navigation | Panes |
| --- | --- | --- | --- |
| Compact | < 600 px | navigation bar (bottom) | 1 |
| Medium | 600 to 839 px | navigation rail | 1, or list-detail |
| Expanded | 840 to 1199 px | navigation rail or drawer | 2 |
| Large | 1200 to 1599 px | navigation drawer | 2 |
| Extra-large | >= 1600 px | navigation drawer | 2 or 3 |

Margins are 16px on compact and 24px elsewhere; the content area uses a scaffold with top app bar, navigation region, body and optional supporting pane. Canonical layouts (list-detail, supporting pane, feed) are described there with the CSS grid needed to build them.

### 6. Make the page complete, not only pretty

A Material page that ships also needs what the user never sees. Do these for every page, following `references/engineering/`:

- **Head and identity** (`metadata.md`): `lang`, charset, viewport with `viewport-fit=cover`, a `<title>` under 60 characters, a meta description, `theme-color` for light and dark set to the surface color, favicon and web manifest, canonical and Open Graph on public pages, `noindex` on back-office pages. Copy the head template from that file.
- **Structured data** (`structured-data.md`): one JSON-LD script on public pages (Organization or LocalBusiness, WebPage, BreadcrumbList, Article, Product, FAQ...) that matches what is visible on the page.
- **Semantic skeleton** (`semantic-html.md`): skip link, one `<header>`, `<nav aria-label>`, one `<main>`, one `h1`, headings in order, native `<button>`, `<a>`, `<dialog>`, `<label for>` on every control with `autocomplete` and `inputmode`.
- **Performance** (`performance.md`): fonts with `display=swap` and preconnect, Material Symbols loaded as a subset (`icon_names=`), images with `width`, `height`, `loading="lazy"` and `srcset`, no JS for what CSS does, code split by route. Budget: Lighthouse 90 or more on mobile, LCP under 2.5 s, CLS under 0.1, first-load JS under 200 KB gzipped.

### 7. Check before delivering

Run `scripts/check_material.py <file or folder>` on everything you produced (add `--app` for an authenticated app, where canonical, Open Graph and JSON-LD are not required). It reports hard-coded colors, font sizes, corner radii, durations and shadows that should be tokens, touch targets below 48px, interactive elements without a focus style or label, divs used as buttons, unlabelled inputs, inline styles, and on full documents the missing head metadata, heading structure, landmarks, image attributes, font loading and skip link. Fix what it reports, then re-read the component's Do / Don't list once.

Then run the delivery checklist in `references/engineering/quality.md`: Lighthouse on the four scores, axe with zero violations, HTML validation, a keyboard walkthrough (tab order, focus visible, Escape closes, arrow keys in tabs, chips and radio groups), light and dark, 400 px and 1280 px, 200 % zoom, `prefers-reduced-motion`. Also confirm by eye:
- text over every colored container uses the matching `on-` role
- nothing is only distinguished by color (icons or text labels accompany it)
- every list has a loading, an empty and an error state

## Language and framework notes

`references/frameworks.md` explains how to apply the same tokens and component structure in each environment:

- **Plain HTML/CSS/JS**: use the CSS file and the minimal implementations in the component references directly. `assets/examples/starter.html` is a complete page (app bar, navigation, cards, buttons, text field, dialog, snackbar, light and dark) to start from.
- **React, Vue, Svelte, Solid**: same markup and CSS, wrapped in components; examples in `assets/examples/`. Keep the token CSS global and the component CSS scoped.
- **Web Components / Lit**: `@material/web` (Material Web Components) implements M3 faithfully but is in maintenance mode; it is still the quickest way to get spec-accurate components. Theme it with the same `--md-sys-*` variables.
- **Angular**: Angular Material 17.2+ ships M3 themes (`mat.theme(...)` with a seed palette); map the generated CSS variables to the same role names.
- **React libraries (MUI)**: MUI is Material 2 by default; use this skill's tokens to build an M3 theme or prefer hand-written components for M3 fidelity.
- **Tailwind**: register the tokens as theme colors, font sizes, border radii and shadows under the same names (`bg-md-sys-color-primary`).
- **Server-rendered templates (PHP, Django, Rails, Blazor, Razor)**: output the same HTML; keep the CSS file in the static assets.

## Reference index

| Need | File |
| --- | --- |
| Which component for which need, categories | `references/components/_overview.md` |
| One file per component (36) | `references/components/<name>.md` |
| Color roles, pairing rules, light/dark hex | `references/styles/color.md` |
| Scheme generation, variants, custom colors, contrast levels, multi-scheme, brand | `references/styles/color-schemes.md` |
| Scheme generator (CSS, JSON, contrast check) | `scripts/make_scheme.mjs` |
| Type scale values and usage | `references/styles/typography.md` |
| Shape scale, per-component corners, morphing | `references/styles/shape.md` |
| Elevation levels and tonal surfaces | `references/styles/elevation.md` |
| Durations, easings, springs, transitions | `references/styles/motion.md` |
| Material Symbols | `references/styles/icons.md` |
| Spacing grid | `references/styles/spacing.md` |
| Breakpoints, canonical layouts, scaffold, RTL | `references/foundations/layout.md` |
| States, state layers, gestures, selection | `references/foundations/interaction-states.md` |
| Contrast, targets, focus, screen readers, alt text | `references/foundations/accessibility.md` |
| Token system and naming | `references/foundations/design-tokens.md` |
| UI text: tone, capitalization, labels, errors | `references/foundations/content-design.md` |
| Framework-specific guidance | `references/frameworks.md` |
| Project tree, reusable components, AppShell and layout templates | `references/engineering/architecture.md` |
| Budgets, fonts, images, JS, caching, Lighthouse | `references/engineering/performance.md` |
| Head template, favicon, manifest, Open Graph, robots | `references/engineering/metadata.md` |
| JSON-LD types and examples, microdata | `references/engineering/structured-data.md` |
| Landmarks, headings, forms, links, page skeleton | `references/engineering/semantic-html.md` |
| Definition of done, tooling, tests, review checklist, i18n | `references/engineering/quality.md` |
| Full token lists (6 400 tokens, 83 files) | `references/tokens/md.<ref|sys|comp>.<group>.md` |
| CSS custom properties, light and dark | `assets/material-tokens.css` |
| Complete starter page and framework examples | `assets/examples/` |
| Static checker | `scripts/check_material.py` |

The token files are large. Open `references/tokens/md.comp.<component>.md` only when you need an exact value that the component reference does not already give (for example the icon size of a small FAB or the padding of a secondary tab). Values written `→ md.sys.color.primary` mean "use that system token".

## Source and versions

Content was derived from m3.material.io in November 2026 (design system data version 38.2.9, which includes the Material 3 Expressive updates). The guidelines site changes; when a detail matters and a search tool is available, verify it on the component's page at `https://m3.material.io/components/<component>`.
