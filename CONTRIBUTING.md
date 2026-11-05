# Contributing

Thanks for helping keep this skill accurate.

## What is welcome

- Corrections where a value, token name or rule differs from https://m3.material.io (open a "Guideline mismatch" issue or a pull request with the link to the page).
- New framework notes in `material-design-3/references/frameworks.md` (keep them short and token-based).
- New checks in `material-design-3/scripts/check_material.py`, with a sample that triggers them.
- Translations are not planned for now; the reference files stay in English so one version is the source of truth.

## Rules for the reference files

- Paraphrase the guidelines in your own words. Do not paste sentences from m3.material.io. Numbers, token names and lists of variants or states are facts and must stay exact.
- Keep the structure of the component files (When to use, Variants, Anatomy, Specs, States, Accessibility, Do / Don't, Minimal implementation, Tokens).
- Minimal implementations use `--md-sys-*` custom properties, never hard-coded colors, sizes, radii, shadows or durations. The CI runs `check_material.py` on them.
- Simple hyphens only, no em or en dashes (the CI checks this too).
- Keep SKILL.md under 500 lines; put details in `references/`.

## Refreshing from the source

The site serves its pages as JSON under `/_dsm/content/m3/<version>/<pageId>.json` and the token database under `/_dsm/data/dsdb-m3/<version>/`. The `<version>` string is in the site's main JavaScript bundle (`carbonVersion`). After a refresh, regenerate `assets/material-tokens.css` and `references/tokens/`, then re-read the changed pages and update the matching reference files.

## Testing a change

1. Install the skill locally (copy `material-design-3/` into `.claude/skills/`).
2. Ask Claude for a UI that exercises the changed component or rule.
3. Run `python3 material-design-3/scripts/check_material.py <output>` and read the result against the guideline page.

## Pull requests

One topic per pull request. Say which m3.material.io page you checked and when. Add a "Co-authored-by" line if an AI assistant wrote part of the change.
