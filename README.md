# material-design-3 skill for Claude

A skill that lets Claude write front-end code following Google's Material Design 3 guidelines (including the 2025 Material 3 Expressive update) in any web language or framework: plain HTML/CSS/JS, React, Vue, Angular, Svelte, Solid, Web Components, Lit, Tailwind, Flutter web, server-rendered templates.

It was built by reading all 91 pages of https://m3.material.io (foundations, styles, components, develop) and the design-system token data behind them (6 400 tokens, version 38.2.9), then condensing the rules into reference files Claude reads on demand.

## What is inside

```
material-design-3/
  SKILL.md                     the workflow Claude follows (tokens, components, styles, states, layout, check)
  references/
    components/                one file per component (36) plus _overview.md (need -> component)
    styles/                    color, typography, shape, elevation, motion, icons, spacing
    foundations/               layout, interaction-states, accessibility, design-tokens, content-design
    frameworks.md              how to apply the tokens in each framework
    tokens/                    the full token lists: md.ref.*, md.sys.*, md.comp.* (83 files)
  assets/
    material-tokens.css        all system tokens as CSS custom properties, light and dark
    examples/starter.html      a complete page: app bar, navigation bar and rail, cards, buttons, chips,
                               switch, checkbox, text field, dialog, snackbar, FAB, dark mode
    examples/react-button.jsx  button, icon button, text field in React (+ react-button.css)
    examples/vue-card.vue      card in Vue 3
  scripts/
    check_material.py          static checker: hard-coded colors, sizes, radii, durations, shadows,
                               missing focus styles, icon buttons without a label, images without alt
```

## Install

### Claude Code

Copy the `material-design-3` folder into your project's `.claude/skills/` directory (project skill) or into `~/.claude/skills/` (personal skill). Claude Code picks it up at the next session. You can also invoke it directly with `/material-design-3`.

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

## License and attribution

The reference files are written in our own words from the Material Design guidelines (https://m3.material.io, Google LLC). Token names and values are facts from the Material 3 design system. Material Design, Material You and Material Symbols are trademarks of Google LLC. The code in this repository (SKILL.md, examples, scripts) is released under the MIT License.
