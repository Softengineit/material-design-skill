# Quality and delivery

The bar a Material page must meet before it is called done, the tools that check it, and the project setup that keeps it there.
Every item below is checkable by one person with a terminal and a browser; run the checks, do not guess.

## Definition of done for a page

A page is done when all of these pass:

| Check | Target | How |
|---|---|---|
| Lighthouse Performance | >= 90, mobile preset | Chrome DevTools, Lighthouse tab, or `npx lighthouse <url> --preset=perf --form-factor=mobile` |
| Lighthouse Accessibility, Best Practices, SEO | >= 90 each | same run; fix every red item, read every orange one |
| axe violations | 0 | `npx @axe-core/cli <url>` or the axe DevTools browser extension |
| Valid HTML | 0 errors | W3C validator (paste the rendered HTML) or `npx html-validate dist/**/*.html` |
| Material checker | 0 findings | `python3 scripts/check_material.py src/` |
| Keyboard walkthrough | complete | Tab order follows the visual order; focus ring visible on every stop; Escape closes dialogs, menus, sheets; arrow keys move inside tabs, chip groups, radio groups, menus |
| Screen reader pass | main flow works | VoiceOver (macOS, Cmd+F5) or NVDA (Windows); landmarks, headings, labels and live messages are announced |
| Themes | both correct | toggle `data-theme="dark"` on `<html>` and check every colored container with its `on-` text |
| Widths | no overflow, no clipped text | 400 px and 1280 px in DevTools device mode |
| Zoom | still usable | browser zoom at 200 %; nothing hidden, no horizontal scroll on text |
| Reduced motion | no decorative animation | DevTools Rendering panel, "Emulate CSS prefers-reduced-motion" |
| RTL smoke test | layout mirrors | `<html dir="rtl">`, only if the product may be translated into Arabic or Hebrew |

Record the Lighthouse scores and the axe output in the pull request description, so the reviewer does not rerun everything.

## Tooling to set up once per project

Install at project start, not at the end; retrofitting lint rules on a large codebase is painful.

- ESLint with the recommended config of the framework, plus `eslint-plugin-jsx-a11y` (React) or `eslint-plugin-vuejs-accessibility` (Vue).
- Stylelint with `stylelint-config-standard` and `stylelint-declaration-strict-value` set so that `color`, `background-color`, `border-color`, `fill`, `font-size`, `border-radius`, `box-shadow` and `transition-duration` accept only `var()` values; this is the lint form of the "tokens only" rule.
- Prettier for formatting; no debates in review about spaces.
- npm scripts that every developer and the CI run the same way:

```json
{
  "scripts": {
    "lint": "eslint src && stylelint \"src/**/*.css\"",
    "check": "npm run lint && python3 scripts/check_material.py src && html-validate \"dist/**/*.html\"",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "lhci": "lhci autorun"
  }
}
```

- Pre-commit hook with husky or lefthook running `npm run check` on staged files; a commit that fails lint never reaches the branch.
- CI (GitHub Actions or GitLab CI) running on every pull request: `npm run check`, `npm test`, `npm run test:e2e`, then Lighthouse CI (`@lhci/cli`) against a built preview with these budgets in `lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

- Playwright (or Cypress) smoke tests for the three to five critical flows (log in, create an order, pay, search), run on Chromium and WebKit, at 400 px and 1280 px.
- Visual regression on the component library: Playwright `toHaveScreenshot()` for each component in each variant and both themes; the screenshots are committed and a diff fails the build so a token change is reviewed on purpose.

## Component tests

For each Material component, one test file with these cases:

- Renders each variant (filled, outlined, text...) and matches a snapshot or screenshot.
- Disabled: the click handler is not called, `disabled` or `aria-disabled` is present, the element is not in the tab order when native `disabled` is used.
- ARIA: role, `aria-label` when icon only, `aria-pressed` or `aria-checked` for toggles, `aria-expanded` for expanders.
- Keyboard: Enter and Space activate buttons, Escape closes a dialog or menu, arrow keys move inside a group.
- Events: the component emits or calls what its contract says, with the right payload.

Example with Testing Library (works with React; Vue and Svelte have the same API):

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './IconButton';

test('icon button has a label, toggles and blocks clicks when disabled', async () => {
  const onClick = vi.fn();
  const { rerender } = render(<IconButton icon="favorite" label="Favori" toggle onClick={onClick} />);
  const button = screen.getByRole('button', { name: 'Favori' });
  expect(button).toHaveAttribute('aria-pressed', 'false');
  await userEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(button).toHaveAttribute('aria-pressed', 'true');
  rerender(<IconButton icon="favorite" label="Favori" disabled onClick={onClick} />);
  await userEvent.click(screen.getByRole('button', { name: 'Favori' }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

Query by role and accessible name (`getByRole`), never by class or test id, so the test fails when the accessibility breaks.

## Code review checklist for Material front-end work

Copy this into the pull request template.

- Colors, sizes, radii, shadows and durations come from `--md-sys-*` tokens; no hex, no raw px for these.
- An existing component is reused; nothing was copied and lightly modified.
- Page layout comes from the shared app shell (app bar, nav, main, panes), not rebuilt locally.
- Every interactive element has hover, focus, pressed, disabled and, when relevant, selected states.
- Native elements used; `aria-*` present on icon-only buttons, toggles, dialogs, live regions.
- `<head>` complete per `metadata.md`; structured data present on public pages.
- Images have `width`, `height`, `alt`, `loading="lazy"` below the fold, and a modern format.
- Both themes checked; 400 px and 1280 px checked; 200 % zoom checked.
- No console errors or warnings in the browser.
- No unused CSS or dead component variants added.
- Bundle size diff posted (`npx size-limit` or the build output) and justified if it grows by more than 5 %.
- Loading, empty and error states exist for every list and detail view.
- Strings are in the translation file, not inline in components.
- Tests added or updated; CI green; Lighthouse scores posted.
- Commit messages say why, not only what.

## Documentation

- One `README.md` per component folder: purpose, props or attributes with types and defaults, variants, a usage snippet, the states handled, accessibility notes, and a link to the matching page on `m3.material.io/components/<name>`.
- A demo page or Storybook with one story per variant and per state, in both themes; reviewers and designers look there, not in the code.
- A `CHANGELOG.md` for the component library following Keep a Changelog: Added, Changed, Fixed, Removed, with the version and the date. Breaking changes are named as such.
- An `ARCHITECTURE.md` or the skill's `architecture.md` kept current when folders or conventions change.

## Error handling and empty states

- Every list, table and detail view has four states, each designed with Material components:
  - loading: a loading indicator or skeleton in `surface-container`, with `aria-busy="true"` on the region;
  - empty: a card with an icon (`aria-hidden`), one sentence that says what is empty and why, and a text or filled button for the next action ("Ajouter un plat");
  - error: a card with an error icon, a short message in plain words, and a text button "Réessayer" that calls the same fetch;
  - loaded: the content.
- Forms show inline errors under the field (`aria-invalid`, `aria-describedby`) and move focus to the first invalid field on submit.
- Server errors (5xx, network) show a snackbar with a short message and, when retry makes sense, a "Réessayer" action; the form keeps its values.
- Never fail silently: no empty `catch`, no `console.log` as the only reaction. Log the error to the monitoring tool and show the user something.
- Timeouts: show the loading state at most 10 seconds, then switch to the error state with retry.
- Destructive actions confirm in a dialog and announce the result in a snackbar with "Annuler" when undo is possible.

## Internationalization basics

- All user-visible strings live in one place per language (`locales/fr.json`, `locales/en.json`), keyed by meaning (`order.save`), never by the French text.
- Numbers, currencies and dates come from `Intl`, never from string concatenation:

```js
const price = new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(4000);
// "4 000 FCFA"
const when = new Intl.DateTimeFormat('fr-CM', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
// "5 nov. 2026, 12:40"
```

- Plurals and gender use ICU messages (`{count, plural, one {# commande} other {# commandes}}`) through a library like `i18next` or `FormatJS`, never `count > 1 ? 's' : ''`.
- No sentences built from fragments (`"Vous avez " + n + " commandes"`); word order changes across languages. Use one message with placeholders.
- Logical CSS properties (`margin-inline-start`, `padding-block`, `inset-inline-end`) instead of `left` and `right`, so RTL works without a second stylesheet.
- Leave room for text 1.5 times longer than French in buttons, chips and navigation labels; test with a long-text pseudo locale.
- Icons that imply direction (back arrows, "next" chevrons) flip in RTL; icons that do not (clock, phone) stay.

## Checklist

- Lighthouse four scores >= 90 on mobile, axe 0, HTML valid, `check_material.py` 0.
- Keyboard, screen reader, both themes, two widths, 200 % zoom, reduced motion checked.
- Lint, format, pre-commit hook and CI with Lighthouse budgets in place.
- Each component has tests, a README and a demo entry.
- Lists have loading, empty and error states; forms show inline and snackbar errors.
- Strings, numbers and dates go through the translation layer and `Intl`.
