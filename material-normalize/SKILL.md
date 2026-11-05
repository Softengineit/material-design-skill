---
name: material-normalize
description: Normalize an existing page or component to Material Design 3 while keeping its structure, content and user flow. Use when the user says /normalize, "mets cette page aux normes Material", "normalise", "aligne sur Material", "rends cette page conforme", or gives a page, a screen, a component or a URL and asks to fix its colors, fonts, spacing, components, states, accessibility or metadata without redesigning it. Requires the material-design-3 skill in the same skills folder.
---

# /normalize : bring an existing page up to Material Design 3 without changing what it does

The page keeps its purpose, its content, its order of sections and its user flow. Everything else is brought to the standard: components, colors, type, shape, spacing, states, accessibility, head metadata, performance, and what the page lacks (missing states, missing labels, missing feedback). The user must recognise the page afterwards and find everything where it was.

Read `../material-design-3/SKILL.md` first and follow its priorities (end user, then the standard, then the look, then the code). Read `DESIGN.md` at the project root if it exists; if it does not, run the first-use audit from that SKILL.md before touching the page.

## Inputs

The page in any form: a file in the project, a URL, a screenshot, pasted markup. With a URL or a screenshot, render or read it first and write down what you see before editing: sections in order, components present, actions, data shown, states handled. That inventory is the contract: nothing in it disappears.

## Procedure

1. **Inventory** (write it in `reports/<page>/inventory.md`): sections in order; every interactive element with its current role (navigation, action, selection, input); data displayed and its source; states present and missing (loading, empty, error, disabled, selected); colors, fonts, sizes and spacings used; accessibility gaps; head metadata present.
2. **Map each element to its Material component** using `../material-design-3/references/components/_overview.md`: a div-with-onclick becomes a button, a custom dropdown becomes a menu or a select, a row of links becomes tabs or a navigation bar, a toast becomes a snackbar, a modal becomes a dialog or a bottom sheet (phone), a card-looking box becomes a card with the right variant. Keep the element in the same place with the same label. Reuse the stack's existing component when one exists.
3. **Replace values by tokens**: colors to `--md-sys-color-*` roles (the scheme from `DESIGN.md`, generated with `scripts/make_scheme.mjs`), fonts and sizes to the type scale, radii to the shape scale, spacing to the 4px grid, shadows to elevation levels, durations to motion tokens. Semantic colors (success, warning) become custom colors, not tertiary or hex.
4. **Add what is missing**, without adding features: state layers, focus rings, disabled styling, 48px targets, loading, empty and error states for every list and form, labels and `autocomplete` on inputs, `aria` on custom widgets, skip link, landmarks, one h1, alt texts, head metadata (`references/engineering/metadata.md`), font loading with swap and icon subset, image attributes, dark theme.
5. **Lay it out on the Material grid** at the same breakpoints the page already serves (compact, medium, expanded): same sections, Material margins and gutters, navigation component matching the window class. Do not move a section unless it is unreachable or overlaps; say so if you do.
6. **Check**: `python3 ../material-design-3/scripts/check_material.py` (with `--app` for authenticated pages) at 0 findings, then `node ../material-design-3/scripts/e2e_smoke.mjs <url> --dark` with no blocking finding, then compare the inventory with the result item by item.
7. **Deliver**: the normalized page, a before/after table (element, before, after, rule applied, reference file), the list of things that were missing and were added, and anything the page needs that cannot be done without changing its flow (that becomes a `/redesign` proposal, not a change made here). Then run the controller and tester passes from the main SKILL.md before calling it done.

## Rules

- No new feature, no removed feature, no moved section without saying it.
- Same wording for labels unless the wording breaks a Material content rule (sentence case, verb on buttons); list the wording changes.
- If the page uses a component library already, theme it rather than replace it.
- If the existing structure makes a Material rule impossible (for example seven navigation destinations), apply the closest compliant option and record the exception in `DESIGN.md` with the reason.
- Keep the diff reviewable: one commit per step above when working in a repository.
