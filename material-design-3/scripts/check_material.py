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

The checker is intentionally simple (regular expressions). It reports candidates for
review, not certainties. Exit code is 1 when at least one finding is reported.
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
        if m and 'var(--md-' not in line and not re.search(r'(href|src|xlink:href|url\(|id=|#\w+\s*\{|&#)', line):
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
    return findings


def main(argv):
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
