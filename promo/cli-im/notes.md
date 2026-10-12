# cli-im v2: 草料二维码 promo (Chinese)

**Request:** 给草料二维码（https://cli.im/）做一个简短的中文宣传视频：输入一个网址，马上生成二维码，还可以美化一下样式。用于官网首页和社交媒体。中文字幕和中文配音。

- **Type:** pitch (promo), 16:9 1920x1080, 19.4 s, aurora frame, upbeat synth music (112 bpm)
- **Voice:** macOS `say` provider, `Tingting` (zh_CN). Chinese caption pills, no burned subtitles.
- **Wall clock:** 04:06:42 to 04:13:22 PDT, about 7 minutes
- **Renders / composes:** 1 full render and 1 compose. Before rendering I ran 3 `inspect` probes (cli.im/url, mh.cli.im, and `--after 5`) plus 2 `--after 3` probes.
- **Example URL:** https://example.com

## Shot list
| time | shown | caption |
|---|---|---|
| 0.0–2.5 s | intro card: 草料二维码 / 网址一贴，马上出码 | (card) |
| 2.5–5.0 s | cli.im/url, zoomed 2.2x on the 网址 tab and the input; https://example.com is pasted with `paste` | 粘贴你的**网址** (top) |
| 5.0–8.0 s | click 生成二维码; the zoom moves to the black QR code as it appears | 一键**生成二维码** |
| 8.0–9.8 s | zoom on the panel; the real 二维码美化 button is clicked | 还能**美化** |
| 9.8–12.0 s | mh.cli.im (address bar reads mh.cli.im): the black code is visible, then the 简约渐变 style is clicked (brief loading spinner, compressed 2.6x) | 选一个**样式** |
| 12.0–15.5 s | 1.45x zoom on the restyled code (blue gradient, rounded eyes, bar-shaped modules), held 3.5 s | 渐变配色，**秒变好看** |
| 15.5–19.4 s | end card: 草料二维码 / 免费生成，一键美化 / 立即访问 cli.im (auto duration, 3.9 s) | (card) |

## Reviewer issues and fixes
- **Intro 4.6 s:** now 2.5 s. `duration: 2.5` with a two-word line, "草料二维码。"
- **Paste shown as slow typing in a huge empty box:** now a real `paste` action. The step zooms 2.2x on the top-left of the input, so the frame shows the 网址 tab, the code-type tabs and a large URL rather than an empty rectangle. The lower part of the box is still visible but no longer fills the frame.
- **Beautify beat was a static hover:** two beats now. Step 3 really clicks 二维码美化. On mh.cli.im the viewer sees the plain black code, then the 简约渐变 thumbnail is clicked and the code turns into a gradient code. The payoff is then held in its own zoomed step for 3.5 s (about 4 s counting the end of the previous step), up from about 2 s.
- **URL bar stuck on cli.im/url:** checked in extracted frames. The address pill reads `mh.cli.im` after the cut.
- **End card:** no `duration` set. It auto-fit to 3.9 s.
- **Neutral URL:** https://example.com everywhere.

## Other problems and how I solved them
- **二维码美化 opens a new tab.** Storyshot still records only the original page; I confirmed this with `inspect --after 3`, which stayed on cli.im/url. As in v1, a `hidden: true` step does `goto: https://mh.cli.im/`, pastes the same URL and generates a base code off camera (about 11 s raw, cut). The visible click on 二维码美化 keeps the story continuous.
- **The style preview loads slowly** (about 1–2 s spinner). `waitFor: { text: "当前样式" }` handles it, and Storyshot compresses the wait. A short spinner is still visible in the 选一个样式 step.
- **One warning in render 1:** step 1's caption was moved to the top because it would cover the textbox. I set `captionPosition: top` explicitly. The compose had zero warnings.
- **The step-3 click was too small to read.** I added a 1.4x point zoom on the right-hand panel (compose-only).
- **No login was needed.** Both sites work anonymously and nothing was logged into. Floating 客服/助手 widgets are hidden in `setup`.

## Quality assessment
The video tells the brief's story cleanly in under 20 s: paste a URL, get a QR code, one click restyles it into an attractive gradient code that stays on screen long enough to register. Chinese captions, cards and the green accent look crisp. Weaker points:
- The Tingting voice is clear but flat and obviously synthetic.
- The top caption in the paste shot partly overlaps the site's top nav.
- The cut from cli.im to mh.cli.im is a hard page change, since the real new tab can't be followed. A brief loading spinner shows before the payoff.

It is good enough for social media and a homepage loop.
