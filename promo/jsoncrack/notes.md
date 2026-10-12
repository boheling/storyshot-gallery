# JSON Crack editor promo

**Request:** "Make a short promo video of JSON Crack's editor (https://jsoncrack.com/editor): paste a bit of JSON and watch it turn into an interactive graph you can explore. For a landing page / social post."

- **Wall-clock:** 21:32:56 → 21:42:00 PDT (about 9 minutes)
- **Renders:** 3 full renders + 2 composes (the limit was 5 renders)
- **Output:** 17.1 s, 1920x1080, 16:9, `pitch` type, no voiceover, synth music at 120 bpm with click and whoosh sounds, aurora browser frame
- **Plan (assumed "ok"):** intro "Paste JSON. See the graph." → type JSON → graph appears → collapse and expand a branch → click a node to see its content and JSON path → rotate the layout → end card "Try it at jsoncrack.com/editor". The site had no bot check, cookie wall or login.

## Shot list
| time | shown | caption |
|---|---|---|
| 0.0–2.2 | intro card | JSON Crack / Paste JSON. **See the graph.** |
| 2.2–5.1 | JSON typed into the Monaco editor (zoomed in) | Paste in **any JSON** |
| 5.1–7.6 | formatted JSON next to the generated graph | It becomes a **live graph** |
| 7.6–10.1 | `tasks` branch collapsed, then expanded again | Collapse branches **in one click** |
| 10.1–13.1 | node clicked; modal shows its content and `$["owner"]` | Click any node for its **JSON path** |
| 13.1–16.1 | rotate layout and fit to center (top-down tree) | Flip the layout **instantly** |
| 16.1–17.1 | end card | Try it at jsoncrack.com/editor |

## Problems and fixes
- **No real paste.** Storyshot has no clipboard or paste action, so the "paste" is a fast `type` (delay 18 ms) into Monaco, followed by `Shift+Alt+F` to format it. Monaco's auto-closing brackets and quotes did not corrupt the text because typed closers overwrite the auto-inserted ones. The JSON had to stay on one line, because typing newlines would have added extra auto-indent. Typing still plays at about x2.3, so it looks like fast typing rather than a paste.
- **The editor opens with sample "fruits" JSON.** When I cleared the editor in a hidden step, the old fruits graph stayed on the canvas while the new JSON was being typed (it is invalid until the last character). In render 2 this was confusing. Fix: the hidden step types `{}`, which gives an empty canvas, and the visible step selects all and types over it.
- **Collapse button was hard to click.** A point click at the coordinates inspect gave for the "−" collapse button did nothing in Storyshot, although a raw Playwright mouse click at the same point worked. The role target `{role: button, name: Collapse, nth: 2}` was worse: it scrolled or panned the SVG canvas and clicked the wrong node. Inspect printed `nth: 0` for all three collapse buttons, so its targets were ambiguous. Fix: a CSS target on the app's own attribute, `[data-collapse-path="[\"tasks\"]"]`. I found it by debugging with a throwaway Playwright script.
- **Typing step:** render 1 showed it at x4.0 ("rushed"). A shorter typing `delay` and a 2.9 s duration brought it down to about x2.3. A zoom on the editor makes the typed text readable. Because the editor sits at the top-left edge, the zoom is clamped and off-centre.
- Fixed the caption-moved warnings by setting `captionPosition: top` on the typing step and the rotate step.
- In render 1, the preview frame for the collapse step looked blank. That was a single frame during the re-layout. Extracted frames show the step plays correctly.

## Quality assessment
The video is clean and on-message. Every caption is backed by a real interaction: the graph appears from typed JSON, a branch collapses, the node modal shows a JSON path, and the layout rotates. The rotate shot and the live-graph shot are the strongest frames. The weak spots: the typing is a fast type rather than a true paste. The graph only appears after the cut to step 3, so you don't see it grow while the JSON goes in. The intro and end cards are light while the app is dark, which jars a little. The node-modal zoom also crops some of the graph. It works as a landing-page or social loop. A tighter version would zoom closer on the graph nodes and match the cards to the dark theme.
