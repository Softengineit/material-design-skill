# Changelog

## 1.4.0 (2026-11-05)

- SKILL.md: "Working as a team of agents": builder, controller and tester roles with verbatim briefs, a delivery gate (no blocking finding in either report, two rounds at most), and a report format. Works with separate agents or as sequential passes in a plain chat.
- New `scripts/e2e_smoke.mjs` (Playwright): walks the pages as an end user, clicks every control, tries each with the keyboard first, flags dead controls, mouse-only controls, unreachable dialogs, console errors, overflow, small text and targets, unlabeled fields, and measures the rendered page against the visible Material rules (type scale, shape scale, color roles, 4px grid, component heights, 3px focus ring, hover state layer). Screenshots at 400 and 1280px, light and dark. Report in Markdown and JSON.

## 1.3.0 (2026-11-05)

- SKILL.md: priorities (end user first, then the standard, then the look, then the code); a first-use step that audits the project, proposes the optimal choices with recommendations and records them in DESIGN.md; a rule to reuse the stack's existing components before rewriting.
- `architecture.md`: "Reuse before rewrite" section.
- `bottom-sheets.md`: complete behaviour (detents half and full, drag, swipe to dismiss, scrim, keyboard, sticky actions) and how to map it to Ionic, Vaul, Vuetify, Angular Material.
- `navigation-bar.md`: which height to build and why.

## 1.2.0 (2026-11-05)

Color management, documented from the Material color pages, the material-color-utilities library and the Material Theme Builder.

- New `references/styles/color-schemes.md`: HCT and the tone-to-contrast rule, scheme variants with their hue and chroma parameters, baseline tones per role, contrast levels, custom colors (success, warning, brand) with harmonization, several schemes on one screen, role remapping, source color and brand integration, dynamic color on the web, Material 3 Expressive changes, shipping checklist.
- New `scripts/make_scheme.mjs`: generates the 45 roles (plus custom colors) from one source color with Google's algorithm, for light, dark and the three contrast levels, as CSS or JSON, with a contrast check of every guaranteed pair.
- SKILL.md step 1 points to the generator; hand-typed tones are no longer accepted.
- `color.md`: section on light themes that look too pale.

## 1.1.0 (2026-11-05)

Engineering layer, so the output is production-grade and not only visually Material.

- New `references/engineering/`: architecture (project tree, reusable components, AppShell and layout templates, definition of done), performance (budgets, fonts, images, JS, caching, Lighthouse), metadata (head template, favicon, manifest, Open Graph, robots, security headers), structured data (JSON-LD types and examples), semantic HTML (landmarks, headings, forms, page skeleton), quality (delivery bar, tooling, tests, review checklist, empty states, i18n).
- SKILL.md: step 0 (project structure), step 6 (page completeness), step 7 (checker and delivery checklist).
- `check_material.py`: 20 new checks on metadata, landmarks, headings, images, fonts, labels, inline styles and div-buttons; `--app` flag for authenticated apps.
- Starter page upgraded (head metadata, skip link, icon subset).
- `frameworks.md`: spring parameters for Framer Motion, react-spring, Angular Animations and Svelte.
- `lists.md`: subheaders and sections.

## 1.0.0 (2026-11-05)

First release.

- Content derived from all 91 pages of m3.material.io and design system data version 38.2.9 (Material 3 Expressive included).
- 36 component references, 7 style references, 5 foundation references, one framework guide.
- `material-tokens.css` with the full reference palette, 50 color roles in light and dark, type scale, shape, elevation, state, motion and spacing tokens.
- 83 token list files (`md.ref.*`, `md.sys.*`, `md.comp.*`).
- Starter page, React and Vue examples.
- `check_material.py` static checker.
