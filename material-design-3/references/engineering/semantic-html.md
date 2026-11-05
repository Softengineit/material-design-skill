# Semantic HTML

The document skeleton that makes a Material page readable by screen readers, crawlers and keyboards before any CSS or JavaScript loads.
Use the native element for every job; add ARIA only when no native element exists.

## Landmarks

| Region of a Material page | Element | Notes |
|---|---|---|
| Top app bar | `<header>` | one per page, direct child of `<body>`; becomes the `banner` landmark |
| Navigation bar, rail or drawer | `<nav aria-label="Principale">` | one label per `<nav>`; a second nav (footer links) gets another label, `aria-label="Pied de page"` |
| Page content | `<main>` | exactly one; everything the page is about lives here |
| Supporting pane, filters, related items | `<aside aria-label="...">` | becomes `complementary`; label it when there are several |
| Footer with legal links | `<footer>` | one per page, direct child of `<body>`; becomes `contentinfo` |
| Search field in the app bar | `<search>` or `<form role="search">` | `<search>` is the native element; the `role` is the fallback for older browsers |
| Named block inside main | `<section aria-labelledby="id-of-heading">` | a `<section>` without a label is not a landmark; use `<div>` instead |

- Use `role="..."` only when no native element exists (`role="tablist"`, `role="menu"`, `role="switch"`). Never `<div role="button">` or `<div role="navigation">`.
- Do not nest `<header>` or `<footer>` of a card inside `<main>` expecting a landmark; inside an `<article>` they are plain grouping elements, which is fine.

## Headings

- Exactly one `<h1>` per page: the page title. It can be the visible app bar title; if the app bar shows only a logo, add a visually hidden `<h1>`.
- No skipped levels. `<h1>` then `<h2>` then `<h3>`. A card title inside a section with an `<h2>` is an `<h3>`.
- Card titles, dialog titles, list subheaders and side sheet titles are headings, in order of nesting.
- Visual size comes from the type scale classes (`title-large`, `title-medium`), not from the heading level. `<h3 class="md-typescale-title-medium">` is normal.
- Never use a heading for a label or a button text.

```html
<h1 class="md-typescale-title-large">Commandes</h1>
<section aria-labelledby="h-today">
  <h2 id="h-today" class="md-typescale-title-medium">Aujourd'hui</h2>
  <article class="md-card"><h3 class="md-typescale-title-small">Table 4</h3></article>
</section>
```

## Native elements first

| Need | Write | Never |
|---|---|---|
| Action | `<button type="button">` | `<div onclick>`, `<a href="#">` |
| Submit a form | `<button type="submit">` inside the `<form>` | `<button>` with no type (it submits by default and surprises people) |
| Go to another page or anchor | `<a href="/commandes">` | `<button>` that calls `location.href` |
| Modal or basic dialog | `<dialog>` with `showModal()` | a positioned `<div>` with a backdrop |
| Simple expander | `<details><summary>` | a button that toggles `hidden` |
| Switch | `<input type="checkbox" role="switch">` | a styled `<div>` |
| Checkbox, radio | `<input type="checkbox">`, `<input type="radio">` | custom spans |
| Radio group | `<fieldset><legend>` around the radios | a heading above loose inputs |
| Choose one from a short list | `<select>` or a listbox pattern (`role="listbox"` plus `role="option"`) | a menu of buttons |
| Real table (Tableau view, data grid) | `<table>` with `<caption>`, `<thead>`, `<th scope="col">`, `<th scope="row">` | `<div>` grid for tabular data |
| Date or time | `<time datetime="2026-11-20T19:30+01:00">20 nov. 2026, 19 h 30</time>` | plain text only |
| List of items | `<ul>` or `<ol>` with `<li>` | stacked `<div>` |
| Image | `<img src alt width height>` | CSS `background-image` for content images |
| Progress | `<progress>` or `role="progressbar"` with `aria-valuenow` | an animated div with no role |
| Quantity, price, measure | plain text with the unit, or `<data value="4000">4 000 FCFA</data>` | an icon alone |

- Give every `<button>` an explicit `type`. Outside a form use `type="button"`.
- A link that only runs JavaScript is a button; a button that changes the URL is a link.
- `<dialog>` handles focus trapping, Escape and `aria-modal` for you; `dialog::backdrop` is the scrim.
- A `<details>` expander is enough for FAQ items and "voir plus" blocks; use a custom expander only when animation or lazy loading is required.

## Forms

- Every control has a `<label for="id">` with matching `id`. Text fields in M3 show the label as the floating label; it is still a real `<label>`.
- `placeholder` is never the only label; it disappears when typing and is read inconsistently.
- `autocomplete` on every field that matches a known value: `name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-level2` (city), `postal-code`, `country`, `cc-number`, `cc-exp`, `cc-csc`, `one-time-code`, `new-password`, `current-password`, `off` only for search-like fields.
- `inputmode` chooses the phone keyboard: `numeric` (codes, quantities), `decimal` (prices), `tel`, `email`, `url`, `search`.
- `type` still matters: `type="email"`, `type="tel"`, `type="number"` only for real numbers that can be incremented, `type="text"` plus `inputmode="numeric"` for codes and phone-like values with leading zeros.
- `required` on mandatory fields and a visible mark or the word "obligatoire" in the supporting text.
- Supporting text links to the field with `aria-describedby="id-of-text"`.
- On error: `aria-invalid="true"` on the control, the error text in the same `aria-describedby` target, and that target gets `role="alert"` or sits in an `aria-live="polite"` region so it is announced.
- Enter in a text field submits the form; keep one `<button type="submit">` and do not block the key.
- Group radios and related checkboxes in `<fieldset>` with a `<legend>` that reads as the question.
- Do not `disable` the submit button while the form is invalid; let people submit and show what is missing.

```html
<form novalidate>
  <div class="md-text-field">
    <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required
           aria-describedby="phone-help" aria-invalid="false">
    <label for="phone">Téléphone</label>
    <p id="phone-help" class="md-text-field__supporting" aria-live="polite">Format : +237 6 99 00 00 00</p>
  </div>
  <button type="submit" class="md-button md-button--filled">Enregistrer</button>
</form>
```

## Text content

- Sentence case in the markup: `Enregistrer la commande`, not `Enregistrer La Commande`.
- No all-caps text in the HTML. If a design needs capitals, add `text-transform: uppercase` in CSS; screen readers read `ETC` letter by letter.
- Real text, never an image of text. Logos are the one exception and get `alt` with the brand name.
- French numbers: narrow no-break space (`&#8239;`, U+202F) or no-break space (`&nbsp;`) as thousands separator and before the unit: `4&nbsp;000&nbsp;FCFA`. Generate it with `Intl.NumberFormat('fr-CM')` rather than typing it.
- No-break space before `:`, `;`, `?`, `!` in French running text when the typographic rule is followed; be consistent across the site.
- A fragment in another language gets a `lang` attribute: `<span lang="en">Dashboard</span>`.
- Abbreviations the reader may not know: `<abbr title="Taxe sur la valeur ajoutée">TVA</abbr>` once per page.

## Links

- Link text says where it goes: `Voir la facture n° 1245`, never `cliquez ici` or `en savoir plus` alone. Several identical link texts on one page need `aria-label` or visually hidden context.
- `target="_blank"` always with `rel="noopener"`; add a visually hidden "(nouvelle fenêtre)" or an icon with `aria-label`.
- Skip link as the first focusable element of `<body>`: `<a class="skip-link" href="#main">Aller au contenu</a>`, visible on focus, pointing to `<main id="main" tabindex="-1">`.
- Download links use the `download` attribute and name the format and size in the text: `Télécharger le reçu (PDF, 120 Ko)`.
- Phone and mail links: `<a href="tel:+237699000000">` and `<a href="mailto:...">`.

## Icons

- Decorative icon next to a text label: `<span class="material-symbols-outlined" aria-hidden="true">add</span>`.
- Icon-only button: `aria-label` on the button, icon still `aria-hidden="true"`: `<button type="button" class="md-icon-button" aria-label="Fermer"><span aria-hidden="true">close</span></button>`.
- `title` is never the only label; it is not announced reliably and does not show on touch. A tooltip component can repeat the `aria-label` visually.
- Inline SVG that carries meaning: `<svg role="img" aria-label="Alerte">`. Decorative SVG: `aria-hidden="true" focusable="false"`.
- Toggle icon buttons use `aria-pressed="true|false"`; the label stays the same (`Favori`), the state changes.

## Complete page skeleton

```html
<!doctype html>
<html lang="fr-CM">
<head><!-- see metadata.md --></head>
<body>
  <a class="skip-link" href="#main">Aller au contenu</a>
  <header class="md-top-app-bar">
    <button type="button" class="md-icon-button" aria-label="Ouvrir le menu"><span class="material-symbols-outlined" aria-hidden="true">menu</span></button>
    <h1 class="md-typescale-title-large">Commandes</h1>
    <search><form action="/recherche"><label for="q" class="visually-hidden">Rechercher</label><input id="q" name="q" type="search" autocomplete="off"></form></search>
  </header>
  <nav class="md-navigation-rail" aria-label="Principale">
    <ul>
      <li><a href="/commandes" aria-current="page"><span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>Commandes</a></li>
      <li><a href="/menu"><span class="material-symbols-outlined" aria-hidden="true">restaurant_menu</span>Menu</a></li>
    </ul>
  </nav>
  <main id="main" tabindex="-1">
    <section aria-labelledby="h-today">
      <h2 id="h-today" class="md-typescale-title-medium">Aujourd'hui</h2>
      <ul class="md-list">
        <li class="md-list-item"><a href="/commandes/1245">Table 4 <time datetime="2026-11-05T12:40+01:00">12 h 40</time> <data value="12500">12&nbsp;500&nbsp;FCFA</data></a></li>
      </ul>
    </section>
  </main>
  <aside aria-label="Détail de la commande"><!-- supporting pane --></aside>
  <footer><p><a href="/mentions-legales">Mentions légales</a></p></footer>
  <button type="button" class="md-fab" aria-label="Nouvelle commande"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>
  <dialog id="confirm" aria-labelledby="confirm-title"><h2 id="confirm-title">Annuler la commande ?</h2><form method="dialog"><button type="submit" value="no">Non</button><button type="submit" value="yes" class="md-button md-button--filled">Oui</button></form></dialog>
  <div class="md-snackbar" role="status" aria-live="polite"></div>
</body>
</html>
```

- `aria-current="page"` marks the active destination in the nav; CSS styles it as the active indicator.
- The snackbar container exists at load with `role="status"` so later messages are announced.
- The FAB sits after `<main>` in DOM order so it is reached after the content, and it is a `<button>` because it acts rather than navigates.

## Checklist

- One `<header>`, one `<main>`, one `<footer>`, labelled `<nav>` and `<aside>`.
- One `<h1>`, no skipped levels, card and dialog titles are headings.
- Buttons are `<button type="...">`, navigation is `<a href>`, dialogs are `<dialog>`.
- Every field has a `<label for>`, `autocomplete`, `inputmode` where useful, `aria-describedby` for its supporting text.
- No all-caps or images of text in the markup; French numbers with no-break spaces; `lang` on foreign fragments.
- Skip link first, `rel="noopener"` on new-window links, descriptive link text.
- Decorative icons `aria-hidden`, icon-only buttons with `aria-label`.
