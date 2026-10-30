# Excalidraw promo: build notes

**Request:** "Make a short promo video of Excalidraw (https://excalidraw.com), the hand-drawn style whiteboard — show how quickly you can sketch a little diagram (a couple of shapes, an arrow, some text). For a landing page / social post."

- **Wall clock:** 21:25:25 to 21:32:19 PDT (about 7 minutes)
- **Renders:** 2 full renders and 1 compose. I also ran 3 `inspect --after N` dry runs.
- **Output:** 24.7 s, 1920x1080, pitch type, aurora browser frame, synth music at 112 bpm, kokoro voice (af_heart), captions.
- **Plan (assumed "ok"):** intro card, then the empty canvas, then a blue box, the label "Idea", a green ellipse labelled "Launch", an arrow joining them, a free-text note "v1 by Friday!", the finished diagram, and an end card ("Free, open source, no sign-up" / excalidraw.com).

## Shot list
| time | shot | caption |
|---|---|---|
| 0.0–2.7 | Intro card: logo with "Sketch an idea in seconds" | |
| 2.7–5.1 | Empty canvas with the welcome screen, slight zoom | A whiteboard, right in your browser |
| 5.1–8.1 | R key, drag a rectangle, click the light-blue background swatch | Draw a box, pick a color |
| 8.1–10.0 | Enter, type "Idea" (zoomed in) | Label it |
| 10.0–13.2 | O key, drag an ellipse, pick green, type "Launch" | Add another shape |
| 13.2–15.8 | A key, drag an arrow between the two shapes | Connect them with an arrow |
| 15.8–18.6 | T key, click, type "v1 by Friday!" | Jot a note anywhere |
| 18.6–21.2 | Finished diagram, zoomed in | Hand-drawn diagram, done |
| 21.2–24.7 | End card with the URL | |

## Problems and fixes
- **Drawing on a canvas.** Excalidraw has no DOM targets on the canvas. I used keyboard tool shortcuts (`press: r/o/a/t`), drags to points (`drag: {from, to}`), and `press: Enter` + `type:` to put a label inside the selected shape. This all worked on the first try. I checked it with `inspect --after 6` before rendering.
- **The diagram was too small in render 1.** The promo browser frame shrinks the 1600 px viewport, so the default 100% canvas made thin strokes and tiny text. Fix: `setup` clicks "Zoom in" four times (canvas at 140%), I drew larger shapes, and I added background fills (swatch targets came from `inspect --after 2`). The diagram now reads well at 1080p.
- **The label step played in slow motion** (motion x0.6) because typing "Idea" is quick. I shortened that step's duration with a compose instead of re-recording.
- **The welcome-screen hint arrows and the encryption badge** were hidden in `setup` with `hide:`.
- **Storyshot limitations:**
  - The left properties panel opens whenever a shape is selected, and the cursor sits on it after a colour click. The storyboard has no clean way to keep the panel shut while still showing a colour being picked.
  - The intro and end-card logo came from the welcome-screen logo (`.welcome-screen-center__logo`). This worked, but only because the logo is captured before drawing starts.
  - The new ellipse briefly appears blue (Excalidraw reuses the last fill) before it turns green. This is real app behaviour and I left it in.

## Quality assessment
It's clean and on-message. The video shows box, label, ellipse, arrow and note in about 16 s of real interaction, the hand-drawn look comes through well in the final frame, and the narration is short and in sync. There are some weak spots:
- The diagram fills only the middle part of a framed window, so on a phone-sized social feed the labels are small.
- The left properties panel and the wandering cursor add visual noise.
- The accent underline under "no sign-up" on the end card sits low enough to read faintly like a strikethrough at small sizes.

For social, a `frame: false` or 9:16 cut with a tighter zoom on the canvas would be stronger.

## Update, 2026-10-29

Re-rendered with `hyperframes: true` (Storyshot 0.5.0), the launch template: hand-drawn accents, the intro's paper turns into the browser window and the logo lands on Excalidraw's own logo, and the outro zooms from the last frame into the page and draws the call to action over it. `hand: true` letters the subtitle and call to action in Virgil, Excalidraw's handwriting font.
