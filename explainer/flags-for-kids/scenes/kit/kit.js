/* ──────────────────────────────────────────────────────────────────────────
   flags-of-discovery — shared builders. Loaded before every scene's script.

   Everything here is deterministic: frames are rendered by seeking a paused
   timeline, so there is no Math.random, no Date and no rAF anywhere in this
   film. Where scatter is needed, rnd(seed) gives the same scatter every run.

   Draw with these, not with new primitives, so the twelve scenes agree about
   what a banner, a leader line or a label looks like.
   ────────────────────────────────────────────────────────────────────────── */
window.Kit = (function () {
  const SVGNS = 'http://www.w3.org/2000/svg';

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const div = (cls, css, parent) => {
    const n = document.createElement('div');
    if (cls) n.className = cls;
    if (css) Object.assign(n.style, css);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* ── finding your own root ───────────────────────────────────────────────
     Storyshot mounts a scene as a sub-composition, and the HOST div it mounts
     into is given the SAME id as the scene's template root. So there are two
     elements with that id in the document, and getElementById returns the
     host — appending to it puts everything outside the styled .chart root,
     where none of this file's CSS matches. Always take the root this way. */
  const root = (id) => {
    const host = document.getElementById(id);
    if (host && host.classList.contains('chart')) return host;      // root kept its id
    const inside = host && host.querySelector('.chart');            // root mounted inside the host
    return inside || document.querySelector('.chart') || host;      // one scene per page, so this is safe
  };

  /* mulberry32: the same scatter on every render */
  function rnd(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── the ground ─────────────────────────────────────────────────────────
     grid + rhumb lines + paper tooth + vignette, in that stacking order.
     Call once at the top of every scene so all twelve sit on one sheet. */
  function paper(root, opts) {
    const o = Object.assign({ rose: [1480, 300], grid: 80 }, opts || {});
    const W = 1920, H = 1080;

    const g = div('grid', null, root);
    const gs = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }, g);
    for (let x = o.grid; x < W; x += o.grid)
      el('line', { x1: x, y1: 0, x2: x, y2: H, stroke: 'var(--rule)', 'stroke-width': x % (o.grid * 5) ? 0.8 : 1.5 }, gs);
    for (let y = o.grid; y < H; y += o.grid)
      el('line', { x1: 0, y1: y, x2: W, y2: y, stroke: 'var(--rule)', 'stroke-width': y % (o.grid * 5) ? 0.8 : 1.5 }, gs);

    /* rhumb lines: 16 bearings from one point, the way a portolan is ruled */
    const r = div('rhumbs', null, root);
    const rs = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }, r);
    const [cx, cy] = o.rose;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      el('line', {
        x1: cx, y1: cy, x2: cx + Math.cos(a) * 2400, y2: cy + Math.sin(a) * 2400,
        stroke: 'var(--rule)', 'stroke-width': i % 4 ? 0.9 : 1.6,
      }, rs);
    }
    el('circle', { cx, cy, r: 92, fill: 'none', stroke: 'var(--rule)', 'stroke-width': 1.4 }, rs);
    el('circle', { cx, cy, r: 148, fill: 'none', stroke: 'var(--rule)', 'stroke-width': 0.9 }, rs);

    div('tooth', null, root);
    div('vignette', null, root);
    return root;
  }

  /* ── text ───────────────────────────────────────────────────────────────── */
  const text = (root, cls, html, css) => {
    const n = div(cls, css, root);
    n.innerHTML = html;
    return n;
  };
  const kicker = (root, x, y, html) => text(root, 'kicker', html, { left: x + 'px', top: y + 'px' });
  const title  = (root, x, y, html, w) => text(root, 'title', html, { left: x + 'px', top: y + 'px', width: (w || 900) + 'px' });
  const lead   = (root, x, y, html, w) => text(root, 'lead', html, { left: x + 'px', top: y + 'px', width: (w || 760) + 'px' });
  const note   = (root, x, y, html, w) => text(root, 'note', html, { left: x + 'px', top: y + 'px', width: (w || 620) + 'px' });
  const label  = (root, x, y, html, hot) => text(root, 'label' + (hot ? ' hot' : ''), html, { left: x + 'px', top: y + 'px' });
  const year   = (root, x, y, html) => text(root, 'year', html, { left: x + 'px', top: y + 'px' });

  /* a source credit. Deliberately under the 28px floor, so it carries
     data-layout-ignore: a credit is not something the viewer has to read. */
  function credit(root, x, y, html) {
    const n = text(root, 'credit', html, { left: x + 'px', top: y + 'px' });
    n.setAttribute('data-layout-ignore', '');
    return n;
  }
  function schem(root, x, y, html) {
    const n = text(root, 'schem', html, { left: x + 'px', top: y + 'px' });
    n.setAttribute('data-layout-ignore', '');
    return n;
  }

  /* a rule that wipes in under a phrase. Tween scaleX 0 → 1. */
  const underline = (root, x, y, w) =>
    div('underline', { left: x + 'px', top: y + 'px', width: w + 'px' }, root);

  /* ── a leader line that draws itself ────────────────────────────────────
     pathLength=1 + dasharray 1 + tween strokeDashoffset 1 → 0 with
     autoRound:false, or GSAP rounds the offset and the line pops in. */
  function leader(root, x1, y1, x2, y2, hot) {
    const w = div('leader' + (hot ? ' hot' : ''), { left: 0, top: 0 }, root);
    const s = el('svg', { viewBox: '0 0 1920 1080', width: 1920, height: 1080 }, w);
    const p = el('path', {
      d: `M ${x1} ${y1} L ${x2} ${y2}`, pathLength: 1,
      style: 'stroke-dasharray:1;stroke-dashoffset:1',
    }, s);
    const dot = el('circle', { cx: x2, cy: y2, r: 5 }, s);
    return { wrap: w, path: p, dot };
  }

  /* ── a banner on a pole ─────────────────────────────────────────────────
     Used in scenes 1, 3, 4, 11 and 12, so it lives here. The cloth is one
     path whose trailing edge is scalloped by two waves; `phase` slides the
     waves so the cloth can be made to flutter by tweening one number.
     Returns { fig, pole, cloth, setPhase, w, h }. */
  function banner(root, x, y, opts) {
    const o = Object.assign({
      w: 300, h: 190, poleH: 560, fly: 1, cloth: 'var(--paper-2)',
      edge: 'var(--ink)', poleW: 11,
    }, opts || {});
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const s = el('svg', {
      viewBox: `-40 -40 ${o.w + 160} ${o.poleH + 80}`,
      width: o.w + 160, height: o.poleH + 80,
    }, fig);

    /* the pole, with a finial */
    const pole = el('g', {}, s);
    el('path', { class: 'ln', d: `M 0 0 V ${o.poleH}`, 'stroke-width': o.poleW }, pole);
    /* fill goes in an inline STYLE, not an attribute: `.chart .fig .ln` sets
       `fill: none`, and a CSS rule always beats a presentation attribute, so a
       `fill="…"` here leaves the cloth transparent and the chart grid shows
       straight through it. */
    el('circle', { class: 'ln', cx: 0, cy: -14, r: 11, style: 'fill:var(--paper-2)' }, pole);

    const cloth = el('g', {}, s);
    const body = el('path', { class: 'ln', stroke: o.edge, style: `fill:${o.cloth}` }, cloth);

    function pathFor(phase, fly) {
      const W = o.w * fly, H = o.h;
      /* trailing edge: two scallops whose depth travels with `phase` */
      const d1 = 26 * Math.sin(phase), d2 = 26 * Math.sin(phase + 2.1);
      return `M 0 4
              L ${W} ${4 + d1 * 0.5}
              C ${W - 26} ${H * 0.34 + d2} ${W + 26} ${H * 0.62 + d1} ${W} ${H - 2 + d2 * 0.5}
              L 0 ${H + 4} Z`;
    }
    const st = { phase: 0, fly: o.fly };
    const redraw = () => body.setAttribute('d', pathFor(st.phase, st.fly));
    redraw();

    return {
      fig, svg: s, pole, cloth, body, st,
      /* tween st.phase / st.fly and call this from onUpdate */
      redraw,
      w: o.w, h: o.h, poleH: o.poleH,
    };
  }

  /* ── words said aloud ───────────────────────────────────────────────────
     Four scenes have someone reading a text out at a shore, so speech gets
     one shape: a paper panel with the script written in it as strokes, never
     as legible words, and a tail pointing at whoever is speaking. Tween each
     returned path's strokeDashoffset 1 → 0 to write it.
     `tail` is [x, y] in page coordinates, or null for no tail. */
  function scroll(root, x, y, w, h, opts) {
    const o = Object.assign({ lines: 3, tail: null, seed: 5 }, opts || {});
    const wrap = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const s = el('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h, style: 'overflow:visible' }, wrap);
    el('path', {
      class: 'ln2 fill-paper',
      d: `M 10 0 h ${w - 20} q 10 0 10 10 v ${h - 20} q 0 10 -10 10 h ${-(w - 20)} q -10 0 -10 -10 v ${-(h - 20)} q 0 -10 10 -10 Z`,
    }, s);
    if (o.tail) {
      const tx = o.tail[0] - x, ty = o.tail[1] - y;
      const bx = Math.max(28, Math.min(w - 28, tx));
      el('path', { class: 'ln2 fill-paper', d: `M ${bx - 20} ${h - 2} L ${bx + 16} ${h - 2} L ${tx} ${ty} Z` }, s);
      el('line', { x1: bx - 19, y1: h - 2, x2: bx + 15, y2: h - 2, stroke: 'var(--paper-2)', 'stroke-width': 4 }, s);
    }
    const r = rnd(o.seed), paths = [];
    const top = (h - (o.lines - 1) * 26) / 2;
    for (let i = 0; i < o.lines; i++) {
      const wide = i === o.lines - 1 ? 0.62 : 1;
      const run = (w - 56) * wide;
      let d = `M 28 ${top + i * 26}`;
      for (let k = 0; k < 8; k++) d += ` q ${-9 + r() * 18} ${-12 + r() * 24} ${run / 8} 0`;
      paths.push(el('path', {
        class: 'hair', d, 'stroke-width': 3.2, pathLength: 1,
        style: 'stroke-dasharray:1;stroke-dashoffset:1',
      }, s));
    }
    return { wrap, svg: s, paths };
  }

  /* ── a wax seal: flat disc, ring, and a letter. Never a gradient. ──────── */
  function seal(root, x, y, r, html) {
    const w = div('seal', { left: (x - r) + 'px', top: (y - r) + 'px' }, root);
    const s = el('svg', { viewBox: `0 0 ${r * 2} ${r * 2}`, width: r * 2, height: r * 2 }, w);
    /* a scalloped rim, 18 lobes, deterministic */
    const n = 18, pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const rr = r * (i % 2 ? 0.885 : 0.985);
      pts.push(`${r + Math.cos(a) * rr},${r + Math.sin(a) * rr}`);
    }
    el('polygon', { points: pts.join(' '), fill: 'var(--accent)' }, s);
    el('circle', { cx: r, cy: r, r: r * 0.70, fill: 'none', stroke: 'var(--paper)', 'stroke-width': 2.4, opacity: .55 }, s);
    if (html) {
      const t = el('text', {
        x: r, y: r, 'text-anchor': 'middle', 'dominant-baseline': 'central',
        fill: 'var(--paper)', 'font-size': r * 0.78, 'font-family': 'var(--serif)',
      }, s);
      t.textContent = html;
    }
    return { wrap: w, svg: s };
  }

  /* ── a sheet of paper with ruled lines in it ────────────────────────────
     A blank rectangle on paper reads as a hole, so a sheet always gets rules
     and a heavier header rule. */
  function sheet(root, x, y, w, h, rules) {
    const n = div('sheet', { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }, root);
    const k = rules == null ? Math.max(3, Math.floor((h - 70) / 44)) : rules;
    for (let i = 0; i < k; i++) {
      const r = div('ruled', { top: (62 + i * 44) + 'px', left: '34px', right: '34px' }, n);
      if (i === 0) { r.style.height = '2px'; r.style.opacity = '1'; }
      r.style.width = (i === k - 1 ? (w - 68) * 0.52 : (w - 68)) + 'px';
    }
    return n;
  }

  /* ── a coastline, drawn as one wobbly ink line ──────────────────────────
     Scenes 1, 9 and 12 all put something on a shore; one shoreline keeps
     them the same place. `seed` picks the wobble, deterministically. */
  function shore(root, x, y, w, seed) {
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const s = el('svg', { viewBox: `0 0 ${w} 300`, width: w, height: 300 }, fig);
    const r = rnd(seed || 7);
    let d = 'M 0 150';
    const n = 26;
    for (let i = 1; i <= n; i++) {
      const px = (i / n) * w;
      const py = 150 + Math.sin(i * 0.9) * 13 + (r() - 0.5) * 20;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    /* the sea side gets a few parallel hatch lines, as on an engraved chart */
    const sea = el('g', {}, s);
    for (let k = 1; k <= 3; k++) {
      const off = k * 15;
      let hd = `M 0 ${150 + off}`;
      for (let i = 1; i <= n; i++) {
        const px = (i / n) * w;
        const py = 150 + off + Math.sin(i * 0.9) * 13 + (r() - 0.5) * 8;
        hd += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
      el('path', { class: 'hair', d: hd, opacity: 0.85 - k * 0.2 }, sea);
    }
    const line = el('path', { class: 'ln', d }, s);
    return { fig, svg: s, line, sea };
  }

  /* ── a person ───────────────────────────────────────────────────────────
     Chunky ink, no face. The film puts people on beaches six times and they
     must be the same people each time. `face` is -1 (left) or 1 (right);
     `arm` raises the forward arm (reading a proclamation, planting a pole). */
  function person(root, x, y, opts) {
    const o = Object.assign({ h: 118, face: 1, arm: 0, seed: 3 }, opts || {});
    const S = o.h / 118;                       // 118 is the drawn height
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const s = el('svg', { viewBox: '-40 -8 80 126', width: 80 * S, height: 134 * S }, fig);
    const g = el('g', { transform: `scale(${o.face},1)` }, s);
    /* a tunic with real width, not a single stroke: a stick figure reads as a
       placeholder, and this film puts people on a beach six times */
    el('path', {
      class: 'ln fill-paper',
      d: 'M -15 29 Q 0 24 15 29 L 20 76 Q 0 81 -20 76 Z',
    }, g);
    el('circle', { class: 'ln', cx: 0, cy: 13, r: 13.5, style: 'fill:var(--paper-2)' }, g);
    el('path', { class: 'ln', d: 'M -9 78 L -13 110 M 9 78 L 14 110' }, g);   // legs
    el('path', { class: 'ln2', d: 'M -13 110 h -7 M 14 110 h 7' }, g);        // feet
    /* back arm always hangs; forward arm lifts by `arm` (0 → 1) */
    el('path', { class: 'ln', d: 'M -15 34 L -23 64' }, g);
    const front = el('path', { class: 'ln', d: 'M 15 34 L 24 62' }, g);
    const setArm = (k) => {
      const ax = 24 + 8 * k, ay = 62 - 50 * k;
      front.setAttribute('d', `M 15 34 L ${ax.toFixed(1)} ${ay.toFixed(1)}`);
    };
    setArm(o.arm);
    return { fig, svg: s, g, front, setArm, h: o.h };
  }

  /* ── Portugal's padrão: a stone pillar, cross on top, arms and text cut in ── */
  function pillar(root, x, y, opts) {
    const o = Object.assign({ h: 420, w: 96 }, opts || {});
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const W = o.w, H = o.h;
    const s = el('svg', { viewBox: `${-W * 0.45} ${-H * 0.46} ${W * 1.9} ${H * 1.52}`, width: W * 1.9, height: H * 1.52 }, fig);
    const g = el('g', {}, s);
    /* the shaft, slightly tapered, and a base block */
    el('path', { class: 'ln fill-stone', d: `M ${-W / 2} ${H} L ${-W / 2 + 7} 0 L ${W / 2 - 7} 0 L ${W / 2} ${H} Z` }, g);
    el('path', { class: 'ln fill-stone', d: `M ${-W * 0.66} ${H} h ${W * 1.32} v ${H * 0.085} h ${-W * 1.32} Z` }, g);
    /* the cross of the Order of Christ, on a short neck */
    const cy = -H * 0.10, a = W * 0.30, b = W * 0.105;
    el('path', {
      class: 'ln fill-paper',
      d: `M ${-b} ${cy + a} L ${-b} ${cy + b} L ${-a} ${cy + b} L ${-a} ${cy - b}
          L ${-b} ${cy - b} L ${-b} ${cy - a} L ${b} ${cy - a} L ${b} ${cy - b}
          L ${a} ${cy - b} L ${a} ${cy + b} L ${b} ${cy + b} L ${b} ${cy + a} Z`,
    }, g);
    /* the royal arms: a shield outline with a faint quartering */
    const shield = el('g', { transform: `translate(0,${H * 0.21})` }, g);
    const sw = W * 0.46, sh = W * 0.52;
    el('path', { class: 'ln2 fill-paper', d: `M ${-sw} ${-sh} h ${sw * 2} v ${sh * 0.95} q 0 ${sh * 0.78} ${-sw} ${sh * 1.05} q ${-sw} ${-sh * 0.27} ${-sw} ${-sh * 1.05} Z` }, shield);
    el('path', { class: 'hair', d: `M 0 ${-sh} V ${sh * 0.9} M ${-sw} ${-sh * 0.1} H ${sw}` }, shield);
    /* cut inscription: three ruled lines of text that are not meant to be read */
    const insc = el('g', { transform: `translate(0,${H * 0.56})` }, g);
    for (let i = 0; i < 3; i++) {
      const wi = W * (i === 2 ? 0.30 : 0.44);
      el('line', { class: 'hair', x1: -wi, y1: i * W * 0.17, x2: wi, y2: i * W * 0.17, 'stroke-width': 3.4 }, insc);
    }
    return { fig, svg: s, g, shield, insc, h: H, w: W };
  }

  /* ── a planted cross: France's at Gaspé, England's at Cape Henry ────────
     `board` adds the nailed sign above the crossbar that carried the words. */
  function cross(root, x, y, opts) {
    const o = Object.assign({ h: 440, arm: 150, board: true }, opts || {});
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const H = o.h, A = o.arm;
    const s = el('svg', { viewBox: `${-A - 50} -120 ${A * 2 + 100} ${H + 180}`, width: A * 2 + 100, height: H + 180 }, fig);
    const g = el('g', {}, s);
    const tw = 17;                               // timber width
    el('path', { class: 'ln fill-wood', d: `M ${-tw} ${H} h ${tw * 2} V -70 h ${-tw * 2} Z` }, g);
    const by = H * 0.26;
    el('path', { class: 'ln fill-wood', d: `M ${-A} ${by - tw} h ${A * 2} v ${tw * 2} h ${-A * 2} Z` }, g);
    const board = el('g', {}, g);
    if (o.board) {
      el('path', { class: 'ln2 fill-paper', d: `M ${-A * 0.72} ${by - tw - 86} h ${A * 1.44} v 66 h ${-A * 1.44} Z` }, board);
    }
    return { fig, svg: s, g, board, h: H, arm: A, barY: by };
  }

  /* ── a tobacco leaf: England's claim, in the only material that paid ───── */
  function leaf(root, x, y, opts) {
    const o = Object.assign({ w: 240, h: 360 }, opts || {});
    const fig = div('fig', { left: x + 'px', top: y + 'px' }, root);
    const W = o.w, H = o.h;
    const s = el('svg', { viewBox: `${-W * 0.6} ${-20} ${W * 1.2} ${H + 40}`, width: W * 1.2, height: H + 40 }, fig);
    const g = el('g', {}, s);
    el('path', {
      class: 'ln', style: 'fill:var(--england);fill-opacity:.14',
      d: `M 0 ${H} C ${-W * 0.12} ${H * 0.72} ${-W * 0.52} ${H * 0.60} ${-W * 0.46} ${H * 0.32}
          C ${-W * 0.41} ${H * 0.08} ${-W * 0.16} 0 0 0
          C ${W * 0.16} 0 ${W * 0.41} ${H * 0.08} ${W * 0.46} ${H * 0.32}
          C ${W * 0.52} ${H * 0.60} ${W * 0.12} ${H * 0.72} 0 ${H} Z`,
    }, g);
    el('path', { class: 'ln2', d: `M 0 ${H} V ${H * 0.04}` }, g);          // midrib
    for (let i = 1; i <= 5; i++) {                                          // veins
      const vy = H * (0.10 + i * 0.125), sp = W * 0.30 * (1 - Math.abs(i - 2.6) / 5.5);
      el('path', { class: 'hair', d: `M 0 ${vy} q ${-sp} ${-H * 0.045} ${-sp * 1.18} ${-H * 0.10}` }, g);
      el('path', { class: 'hair', d: `M 0 ${vy} q ${sp} ${-H * 0.045} ${sp * 1.18} ${-H * 0.10}` }, g);
    }
    return { fig, svg: s, g, w: W, h: H };
  }

  return {
    el, div, rnd, root, paper, text, kicker, title, lead, note, label, year,
    credit, schem, underline, leader, banner, seal, sheet, shore, scroll,
    person, pillar, cross, leaf,
  };
})();
