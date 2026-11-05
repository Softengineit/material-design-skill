# material-design-3 skill for Claude

A skill that lets Claude write production-grade front-end code following Google's Material Design 3 guidelines (including the 2025 Material 3 Expressive update) in any web language or framework: plain HTML/CSS/JS, React, Vue, Angular, Svelte, Solid, Web Components, Lit, Tailwind, Flutter web, server-rendered templates. Beyond the visual rules it carries the engineering layer a senior reviewer expects: reusable component architecture, layouts, performance budgets, head metadata, JSON-LD, semantic HTML and a delivery checklist, so a junior developer gets a result that passes review.

It was built by reading all 91 pages of https://m3.material.io (foundations, styles, components, develop) and the design-system token data behind them (6 400 tokens, version 38.2.9), then condensing the rules into reference files Claude reads on demand.

## What is inside

```
material-normalize/SKILL.md    the /normalize command
material-redesign/SKILL.md     the /redesign command
material-design-3/
  SKILL.md                     the workflow Claude follows (priorities, first-use audit, tokens, components, styles, states, layout, engineering, team of agents)
  references/
    components/                one file per component (36) plus _overview.md (need -> component)
    styles/                    color, typography, shape, elevation, motion, icons, spacing
    foundations/               layout, interaction-states, accessibility, design-tokens, content-design
    engineering/               architecture, performance, metadata, structured-data, semantic-html, quality
    frameworks.md              how to apply the tokens in each framework
    tokens/                    the full token lists: md.ref.*, md.sys.*, md.comp.* (83 files)
  assets/
    material-tokens.css        all system tokens as CSS custom properties, light and dark
    examples/starter.html      a complete page: app bar, navigation bar and rail, cards, buttons, chips,
                               switch, checkbox, text field, dialog, snackbar, FAB, dark mode
    examples/react-button.jsx  button, icon button, text field in React (+ react-button.css)
    examples/vue-card.vue      card in Vue 3
  scripts/
    make_scheme.mjs            scheme generator: 45 color roles + custom colors from one source color, light/dark, 3 contrast levels
    e2e_smoke.mjs              browser smoke test (Playwright): dead controls, keyboard, reachability, visual rules, screenshots
    check_material.py          static checker: hard-coded colors, sizes, radii, durations, shadows,
                               missing focus styles, icon buttons without a label, images without alt
```

## Install

### Claude Code

Copy the three folders `material-design-3`, `material-normalize` and `material-redesign` into your project's `.claude/skills/` directory (project skills) or into `~/.claude/skills/` (personal skills). Claude Code picks them up at the next session. The two command skills need the main one next to them.

Commands:
- `/material-design-3` : the full skill (first-use audit, tokens, components, engineering layer, team of agents).
- `/normalize` (skill `material-normalize`) : bring an existing page up to the standard while keeping its structure, content and flow; adds what is missing (states, labels, metadata, dark theme) and delivers a before/after table.
- `/redesign` (skill `material-redesign`) : start from the mission and the data of a page, analyse coherence and flow, propose one to three options with wireframes, wait for the user's validation, then build from scratch.

### claude.ai (web, desktop, mobile)

Zip the `material-design-3` folder (the zip must contain `SKILL.md` at the top level of the folder) and upload it in Settings > Capabilities > Skills, or use the `.skill` file published in the releases of this repository.

### Claude API

Upload the same zip through the Skills endpoint and reference the skill id in your request. See https://docs.claude.com for the current API.

## Use

Ask for Material Design interfaces as you normally would:

- "Build a settings page in React with Material Design 3, dark mode included."
- "Convert this Bootstrap form to Material 3 with a filled text field and a tonal button."
- "Review this Vue component against Material Design rules."
- "Give me a Tailwind config with the M3 color roles from the seed color #0b57d0."

Claude loads the tokens, reads the relevant component references, writes the code with `--md-sys-*` variables, then runs `scripts/check_material.py` on the result.

## Keeping it current

The guidelines site changes a few times a year. The content here reflects m3.material.io as of November 2026. To refresh, re-run the extraction (the site serves its pages as JSON under `/_dsm/content/m3/<version>/` and its tokens under `/_dsm/data/dsdb-m3/<version>/`) and regenerate `material-tokens.css` and the `references/tokens/` files.

## Contributing

Corrections and framework notes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Report a mismatch with the guidelines or a bad output with the issue templates.

## Maintainer

Maintained by Steve Nouyep (SEED Innovation, Yaoundé). Releases are tagged `vX.Y.Z`; each release page carries the ready-to-install `material-design-3.skill` file.

## License and attribution

The reference files are written in our own words from the Material Design guidelines (https://m3.material.io, Google LLC). Token names and values are facts from the Material 3 design system. Material Design, Material You and Material Symbols are trademarks of Google LLC. The code in this repository (SKILL.md, examples, scripts) is released under the MIT License (see [LICENSE](LICENSE)).
