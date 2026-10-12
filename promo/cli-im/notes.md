# cli-im — 草料二维码 promo (Chinese)

**Request:** 给草料二维码（https://cli.im/）做一个简短的中文宣传视频：输入一个网址，马上生成二维码，还可以美化一下样式。用于官网首页和社交媒体。中文字幕和中文配音。

- **Type:** pitch (promo), 16:9 1920x1080, 20.9 s, aurora frame, upbeat synth music
- **Voice:** macOS `say` provider, `Tingting` (zh_CN), free and local
- **Wall clock:** 21:54 to 22:00 PDT, about 6 minutes
- **Renders / composes:** 1 full render and 1 compose. About 6 `inspect --after N` probes before rendering.

## Shot list
| time | shown | caption |
|---|---|---|
| 0.0–4.6 s | intro card: 草料二维码 / 输入网址，马上生成二维码 | (card) |
| 4.6–7.6 s | cli.im/url: https://example.com is typed into the input (zoomed) | 粘贴你的**网址** |
| 7.6–10.6 s | click 生成二维码, QR appears on the right ("生成成功" toast) | 一键**生成二维码** |
| 10.6–13.6 s | zoom on the 二维码美化 button, which is highlighted | 还能**美化样式** |
| 13.6–17.1 s | mh.cli.im: click the 简约渐变 style; the black QR turns into a blue gradient with rounded eyes (zoomed) | 一键换上**渐变样式** |
| 17.1–20.9 s | end card: 草料二维码 / 免费生成，一键美化 / 立即访问 cli.im | (card) |

The ~10 s needed to load mh.cli.im and generate the base code there is cut (hidden step). The 1–3 s server-side style rendering is compressed about 3x.

## Problems and fixes
- **No login needed.** Generating and styling a QR code works anonymously on both cli.im/url and mh.cli.im, so nothing was logged into.
- **The 二维码美化 button opens a new tab.** Storyshot records a single page and doesn't follow popups, so the click left the recording on cli.im/url. Fix: step 3 only hovers and highlights the button. A `hidden: true` step then does `goto: https://mh.cli.im/`, types the same URL and generates the code off camera. Side effect: the browser chrome's address pill reads cli.im/url during the mh.cli.im shot. It's tiny and hardly noticeable.
- **Style preview loads slowly.** After clicking a style, the preview shows a spinner for about 1–3 s. The first probe captured only the spinner. Fix: `waitFor: { text: "当前样式" }` after the click, and Storyshot compresses the wait.
- **Ambiguous / unnamed targets.** The third style thumbnail (标签 style) has a duplicated alt, and clicking it switched the editor into a label-field layout without a visible result, so I dropped that shot. Zooms on steps 1–2 use point targets, so changing them only needed a compose.
- **Chinese text: no problems.** Chinese captions, `**bold**` accent highlights, intro and end cards all rendered correctly with the default theme font, using the system CJK fallback. No font configuration was needed.
- **Chinese voice: works via `say`.** The `say` provider passed `voice: Tingting` through correctly. Narration timing fit fixed step durations at roughly 4.5 characters/s; only one line needed a slight speed-up (x1.06). Subtitles/.srt were not requested, so I didn't make them. The skill text says non-English needs ElevenLabs and calls `say` "robotic; fine for drafts". For Mandarin, Tingting is actually acceptable.
- The skill's "confirm the plan" step was skipped because the user was unavailable. The brief already fixed type (promo), language and voice.

## Quality assessment
The video tells the requested story clearly in about 20 s: URL typed, QR generated, then one click turns it into an attractive gradient code. Chinese captions and cards look crisp and on-brand with a green accent. The weakest parts are the Tingting voice, which is clear but flat and obviously synthetic next to a commercial voiceover, and the beautify hand-off: the 二维码美化 button is only hovered, then the view cuts to a different page. Fine for social media and a homepage loop. For a polished homepage hero, I'd re-voice it with a human or premium Mandarin voice.
