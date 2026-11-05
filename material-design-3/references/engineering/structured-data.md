# Structured data

How to describe a page to search engines with schema.org vocabulary so it can get rich results (stars, opening hours, FAQ dropdowns, breadcrumbs).
Use JSON-LD for all new work; touch microdata only when the project already has it.

## Why JSON-LD

- One `<script type="application/ld+json">` block holds the whole description; the HTML stays clean.
- No coupling with the markup: you can restyle or restructure the page without breaking the data.
- Google recommends it and its tools parse it first.
- It is plain JSON, so it can be generated server side from the same object that renders the page, which keeps both in sync.

## Types a front-end developer meets

| Type | Use it for | Key fields |
|---|---|---|
| `Organization` | the company behind the site, once, on the home page | `name`, `url`, `logo`, `sameAs` (social profiles), `contactPoint` |
| `LocalBusiness` and subtypes (`Restaurant`, `Store`, `School`) | a place people visit | `address` (`PostalAddress`), `telephone`, `openingHoursSpecification`, `geo`, `priceRange`, `image` |
| `WebSite` | the site itself, home page only | `name`, `url`, `potentialAction` (`SearchAction`) for a search box |
| `WebPage` | the current page, when another type does not already cover it | `name`, `url`, `description`, `inLanguage`, `isPartOf` |
| `BreadcrumbList` | every page below the home page | `itemListElement` of `ListItem` with `position`, `name`, `item` |
| `Article` / `BlogPosting` / `NewsArticle` | a dated text with an author | `headline`, `datePublished`, `dateModified`, `author`, `image`, `publisher` |
| `Product` with `Offer` | something sold, with a price | `name`, `image`, `description`, `sku`, `offers` (`price`, `priceCurrency`, `availability`, `url`) |
| `FAQPage` | a visible list of questions and answers | `mainEntity` of `Question` with `acceptedAnswer` (`Answer`) |
| `Event` | a dated happening with a place or an online URL | `name`, `startDate`, `endDate`, `location`, `eventStatus`, `offers`, `organizer` |
| `Course` | a training with a provider | `name`, `description`, `provider` (`Organization`), `hasCourseInstance` |
| `SoftwareApplication` | an app you distribute | `name`, `applicationCategory`, `operatingSystem`, `offers` |
| `Person` | an author or team member page | `name`, `jobTitle`, `url`, `image`, `sameAs`, `worksFor` |

Pick the most specific type that is true: `Restaurant` rather than `LocalBusiness`, `BlogPosting` rather than `Article` for a blog.

## Rules

- The data must match what the visitor can see on the page. Hidden prices, invented reviews or a phone number that is not displayed are treated as spam and the page loses its rich results.
- Every `url`, `image`, `logo` and `item` value is an absolute `https://` URL.
- Dates and times use ISO 8601 with a timezone offset: `2026-11-20T19:30:00+01:00`. Dates alone: `2026-11-20`.
- Prices are numbers or numeric strings without separators: `"price": "4000"`, with `"priceCurrency": "XAF"` (the ISO code for the franc CFA; never `FCFA`).
- Phone numbers in international format: `+237 6 99 00 00 00`.
- When a page describes several entities (the business, the page, the breadcrumb), put them in one `@graph` array in one script block, and link them with `@id` references.
- Place the script in `<head>` or just before `</body>`. Both work; `<head>` keeps it next to the other metadata.
- One block per page. Do not repeat `Organization` on every page; put it on the home page and reference it by `@id` elsewhere.
- Frameworks: render the JSON on the server or at build time. Data injected only after hydration may be missed by crawlers.
- Escape `</script>` inside string values as `<\/script>`, or the block ends early.
- Validate every template once with the Rich Results Test (Google) and the Schema Markup Validator (schema.org). Fix every error; warnings are recommended fields and are worth adding when the data exists.

## Example: restaurant page

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": "https://chezmamango.cm/#restaurant",
      "name": "Chez Mama Ngo",
      "url": "https://chezmamango.cm/",
      "image": "https://chezmamango.cm/og/facade.jpg",
      "telephone": "+237 6 99 00 00 00",
      "priceRange": "2000 - 8000 XAF",
      "servesCuisine": "Camerounaise",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rue 1.750, Bastos",
        "addressLocality": "Yaoundé",
        "addressRegion": "Centre",
        "addressCountry": "CM"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 3.8905, "longitude": 11.5162 },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "11:30",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "12:00",
          "closes": "23:00"
        }
      ],
      "hasMenu": "https://chezmamango.cm/menu",
      "acceptsReservations": "True"
    },
    {
      "@type": "WebPage",
      "@id": "https://chezmamango.cm/menu#page",
      "url": "https://chezmamango.cm/menu",
      "name": "Menu du jour - Chez Mama Ngo",
      "inLanguage": "fr-CM",
      "about": { "@id": "https://chezmamango.cm/#restaurant" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://chezmamango.cm/" },
        { "@type": "ListItem", "position": 2, "name": "Menu du jour", "item": "https://chezmamango.cm/menu" }
      ]
    }
  ]
}
</script>
```

Required for `Restaurant`: `name`, `address`, `image`. Recommended: `telephone`, `openingHoursSpecification`, `geo`, `priceRange`, `servesCuisine`, `url`, `hasMenu`. Add `aggregateRating` only when real reviews are shown on the page.

## Example: article page

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://xcodepath.com/blog/debuter-en-html#article",
  "mainEntityOfPage": "https://xcodepath.com/blog/debuter-en-html",
  "headline": "Débuter en HTML en une semaine",
  "description": "Un plan de sept jours pour écrire sa première page HTML propre et accessible.",
  "image": "https://xcodepath.com/og/debuter-en-html.jpg",
  "datePublished": "2026-10-12T08:00:00+01:00",
  "dateModified": "2026-11-02T10:15:00+01:00",
  "inLanguage": "fr",
  "author": {
    "@type": "Person",
    "name": "Steve Nouyep",
    "url": "https://xcodepath.com/auteurs/steve-nouyep"
  },
  "publisher": {
    "@type": "Organization",
    "name": "X Code-Path",
    "logo": { "@type": "ImageObject", "url": "https://xcodepath.com/logo-600.png" }
  }
}
</script>
```

Required for `BlogPosting`: `headline` (under 110 characters), `image`, `datePublished`, `author`. Recommended: `dateModified`, `publisher` with `logo`, `description`, `mainEntityOfPage`. The visible page shows the same title, the same author name and the same date.

## Example: product offer in XAF

```json
{
  "@type": "Product",
  "name": "Poulet DG",
  "image": "https://chezmamango.cm/plats/poulet-dg.jpg",
  "description": "Poulet braisé aux plantains et légumes, portion pour une personne.",
  "sku": "PLAT-012",
  "offers": {
    "@type": "Offer",
    "url": "https://chezmamango.cm/menu#poulet-dg",
    "price": "4000",
    "priceCurrency": "XAF",
    "availability": "https://schema.org/InStock"
  }
}
```

`availability` values are full schema.org URLs: `InStock`, `OutOfStock`, `PreOrder`, `SoldOut`.

## Microdata, only for existing code

Microdata puts the same information inside the HTML as attributes. It couples data and markup, breaks when the layout changes and is harder to review. Never choose it for new work. If a project already uses it, keep it consistent:

```html
<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">Chez Mama Ngo</h1>
  <img itemprop="image" src="/og/facade.jpg" alt="Façade du restaurant">
  <p itemprop="servesCuisine">Camerounaise</p>
  <a itemprop="telephone" href="tel:+237699000000">+237 6 99 00 00 00</a>
  <address itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
    <span itemprop="streetAddress">Rue 1.750, Bastos</span>,
    <span itemprop="addressLocality">Yaoundé</span>
    <meta itemprop="addressCountry" content="CM">
  </address>
  <p itemprop="openingHoursSpecification" itemscope itemtype="https://schema.org/OpeningHoursSpecification">
    <meta itemprop="dayOfWeek" content="Monday">
    Lundi : <time itemprop="opens" datetime="11:30">11 h 30</time> à <time itemprop="closes" datetime="22:00">22 h</time>
  </p>
</article>
```

Do not mix: a page carries either JSON-LD or microdata for a given entity, never both, or the validators report duplicates.

## Open Graph is not structured data

`og:` tags describe how a link looks when shared on social networks; schema.org data describes what the page is about to search engines. A public page needs both (see `metadata.md` for Open Graph).

## Checklist

- Most specific type chosen; required fields present.
- Everything in the JSON is visible on the page.
- Absolute URLs, ISO 8601 dates, `priceCurrency: "XAF"`.
- One script block per page, `@graph` when several entities.
- Rendered server side or at build time.
- Rich Results Test and Schema Markup Validator show zero errors.
