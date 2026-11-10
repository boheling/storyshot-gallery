// Scan <type>/<example>/ folders and write gallery.json for index.html.
//
// The MP4s are NOT in this repository any more — they are release assets (tag `media`),
// because keeping every re-render in git had taken the history to 400 MB and it only grew.
// So a film is identified by its storyboard.yaml AND its poster.jpg — both small, both in
// the repo — rather than by a video file that may not be on disk, and its duration is
// remembered from the previous gallery.json when ffprobe has nothing local to measure.
// Running this on a fresh clone must not empty the gallery, and a half-finished folder
// with a storyboard but no poster must not walk into it either.
// Each example folder: poster.jpg, storyboard.yaml, notes.md, optional meta.json
// ({ title, site, url }), steps/ (docs: GIFs, PNGs, README.md) and scenes/ (explainers: the scene files).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = [
  { id: 'promo', label: 'Promos', blurb: 'Short and tightly cut: one message, a browser frame on a backdrop, music.' },
  { id: 'tutorial', label: 'Tutorials', blurb: 'Paced to follow along: one narrated action per step, the camera following each click, a second example, a recap.' },
  { id: 'course', label: 'Lessons', blurb: 'Explain the why: concept cards, the idea shown live, a question to check understanding.' },
  { id: 'explainer', label: 'Explainers', blurb: 'No website and nothing recorded: animations the agent writes and times to the narration, in one world.' },
  { id: 'docs', label: 'Help-center docs', blurb: 'Per-step GIFs and screenshots cropped to the action, plus a ready-to-paste article.' },
];
const seconds = (f) => { try { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()); } catch { return null; } };
// what the last build recorded, so a clone without the media keeps every film's length
const PREV = (() => {
  try {
    const seen = new Map();
    for (const t of JSON.parse(fs.readFileSync(path.join(ROOT, 'gallery.json'), 'utf8'))) {
      for (const i of t.items) seen.set(i.id, i.seconds);
    }
    return seen;
  } catch { return new Map(); }
})();
const firstLine = (f, re) => { try { return (fs.readFileSync(f, 'utf8').match(re) ?? [])[1]?.trim() ?? null; } catch { return null; } };
// the request in notes.md: a "**Request:** …" line, or the first paragraph under a "## (User) request" heading
const requestOf = (f) => {
  let t; try { t = fs.readFileSync(f, 'utf8'); } catch { return null; }
  const m = t.match(/\*\*(?:User )?[Rr]equest:?\*\*:?\s*(.+)/) ?? t.match(/^#+\s*(?:User )?[Rr]equest\s*\n+([\s\S]+?)(?:\n\s*\n|$)/m);
  return m ? m[1].trim().replace(/^["“]|["”]$/g, '') : null;
};

const gallery = TYPES.map((t) => {
  const dir = path.join(ROOT, t.id);
  const items = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'storyboard.yaml'))
      && fs.existsSync(path.join(dir, d, 'poster.jpg'))).sort().map((d) => {
    const rel = `${t.id}/${d}`, abs = path.join(dir, d);
    const meta = fs.existsSync(path.join(abs, 'meta.json')) ? JSON.parse(fs.readFileSync(path.join(abs, 'meta.json'), 'utf8')) : {};
    const yaml = path.join(abs, 'storyboard.yaml');
    return {
      id: rel,
      title: meta.title ?? d,
      site: meta.site ?? null,
      lang: meta.lang ?? 'en',
      url: meta.url ?? firstLine(yaml, /^url:\s*(\S+)/m),
      request: meta.request ?? requestOf(path.join(abs, 'notes.md')),
      seconds: seconds(path.join(abs, 'video.mp4')) ?? PREV.get(rel) ?? null,
      video: `${rel}/video.mp4`, poster: `${rel}/poster.jpg`, storyboard: `${rel}/storyboard.yaml`, notes: `${rel}/notes.md`,
      article: fs.existsSync(path.join(abs, 'steps', 'README.md')) ? `${rel}/steps/README.md` : null,
    };
  });
  return { ...t, items };
});
fs.writeFileSync(path.join(ROOT, 'gallery.json'), JSON.stringify(gallery, null, 1));
console.log(gallery.map((t) => `${t.id}: ${t.items.length}`).join(', '));
