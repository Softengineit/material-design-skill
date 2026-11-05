# Performance: budgets and techniques for a Material UI

A Material page must load fast on a mid-range phone over 4G. Set the budgets below before coding, measure on every page before shipping, and fix the first failing metric with the table at the end.

## Budgets per page

| Metric | Budget | Why |
| --- | --- | --- |
| Lighthouse performance (mobile) | >= 90 | the number stakeholders look at |
| LCP (largest contentful paint) | < 2.5 s | the main content is visible |
| INP (interaction to next paint) | < 200 ms | taps feel instant |
| CLS (cumulative layout shift) | < 0.1 | nothing jumps under the finger |
| JavaScript on first load | < 200 KB gzipped | parse time on slow CPUs |
| CSS on first load | < 50 KB gzipped | render blocking |
| Font families | <= 2 | each family is a network round trip |
| Font files | <= 4 | weights 400, 500, 700 and one icon font at most |

Write these numbers in the README of the project. A pull request that breaks one is not merged.

## Fonts

- Load Roboto (or the brand font) from Google Fonts with `display=swap` and only the weights used:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  ```
- Subset when the text is known and small (a landing page): add `&text=` with the characters used.
- Self-host when the site must work offline or the client forbids third parties:
  ```html
  <link rel="preload" href="/assets/fonts/roboto-400.woff2" as="font" type="font/woff2" crossorigin>
  ```
  ```css
  @font-face { font-family: Roboto; src: url(/assets/fonts/roboto-400.woff2) format("woff2"); font-weight: 400; font-display: swap; }
  ```
- Add a fallback with `size-adjust` so the swap does not shift the layout:
  ```css
  @font-face { font-family: "Roboto Fallback"; src: local("Arial"); size-adjust: 99%; ascent-override: 93%; descent-override: 24%; line-gap-override: 0%; }
  :root { --md-ref-typeface-plain: Roboto, "Roboto Fallback", sans-serif; }
  ```
- Never load a variable font with the full axis range (`opsz,wght@8..144,100..1000`) on a page that uses two weights.

## Material Symbols

- In production load a named subset, not the whole font (the full variable font is over 3 MB):
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=add,close,menu,search,settings&display=block" rel="stylesheet">
  ```
  `display=block` here is on purpose: icon text must not flash as the ligature name.
- Keep the list of icon names in `lib/icons.ts` and generate the link from it, so nobody forgets one.
- When a page uses fewer than 10 icons, inline the SVG from the Material Symbols repository instead, inside an `<Icon name>` component. Zero network requests.
- Never load the full icon font for 3 icons.

## CSS

- `tokens/material-tokens.css` is global and small (under 15 KB gzipped). Load it first, once.
- Component CSS travels with the component: CSS modules, scoped styles, or one bundled `components.css` built from the component folders. A page never adds CSS.
- No `@import` chains: each one is a sequential request. Let the bundler concatenate.
- With SSR, inline the critical CSS of the shell (tokens, app bar, navigation) in `<head>` and load the rest with a normal `<link>`.
- `content-visibility: auto; contain-intrinsic-size: auto 72px;` on each row of a long list, so off-screen rows are not laid out.
- State layers, ripples and focus rings are pure CSS (`::before` with `currentColor` and the `--md-sys-state-*` opacities). No JavaScript ripple library.

## Images

- Always `width` and `height` attributes (or `aspect-ratio` in CSS). This is the main CLS fix.
- `loading="lazy"` and `decoding="async"` on every image below the fold.
- `fetchpriority="high"` on the LCP image (hero, first card media), and no `loading="lazy"` on it.
- `srcset` and `sizes` so a phone does not download the desktop file:
  ```html
  <img src="/img/plant-800.webp" srcset="/img/plant-400.webp 400w, /img/plant-800.webp 800w, /img/plant-1200.webp 1200w"
       sizes="(min-width: 840px) 360px, 100vw" width="800" height="600" alt="Monstera in a white pot" loading="lazy" decoding="async">
  ```
- Serve AVIF or WebP with a `<picture>` fallback to JPEG when old browsers matter.
- In card media use `object-fit: cover` and a fixed `aspect-ratio: 16 / 9` on the container.

## JavaScript

- No library for what CSS already does: transitions, state layers, ripples, dark mode, sticky app bar.
- Code-split by route (`React.lazy`, `defineAsyncComponent`, Angular `loadComponent`, dynamic `import()`). The home route loads only its own code.
- `defer` on every script tag; `type="module"` is deferred by default. Nothing synchronous in `<head>`.
- Avoid layout thrash: read all layout values (`offsetHeight`, `getBoundingClientRect`) first, then write styles. Never alternate read, write, read in a loop.
- Animate only `transform` and `opacity`. Prefer CSS transitions with the `--md-sys-motion-*` tokens; for JS-driven motion use `requestAnimationFrame`, never `setInterval`.
- Use the View Transitions API (`document.startViewTransition`) for page and list-detail changes; fall back to no animation where unsupported.
- `addEventListener('scroll', fn, { passive: true })` and `touchstart` the same, so scrolling never waits for the handler.
- Debounce search fields (250 ms) and resize handlers (100 ms).
- Keep third-party widgets (chat, analytics, maps) out of the initial bundle; load them on interaction or after `load`.

## Lists

- Render at most about 200 rows in the DOM. Above that, virtualize (TanStack Virtual, vue-virtual-scroller, Angular CDK `cdk-virtual-scroll-viewport`).
- Paginate server side (page size 20 to 50) and show the loading indicator or a skeleton row while a page loads.
- Skeletons use the same height as the real row so the swap does not move the page.
- Give every row a stable `key` (the id, never the index) so a re-sort does not re-create DOM.

## Caching and delivery

- Hashed file names (`app.3f9a2c.js`) with `Cache-Control: public, max-age=31536000, immutable`. The HTML itself gets `no-cache` so a deploy is visible at once.
- Brotli (or gzip as fallback) on every text asset: HTML, CSS, JS, SVG, JSON.
- HTTP/2 or HTTP/3 so many small files cost little.
- `<link rel="preload">` for the LCP image and the one font file used above the fold. Preload at most 3 resources, more slows everything else.
- `<link rel="dns-prefetch" href="https://api.example.com">` for the API host and any third party.
- No render-blocking third-party script in `<head>`. Tag managers go at the end of `<body>` with `defer` or `async`.
- Serve images from a CDN that resizes on the fly when the catalog is large.

## Measuring

- Chrome DevTools: Lighthouse tab, mode Navigation, device Mobile, throttling on. Run it in an incognito window so extensions do not count.
- Command line: `npx lighthouse https://example.com --preset=perf --form-factor=mobile --screenEmulation.mobile --output=html --output-path=./lighthouse.html`.
- WebPageTest (webpagetest.org): choose "Moto G4, 4G" and look at the filmstrip to see what paints first.
- Chrome Performance panel: record a tap, look for long tasks (over 50 ms, marked in red) and layout events in a loop.
- Field data: Chrome UX Report in PageSpeed Insights shows what real users get, lab numbers can be better than reality.

| Failing metric | Usual cause | Fix |
| --- | --- | --- |
| LCP > 2.5 s | hero image not prioritized, render-blocking CSS or font | `fetchpriority="high"`, preload it, inline critical CSS, `display=swap` |
| LCP > 2.5 s | slow server response (TTFB > 800 ms) | cache the HTML, CDN, fix the slow API call |
| INP > 200 ms | long task on tap, heavy re-render | split the work, virtualize, memoize the list, passive listeners |
| CLS > 0.1 | image without size, font swap, late banner | `width`/`height`, `size-adjust` fallback, reserve space for banners |
| JS > 200 KB | one bundle for all routes, big library for one feature | code-split by route, replace the library, tree-shake imports |
| CSS > 50 KB | full framework CSS, unused component CSS | purge unused, load component CSS with the component |
| Many font requests | full icon font, every weight loaded | `icon_names=` subset, 3 weights only |
| Slow scroll | non-passive listeners, `box-shadow` animated on many cards | passive listeners, animate `transform` and `opacity` only |

## Pre-ship checklist

- Lighthouse mobile performance >= 90 on the 3 busiest pages.
- LCP < 2.5 s, INP < 200 ms, CLS < 0.1 in the Lighthouse report.
- First-load JS < 200 KB gzipped (check the bundle analyzer output).
- First-load CSS < 50 KB gzipped.
- At most 2 font families and 4 font files in the Network panel.
- Material Symbols loaded as an `icon_names=` subset or inline SVG.
- Every `<img>` has `width`, `height`, `alt`; below-the-fold images have `loading="lazy"`.
- LCP image has `fetchpriority="high"` and is preloaded.
- `preconnect` to fonts.googleapis.com and fonts.gstatic.com present.
- Routes are code-split; no third-party script blocks in `<head>`.
- Lists over 200 rows are virtualized or paginated.
- Static assets have hashed names and a one-year cache header; brotli enabled.
- Scroll and touch listeners are passive.
- No JavaScript ripple or animation library doing what CSS does.
- Checked on a real mid-range Android phone, not only on the laptop.
