# Desmos lesson: slope and y-intercept (English)

**Request:** "Make a short lesson video with the Desmos graphing calculator (https://www.desmos.com/calculator) on what m and b mean in y = mx + b (slope and y-intercept), in three languages: English, Simplified Chinese and Spanish, so I can share it with students who speak each one. Same lesson, each fully in its own language: the Desmos interface too, not only the narration."

- **Wall-clock:** 04:17 → 05:46 PDT (≈ 89 min for all three languages together; built in parallel from one structure).
- **Renders / composes (en):** 3 full renders (render 1: `slide` + camera follow; render 2: thumb `drag`s; render 3: faster drag + `sayAt`); 3 composes (follow off ×2, then `sayAt` timing). Also ~6 cheap `inspect --after N` checks and Playwright DOM probes, shared by all three languages.
- **Output:** `video.mp4` (2:12, 1920×1080), `storyboard.yaml`, `subtitles.srt`, `chapters.txt`, `poster.jpg` (step 6: m = 2, b = −2).
- **Lesson shape (identical in all three):** intro (goals) → Concept card (y = mx + b, m = slope, b = y-intercept) → type `y=mx+b` → add sliders → Part 1: drag b to 3, then −2 → Part 2: drag m to 2, −1, 0 → Question card "y = −2x + 4" with 5 s think pause → set m = −2, b = 4 live → answer → recap card.

## Language-specific notes (English)
- Voice: `kokoro` / `af_heart`, `lang: en`. No `pronounce` entries are used; the letters m, b, x and y are left for Kokoro to read as letters. I did not check the audio by ear, only the subtitles and timing.
- Desmos UI in English (`?lang=en`); the slider button is labelled "all", which is what the narration says.

## Problems and fixes (shared by all three languages)

- **Localized UI.** Desmos switches its whole UI with `?lang=` - verified codes with `storyshot inspect`: `en`, `zh-CN`, `es` (title bar becomes "未命名图表 / 保存 / 登录 / 注册" and "Gráfica sin título / Guardar / Iniciar Sesión / Registrarse"; the slider prompt becomes "添加滑块… 全部" / "añadir control deslizante… todo"; the slider settings row shows "Step / 步长 / Escala").
- **Language-independent targets.** Every accessible name differs per language (e.g. "Close Message" / "关闭消息" / "Cerrar mensaje"), so no `role+name` targets are used. All three storyboards use identical CSS targets from Desmos's own class names and `expr-id` attributes: `.dcg-expressionitem .dcg-mq-editable-field` (first expression), `.dcg-btn-slider` last (the all/全部/todo button), `[expr-id="2"] .dcg-main .dcg-math-field` (m) and `[expr-id="3"] …` (b). The login toast is hidden with `hide: ".dcg-notice-wrapper"` instead of dismissing it by its localized name. The narration names the button by its localized label ("all", "全部", "todo"), checked by probing each language.
- **Wrong field when typing the answer.** At first the b value was typed with `nth: 1` of the slider fields, but while m is being edited Desmos shows the slider's min/max/step fields, so `nth: 1` landed in "min" (`b=4 ≤ m ≤`). I switched to `expr-id` targets, which fixed it (checked with `inspect --after 10`).
- **`slide` swept from the end of the track.** The first renders used `slide: { target: .dcg-slider-interior, to: … }`. It presses at the end of the track, so m briefly jumped to −10 and swept back (e.g. m = −5.8 on screen while the voice said "drag m up to two"). In the Chinese render, the line "m 等于零" started while m still read −8.9. I replaced every `slide` with a `drag` from the thumb's computed pixel position to the target value (track 83→440 px = −10…10). That gives exact values (3, −2, 2, −1, 0) and the thumb now moves smoothly from its current value.
- **Narration vs. drag timing.** The drag only finishes about 3.3–4 s into each step (slow course pace: cursor travel, then the drag). I measured this from frames sampled every 0.4–0.5 s, then set `sayAt: 2.3` on the five drag steps and made each line start with the instruction ("Now drag m to zero."). The claim about the value is now always spoken after the slider shows that value. I checked this frame by frame in all three videos.
- **Camera follow hid the graph.** By default the `course` camera zoomed in on the slider panel, so the line was off-screen while it moved. I set `follow: false` on steps 3–11 so the slider and the line are both visible. Steps 1–2 (typing, the all button) keep the zoom.
- **Point notes not allowed.** I tried to label the intercepts with `note` at a point, but `note` needs an element and the graph is a canvas. Clicking a Desmos point of interest didn't show its coordinate label in headless Chromium either. Instead, the cursor moves onto the intercept after each b change and on the answer.
- Warnings: the only warnings were "intro card plays 8.4 s" (en, first render) and "8.1 s" (es). Both were fixed by shortening the intro line. The final composes report **no warnings** (no dead air, no near-blank frames, no caption moves; `captions: false` + `subtitles: burn`).
- Heavy machine load (load average around 50–60), so each render or compose took 9–17 min.
- Known small leftover: in step 10 ("set b to 4"), the value is typed in the last ~0.5 s of the step, just after the short instruction line. The answer step right after shows b = 4 for 11+ s.

## Narrated values vs. screen

| Narration (step) | On screen at that moment (checked in extracted frames) | Match |
|---|---|---|
| Step 3 "y equals x plus one" | m = 1, b = 1, line through (0, 1) | ✓ |
| Step 4 "up to three … crosses the y-axis at three" | b = 3, line crosses y-axis at 3 (cursor on (0, 3)) | ✓ |
| Step 5 "minus two … crosses at minus two" | b = −2, crossing at −2; slope unchanged (m = 1) | ✓ |
| Step 6 "m up to two … one step right, two steps up" | m = 2, b = −2; line passes (0, −2) and (1, 0) | ✓ |
| Step 7 "minus one … falls" | m = −1, line falls left→right | ✓ |
| Step 8 "m to zero … flat … height b" | m = 0, horizontal line at y = −2 (= b) | ✓ |
| Question "y = −2x + 4" | card text y = −2x + 4 | ✓ |
| Steps 9–10 "set m to minus two", "set b to four" | m = −2, then b = 4 typed into the fields | ✓ |
| Step 11 "crosses at four … two down for every step right" | m = −2, b = 4; line through (0, 4) and (2, 0) | ✓ |

## Quality assessment

The lesson structure works: a concept card, a live demonstration where every value is visible in the slider panel and on the graph, a question with a 5-second countdown, the answer built live, and a recap. Desmos is shown un-zoomed inside a browser frame for most of the video, so the slider labels (m = 2, b = −2) are small; they are legible at 1080p but would be cramped on a phone. The burned word-by-word subtitles and the clean frame (no login toast) look good. The narration now never states a value before the screen shows it.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
