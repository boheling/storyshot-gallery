// Shared data and builders for the CRISPR screen film. Loaded before each scene's own script.
window.Kit = {
  // A seeded random generator (mulberry32): the same picture every frame and every render.
  rng(seed = 1) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  },

  // NF2 exon 2, the real + strand (Ensembl GRCh38, transcript ENST00000338641, exon ENSE00001373499, 126 nt).
  // It is in frame: exon index 0 is the first base of codon 39. The guide and PAM are a real NGG site in it;
  // which guide the 2014 library used here is not claimed (say 示意 for the guide's position).
  NF2: {
    exon2: 'ATGAAGTGGAAAGGGAAGGACCTCTTTGATTTGGTGTGCCGGACTCTGGGGCTCCGAGAAACCTGGTTCTTTGGACTGCAGTACACAATCAAGGACACAGTGGCCTGGCTCAAAATGGACAAGAAG',
    guideStart: 19, guide: 'ACCTCTTTGATTTGGTGTGC', pamStart: 39, pam: 'CGG',
    cut: 36,               // Cas9 cuts between exon index 35 and 36: 3 bases before the PAM (…GGTG | TGC CGG)
    firstCodon: 39,        // codon number of exon index 0
    protein: 595,          // merlin, the NF2 protein, in amino acids
    // codons 46-60 as written, then after a +1 insertion of G at the cut (the base next to the cut, copied):
    // from codon 51 every codon is read wrong, and codon 85 is TGA, a stop. The protein ends after 84 amino acids.
    wt: [[46,'CTC','L'],[47,'TTT','F'],[48,'GAT','D'],[49,'TTG','L'],[50,'GTG','V'],[51,'TGC','C'],[52,'CGG','R'],[53,'ACT','T'],[54,'CTG','L'],[55,'GGG','G'],[56,'CTC','L'],[57,'CGA','R'],[58,'GAA','E'],[59,'ACC','T'],[60,'TGG','W']],
    ins: [[46,'CTC','L'],[47,'TTT','F'],[48,'GAT','D'],[49,'TTG','L'],[50,'GTG','V'],[51,'GTG','V'],[52,'CCG','P'],[53,'GAC','D'],[54,'TCT','S'],[55,'GGG','G'],[56,'GCT','A'],[57,'CCG','P'],[58,'AGA','R'],[59,'AAC','N'],[60,'CTG','L'],
      [61,'GTT','V'],[62,'CTT','L'],[63,'TGG','W'],[64,'ACT','T'],[65,'GCA','A'],[66,'GTA','V'],[67,'CAC','H'],[68,'AAT','N'],[69,'CAA','Q'],[70,'GGA','G'],[71,'CAC','H'],[72,'AGT','S'],[73,'GGC','G'],[74,'CTG','L'],[75,'GCT','A'],
      [76,'CAA','Q'],[77,'AAT','N'],[78,'GGA','G'],[79,'CAA','Q'],[80,'GAA','E'],[81,'GGT','G'],[82,'ACT','T'],[83,'GGA','G'],[84,'TCA','S'],[85,'TGA','*']],
    stopAt: 85,
    // a 3-base deletion right before the cut (GTG, codon 50) keeps the frame: one amino acid (V50) is lost
    del3: [[46,'CTC','L'],[47,'TTT','F'],[48,'GAT','D'],[49,'TTG','L'],[50,'TGC','C'],[51,'CGG','R'],[52,'ACT','T'],[53,'CTG','L'],[54,'GGG','G'],[55,'CTC','L']],
  },
  comp: (s) => s.replace(/[ACGT]/g, (c) => ({ A: 'T', T: 'A', G: 'C', C: 'G' }[c])),

  // Fill `el` (an empty .strand div) with one tile per letter; ' ' is an invisible gap; cls[i] adds a class
  // to tile i (or cls = function(i) => class). Tiles: 44 px on a 48 px pitch (.sm: 32 on 36).
  strand(el, seq, cls = {}, extra = '') {
    el.textContent = '';
    if (extra) el.classList.add(...extra.split(' '));
    return [...seq].map((ch, i) => {
      const t = document.createElement('span'), c = typeof cls === 'function' ? cls(i) : cls[i];
      t.className = 'nt' + (ch === ' ' ? ' gap' : '') + (c ? ' ' + c : '');
      t.textContent = ch === ' ' ? '' : ch;
      el.appendChild(t);
      return t;
    });
  },

  // Fill `el` (an empty .codons div) with codon boxes from rows like [46, 'CTC', 'L']; '*' shows as 终止.
  codons(el, rows, { numbers = true, wrongFrom = null } = {}) {
    el.textContent = '';
    return rows.map(([n, b3, aa]) => {
      const c = document.createElement('div');
      c.className = 'cod' + (aa === '*' ? ' stop' : wrongFrom != null && n >= wrongFrom ? ' wrong' : '');
      c.innerHTML = `<div class="b3">${b3}</div><div class="aa">${aa === '*' ? '终止' : aa}</div>` + (numbers ? `<div class="no">${n}</div>` : '');
      el.appendChild(c);
      return c;
    });
  },

  // A field of cells inside `el` (an empty .cellfield div of size w x h): a jittered grid of n cells of
  // radius r, from a seed. Returns [{ el, x, y }] (centres, in the field's px). `nf2` marks those cells.
  cells(el, { w, h, n, r = 26, seed = 7, nf2 = [] } = {}) {
    el.textContent = '';
    const rnd = Kit.rng(seed), cols = Math.max(1, Math.round(Math.sqrt(n * w / h))), rows = Math.ceil(n / cols);
    const dx = w / cols, dy = h / rows, out = [];
    for (let i = 0; i < n; i++) {
      const cx = (i % cols + 0.5) * dx + (rnd() - 0.5) * dx * 0.45, cy = (Math.floor(i / cols) + 0.5) * dy + (rnd() - 0.5) * dy * 0.45;
      const rr = r * (0.85 + rnd() * 0.3), d = document.createElement('div');
      d.className = 'cell' + (nf2.includes(i) ? ' nf2' : '');
      d.style.cssText = `left:${cx - rr}px;top:${cy - rr}px;width:${2 * rr}px;height:${2 * rr}px`;
      d.innerHTML = '<div class="nuc"></div><div class="bc"></div>';
      el.appendChild(d);
      out.push({ el: d, x: cx, y: cy, r: rr });
    }
    return out;
  },

  // Fill `el` (an empty .barcode div) with stripes drawn from a seed: one guide, written as a barcode.
  barcode(el, seed = 1, n = 14) {
    el.textContent = '';
    const rnd = Kit.rng(seed);
    for (let i = 0; i < n; i++) { const b = document.createElement('i'); if (rnd() < 0.35) b.className = 'w'; el.appendChild(b); }
    return el;
  },
};

// Cas9 seen from the side, 460 x 300: two lobes (recognition above, nuclease below) closing around the DNA,
// which runs through the channel at y = 150. Place it so the channel sits on the strand's centre line.
Kit.CAS9_SVG = `<svg viewBox="0 0 460 300" width="460" height="300" xmlns="http://www.w3.org/2000/svg">
  <path d="M 40 128 C 28 78, 70 22, 150 16 C 236 8, 330 18, 392 54 C 440 82, 446 118, 424 128 Z" fill="#8f9bd6" fill-opacity=".78"/>
  <path d="M 52 172 C 40 214, 84 276, 168 286 C 252 296, 350 280, 404 246 C 444 220, 440 184, 420 172 Z" fill="#6d78b3" fill-opacity=".8"/>
  <path d="M 70 92 C 110 56, 190 40, 260 46" fill="none" stroke="#c9d0f0" stroke-width="5" stroke-linecap="round" opacity=".55"/>
  <text x="230" y="98" text-anchor="middle" style="font: 800 52px var(--font)" fill="#1b2140">Cas9</text>
</svg>`;
