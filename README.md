# Storyshot Gallery

Promos, tutorials, lessons, explainers and help-center docs, each made by an AI coding agent
with [Storyshot](https://github.com/boheling/storyshot) from a one-paragraph request. Most of them record a
real web app; the explainers record nothing and are animated from end to end.

**Watch them: https://boheling.github.io/storyshot-gallery/**

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
