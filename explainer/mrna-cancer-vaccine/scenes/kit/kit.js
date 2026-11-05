// Shared data and builders for the mRNA cancer-vaccine explainer. Loaded before each scene's script.
// Every number here is checked against the source named beside it; the scene that puts a number on
// screen also puts that source on screen (class `credit`, with data-layout-ignore).
window.Kit = {
  // A seeded random generator (mulberry32): the same picture every frame and every render.
  rng(seed = 1) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  },

  // ---- the numbers ----------------------------------------------------------------------------
  // Merck/Moderna INTerpath backgrounder, Aug 2026
  DRUG: {
    name: 'intismeran autogene',
    code: 'V940 / mRNA-4157',
    peptides: 34,            // "personalized synthetic mRNA coding for up to 34 neoantigens"
    dose: '1 mg',            // intismeran, intramuscular
    every: 3,                // weeks
    doses: 9,                // up to 9 doses
    pembroDose: '400 mg',    // pembrolizumab IV
    pembroEvery: 6,          // weeks
    pembroDoses: 9,
  },
  // INTerpath-001, ESMO 2026 LBA1 (24 Oct 2026; cutoff 30 Jun 2026; median follow-up 24.6 months)
  TRIAL: {
    id: 'INTerpath-001', nct: 'NCT05933577',
    n: 1137, nVax: 757, nCtrl: 380, ratio: '2:1',
    stage: 'IIB–IV 期，已完整切除的皮肤黑色素瘤',
    rfs: { vax: 82.2, ctrl: 70.0, hr: 0.58, lo: 0.45, hi: 0.75, p: '<0.001', evVax: 136, evCtrl: 111, cut: 42 },
    dmfs: { vax: 88.5, ctrl: 80.2, hr: 0.62, lo: 0.45, hi: 0.85, p: '0.002' },
    early: { hr: 0.99, lo: 0.66, hi: 1.49 },   // first 6 months
    late: { hr: 0.42, lo: 0.30, hi: 0.58, cut: 58 },  // after 6 months
    os: { hr: 0.77, lo: 0.45, hi: 1.31, p: '0.33' },  // immature, not significant
    ae: { g35vax: 23.6, g35ctrl: 20.3, fever: 52.2, feverCtrl: 8.2, pain: 51.0, painCtrl: 9.5 },
    made: 99,                // >99% of the 757 were manufactured successfully
    windowWeeks: 13,         // NCT05933577: ≤13 weeks from final resection to first dose
    followMonths: 24.6,
  },
  // The nine Phase 2/3 INTerpath trials (Merck/Moderna backgrounder, Aug 2026)
  TRIALS: [
    { organ: '黑色素瘤', n: 2, ph: '3 期 + 2 期', note: '已切除 / 晚期一线' },
    { organ: '肺癌', n: 4, ph: '3 期 ×3，2 期 ×1', note: '已切除 / 新辅助后 / 晚期' },
    { organ: '膀胱癌', n: 2, ph: '2 期', note: '切除后 / 高危非肌层浸润' },
    { organ: '肾癌', n: 1, ph: '2 期', note: '切除后高危' },
  ],
  // Who the trial let in (NCT05933577). `yes` = required, `no` = excluded.
  WHO: [
    { t: '皮肤黑色素瘤，IIB 到 IV 期', k: 'yes' },
    { t: '已经完整切除，目前无瘤', k: 'yes' },
    { t: '此前没做过系统治疗', k: 'yes' },
    { t: '手术到第一针 ≤ 13 周', k: 'yes' },
    { t: '有够做测序的肿瘤组织', k: 'yes' },
    { t: '眼部、黏膜黑色素瘤', k: 'no' },
    { t: '无法手术切除的转移', k: 'no' },
  ],

  // ---- builders -------------------------------------------------------------------------------
  // A grid of dots inside `el` (an empty .dots div). Returns them in order.
  dots(el, { n, cols, size = 22, gap = 12, cls = '' } = {}) {
    el.textContent = '';
    const out = [];
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (cls ? ' ' + cls : '');
      d.style.cssText = `left:${(i % cols) * (size + gap)}px;top:${Math.floor(i / cols) * (size + gap)}px;width:${size}px;height:${size}px`;
      el.appendChild(d); out.push(d);
    }
    return out;
  },

  // A cell centred on (x, y), `r` px across. `cls`: '' (healthy), 'tum', 'imm'. Returns the element.
  cell(parent, { x, y, r = 120, cls = '', nuc = true } = {}) {
    const d = document.createElement('div');
    d.className = 'cell' + (cls ? ' ' + cls : '');
    d.style.cssText = `left:${x - r / 2}px;top:${y - r / 2}px;width:${r}px;height:${r}px`;
    if (nuc) d.innerHTML = '<div class="nuc"></div>';
    parent.appendChild(d); return d;
  },

  // A neoantigen peptide tile, centred on (x, y).
  pep(parent, { x, y, s = 1, cls = '' } = {}) {
    const d = document.createElement('div'), w = 74 * s, h = 30 * s;
    d.className = 'pep' + (cls ? ' ' + cls : '');
    d.style.cssText = `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px`;
    parent.appendChild(d); return d;
  },

  // An mRNA strand as a self-drawing SVG wave from (x, y), `w` px wide. Draw it on by tweening the
  // returned path's stroke-dashoffset 1.1 → 0 with autoRound: false, after setting
  // `path.style.strokeDasharray = '1 1.2'` (a bare '1' leaves the round line cap painting a dot at
  // zero length, which the lint reports as svg_round_cap_hidden_dash).
  //
  // Three things about the geometry, learned the hard way — read them before picking `amp`:
  //  - `amp` is the CONTROL POINT offset, not the visual one: a cubic through these points swings
  //    only about 0.29 × amp. For a wave that reads at 1080p, ask for roughly 3.5 × what you want.
  //  - Keep `amp` at or under 0.5 × (w / waves). Past that the curve overshoots into hooks.
  //  - The box is `amp * 2 + 60` tall, so a large amp leaves dead padding around the curve. Clip the
  //    svg's viewBox/height and the wrapper's top/height to the curve before hanging a label off it,
  //    or the leader line will point into empty space.
  // `ticks` are placed by a sine approximation and drift off the real curve: pass `ticks: 0` and
  // place your own from the path if they must sit on the line.
  strand(parent, { x, y, w = 900, amp = 34, waves = 4, ticks = 12, cls = '' } = {}) {
    const h = amp * 2 + 60, ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const wrap = document.createElement('div');
    wrap.className = 'strand' + (cls ? ' ' + cls : '');
    wrap.style.cssText = `left:${x}px;top:${y - h / 2}px;width:${w}px;height:${h}px`;
    let d = `M 0 ${h / 2}`;
    const seg = w / waves;
    for (let i = 0; i < waves; i++) {
      const x0 = i * seg, s = i % 2 ? 1 : -1;
      d += ` C ${x0 + seg * 0.25} ${h / 2 + s * amp}, ${x0 + seg * 0.75} ${h / 2 - s * amp}, ${x0 + seg} ${h / 2}`;
    }
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d); p.setAttribute('pathLength', '1');
    p.style.strokeDasharray = '1';
    svg.appendChild(p);
    // codon ticks along the line, so it reads as a coding sequence and not as decoration
    const tg = document.createElementNS(ns, 'g');
    for (let i = 1; i <= ticks; i++) {
      const t = i / (ticks + 1), px = t * w, py = h / 2 + Math.sin(t * waves * Math.PI) * amp * 0.72;
      const l = document.createElementNS(ns, 'line');
      l.setAttribute('x1', px); l.setAttribute('y1', py - 11); l.setAttribute('x2', px); l.setAttribute('y2', py + 11);
      l.setAttribute('class', 'tick'); tg.appendChild(l);
    }
    svg.appendChild(tg);
    wrap.appendChild(svg); parent.appendChild(wrap);
    return { el: wrap, path: p, ticks: [...tg.children], h };
  },

  // A curve through points given in 0..1 of the plot box (x right, y up). Self-drawing like strand().
  curve(parent, { pts, x, y, w, h, cls = '' } = {}) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const wrap = document.createElement('div');
    wrap.className = 'curve' + (cls ? ' ' + cls : '');
    wrap.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${(p[0] * w).toFixed(1)} ${((1 - p[1]) * h).toFixed(1)}`).join(' ');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d); p.setAttribute('pathLength', '1');
    p.style.strokeDasharray = '1';
    svg.appendChild(p); wrap.appendChild(svg); parent.appendChild(wrap);
    return { el: wrap, path: p };
  },

  // The two recurrence-free survival curves, in 0..1 of a 0–24 month by 60–100% box.
  // SCHEMATIC between the published anchors: 100% at month 0, the two arms together through month 6
  // (HR 0.99), separating after it (HR 0.42), landing on the published 24-month 82.2% and 70.0%.
  // Any scene that draws these marks itself 示意.
  RFS_PTS(arm) {
    const y = (pct) => (pct - 60) / 40, x = (m) => m / 24;
    const vax = [[0, 100], [3, 96.5], [6, 93.4], [9, 91.3], [12, 89.1], [15, 87.2], [18, 85.3], [21, 83.6], [24, 82.2]];
    const ctrl = [[0, 100], [3, 96.2], [6, 92.8], [9, 88.6], [12, 84.3], [15, 80.2], [18, 76.4], [21, 73.0], [24, 70.0]];
    return (arm === 'vax' ? vax : ctrl).map(([m, pct]) => [x(m), y(pct)]);
  },

  // A numbered flow step. `items` = ['取组织', …]; returns the step elements, stacked at `gap` px.
  steps(parent, { items, x, y, gap = 104 } = {}) {
    return items.map((t, i) => {
      const d = document.createElement('div');
      d.className = 'step';
      d.style.cssText = `left:${x}px;top:${y + i * gap}px`;
      d.innerHTML = `<div class="ix">${i + 1}</div><div class="tx">${t}</div>`;
      parent.appendChild(d); return d;
    });
  },

  // A checklist row. `k`: 'yes' | 'no' | 'off'.
  chk(parent, { x, y, t, k = 'off' } = {}) {
    const d = document.createElement('div');
    d.className = 'chk ' + k;
    d.style.cssText = `left:${x}px;top:${y}px`;
    d.innerHTML = `<div class="mk"></div><div class="tx">${t}</div>`;
    parent.appendChild(d); return d;
  },

  // A hairline leader from (x1, y1) to (x2, y2), with a dot at the anchor end. Draw it on by
  // tweening `width` from 0 to its length — never scaleX, because the element already carries a
  // CSS rotate() and GSAP must not transform an element that has one.
  lead(parent, { x1, y1, x2, y2, dot = true } = {}) {
    const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const l = document.createElement('div');
    l.className = 'lead';
    l.style.cssText = `left:${x1}px;top:${y1}px;width:${len}px;transform:rotate(${ang}deg)`;
    parent.appendChild(l);
    let a = null;
    if (dot) {
      a = document.createElement('div');
      a.className = 'anchor';
      a.style.cssText = `left:${x2 - 5}px;top:${y2 - 5}px`;
      parent.appendChild(a);
    }
    return { line: l, anchor: a };
  },
};

// A tick mark / check glyph, for a checklist box (crimson × or teal ✓ drawn, not a font glyph).
Kit.MARK_OK = `<svg viewBox="0 0 40 40" width="34" height="34" style="position:absolute;left:0;top:0">
  <path d="M 9 21 l 7 7 l 15 -18" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
Kit.MARK_NO = `<svg viewBox="0 0 40 40" width="34" height="34" style="position:absolute;left:0;top:0">
  <path d="M 12 12 l 16 16 M 28 12 l -16 16" fill="none" stroke="#a3203a" stroke-width="5" stroke-linecap="round"/></svg>`;

// A skin cross-section, 900 x 360: epidermis, dermis, and a melanoma lesion sitting in it.
// Flat atlas drawing, no gradients. The lesion is #lesion so a scene can remove it (the resection).
// That id carries no scene prefix, so rename it on the way in — `.replace('id="lesion"',
// 'id="<scene>-lesion"')` — to keep the rule that the root id prefixes every other id in the file.
Kit.SKIN_SVG = `<svg viewBox="0 0 900 360" width="900" height="360" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="900" height="54" rx="6" fill="#efe9dc" stroke="#d9d4c7" stroke-width="2"/>
  <rect x="0" y="54" width="900" height="306" rx="6" fill="#f9f6f0" stroke="#d9d4c7" stroke-width="2"/>
  <g stroke="#d9d4c7" stroke-width="2" opacity=".8">
    <line x1="0" y1="140" x2="900" y2="140"/><line x1="0" y1="240" x2="900" y2="240"/>
  </g>
  <g id="lesion">
    <path d="M 380 54 C 330 54, 318 128, 360 170 C 400 212, 500 212, 538 168 C 578 124, 566 54, 520 54 Z"
      fill="rgba(163,32,58,.16)" stroke="#a3203a" stroke-width="5"/>
    <circle cx="430" cy="110" r="9" fill="#a3203a"/><circle cx="470" cy="140" r="9" fill="#a3203a"/>
    <circle cx="492" cy="96" r="9" fill="#a3203a"/><circle cx="406" cy="152" r="9" fill="#a3203a"/>
  </g>
</svg>`;
