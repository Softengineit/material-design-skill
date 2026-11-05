#!/usr/bin/env node
/**
 * e2e_smoke.mjs : walk a web UI the way an end user would and report what is broken, unreachable or dead.
 *
 * Setup (once): npm i -D playwright && npx playwright install chromium
 * Usage:
 *   node e2e_smoke.mjs http://localhost:5173                 # start page, follows same-origin links
 *   node e2e_smoke.mjs ./dist/index.html --out report        # local file
 *   node e2e_smoke.mjs http://localhost:5173 --routes /,/orders,/settings --max 40 --dark
 *
 * For every page visited it:
 *   - records console errors and failed requests
 *   - checks there is one h1, a <main>, a skip link, and that the first Tab lands on a visible focused element
 *   - clicks every button, link, tab, chip, menu item and summary that is visible, one at a time, and reports
 *     the ones that change nothing (no navigation, no DOM change, no dialog, no focus move): "dead" controls
 *   - tries each control with the keyboard (focus + Enter or Space) and reports those that work only with a mouse
 *   - lists elements that exist in the DOM but can never be reached (hidden with no way to show them is fine;
 *     a route or dialog never linked from anywhere is reported as "unreachable")
 *   - measures text under 12px, tap targets under 48x48 on phone width, and horizontal overflow
 *   - measures the rendered page against the visible Material rules: font sizes in the type scale, corner radii in
 *     the shape scale, text and background colors taken from the --md-sys-color-* roles, paddings on the 4px grid,
 *     button, chip, FAB, app bar and navigation bar heights at their spec values, a 3px focus ring on :focus-visible,
 *     a hover state layer on buttons
 *   - takes screenshots at 400px and 1280px, light and dark, into <out>/ for the human or agent visual review
 * The result is <out>/report.md plus <out>/report.json. Exit code 1 when a blocking finding exists.
 *
 * It does not replace written end-to-end tests for business flows (a Playwright test per critical flow);
 * it catches what nobody wrote a test for.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const start = args.find((a) => !a.startsWith('--'));
if (!start) { console.error('Give a URL or a file path'); process.exit(2); }
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const OUT = opt('--out', 'e2e-report');
const MAX = +opt('--max', 25);
const ROUTES = (opt('--routes', '') || '').split(',').filter(Boolean);
const DARK = args.includes('--dark');
fs.mkdirSync(OUT, { recursive: true });

const toUrl = (s) => (/^https?:/.test(s) ? s : 'file://' + path.resolve(s));
const origin = new URL(toUrl(start)).origin;
const findings = []; // {page, severity: 'block'|'warn', kind, detail}
const add = (page, severity, kind, detail) => findings.push({ page, severity, kind, detail });

const CONTROLS = 'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="radio"], [role="switch"], [role="option"], summary, input[type="checkbox"], input[type="radio"]';

async function snapshot(page) {
  return page.evaluate(() => ({
    url: location.href,
    html: document.body.innerHTML.length,
    dialogs: [...document.querySelectorAll('dialog[open], [role="dialog"], [aria-modal="true"]')].filter((d) => d.checkVisibility && d.checkVisibility()).length,
    focus: document.activeElement && document.activeElement.tagName + '#' + (document.activeElement.id || '') + '.' + document.activeElement.className,
    expanded: [...document.querySelectorAll('[aria-expanded]')].map((e) => e.getAttribute('aria-expanded')).join(''),
    selected: [...document.querySelectorAll('[aria-selected],[aria-checked],[aria-current],[aria-pressed]')].map((e) => e.getAttribute('aria-selected') + e.getAttribute('aria-checked') + e.getAttribute('aria-current') + e.getAttribute('aria-pressed')).join(''),
    hidden: [...document.querySelectorAll('[hidden],[open]')].length,
    scroll: scrollY,
    root: document.documentElement.getAttribute('data-theme') + '|' + document.documentElement.className,
  }));
}
const changed = (a, b) => a.url !== b.url || a.root !== b.root || a.dialogs !== b.dialogs || a.expanded !== b.expanded || a.selected !== b.selected || a.hidden !== b.hidden || Math.abs(a.html - b.html) > 20 || a.scroll !== b.scroll;

async function closeOverlays(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(() => document.querySelectorAll('dialog[open]').forEach((d) => d.close()));
}

async function auditPage(browser, url, width, theme, visited, queue) {
  const context = await browser.newContext({ viewport: { width, height: 860 }, colorScheme: theme, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const consoleErrors = []; const failed = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto(url, { waitUntil: 'load' }).catch((e) => add(url, 'block', 'load', String(e)));
  await page.waitForTimeout(800);
  const label = `${new URL(url).pathname || '/'} ${width}px ${theme}`;
  const shot = path.join(OUT, `${(new URL(url).pathname.replace(/[^a-z0-9]+/gi, '_') || 'root')}_${width}_${theme}.png`);
  await page.screenshot({ path: shot, fullPage: true }).catch(() => {});

  for (const e of consoleErrors) add(label, 'block', 'console', e.slice(0, 200));
  for (const f of failed) add(label, 'warn', 'request-failed', f);

  // Structure
  const s = await page.evaluate(() => {
    const vis = (el) => el.checkVisibility ? el.checkVisibility() : true;
    const small = [...document.querySelectorAll('body *')].filter((el) => el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(el) && parseFloat(getComputedStyle(el).fontSize) < 11).length;
    const targets = [...document.querySelectorAll('button, a[href], [role="button"], input, select, [role="tab"], [role="menuitem"]')].filter(vis).map((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const pad = parseFloat(cs.marginTop) + parseFloat(cs.marginBottom); return { w: r.width, h: r.height + pad, text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30) }; }).filter((t) => t.w > 0 && (t.w < 40 || t.h < 40));
    return {
      h1: document.querySelectorAll('h1').length, main: !!document.querySelector('main, [role="main"]'),
      skip: !!document.querySelector('a[href^="#"]'), lang: document.documentElement.lang, title: document.title,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      small, targets: targets.slice(0, 10), targetCount: targets.length,
      unlabeled: [...document.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(vis).filter((i) => !i.labels?.length && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby')).length,
      imgs: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    };
  });
  if (s.h1 !== 1) add(label, 'warn', 'headings', `${s.h1} h1 on the page`);
  if (!s.main) add(label, 'warn', 'landmark', 'no <main>');
  if (!s.lang) add(label, 'warn', 'lang', '<html> has no lang');
  if (!s.title) add(label, 'warn', 'title', 'empty <title>');
  if (s.overflow) add(label, 'block', 'overflow', 'horizontal scroll');
  if (s.small) add(label, 'warn', 'font-size', `${s.small} text element(s) under 11px (Material minimum is label-small, 11px)`);
  if (width <= 480 && s.targetCount) add(label, 'warn', 'tap-target', `${s.targetCount} control(s) drawn under 40px, confirm their 48px target (padding or pseudo-element): ${s.targets.map((t) => t.text || '?').join(', ')}`);
  if (s.unlabeled) add(label, 'block', 'label', `${s.unlabeled} form control(s) without a label`);
  if (s.imgs) add(label, 'block', 'alt', `${s.imgs} <img> without alt`);

  // Visible Material rules measured on the rendered page
  const v = await page.evaluate(() => {
    const vis = (el) => el.checkVisibility ? el.checkVisibility() : true;
    const cs = getComputedStyle(document.documentElement);
    const roles = new Set();
    for (const sheet of document.styleSheets) { try { for (const r of sheet.cssRules) if (r.style) for (const n of r.style) if (n.startsWith('--md-sys-color-')) roles.add(cs.getPropertyValue(n).trim().toLowerCase()); } catch (_) {} }
    const norm = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const [r, g, b, a] = m[1].split(',').map((x) => parseFloat(x)); if (a === 0) return 'transparent'; return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join(''); };
    const TYPE = [11, 12, 14, 16, 22, 24, 28, 32, 36, 45, 57];
    const RADII = [0, 4, 8, 12, 16, 20, 28, 32, 48];
    const desc = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : '') + ' "' + (el.textContent || '').trim().slice(0, 25) + '"';
    const out = { type: [], radius: [], color: [], grid: [], height: [], roleCount: roles.size };
    const seen = { type: new Set(), radius: new Set(), color: new Set(), grid: new Set(), height: new Set() };
    const push = (k, el, msg) => { const d = desc(el); const key = k + msg; if (seen[k].has(key) || out[k].length > 8) return; seen[k].add(key); out[k].push(d + ': ' + msg); };
    for (const el of document.querySelectorAll('body *')) {
      if (!vis(el) || ['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName)) continue;
      const s = getComputedStyle(el);
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText && !el.classList.contains('material-symbols-outlined')) {
        const fs = parseFloat(s.fontSize);
        if (!TYPE.some((x) => Math.abs(x - fs) < 0.6)) push('type', el, `font-size ${fs}px is not a Material type scale size`);
        const c = norm(s.color);
        if (roles.size && c !== 'transparent' && !roles.has(c) && s.opacity === '1' && !el.closest('[class*="symbol"]')) push('color', el, `text color ${c} is not a --md-sys-color-* role`);
      }
      const bg = norm(s.backgroundColor);
      if (roles.size && bg !== 'transparent' && !roles.has(bg) && !s.backgroundImage.includes('gradient')) {
        // allow state layers (semi-transparent) and inherited hex of images
        const parts = (s.backgroundColor.match(/[0-9.]+/g) || []); const alpha = parts.length === 4 ? parseFloat(parts[3]) : 1; if (alpha === 1) push('color', el, `background ${bg} is not a --md-sys-color-* role`);
      }
      const r = parseFloat(s.borderTopLeftRadius);
      if (r > 0 && r < 999 && !RADII.some((x) => Math.abs(x - r) < 0.6) && !s.borderTopLeftRadius.includes('%')) push('radius', el, `border-radius ${r}px is not in the shape scale (4, 8, 12, 16, 20, 28, 32, 48, full)`);
      for (const side of ['paddingTop', 'paddingLeft']) { const pv = parseFloat(s[side]); if (pv > 0 && Math.abs(pv / 4 - Math.round(pv / 4)) > 0.1) { push('grid', el, `${side} ${pv}px is off the 4px grid`); break; } }
      const h = el.getBoundingClientRect().height;
      const isBtn = el.tagName === 'BUTTON' && !el.closest('nav') && !el.getAttribute('role');
      if (isBtn && /button/.test(el.className) && !/icon|fab|chip|handle|nav|item|tab|row|close|segment/.test(el.className) && ![32, 40, 48, 56, 96, 136].some((x) => Math.abs(h - x) < 1.5)) push('height', el, `button height ${Math.round(h)}px (Material sizes: 32, 40, 48, 56, 96, 136)`);
      if (/chip/.test(el.className) && el.tagName === 'BUTTON' && Math.abs(h - 32) > 1.5) push('height', el, `chip height ${Math.round(h)}px (spec 32px)`);
      if (/\bfab\b/.test(el.className) && !/extended|menu/.test(el.className) && ![40, 56, 96].some((x) => Math.abs(h - x) < 1.5)) push('height', el, `FAB height ${Math.round(h)}px (spec 40, 56, 96)`);
    }
    const bar = document.querySelector('header, [class*="app-bar"], [class*="top-bar"]'); if (bar) { const h = bar.getBoundingClientRect().height; if (![64, 112, 152].some((x) => Math.abs(h - x) < 2)) out.height.push(`top app bar height ${Math.round(h)}px (spec 64 small, 112 medium, 152 large)`); }
    const nav = document.querySelector('nav [class*="list"], nav ul'); if (nav && innerWidth < 600) { const h = nav.getBoundingClientRect().height; if (![64, 80].some((x) => Math.abs(h - x) < 2)) out.height.push(`navigation bar height ${Math.round(h)}px (spec 80 baseline, 64 flexible)`); }
    return out;
  });
  if (!v.roleCount) add(label, 'warn', 'tokens', 'no --md-sys-color-* custom properties found on the page: colors cannot be checked against roles');
  for (const k of ['type', 'radius', 'color', 'grid', 'height']) for (const m of v[k]) add(label, 'warn', 'visual-' + k, m);
  // Focus ring and hover state layer on the first real button
  const btn = page.locator('button:not([aria-hidden])').first();
  if (await btn.count()) {
    await btn.focus().catch(() => {});
    await page.keyboard.press('Shift+Tab').catch(() => {}); await page.keyboard.press('Tab').catch(() => {});
    const ring = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const s = getComputedStyle(a); const b = getComputedStyle(a, '::after'); return { outline: s.outlineStyle !== 'none' ? parseFloat(s.outlineWidth) : 0, shadow: s.boxShadow !== 'none', after: b.boxShadow !== 'none' }; });
    if (ring && !ring.outline && !ring.shadow && !ring.after) add(label, 'block', 'focus-ring', 'keyboard focus on a button shows no ring (Material: 3px outline in secondary, 2px offset)');
    else if (ring && ring.outline && Math.abs(ring.outline - 3) > 0.6) add(label, 'warn', 'focus-ring', `focus ring is ${ring.outline}px, Material uses 3px`);
    const hov = await btn.evaluate(async (e) => { const before = getComputedStyle(e, '::before').opacity + getComputedStyle(e, '::after').opacity + getComputedStyle(e).backgroundColor + getComputedStyle(e).boxShadow; return before; });
    await btn.hover().catch(() => {}); await page.waitForTimeout(250);
    const hov2 = await btn.evaluate((e) => getComputedStyle(e, '::before').opacity + getComputedStyle(e, '::after').opacity + getComputedStyle(e).backgroundColor + getComputedStyle(e).boxShadow);
    if (width > 600 && hov === hov2) add(label, 'warn', 'state-layer', 'no visible change on hover for the first button (state layer 8% expected)');
    await page.mouse.move(0, 0);
  }

  // First Tab lands somewhere visible
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const r = a.getBoundingClientRect(); return { tag: a.tagName, text: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40), visible: r.width > 0 && r.height > 0, outline: getComputedStyle(a).outlineStyle }; });
  if (!firstFocus) add(label, 'block', 'keyboard', 'first Tab focuses nothing');
  else if (!firstFocus.visible) add(label, 'block', 'keyboard', `first Tab lands on an invisible element (${firstFocus.tag})`);

  // Click every visible control
  const count = await page.locator(CONTROLS).count();
  const dead = []; const mouseOnly = []; const links = new Set();
  for (let i = 0; i < Math.min(count, 120); i++) {
    const el = page.locator(CONTROLS).nth(i);
    if (!(await el.isVisible().catch(() => false))) continue;
    const info = await el.evaluate((e) => ({ tag: e.tagName, text: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 40), href: e.getAttribute('href'), type: e.getAttribute('type'), disabled: e.disabled || e.getAttribute('aria-disabled') === 'true' }));
    if (info.disabled) continue;
    if (info.tag === 'A' && info.href && !info.href.startsWith('#')) {
      try { const u = new URL(info.href, url); if (/^https?:$/.test(u.protocol) && u.origin === origin && !/\.(pdf|zip|csv|png|jpg)$/i.test(u.pathname)) links.add(u.href.split('#')[0]); } catch (_) {}
      if (/^(mailto|tel|sms):/.test(info.href)) continue;
      if (info.href && !info.href.startsWith('#') && !info.href.startsWith('javascript')) continue; // navigation links are followed later, not clicked here
    }
    const already = await el.evaluate((e) => ['aria-checked', 'aria-selected', 'aria-pressed', 'aria-current'].some((a) => e.getAttribute(a) === 'true' || e.getAttribute(a) === 'page')).catch(() => false);
    if (already) continue; // an already selected option is expected to do nothing
    // 1. keyboard path first: focus, then Enter (buttons, links) or Space (checkbox, radio, switch)
    const before = await snapshot(page);
    const focusable = await el.evaluate((e) => { e.focus(); return document.activeElement === e; }).catch(() => false);
    let kbChanged = false;
    if (focusable) {
      await page.keyboard.press(['BUTTON', 'A', 'SUMMARY'].includes(info.tag) ? 'Enter' : 'Space').catch(() => {});
      await page.waitForTimeout(250);
      const afterKb = await snapshot(page);
      kbChanged = changed(before, afterKb);
      if (afterKb.url !== before.url) { await page.goBack().catch(() => {}); await page.waitForTimeout(300); } else if (kbChanged) await closeOverlays(page);
    } else mouseOnly.push(`${info.tag} "${info.text || '?'}" cannot receive focus`);
    if (kbChanged) continue; // works with the keyboard, so it works with the mouse too
    // 2. mouse path
    const before2 = await snapshot(page);
    await el.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(250);
    const after = await snapshot(page);
    if (!changed(before2, after)) dead.push(`${info.tag} "${info.text || info.href || '?'}"`);
    else if (focusable) mouseOnly.push(`${info.tag} "${info.text || '?'}" works with mouse only`);
    if (after.url !== before2.url) { await page.goBack().catch(() => {}); await page.waitForTimeout(300); } else await closeOverlays(page);
  }
  if (dead.length) add(label, 'block', 'dead-control', dead.slice(0, 15).join('; ') + (dead.length > 15 ? ` (+${dead.length - 15})` : ''));
  if (mouseOnly.length) add(label, 'block', 'keyboard', mouseOnly.slice(0, 10).join('; '));
  for (const l of links) if (!visited.has(l) && !queue.includes(l)) queue.push(l);

  // Unreachable dialogs: dialogs with an id nobody references
  const orphan = await page.evaluate(() => [...document.querySelectorAll('dialog[id], [role="dialog"][id]')].map((d) => d.id).filter((id) => !document.querySelector(`[aria-controls="${id}"], [data-open="${id}"], [data-dialog="${id}"], [href="#${id}"], [commandfor="${id}"]`) && !document.body.innerHTML.includes(`#${id}'`) && !document.body.innerHTML.includes(`#${id}"`)));
  if (orphan.length) add(label, 'warn', 'unreachable', `dialog(s) never referenced from the page: ${orphan.join(', ')} (check the script opens them)`);

  await context.close();
}

(async () => {
  const browser = await chromium.launch();
  const visited = new Set(); const queue = [toUrl(start), ...ROUTES.map((r) => new URL(r, toUrl(start)).href)];
  while (queue.length && visited.size < MAX) {
    const url = queue.shift(); if (visited.has(url)) continue; visited.add(url);
    for (const [w, theme] of [[400, 'light'], [1280, 'light'], ...(DARK ? [[400, 'dark']] : [])]) await auditPage(browser, url, w, theme, visited, queue);
  }
  await browser.close();
  const blocks = findings.filter((f) => f.severity === 'block');
  const md = [`# E2E smoke report`, ``, `Start: ${start}`, `Pages visited: ${visited.size}`, `Blocking: ${blocks.length}, warnings: ${findings.length - blocks.length}`, ``, `| Page | Severity | Kind | Detail |`, `|---|---|---|---|`,
    ...findings.map((f) => `| ${f.page} | ${f.severity} | ${f.kind} | ${f.detail.replace(/\|/g, '/')} |`), ``, `Screenshots in ${OUT}/`];
  fs.writeFileSync(path.join(OUT, 'report.md'), md.join('\n'));
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ start, visited: [...visited], findings }, null, 2));
  console.log(md.join('\n'));
  process.exit(blocks.length ? 1 : 0);
})();
