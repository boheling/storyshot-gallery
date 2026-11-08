# Storyshot Gallery

Promos, tutorials, lessons, explainers and help-center docs, each made by an AI coding agent
with [Storyshot](https://github.com/boheling/storyshot) from a one-paragraph request. Most of them record a
real web app; the explainers record nothing and are animated from end to end.

**Watch them: https://boheling.github.io/storyshot-gallery/**

## A personal screening room / 私人放映间

The gallery now has a Chinese/English interface, curated film stills, searchable collections, and a
notebook of actual production records. The language switch changes the site, film titles and short
introductions; it does not dub the films or translate the original source documents.

画面、标题与介绍支持中英切换；影片和原始手记保留原本的语言。首页的拼贴直接取自现有影片，
点击任意一帧即可播放。原有分镜、制作记录和图文指南都可以在放映窗口中打开。

To preview locally (Node.js 18+):

```sh
node scripts/serve.mjs
# http://127.0.0.1:4176
```

No frontend build or package install is needed. GitHub Pages serves `index.html` and `assets/` directly.
Use `?lang=en` or `?lang=zh` to share a language; `?film=explainer/mrna-cancer-vaccine` opens a specific film.
The selected collection and search query also stay in the URL. The existing `#course`, `#explainer`, etc.
links still filter and scroll to the collection.

- `assets/content.mjs`: interface translations, bilingual film titles, summaries and curated order.
- `assets/gallery.mjs`: search, collections, accessible video dialog and document loading.
- `assets/style.css`: responsive layout, collage and typography.
- `assets/still-*.jpg`: stills extracted from the existing films; original media is unchanged.
- `DESIGN.md`: visual direction and interaction decisions.

When adding a film, regenerate `gallery.json` as below, then add a four-string translation entry in
`assets/content.mjs`: Chinese title, English title, Chinese summary, English summary. Entries without
editorial copy still display their original title and request. Keep the `copy.zh` and `copy.en` keys paired.

Every example folder (`<type>/<site>/`) has:

- `video.mp4`: the video
- `storyboard.yaml`: the storyboard the agent wrote; copy it, change the URL, and render your own
- `notes.md`: the request, how long it took, what went wrong, and the agent's own assessment
- docs examples also have `steps/`: per-step GIFs and PNGs plus the generated help article
- explainers also have `scenes/`: the scene files the agent wrote, plus the shared kit the storyboard loads

Voices are free and local: Kokoro for English, Qwen3-TTS 0.6B CustomVoice (voice `dylan`) for the Chinese
lessons and the Chinese explainer, and Qwen3-TTS (voice `aiden`) for the Spanish one. The title, section and end cards are [HyperFrames](https://github.com/heygen-com/hyperframes)
animations (`hyperframes: true` in the storyboard; Storyshot installs HyperFrames on first use). The sites
shown belong to their owners and are used as public examples.

To add an example: put its folder under `promo/`, `tutorial/`, `course/`, `explainer/` or `docs/` (optionally with a
`meta.json`: `{ "title": "...", "site": "...", "lang": "zh" }`), then run `node scripts/build-index.mjs`.
