// Scan <type>/<example>/ folders and write gallery.json for index.html.
// Each example folder: video.mp4, poster.jpg, storyboard.yaml, notes.md, optional meta.json
// ({ title, site, url }) and steps/ (docs: GIFs, PNGs, README.md).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const TYPES = [
  { id: 'promo', label: 'Promos', blurb: 'Short and tightly cut: one message, a browser frame on a backdrop, music.' },
  { id: 'tutorial', label: 'Tutorials', blurb: 'Paced to follow along: one narrated action per step, the camera following each click, a second example, a recap.' },
  { id: 'course', label: 'Lessons', blurb: 'Explain the why: concept cards, the idea shown live, a question to check understanding.' },
  { id: 'docs', label: 'Help-center docs', blurb: 'Per-step GIFs and screenshots cropped to the action, plus a ready-to-paste article.' },
];
const seconds = (f) => { try { return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim()); } catch { return null; } };
const firstLine = (f, re) => { try { return (fs.readFileSync(f, 'utf8').match(re) ?? [])[1]?.trim() ?? null; } catch { return null; } };
// the request in notes.md: a "**Request:** …" line, or the first paragraph under a "## (User) request" heading
const requestOf = (f) => {
  let t; try { t = fs.readFileSync(f, 'utf8'); } catch { return null; }
  const m = t.match(/\*\*(?:User )?[Rr]equest:?\*\*:?\s*(.+)/) ?? t.match(/^#+\s*(?:User )?[Rr]equest\s*\n+([\s\S]+?)(?:\n\s*\n|$)/m);
  return m ? m[1].trim().replace(/^["“]|["”]$/g, '') : null;
};

const gallery = TYPES.map((t) => {
  const dir = path.join(ROOT, t.id);
  const items = !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'video.mp4'))).sort().map((d) => {
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
      seconds: seconds(path.join(abs, 'video.mp4')),
      video: `${rel}/video.mp4`, poster: `${rel}/poster.jpg`, storyboard: `${rel}/storyboard.yaml`, notes: `${rel}/notes.md`,
      article: fs.existsSync(path.join(abs, 'steps', 'README.md')) ? `${rel}/steps/README.md` : null,
    };
  });
  return { ...t, items };
});
fs.writeFileSync(path.join(ROOT, 'gallery.json'), JSON.stringify(gallery, null, 1));
console.log(gallery.map((t) => `${t.id}: ${t.items.length}`).join(', '));
