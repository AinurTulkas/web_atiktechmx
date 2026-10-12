"""Genera los SVG estáticos de la caja de bits a partir de assets/bitbox.js (una sola fuente de las formas).

    python scripts/make_bitbox_svgs.py

Escribe assets/favicon.svg y assets/brand/caja-<forma>-<tema>.svg.
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = (ROOT / 'assets' / 'bitbox.js').read_text(encoding='utf-8')
N, INSET, GAP = 8, 11, 2
CS = (100 - 2 * INSET - GAP * (N - 1)) / N

THEMES = {  # marco, bit arriba, bit abajo, bit apagado, fondo (None = transparente)
    'oscuro': ('#22A58A', '#5FD6BB', '#0B6B54', 'rgba(95,214,187,.10)', None),
    'claro':  ('#0E8F73', '#1FA184', '#06463A', 'rgba(14,143,115,.09)', None),
    'mono':   ('#000000', '#000000', '#000000', 'rgba(0,0,0,.08)', None),
}

def rows_of(key):
    m = re.search(rf"\b{key}:\s*\['[^']*',\s*(\[[^\]]*\])", JS)
    return json.loads(m.group(1).replace("'", '"'))

def mix(a, b, t):  # t=1 → a, t=0 → b
    a, b = [int(a[i:i + 2], 16) for i in (1, 3, 5)], [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{round(x * t + y * (1 - t)):02X}' for x, y in zip(a, b))

def svg(key, theme, bg=None):
    frame, hi, lo, off, _ = THEMES[theme]
    rows = rows_of(key)
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">']
    if bg: out.append(f'<rect width="100" height="100" rx="18" fill="{bg}"/>')
    out.append(f'<rect x="1.8" y="1.8" width="96.4" height="96.4" rx="15" fill="none" stroke="{frame}" stroke-width="3.6"/>')
    for r in range(N):
        for c in range(N):
            ch = rows[r][c]
            fill = hi if ch == '*' else mix(hi, lo, 1 - r / (N - 1)) if ch == '#' else off
            if ch == '.' and theme == 'mono': continue
            x, y = INSET + c * (CS + GAP), INSET + r * (CS + GAP)
            out.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{CS:.2f}" height="{CS:.2f}" rx="1.4" fill="{fill}"/>')
    out.append('</svg>')
    return '\n'.join(out) + '\n'

if __name__ == '__main__':
    brand = ROOT / 'assets' / 'brand'
    brand.mkdir(exist_ok=True)
    # Favicon: fondo oscuro propio para que se vea en pestañas claras y oscuras
    (ROOT / 'assets' / 'favicon.svg').write_text(svg('a04', 'oscuro', bg='#0D1A16'), encoding='utf-8')
    for key in ('a04', 'stair'):
        for theme in THEMES:
            (brand / f'caja-{key}-{theme}.svg').write_text(svg(key, theme), encoding='utf-8')
    print('ok')
