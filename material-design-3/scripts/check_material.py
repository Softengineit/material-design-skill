#!/usr/bin/env python3
"""Static checker for Material Design 3 front-end code.

Usage: python3 check_material.py <file or folder> [...]

Scans .css .scss .html .htm .jsx .tsx .vue .svelte .js .ts .astro .php .twig .blade.php
files and reports things that usually break Material Design compliance:

- hard-coded colors (hex, rgb(), hsl()) outside a token definition block
- hard-coded font-size, border-radius, box-shadow, transition/animation durations
  where a --md-sys-* token exists
- explicit heights below 48px on interactive elements without a visible touch target rule
- interactive elements (button, a, input, select, textarea) with no focus-visible rule in the CSS
- icon-only buttons (a <button> containing only an icon element) without aria-label
- <img> without alt
- outline: none / outline: 0 without a replacement focus style

Page-level checks (full HTML documents only, those containing <html ...>):
- missing lang, charset, viewport, <title>, meta description, canonical, theme-color
- title over 60 characters, description outside 70 to 155 characters
- zero or several <h1>, skipped heading levels
- no <main>, no <nav> with an accessible name
- Open Graph incomplete on indexable pages (og:title, og:description, og:image)
- <img> without width/height, or below-the-fold images without loading="lazy"
- Google Fonts link without display=swap, or missing preconnect
- inline style="" attributes with colors or sizes
- <div>/<span> with onclick or role="button" instead of a <button>
- form controls without a <label for> or aria-label
- div-with-onclick, target=_blank without rel=noopener

Options: --app marks the project as an authenticated app (no OG or canonical required,
noindex expected). Exit code is 1 when at least one finding is reported.
"""
import os
import re
import sys

EXTS = {'.css', '.scss', '.html', '.htm', '.jsx', '.tsx', '.vue', '.svelte', '.js', '.ts',
        '.astro', '.php', '.twig'}

COLOR_RE = re.compile(r'(?<![\w-])(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))')
FONT_SIZE_RE = re.compile(r'font-size\s*:\s*([0-9.]+(px|rem|em|pt))')
RADIUS_RE = re.compile(r'border-radius\s*:\s*([^;]+);')
SHADOW_RE = re.compile(r'box-shadow\s*:\s*([^;]+);')
DURATION_RE = re.compile(r'(transition|animation)(-duration)?\s*:\s*([^;]*?\b[0-9.]+m?s\b[^;]*);')
HEIGHT_RE = re.compile(r'(min-)?height\s*:\s*([0-9]+)px')
OUTLINE_NONE_RE = re.compile(r'outline\s*:\s*(none|0)\s*[;}]')
IMG_RE = re.compile(r'<img\b[^>]*>', re.I)
BUTTON_RE = re.compile(r'<button\b[^>]*>(.*?)</button>', re.I | re.S)
TAG_RE = re.compile(r'<[^>]+>')
ICON_WORDS = ('material-symbols', 'icon', '<svg', 'mat-icon', 'md-icon')
ARIA_LABEL_RE = re.compile(r'aria-label(ledby)?\s*=', re.I)
TOKEN_DEF_RE = re.compile(r'--md-(sys|ref|comp)-[\w-]+\s*:')
FOCUS_RE = re.compile(r':focus-visible|:focus\b|focus-visible:')


def iter_files(paths):
    for p in paths:
        if os.path.isfile(p):
            yield p
        else:
            for root, _dirs, files in os.walk(p):
                if 'node_modules' in root or '/.git' in root:
                    continue
                for f in files:
                    if os.path.splitext(f)[1] in EXTS or f.endswith('.blade.php'):
                        yield os.path.join(root, f)


def check_file(path):
    findings = []
    try:
        text = open(path, encoding='utf-8', errors='replace').read()
    except OSError as e:
        return [(path, 0, f'cannot read: {e}')]
    if os.path.basename(path) == 'material-tokens.css':
        return findings
    lines = text.split('\n')
    has_focus = bool(FOCUS_RE.search(text))
    has_target_fix = bool(re.search(r'inset:\s*-|min-(height|width):\s*48px|margin:\s*4px', text))
    has_interactive = bool(re.search(r'<(button|a |input|select|textarea)\b|\bbutton\s*\{|\b(role=["\'](button|tab|switch|menuitem))', text, re.I))

    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
            continue
        if TOKEN_DEF_RE.search(line):
            continue  # a token definition line is where hard values belong
        m = COLOR_RE.search(line)
        if m and 'var(--md-' not in line and not re.search(r'(href|src|xlink:href|url\(|id=|#\w+\s*\{|&#|theme-color|msapplication|<svg|fill=|stroke=)', line):
            findings.append((path, i, f'hard-coded color {m.group(1)}: use a --md-sys-color-* role'))
        m = FONT_SIZE_RE.search(line)
        if m and 'var(--md-' not in line and not re.search(r'symbol|icon|svg', line, re.I):
            findings.append((path, i, f'hard-coded font-size {m.group(1)}: use --md-sys-typescale-<role>-size'))
        m = RADIUS_RE.search(line)
        if m and 'var(--md-' not in m.group(1) and not re.search(r'(^|\s)(0|50%|inherit|2px)(\s|$)', m.group(1)) and not re.search(r'checkbox|radio', line, re.I):
            findings.append((path, i, f'hard-coded border-radius {m.group(1).strip()}: use --md-sys-shape-corner-*'))
        m = SHADOW_RE.search(line)
        if m and 'var(--md-' not in m.group(1) and 'none' not in m.group(1):
            findings.append((path, i, 'hard-coded box-shadow: use --md-sys-elevation-level*'))
        m = DURATION_RE.search(line)
        if m and 'var(--md-' not in m.group(3) and '1ms' not in m.group(3) and '0s' not in m.group(3):
            findings.append((path, i, f'hard-coded duration/easing "{m.group(3).strip()}": use --md-sys-motion-*'))
        m = OUTLINE_NONE_RE.search(line)
        if m and not has_focus:
            findings.append((path, i, 'outline removed without a focus-visible replacement (3px ring required)'))
        m = HEIGHT_RE.search(line)
        if m and int(m.group(2)) < 48 and not has_target_fix and re.search(r'\.(button|chip|fab|icon-button|tab|nav-item)\b|\bbutton\s*\{', line, re.I) and not re.search(r'symbol|svg|icon\b(?!-button)', line, re.I):
            findings.append((path, i, f'height {m.group(2)}px on an interactive element: the touch target must still reach 48x48px (padding, margin or ::before)'))

    for m in IMG_RE.finditer(text):
        if not re.search(r'[\s:]alt\s*=|v-bind:alt|alt=\{', m.group(0), re.I):
            findings.append((path, text.count('\n', 0, m.start()) + 1, '<img> without alt attribute'))
    for m in BUTTON_RE.finditer(text):
        tag = m.group(0).split('>', 1)[0]
        inner = m.group(1)
        visible_text = TAG_RE.sub(' ', re.sub(r'<(span|i)\b[^>]*material-symbols[^>]*>[^<]*</\1>', ' ', inner, flags=re.I)).strip()
        looks_icon_only = (not visible_text) and any(w in inner.lower() for w in ICON_WORDS)
        if looks_icon_only and not ARIA_LABEL_RE.search(tag) and 'title=' not in tag:
            findings.append((path, text.count('\n', 0, m.start()) + 1, 'icon-only <button> without aria-label'))

    if has_interactive and not has_focus and path.endswith(('.css', '.scss', '.vue', '.svelte', '.html', '.htm')):
        findings.append((path, 0, 'interactive elements present but no :focus-visible rule found in this file'))

    # Markup-level checks that apply to any file carrying HTML
    if re.search(r'<(div|span|p|li)\b[^>]*\bon[cC]lick', text):
        for m in re.finditer(r'<(div|span|p|li)\b[^>]*\bon[cC]lick', text):
            findings.append((path, text.count('\n', 0, m.start()) + 1, f'<{m.group(1)}> with onClick: use a <button> or an <a href> so keyboard and screen readers work'))
    for m in re.finditer(r'<(div|span)\b[^>]*role=["\']button["\']', text, re.I):
        findings.append((path, text.count('\n', 0, m.start()) + 1, f'<{m.group(1)} role="button">: use a native <button>'))
    for m in re.finditer(r'<a\b[^>]*target=["\']_blank["\'][^>]*>', text, re.I):
        if 'noopener' not in m.group(0) and 'noreferrer' not in m.group(0):
            findings.append((path, text.count('\n', 0, m.start()) + 1, 'target="_blank" without rel="noopener"'))
    for m in re.finditer(r'style=["\'][^"\']*(#[0-9a-fA-F]{3,8}|rgb|font-size|border-radius|box-shadow)[^"\']*["\']', text):
        findings.append((path, text.count('\n', 0, m.start()) + 1, 'inline style with a color or size: move it to a component class using tokens'))
    for m in re.finditer(r'<(input|select|textarea)\b[^>]*>', text, re.I):
        tag = m.group(0)
        if re.search(r'type=["\'](hidden|submit|button|reset)["\']', tag, re.I):
            continue
        idm = re.search(r'\bid=["\']([^"\']+)["\']', tag)
        labelled = ARIA_LABEL_RE.search(tag) or (idm and re.search(r'<label\b[^>]*for=["\']' + re.escape(idm.group(1)) + r'["\']', text)) or re.search(r'<label\b[^>]*>[^<]*' + re.escape(tag[:30]), text)
        wrapped = re.search(r'<label\b[^>]*>(?:(?!</label>).)*' + re.escape(tag), text, re.S)
        if not labelled and not wrapped and ':for=' not in text and 'htmlFor' not in text:
            findings.append((path, text.count('\n', 0, m.start()) + 1, f'<{m.group(1)}> without a <label for> or aria-label'))

    if re.search(r'<html\b', text, re.I):
        findings.extend(check_document(path, text))
    return findings


def check_document(path, text):
    """Checks for a complete HTML document: head metadata, landmarks, headings, images, fonts."""
    f = []
    head = re.search(r'<head\b.*?</head>', text, re.S | re.I)
    head = head.group(0) if head else text[:5000]
    body = re.search(r'<body\b.*', text, re.S | re.I)
    body = body.group(0) if body else text
    app = APP_MODE or bool(re.search(r'name=["\']robots["\'][^>]*noindex', head, re.I))

    def meta(name):
        m = re.search(r'<meta\b[^>]*(?:name|property)=["\']' + name + r'["\'][^>]*content=["\']([^"\']*)["\']', head, re.I) \
            or re.search(r'<meta\b[^>]*content=["\']([^"\']*)["\'][^>]*(?:name|property)=["\']' + name + r'["\']', head, re.I)
        return m.group(1) if m else None

    if not re.search(r'<html\b[^>]*\blang=', text, re.I):
        f.append((path, 1, '<html> without lang attribute'))
    if not re.search(r'<meta\b[^>]*charset', head, re.I):
        f.append((path, 1, 'missing <meta charset="utf-8">'))
    vp = meta('viewport')
    if not vp:
        f.append((path, 1, 'missing viewport meta'))
    elif 'width=device-width' not in vp:
        f.append((path, 1, 'viewport meta without width=device-width'))
    t = re.search(r'<title>(.*?)</title>', head, re.S | re.I)
    if not t or not t.group(1).strip():
        f.append((path, 1, 'missing <title>'))
    elif len(t.group(1).strip()) > 60:
        f.append((path, 1, f'<title> is {len(t.group(1).strip())} characters, keep it under 60'))
    d = meta('description')
    if d is None:
        f.append((path, 1, 'missing <meta name="description">'))
    elif not 70 <= len(d) <= 155:
        f.append((path, 1, f'meta description is {len(d)} characters, aim for 70 to 155'))
    if not meta('theme-color'):
        f.append((path, 1, 'missing <meta name="theme-color"> (set it to the surface color, with a dark variant)'))
    if not app:
        if not re.search(r'<link\b[^>]*rel=["\']canonical["\']', head, re.I):
            f.append((path, 1, 'missing <link rel="canonical"> (public page)'))
        for og in ('og:title', 'og:description', 'og:image'):
            if not meta(og):
                f.append((path, 1, f'missing {og} (public page); pass --app for an authenticated app'))
    if not re.search(r'<link\b[^>]*rel=["\'][^"\']*icon[^"\']*["\']', head, re.I):
        f.append((path, 1, 'missing favicon <link rel="icon">'))
    fonts = [l for l in re.findall(r'<link\b[^>]*fonts\.googleapis\.com[^>]*>', head, re.I) if 'stylesheet' in l]
    for link in fonts:
        if 'display=swap' not in link and 'display=optional' not in link:
            f.append((path, 1, 'Google Fonts link without display=swap'))
            break
    if fonts and not re.search(r'rel=["\']preconnect["\'][^>]*fonts\.gstatic\.com|fonts\.gstatic\.com[^>]*rel=["\']preconnect["\']', head, re.I):
        f.append((path, 1, 'Google Fonts used without <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'))
    if re.search(r'Material\+Symbols[^"\']*["\']', head) and 'icon_names=' not in head and '&text=' not in head:
        f.append((path, 1, 'Material Symbols loaded without a subset (icon_names= or text=): the full variable font is about 3 MB'))

    h1 = re.findall(r'<h1\b', body, re.I)
    if len(h1) == 0:
        f.append((path, 0, 'no <h1> in the page'))
    elif len(h1) > 1:
        f.append((path, 0, f'{len(h1)} <h1> elements, keep one'))
    levels = [int(x) for x in re.findall(r'<h([1-6])\b', body, re.I)]
    prev = 0
    for lv in levels:
        if lv > prev + 1 and prev:
            f.append((path, 0, f'heading level skipped (h{prev} to h{lv})'))
            break
        prev = lv
    if not re.search(r'<main\b|role=["\']main["\']', body, re.I):
        f.append((path, 0, 'no <main> landmark'))
    for m in re.finditer(r'<nav\b[^>]*>', body, re.I):
        if not ARIA_LABEL_RE.search(m.group(0)):
            f.append((path, body.count('\n', 0, m.start()) + 1, '<nav> without aria-label (several navs need names)'))
            break
    imgs = list(IMG_RE.finditer(body))
    for k, m in enumerate(imgs):
        tag = m.group(0)
        if not re.search(r'\bwidth=', tag) or not re.search(r'\bheight=', tag):
            f.append((path, body.count('\n', 0, m.start()) + 1, '<img> without width and height attributes (layout shift)'))
        if k >= 2 and 'loading=' not in tag:
            f.append((path, body.count('\n', 0, m.start()) + 1, '<img> below the first ones without loading="lazy"'))
    if not re.search(r'application/ld\+json', text) and not app:
        f.append((path, 0, 'no JSON-LD structured data on a public page (Organization, WebPage, Article, Product...)'))
    if not re.search(r'skip|aller au contenu', body, re.I):
        f.append((path, 0, 'no skip link to main content'))
    return f


APP_MODE = False


def main(argv):
    global APP_MODE
    if '--app' in argv:
        APP_MODE = True
        argv = [a for a in argv if a != '--app']
    if not argv:
        print(__doc__)
        return 2
    total = 0
    for f in iter_files(argv):
        for path, line, msg in check_file(f):
            total += 1
            where = f'{path}:{line}' if line else path
            print(f'{where}: {msg}')
    print(f'\n{total} finding(s).')
    return 1 if total else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
