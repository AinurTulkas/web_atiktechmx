/* Atik Tech · Caja de bits
 *
 * La caja es una pantalla de 8×8 bits dentro de un marco. Muestra una forma a la vez
 * (una A, la escalera o el logo de una app) y cambia de forma con un barrido diagonal;
 * cada cierto número de cambios entra una transición de pistas de circuito.
 *
 *   <svg class="bitbox" data-bitbox="a04"></svg>                     → forma fija
 *   <svg class="bitbox" data-bitbox-seq="a04,app:tzibal,a11"></svg>  → secuencia animada
 *   AtikBitbox.mount(svg, { sequence:[...], hold:2000, circuitEvery:4 })
 *
 * Colores (variables CSS sobre el svg o un ancestro):
 *   --bb-frame  marco · --bb-hi  bit arriba · --bb-lo  bit abajo · --bb-off  bit apagado
 * Las formas de app traen sus propios hi/lo (el color de cada app).
 */
(function () {
  const N = 8, INSET = 11, GAP = 2, CS = (100 - 2 * INSET - GAP * (N - 1)) / N;
  const X = i => INSET + i * (CS + GAP), C = i => X(i) + CS / 2;
  const NS = 'http://www.w3.org/2000/svg';
  const STEP_MS = 34;            // retraso por diagonal del barrido (15 diagonales ≈ 0.5 s)

  // '#' encendido · '*' bit activo (siempre brillante) · '.' apagado
  const G = {
    stair: ['Escalera', ['......**', '......**', '....####', '....####', '..######', '..######', '########', '########']],
    a01: ['Clásica',          ['...##...', '..####..', '.##..##.', '.##..##.', '##....##', '########', '##....##', '##....##']],
    a02: ['Recta',            ['.######.', '##....##', '##....##', '##....##', '########', '##....##', '##....##', '##....##']],
    a03: ['Redonda',          ['..####..', '.##..##.', '##....##', '##....##', '########', '##....##', '##....##', '##....##']],
    a04: ['Lambda',           ['...##...', '..####..', '.##..##.', '.##..##.', '.##..##.', '##....##', '##....##', '##....##']],
    a05: ['Lambda con bit',   ['...##...', '..####..', '.##..##.', '.##..##.', '##....##', '##....##', '##.**.##', '##.**.##']],
    a06: ['Negrita',          ['..####..', '.######.', '###..###', '###..###', '########', '########', '###..###', '###..###']],
    a07: ['Fina',             ['...##...', '..#..#..', '..#..#..', '.#....#.', '.######.', '.#....#.', '#......#', '#......#']],
    a08: ['Esténcil',         ['..#..#..', '.##..##.', '.##..##.', '##....##', '########', '##....##', '##....##', '##....##']],
    a09: ['Pirámide',         ['...##...', '..####..', '.######.', '.##..##.', '########', '###..###', '###..###', '###..###']],
    a10: ['Cursiva',          ['....##..', '...####.', '..##..##', '.##..##.', '.######.', '.##..##.', '##..##..', '##..##..']],
    a11: ['Minúscula a',      ['........', '.######.', '......##', '.#######', '##....##', '##....##', '##...###', '.####.##']],
    a12: ['Minúscula ɑ',      ['........', '........', '.####.##', '##..####', '##...###', '##...###', '##..####', '.####.##']],
    a13: ['Recta fina',       ['.######.', '#......#', '#......#', '#......#', '########', '#......#', '#......#', '#......#']],
    a14: ['Redonda fina',     ['..####..', '.#....#.', '#......#', '#......#', '########', '#......#', '#......#', '#......#']],
    a15: ['Lambda fina',      ['...##...', '...##...', '..#..#..', '..#..#..', '.#....#.', '.#....#.', '#......#', '#......#']],
    a16: ['Cursiva fina',     ['.....#..', '....#.#.', '..#...#.', '..#...#.', '.#####..', '.#...#..', '#...#...', '#...#...']],
    a17: ['Minúscula a fina', ['........', '.#####..', '......#.', '.######.', '#.....#.', '#.....#.', '#....##.', '.####.##']],
    a18: ['Minúscula ɑ fina', ['........', '........', '.####..#', '#....#.#', '#.....##', '#.....##', '#....#.#', '.####..#']],
  };

  // Apps: forma en 8×8 + color propio (brillante arriba, profundo abajo).
  const APPS = {
    tzibal:     ['Tzibal',           '#6CB8FF', '#1466C2', ['########', '#......#', '#.....##', '#....#.#', '##..#..#', '#.##...#', '#......#', '########']],
    taanwallet: ['Taan Wallet',      '#5FCB8C', '#146B3A', ['........', '########', '#......#', '########', '#......#', '#....#.#', '#......#', '########']],
    xiimbal:    ['Xíimbal',          '#5CC9D2', '#0A6068', ['....#...', '.#####..', '#...#...', '#......#', '#......#', '#......#', '.#....#.', '..####..']],
    ixkan:      ['Ixkan',            '#E2E2E2', '#6B6B6B', ['.......#', '....#..#', '....#..#', '.#..#..#', '.#..#..#', '.#..#..#', '.#..#..#', '........']],
    koolcollect:['KoolCollect',      '#8FA6D6', '#3A5180', ['...##...', '...##...', '...##...', '.######.', '..####..', '...##...', '........', '########']],
    chakbal:    ['Chakbal',          '#F0A35E', '#8E4106', ['..####..', '.#....#.', '########', '#..#...#', '#..#...#', '#..#...#', '#..#...#', '########']],
    meyaj:      ['Meyaj',            '#6BD48F', '#10652F', ['.######.', '.######.', '.####...', '.######.', '.#......', '.#......', '.#......', '.#......']],
    citas:      ['Control de Citas', '#B794F6', '#5521B5', ['..####..', '.#....#.', '#..#...#', '#..#...#', '#..###.#', '#......#', '.#....#.', '..####..']],
    admin:      ['Atik Admin',       '#A5A4FF', '#4644C9', ['...##...', '.#....#.', '..####..', '#.#..#.#', '#.#..#.#', '..####..', '.#....#.', '...##...']],
    taakpass:   ['TaakPass',         '#86AEF5', '#1F55B8', ['..####..', '.#....#.', '.#....#.', '########', '###..###', '###..###', '########', '########']],
    // Sistemas
    travelshield:['Travel Shield',   '#6EA0F0', '#0B3C8C', ['########', '#......#', '#.####.#', '#.####.#', '#.####.#', '.#.##.#.', '..#..#..', '...##...']],
    mirebranda: ['MiRebranda',       '#63D3C4', '#0B5F5A', ['########', '#......#', '#.##...#', '#.##...#', '#.....##', '#..#.###', '#.######', '########']],
    adomicilio: ['A Domicilio',      '#FB7A93', '#8F0F2E', ['...##...', '..####..', '.######.', '########', '.#....#.', '.#.##.#.', '.#.##.#.', '.######.']],
    pathmentor: ['PathMentor',       '#FDBA74', '#C2410C', ['...#....', '...##...', '..###...', '..####..', '.##.###.', '.#...##.', '.##..##.', '..####..']],
  };

  function get(key) {
    if (key.startsWith('app:')) {
      const a = APPS[key.slice(4)];
      if (!a) throw new Error('bitbox: app desconocida ' + key);
      return { key, name: a[0], hi: a[1], lo: a[2], rows: a[3] };
    }
    const g = G[key];
    if (!g) throw new Error('bitbox: forma desconocida ' + key);
    return { key, name: g[0], rows: g[1] };
  }

  // Estilo de un bit según su carácter, su fila y los colores de la forma
  function bitStyle(g, r, c) {
    const ch = g.rows[r][c], hi = g.hi || 'var(--bb-hi)', lo = g.lo || 'var(--bb-lo)';
    if (ch === '*') return 'fill:' + hi;
    if (ch === '#') return 'fill:color-mix(in srgb, ' + hi + ' ' + Math.round((1 - r / (N - 1)) * 100) + '%, ' + lo + ')';
    return 'fill:var(--bb-off)';
  }

  function build(svg) {
    svg.setAttribute('viewBox', '0 0 100 100');
    if (!svg.getAttribute('role')) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Atik Tech'); }
    svg.innerHTML = '';
    const frame = document.createElementNS(NS, 'rect');
    frame.setAttribute('x', 1.8); frame.setAttribute('y', 1.8);
    frame.setAttribute('width', 96.4); frame.setAttribute('height', 96.4); frame.setAttribute('rx', 15);
    frame.setAttribute('style', 'fill:none;stroke:var(--bb-frame);stroke-width:3.6');
    svg.appendChild(frame);
    const bits = [];
    for (let r = 0; r < N; r++) {
      bits.push([]);
      for (let c = 0; c < N; c++) {
        const b = document.createElementNS(NS, 'rect');
        b.setAttribute('x', X(c)); b.setAttribute('y', X(r));
        b.setAttribute('width', CS); b.setAttribute('height', CS); b.setAttribute('rx', 1.4);
        svg.appendChild(b); bits[r].push(b);
      }
    }
    return bits;
  }

  function paint(bits, g) {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) bits[r][c].setAttribute('style', bitStyle(g, r, c));
  }

  // Pistas de circuito: entran por la izquierda, giran a 45° y terminan en un pad.
  function circuit(svg, color, done) {
    const layer = document.createElementNS(NS, 'g');
    // Pistas paralelas (como un bus): filas separadas por dos y el mismo quiebre, para que nunca se crucen.
    const d = Math.random() < 0.5 ? -1 : 1, rows = d > 0 ? [1, 3, 5] : [2, 4, 6], c1 = 1 + Math.floor(Math.random() * 2);
    rows.forEach((r, k) => {
      const r2 = r + d, c2 = c1 + 1, c3 = 5 + Math.floor(Math.random() * 3);
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', `M2 ${C(r)} H${C(c1)} L${C(c2)} ${C(r2)} H${C(c3)}`);
      p.setAttribute('style', `fill:none;stroke:${color};stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round`);
      const pad = document.createElementNS(NS, 'circle');
      pad.setAttribute('cx', C(c3)); pad.setAttribute('cy', C(r2)); pad.setAttribute('r', 2.6);
      pad.setAttribute('style', `fill:none;stroke:${color};stroke-width:1.5;opacity:0`);
      layer.appendChild(p); layer.appendChild(pad);
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 520, delay: k * 90, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' });
      pad.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: 520 + k * 90, fill: 'forwards' });
    });
    svg.appendChild(layer);
    setTimeout(done, 700);
    setTimeout(() => layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'forwards' }).onfinish = () => layer.remove(), 900);
  }

  function mount(svg, opts = {}) {
    const seq = (opts.sequence || ['a04']).map(get);
    const hold = opts.hold || 2000, every = opts.circuitEvery ?? 4;
    const bits = build(svg);
    let i = 0, n = 0, timer = null, stopped = false;
    paint(bits, seq[0]);
    svg.dataset.glyph = seq[0].name;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seq.length < 2 || reduce) return { stop() {} };

    function sweep(g) {
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const st = bitStyle(g, r, c), el = bits[r][c];
        setTimeout(() => el.setAttribute('style', st), (r + c) * STEP_MS);
      }
      svg.dataset.glyph = g.name;
      svg.dispatchEvent(new CustomEvent('bitbox:change', { detail: { key: g.key, name: g.name } }));
    }
    function next() {
      if (stopped) return;
      if (document.hidden) { timer = setTimeout(next, hold); return; }
      i = (i + 1) % seq.length; n++;
      const g = seq[i];
      if (every && n % every === 0) {
        paint(bits, { rows: Array(N).fill('........') });        // se apaga, entran las pistas
        circuit(svg, g.hi || 'var(--bb-hi)', () => sweep(g));
        timer = setTimeout(next, hold + 700);
      } else {
        sweep(g);
        timer = setTimeout(next, hold);
      }
    }
    timer = setTimeout(next, hold);
    return { stop() { stopped = true; clearTimeout(timer); } };
  }

  function auto() {
    document.querySelectorAll('svg[data-bitbox]').forEach(svg => mount(svg, { sequence: [svg.dataset.bitbox] }));
    document.querySelectorAll('svg[data-bitbox-seq]').forEach(svg => mount(svg, {
      sequence: svg.dataset.bitboxSeq.split(',').map(s => s.trim()),
      hold: +svg.dataset.hold || 2000,
      circuitEvery: svg.dataset.circuit !== undefined ? +svg.dataset.circuit : 4,
    }));
  }

  // Dibuja un cuadro fijo: { rows, hi?, lo? } (útil para storyboards e impresos).
  function draw(svg, glyph) { paint(build(svg), glyph); }

  window.AtikBitbox = { mount, get, draw, glyphs: G, apps: APPS, N, geom: { X, C, CS } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
