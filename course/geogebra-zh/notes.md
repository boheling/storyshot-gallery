# GeoGebra (zh_CN): vertex form y = a(x−h)² + k, a narrated Chinese micro-lesson

**Request:** 用 GeoGebra 中文版（https://www.geogebra.org/graphing?lang=zh_CN）做一节中文微课：讲清楚二次函数顶点式 y = a(x−h)² + k 里 a、h、k 分别怎么影响图像，为什么。要现场演示（拖动滑动条看变化），中间加一个小测验题让学生先想一想，最后总结。中文字幕和中文配音。

- **Type:** `course` (lesson), 16:9 1080p, 4:57 (297 s). 8 chapters: intro, setup, a, why-a, k, quiz on h, why-h, combined exercise, recap.
- **Voice:** Qwen3-TTS 0.6B CustomVoice, `dylan`, free and local (Apple Silicon). It was first made with macOS `say` and Tingting, then Kokoro `zf_001`; see the updates at the end. No music.
- **Captions:** short Chinese step captions at the top, the full narration burned in at the bottom (`subtitles: burn`, with word-by-word highlighting), plus `.srt` and `.chapters.txt` files.
- **Wall-clock time:** 21:54 to 22:47 PDT, about 53 minutes.
- **Runs:** 2 full renders and 2 composes. I also ran about 10 `inspect --after N` checks to test typing and to measure where the sliders are.

## Files
- `video.mp4`
- `storyboard.yaml`
- `a-diagram.svg` and `h-diagram.svg`: diagrams for the two "why" concept cards, generated with a small node script.
- `poster.jpg`: frame from the quiz answer step (3:00 in the first version), the quiz answer with h = 2 and the vertex at (2, 0).
- `geogebra-lesson-vertex-form.srt` and `geogebra-lesson-vertex-form.chapters.txt`

## Lesson flow
1. **Intro:** the goals, as 4 bullets.
2. **Setup:** type the function into GeoGebra, then add the point V=(h,k) with its coordinates shown as the label.
3. **a:** drag a to 3 (narrower), then 0.5 (wider), then −1 (opens downward).
4. **Why a:** a concept card with a diagram. (x−h)² ≥ 0, so the sign of a decides whether y ≥ k or y ≤ k.
5. **k:** drag k to +3, then to −2. The whole curve moves up and down.
6. **Quiz:** "h 从 0 变成 2，图像往哪边移？" with a 5 s think countdown. The answer step drags h to 2, and the curve moves right.
7. **Why h:** a concept card with a diagram. The vertex is where x − h = 0, so "减" moves the curve right. Then h is dragged to −3, which moves it left.
8. **Combined exercise:** y = 2(x+1)² − 3 as a question card, then h, k and a are dragged one at a time. The camera zooms in on V = (−1, −3).
9. **End card:** a 5-point recap.

I checked the slider values on every demo step in extracted frames. They all landed exactly on the values the narration states.

## Problems and how I solved them
- **Sliders:** typing `a=1` did not create a slider. A function with undefined a, h, k does auto-create sliders, but their step is 0.1 and drags landed on values like 2.3. I created the sliders in `setup` with `Slider(-3,3,0.5)` and `Slider(-4,4,1)`. That made each step 11 px or more wide, so drags snap exactly. I also hid the sliders' copies in the graph view (`SetVisibleInView`), and added a grey dashed y=x² as a reference curve.
- **Typing the formula into GeoGebra:**
  - Typing `²` (the Unicode superscript) was silently dropped.
  - `a(x-h)^2` was parsed as `(a(x−h))²` because of how the editor auto-closes brackets.
  - `a*(x-h)^2`, then ArrowRight to leave the exponent, then `+k` worked.
  - A quote character in `SetColor(p,"gray")` broke the input box, because GeoGebra auto-closes quotes. I used the RGB form `SetColor(p,0.6,0.6,0.6)` instead.
- **Slider drag positions:** I measured the pixel scale of each slider from inspect screenshots (a: 19 px per unit, h and k: 14.25 px per unit). My first guess was off by one unit.
- **Camera:** `follow` (camera follows the action) would have zoomed into the slider panel and hidden the graph. I set `follow: false` and used two explicit zooms on the graph.
- **Readability:** with the default 1600×900 viewport, the GeoGebra labels were small inside the studio frame. I re-rendered at a 1280×720 viewport, which makes everything 1.5× larger.
- **Chinese text, fonts and voice:**
  - Chinese text rendered correctly everywhere: cards, captions, burned subtitles and the SVG diagrams (PingFang fallback). The burned word-by-word highlighting also works with Chinese.
  - Tingting through the `say` provider worked with no extra setup and read letters and numbers acceptably.
  - Storyshot's only real Chinese gap here is two English labels hard-coded in the package. The quiz countdown says "Pause and think" (`src/compose.mjs`), and the first chapter in `.chapters.txt` is named "Introduction". Neither can be changed from the storyboard, so I left them.
- **Card formatting:**
  - `**bold**` on single letters in the intro subtitle (`**a**(x−**h**)²`) drew small orange blobs under the letters, so I made it plain text.
  - On cards with both an image and 4 bullets, the burned subtitles overlapped the last bullets. I cut those cards to 3 bullets and shrank the diagram's display size. The subtitles now sit just below the bullets.
- **Login:** none was needed, and GeoGebra did not block automation.

## Assessment
From the extracted frames, a student would very likely understand it. Each parameter is changed live, with the formula's evaluated form (for example "= (x − 2)²") and the labelled vertex V = (h, k) updating next to the graph, and the dashed y = x² is always there for comparison. The quiz targets the classic "minus means right" misconception, and the reasons are given on concept cards rather than only asserted. The weak points:
- The Tingting voice is clearly synthetic and a bit flat.
- The concept-card diagrams are fairly small.
- The quiz countdown label is in English.

A teacher would probably want a more natural voice before showing it to a class.

## Update, 2026-10-29

Re-voiced with Kokoro v1.1-zh (`zf_001`) instead of macOS Tingting, and re-composed from the same recording with HyperFrames cards (`hyperframes: true`, Storyshot 0.5.0). The video went from 4:39 to 4:07. Kokoro reads a lone letter h like "a", which matters in a lesson about a, h and k, so the storyboard has `pronounce: { h: 爱曲 }` (how h is often read in Chinese classrooms); the subtitles still show h. The countdown ("先想一想") and the first chapter ("开场") are now Chinese, so the two English labels noted above are gone.

## Update, 2026-10-30

Re-voiced with Qwen3-TTS 0.6B CustomVoice, voice `dylan` (`voice: { provider: qwen, voice: dylan }`, Storyshot 0.6.0), and re-composed from the same recording. It is free and runs locally on an Apple Silicon Mac. Dylan is a male voice with a light Beijing accent, and it suits a lesson. Dylan reads the letter h correctly, so the `pronounce: { h: 爱曲 }` workaround is gone. The video went from 4:07 to 4:57 because Dylan speaks more slowly. A Whisper round-trip of the whole narration (speech recognition back to text, compared with the script) gives a 7.0% character error rate, against 21.0% for `zf_001`. The only compose warning is the long intro (13.9 s, 12.5 s before), which was already there.
