// Shared data and builders for the midterms explainer. Loaded before each scene's own script.
// Every number here was checked against the source named next to it; put that source on screen
// (class `credit`, data-layout-ignore) in the scene that shows the number.
window.Kit = {
  // A seeded random generator (mulberry32): the same picture every frame and every render.
  rng(seed = 1) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  },

  US: {
    house: 435,          // voting members of the House (Art. I creates the chamber; the 435 cap is the
                         // Reapportionment Act of 1929 — credit both where the number is on screen)
    senate: 100,         // two per state (Art. I §3)
    houseTerm: 2, senateTerm: 6, presTerm: 4,   // years
    senateUpEachTime: 'about a third',
    caSeats: 52, wySeats: 1,                    // 2020 census apportionment, in effect 2023–2033
    voteAge: 18,                                // 26th Amendment, 1971
  },
  // The 2026 ballot (regular contests; specials not counted)
  Y2026: { house: 435, senate: 33, governors: 36 },
  // Turnout, as a share of the voting-ELIGIBLE population
  // (Pew Research Center / U.S. Elections Project; U. of Florida Election Lab for 2024)
  TURNOUT: { pres2024: 64, mid2022: 45.1, mid2018: 48.1 },
  // A tie, decided by lot: Virginia's 94th House of Delegates district, 2017.
  // Both candidates finished on 11,608 votes; the winner's name was drawn from a bowl on 4 Jan 2018 (AP).
  VA_TIE: { year: 2017, votes: 11608 },
  // Did the President's party gain or lose House seats at each midterm since 1934?
  // 'down' = lost seats, 'up' = gained. 23 midterms, 20 down, 3 up (1934, 1998, 2002).
  // Source: The American Presidency Project, UCSB, "Seats in Congress Gained/Lost by the President's
  // Party in Mid-Term Elections".
  MIDTERMS: [[1934, 'up'], [1938, 'down'], [1942, 'down'], [1946, 'down'], [1950, 'down'], [1954, 'down'],
    [1958, 'down'], [1962, 'down'], [1966, 'down'], [1970, 'down'], [1974, 'down'], [1978, 'down'],
    [1982, 'down'], [1986, 'down'], [1990, 'down'], [1994, 'down'], [1998, 'up'], [2002, 'up'],
    [2006, 'down'], [2010, 'down'], [2014, 'down'], [2018, 'down'], [2022, 'down']],

  // One little person, `h` px tall, centred on (x, y) at its feet. `cls`: '', 'on', 'house',
  // 'senate', 'local', 'off' (see kit.css). Returns the element.
  person(parent, { x, y, h = 90, cls = '' } = {}) {
    const d = document.createElement('div'), hd = h * 0.34, bw = h * 0.62, bh = h * 0.6;
    d.className = 'person' + (cls ? ' ' + cls : '');
    d.style.cssText = `left:${x - h / 2}px;top:${y - h}px;width:${h}px;height:${h}px`;
    d.innerHTML = `<div class="hd" style="width:${hd}px;height:${hd}px;margin-left:${-hd / 2}px;top:0"></div>`
      + `<div class="bd" style="width:${bw}px;height:${bh}px;margin-left:${-bw / 2}px;top:${hd + h * 0.06}px"></div>`;
    parent.appendChild(d);
    return d;
  },

  // A crowd of `n` people filling an area w x h, in `cols` columns, slightly jittered from a seed.
  // Returns the elements in order, so a scene can light them up one by one.
  people(el, { n, cols, w, h, size = 90, seed = 3, cls = '' } = {}) {
    el.textContent = '';
    const rnd = Kit.rng(seed), rows = Math.ceil(n / cols), dx = w / cols, dy = h / rows, out = [];
    for (let i = 0; i < n; i++) {
      const x = (i % cols + 0.5) * dx + (rnd() - 0.5) * dx * 0.2;
      const y = (Math.floor(i / cols) + 1) * dy - dy * 0.1 + (rnd() - 0.5) * dy * 0.1;
      out.push(Kit.person(el, { x, y, h: size, cls }));
    }
    return out;
  },

  // A grid of `n` seat dots inside `el` (an empty .dots div): `size` px across on a `size + gap` pitch.
  dots(el, { n, cols, size = 18, gap = 8, cls = '' } = {}) {
    el.textContent = '';
    const out = [];
    for (let i = 0; i < n; i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (cls ? ' ' + cls : '');
      d.style.cssText = `left:${(i % cols) * (size + gap)}px;top:${Math.floor(i / cols) * (size + gap)}px;width:${size}px;height:${size}px`;
      el.appendChild(d);
      out.push(d);
    }
    return out;
  },

  // One line on a ballot sheet: a checkbox, the name of the office, and an optional count on the right.
  // `el` is the .ballot sheet; the row is placed at `top` px inside it.
  brow(el, { top, text, count = '', cls = '' } = {}) {
    const d = document.createElement('div');
    d.className = 'brow' + (cls ? ' ' + cls : '');
    d.style.top = `${top}px`;
    d.innerHTML = `<span class="box"></span><span>${text}</span>${count ? `<span class="cnt">${count}</span>` : ''}`;
    el.appendChild(d);
    return d;
  },
};

// The Capitol, flat and friendly, 760 x 300: a dome on a block with two wings. The left wing is the
// House, the right wing is the Senate (that is the real arrangement). Colour the wings from the scene.
Kit.CAPITOL_SVG = `<svg viewBox="0 0 760 300" width="760" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect id="cap-wl" x="20" y="150" width="230" height="130" rx="16" fill="#5ad1c4" fill-opacity=".30" stroke="#5ad1c4" stroke-width="6"/>
  <rect id="cap-wr" x="510" y="150" width="230" height="130" rx="16" fill="#c2a6ff" fill-opacity=".30" stroke="#c2a6ff" stroke-width="6"/>
  <rect x="250" y="120" width="260" height="160" rx="14" fill="#1f2b4a" stroke="#f3f1ea" stroke-width="6"/>
  <path d="M 300 120 C 300 44, 460 44, 460 120 Z" fill="#1f2b4a" stroke="#f3f1ea" stroke-width="6"/>
  <rect x="372" y="18" width="16" height="30" rx="6" fill="#ffc94a"/>
  <g stroke="#f3f1ea" stroke-width="5" opacity=".55">
    <line x1="300" y1="160" x2="300" y2="268"/><line x1="340" y1="160" x2="340" y2="268"/>
    <line x1="380" y1="160" x2="380" y2="268"/><line x1="420" y1="160" x2="420" y2="268"/>
    <line x1="460" y1="160" x2="460" y2="268"/>
  </g>
  <rect x="0" y="276" width="760" height="12" rx="6" fill="#f3f1ea" opacity=".8"/>
</svg>`;

// A ballot box, 300 x 300: a slot on top, a box under it.
Kit.BOX_SVG = `<svg viewBox="0 0 300 300" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="90" width="252" height="186" rx="22" fill="#1f2b4a" stroke="#f3f1ea" stroke-width="7"/>
  <rect x="86" y="66" width="128" height="22" rx="11" fill="#0b1226" stroke="#f3f1ea" stroke-width="6"/>
  <rect x="112" y="150" width="76" height="76" rx="12" fill="none" stroke="#ffc94a" stroke-width="7"/>
  <path d="M 128 190 l 22 22 l 36 -48" fill="none" stroke="#ffc94a" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
