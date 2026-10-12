# Desmos tutorial — build notes

## User request
"Make a tutorial video for students who have never used Desmos (https://www.desmos.com/calculator): how to plot a function, add a slider to change a parameter, and read off points like intercepts. Use y = a·sin(x) as the example, then a second example like a parabola so they see the same steps work for any function."

## Result
- `video.mp4`: 4:43, 1920x1080, tutorial preset (studio frame, camera follows the action, step numbers, spotlight, soft music), free local kokoro voice (af_heart).
- `video.srt` and `video.chapters.txt` were written by Storyshot. Chapters: Intro / Plot a function / Add a slider / Read off points / Same steps: a parabola.
- Flow: intro with goals → type `y=sin(x)` → select all and retype as `y=a*sin(x)` → click "add slider" → drag a (wave grows, then flips) → type `a=2` → click the curve, then the grey dots, to read (π, 0) and (π/2, 2) → hide the sine → type `y=x^2`, right arrow, `-k` → add slider k → drag → `k=4` → read (2, 0), (−2, 0), (0, −4) → recap end card.

## Effort
- Wall clock: 21:19:52 → 21:42:40 PDT, about 23 minutes.
- Full renders: 2 (of the 5 allowed). Composes: 0. About 8 `inspect --after N` probes (roughly 10–30 s each) checked the targets and states before rendering.

## Problems and how they were solved
1. **Desmos has no normal text inputs** (MathQuill). The `init` target list was mostly keypad spans. I clicked the first line with `{ css: ".dcg-expressionitem .dcg-mq-editable-field", nth: 0 }` and then used a bare `type:`. MathQuill closes brackets on its own, so I typed `y=sin(x` without the `)`. `*` shows as a dot, `^` starts an exponent, and ArrowRight steps out of it.
2. **`note` can't point at a screen position.** `note: { target: { x, y } }` passed `check` but failed at record time with "cannot build a locator". Storyshot limitation: `check` doesn't catch it. I switched to element targets.
3. **Note placement went the wrong way.** `side: right` on the expression field put the label over the graph, and a note on `.dcg-graph-outer` with `side: left` landed over the expression list. Fix: one note under the expression field (`side: bottom`), and a cursor move over the graph instead of a second note.
4. **The slider drag was barely visible in render 1.** In the tutorial default `follow: true`, the camera zoomed in on the slider, so the graph that changes was mostly off screen. Fix: `follow: false` on the slider-reveal and both drag steps. Storyshot has no "zoom on the control but also show the effect" option. The wide shot is the compromise, and in it the expression text is small, but it reads fine at 1080p.
5. **Point labels were missing in render 1.** When the expression line has focus, the first click on the curve only selects it and shows grey points-of-interest dots, with no label. Inspect hadn't caught this because its path differed. Fix: two steps, click the curve, then click the grey dot. That is also the correct Desmos workflow to teach.
6. **Real values differed from my guess.** Desmos labels the maximum as (π/2, 2), not 1.571. I read it from the frames and fixed the narration before render 2.
7. Minor: the select-all shortcut is recorded as Meta+A (macOS headless Chromium). The on-screen badge shows that, and the narration says "Control A, or Command A on a Mac". `check` still warns that step 22 does 3 things (click, select all, type `k=4`). I left that on purpose because it repeats an action already taught in steps 10–11.

## Assessment (after viewing extracted frames)
A beginner could follow it. Every action is its own narrated step with a caption. The typed expressions and the coordinate labels ((π, 0), (π/2, 2), (2, 0), (−2, 0), (0, −4)) are clearly readable in the zoomed shots. The parabola repeats the sine steps one for one, which makes the "works for any function" point. Two weak spots: in the wide shots used for slider drags, the slider value and expression text are small, so they are hard to read on a phone. And at 4:43 with the slow tutorial pace, it may feel slow to quicker students, so a teacher might suggest 1.25x playback.
