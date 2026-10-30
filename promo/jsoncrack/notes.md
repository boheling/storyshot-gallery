# JSON Crack editor promo (v2)

**Request:** "Make a short promo video of JSON Crack's editor (https://jsoncrack.com/editor): paste a bit of JSON and watch it turn into an interactive graph you can explore. For a landing page / social post."

- **Wall-clock:** 04:06:30 → 04:18:19 PDT (about 12 minutes)
- **Renders:** 4 full renders, 0 composes (the limit was 5 renders). Plus a few `inspect --after N` checks and two small throwaway Playwright probes to diagnose the paste problem.
- **Output:** 18.4 s, 1920x1080, `pitch` type, no voiceover, synth music at 120 bpm with click and whoosh sounds, default aurora frame. The intro and end cards are dark automatically.
- **Plan (assumed "ok"):** intro → paste JSON and watch the graph build → collapse and expand a branch → click a node to see its JSON path → rotate the layout → end card.

## Shot list
| time | shown | caption |
|---|---|---|
| 0.0–2.2 | intro card (dark) | JSON Crack / Paste JSON. **See the graph.** |
| 2.2–5.0 | empty `{}` editor; ⌘V badge; the JSON lands in one go, and in the same shot the graph appears and settles | Paste **any JSON** |
| 5.0–8.0 | zoom 1.4x on the graph: the cursor clicks "−" on `tasks`, the three task nodes vanish, then "+" brings them back | Collapse branches **in one click** |
| 8.0–11.0 | the cursor clicks the `id: 2 / Render` node; zoom 1.6x on the modal with its content and `$["tasks"][1]`, with the clicked node in frame | Click a node for its **JSON path** |
| 11.0–14.6 | rotate layout → the tree turns top-down, fit to center, zoom out a step (caption at top) | Flip the layout **instantly** |
| 14.6–18.4 | end card (dark), on screen for about 3.7 s | JSON Crack / Your JSON, **as a graph** / Try it at jsoncrack.com/editor |

## Problems and fixes
- **Storyshot's `paste` duplicates text in Monaco (a Storyshot bug).** It checks whether the paste landed by comparing `document.activeElement.value/textContent` before and after. JSON Crack's Monaco uses the EditContext API, so the focused element is a DIV whose textContent is always "". The check sees no change and falls back to `keyboard.insertText`, so the JSON appears twice (a second, staircase-indented copy). I confirmed this with a Playwright probe. Workaround: a hidden step runs the `paste` action, which loads the JSON onto the real clipboard, then clears the editor back to `{}` and selects it. The visible step then presses a real `Meta+V` (`press: { key: Meta+V, show: true }`). That is a genuine clipboard paste with the ⌘V badge, and the app reformats it as a user's paste would.
- **The graph must appear in the same shot as the paste.** The paste step has no zoom and no cut: the editor and the canvas are both visible while the JSON lands and the graph builds and auto-fits, about 0.4–1.2 s after the paste.
- **Near-blank warning (render 3):** a 300 ms pause before ⌘V showed 0.5 s of empty canvas. I removed the pause, so the paste now fires as the step starts. The warning is gone in render 4.
- **Collapse beat:** I kept the old notes' `[data-collapse-path="[\"tasks\"]"]` target and switched to a 1.4x zoom centered on the root node and the task fan. Three nodes disappearing is now an obvious change. The beat expands again with `{ role: button, name: Expand }`.
- **Cursor on the wrong node:** I replaced the ambiguous `rect._rect_…` nth target with a point target (1299, 655) on the `Render` row of the `id: 2` node, taken from inspect after the expand. The modal confirms that node (`$["tasks"][1]`).
- **Rotate step:** with the bottom caption, Storyshot moved the caption to the top because it would cover the toolbar clicks, even with an explicit `captionPosition: bottom`. A top caption overlapped the root node of the fitted top-down tree. So I added a click on the app's own "zoom out" button after "fit to center", gave the step a longer hold (3.6 s), and made `captionPosition: top` explicit. That resolved the warning.
- **End card:** I left out `duration`; it gets about 3.7 s on screen. The cards are dark automatically with the aurora frame.

## Quality assessment
The core promise is now on screen in one continuous shot: a real ⌘V paste fills the editor and the graph builds next to it. Each beat has a clear visible change (nodes vanish and return, a modal shows the JSON path, the tree flips), and the cards match the dark app. The weak spots: in the paste shot, the editor text is small because both panels have to stay in frame. The rotate step runs at about x2.5, so the app's zoom-out lands only in its last half-second and the root node sits right under the top caption for most of the shot (readable, but tight). The end card's 3.7 s on screen is comfortable.

## Update, 2026-10-29

Re-rendered with `hyperframes: true` (Storyshot 0.5.0), the launch template: hand-drawn accents, the intro's paper turns into the browser window, and the outro zooms from the last frame into the page and draws the call to action over it. There is no logo image, so the title sits in a hand-drawn box.
