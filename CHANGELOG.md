# Changelog

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
