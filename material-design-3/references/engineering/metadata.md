# Metadata and the head element

Everything that goes in `<head>` and the non-visual identity of a page: language, title, description, icons, manifest, social cards, robots, security.
Follow this file literally; a missing or wrong tag here costs search ranking, broken sharing previews or a wrong theme bar on the phone.

## Mandatory on every page

| Tag | Exact value | Why |
|---|---|---|
| `<html lang="fr">` | real language of the page; add a region when it matters (`fr-CM`, `fr-FR`, `en-CM`) | screen readers pick the voice, browsers pick hyphenation and translation |
| `<meta charset="utf-8">` | first child of `<head>` | the browser must know the encoding before reading any text, including the title |
| `<meta name="viewport">` | `content="width=device-width, initial-scale=1, viewport-fit=cover"` | without it phones render the page at 980 px; `viewport-fit=cover` lets the app bar reach the notch area |
| `<title>` | `Page name - Site name`, under 60 characters | shown in tabs, bookmarks, history and search results |
| `<meta name="description">` | 70 to 155 characters, a sentence for humans, unique per page | used as the snippet in search results and in some share previews |
| `<link rel="canonical">` | absolute URL of the preferred version of this page | stops duplicate indexing of `?utm=` or `/index.html` variants |
| `<meta name="theme-color">` | the `--md-sys-color-surface` value, twice (see below) | colors the browser toolbar and the PWA title bar to match the app |
| `<meta name="color-scheme">` | `content="light dark"` | tells the browser the page supports both so form controls and scrollbars switch too |

Theme color follows the token, so two tags are needed, one per scheme:

```html
<meta name="theme-color" content="#fef7ff">
<meta name="theme-color" content="#141218" media="(prefers-color-scheme: dark)">
```

Use the hex values of `--md-sys-color-surface` from your theme (the baseline values above come from `assets/material-tokens.css`). If the app has a manual theme toggle, update the tag with JavaScript when the user switches.

Title and description rules:
- Page name first, site name last: `Commandes du jour - Chez Mama Ngo`. Home page: `Site name - short tagline`. No "Bienvenue", no all-caps, no keyword list.
- In an app, update `document.title` on every route change so the tab and the history entry stay meaningful.
- Description: one or two plain sentences that say what the page is for and who it is for; do not repeat the title; no raw quotes inside the value.

## Icons and PWA

Provide all of these, in this order, in `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
```

- `favicon.ico`: 32 x 32 px at the site root, because old browsers and some tools request `/favicon.ico` directly. `icon.svg`: the same mark as a vector.
- `apple-touch-icon.png`: 180 x 180 px, no transparency, no rounded corners (iOS rounds it).
- `manifest.webmanifest`: served with `Content-Type: application/manifest+json`.

Minimal manifest:

```json
{
  "name": "Chez Mama Ngo - Gestion",
  "short_name": "Mama Ngo",
  "start_url": "/app/",
  "display": "standalone",
  "background_color": "#fef7ff",
  "theme_color": "#fef7ff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

- `short_name` is under 12 characters; it is the label under the home screen icon.
- `theme_color` and `background_color` use the light `--md-sys-color-surface` value; the splash screen is drawn with them before any CSS loads.
- The maskable icon keeps the logo inside the central 80 % safe zone, because Android crops it to a circle or squircle.
- Add a service worker only when offline use is a real need (field agents, unstable networks). An empty or copy-pasted service worker breaks updates and caches bugs.

## Open Graph and Twitter cards

Needed on every public page that can be shared. Place these after the description.

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chez Mama Ngo">
<meta property="og:title" content="Menu du jour">
<meta property="og:description" content="Plats du jour, prix et horaires du restaurant Chez Mama Ngo à Yaoundé.">
<meta property="og:url" content="https://chezmamango.cm/menu">
<meta property="og:image" content="https://chezmamango.cm/og/menu.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Plat de ndolé servi avec des plantains">
<meta property="og:locale" content="fr_CM">
<meta name="twitter:card" content="summary_large_image">
```

- `og:image`: 1200 x 630 px, JPEG or PNG, under 1 MB, absolute `https://` URL. Relative URLs are ignored by most crawlers.
- One image per page, or one site default stored at `/og/default.jpg` when the page has nothing specific.
- `og:type` is `website` for most pages, `article` for blog posts and news (then also add `article:published_time` in ISO 8601). `og:locale` uses an underscore (`fr_CM`), unlike `lang`.
- `twitter:title`, `twitter:description` and `twitter:image` are optional; Twitter and X fall back to the `og:` values.

## Robots and indexing

- Default public page: `<meta name="robots" content="index, follow">` (or no tag at all; the default is the same).
- Back-office pages (dashboard, admin, account, checkout): `<meta name="robots" content="noindex, nofollow">`.
- Search result pages, filtered lists and print views: `noindex, follow`.
- `robots.txt` at the site root, with the sitemap line:

```
User-agent: *
Disallow: /app/
Disallow: /admin/
Sitemap: https://chezmamango.cm/sitemap.xml
```

- `sitemap.xml` lists every indexable URL with `<lastmod>` in ISO 8601. Generate it from the build or the CMS; never write it by hand for more than 20 pages.
- Multilingual sites: one `<link rel="alternate" hreflang="...">` per language on every page, including the page itself, plus `hreflang="x-default"` pointing to the language chooser or the main language.

## Back-office and authenticated apps

These pages are not public, so skip Open Graph and canonical. Keep everything else:

- `lang`, `charset`, `viewport`, `title`, both `theme-color` tags, `color-scheme`, icons and manifest.
- `<meta name="robots" content="noindex, nofollow">`.
- `<meta name="referrer" content="strict-origin-when-cross-origin">`, so internal URLs with ids or tokens never leak into third-party logs.

## Security headers to request from the backend

The front-end cannot set these from HTML in a reliable way. Ask the backend or hosting team for them and check them with the browser's Network panel.

| Header | Value to ask for | Why |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'` as a start, tightened later | blocks injected scripts; the main defense against XSS |
| `X-Content-Type-Options` | `nosniff` | stops browsers from executing a file served with a wrong type |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | same effect as the meta tag, applied to every response |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (allow only what the app uses) | disables sensors the app does not need |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | forces HTTPS after the first visit |

## Order of elements in head and why

1. `<meta charset>`: must be in the first 1024 bytes.
2. `<meta name="viewport">`: needed before any layout happens.
3. `<title>`: the browser can show the tab early.
4. `<link rel="preconnect">` to the font or API origin: opens the connection while the rest parses.
5. Critical CSS, inline or as the first stylesheet: the tokens file and the layout rules, so the first paint is already Material.
6. Fonts: `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the one or two files used above the fold, then the font stylesheet.
7. Everything else: description, canonical, theme-color, icons, manifest, Open Graph, robots, structured data.
8. Scripts last, with `defer` or `type="module"`, never blocking.

## Template: public page

```html
<!doctype html>
<html lang="fr-CM">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Menu du jour - Chez Mama Ngo</title>
  <!-- Connections and critical CSS before anything that paints -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="/css/material-tokens.css">
  <link rel="stylesheet" href="/css/app.css">
  <link rel="preload" href="/fonts/roboto-flex.woff2" as="font" type="font/woff2" crossorigin>
  <!-- Identity -->
  <meta name="description" content="Plats du jour, prix en FCFA et horaires du restaurant Chez Mama Ngo, quartier Bastos à Yaoundé.">
  <link rel="canonical" href="https://chezmamango.cm/menu">
  <meta name="theme-color" content="#fef7ff">
  <meta name="theme-color" content="#141218" media="(prefers-color-scheme: dark)">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index, follow">
  <!-- Icons and PWA -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <!-- Sharing -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Chez Mama Ngo">
  <meta property="og:title" content="Menu du jour">
  <meta property="og:description" content="Plats du jour, prix et horaires du restaurant Chez Mama Ngo à Yaoundé.">
  <meta property="og:url" content="https://chezmamango.cm/menu">
  <meta property="og:image" content="https://chezmamango.cm/og/menu.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Plat de ndolé servi avec des plantains">
  <meta property="og:locale" content="fr_CM">
  <meta name="twitter:card" content="summary_large_image">
  <!-- Structured data goes here: see structured-data.md -->
  <script type="module" src="/js/app.js"></script>
</head>
```

## Template: app page (authenticated)

```html
<!doctype html>
<html lang="fr-CM">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Tableau de bord - Mama Ngo Gestion</title>
  <link rel="stylesheet" href="/css/material-tokens.css">
  <link rel="stylesheet" href="/css/app.css">
  <link rel="preload" href="/fonts/roboto-flex.woff2" as="font" type="font/woff2" crossorigin>
  <!-- Not public: no indexing, no referrer leaks, no Open Graph -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="theme-color" content="#fef7ff">
  <meta name="theme-color" content="#141218" media="(prefers-color-scheme: dark)">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <script type="module" src="/js/app.js"></script>
</head>
```

## Checklist

- `lang` matches the page language; `charset` is the first tag.
- Title under 60 characters with the page name first; description 70 to 155 characters.
- Two `theme-color` tags with the surface token values; `color-scheme` set.
- Favicon, SVG icon, Apple touch icon, manifest with 192, 512 and maskable icons.
- Public page: canonical, Open Graph with an absolute 1200 x 630 image, `twitter:card`.
- App page: `noindex, nofollow` and `referrer` meta; no Open Graph.
- Security headers confirmed in the Network panel.
