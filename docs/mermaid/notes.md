# Mermaid Live Editor: help-center GIFs + article

**Request:** "We need help-center GIFs and a short article for Mermaid Live Editor (https://mermaid.live): how to start a flowchart from the sample, edit the text to add a node, and export the diagram as an SVG or PNG."

- **Type chosen:** `docs` (silent, no voice, no music). The plan was auto-approved because the user was unavailable.
- **Wall clock:** 21:27 to 21:40 PDT (about 13 minutes)
- **Renders:** 4 full renders (limit 5), plus 2 composes
- **Output:** `video.mp4` (47 s, 7 captioned steps), `steps/` (7 GIFs + 7 PNGs + `README.md` article), `storyboard.yaml`, `poster.jpg` (frame from step 6)

## Flow
1. Open the Flowchart samples (dropdown next to Flowchart)
2. Pick Basic Flowchart
3. Type a new line of code: `F --> G[Road trip]`
4. The new node appears (Road trip under Car)
5. Open the Actions panel
6. Download as SVG (callout: "Sharp at any size")
7. Or download as PNG

## Problems and fixes
- **Bot checks:** none. The site has a "Try the full Mermaid experience" upsell modal and a promo banner. `dismiss` in `setup` ("Stay on mermaid.live", "Dismiss banner") cleared both.
- **Targets the inspector didn't list:** `inspect` didn't show the sample dropdown's menu items or anything in the Actions panel (PNG/SVG buttons, Width), so I used text targets (`{ text: "Basic Flowchart" }`, `{ text: "SVG" }`, `{ text: "PNG" }`) and checked each with `inspect --after N` before rendering.
- **Monaco code editor:** clicking `textarea.ime-text-area`, then `Meta+ArrowDown`, `End`, `Enter` and `type` worked. Bracket auto-close did not garble `G[Road trip]`.
- **Step crops missed the result (renders 1 to 3):** each step is cropped around what it clicks, so "Pick Basic Flowchart" first showed only the sample buttons, and "Add a node" showed the code without the new box. Fixes: a `move` to the code after picking the sample, and splitting "add a node" into a typing step and a "new node appears" step. The new node still sat just below the crop. **Storyshot limitation:** clip crops seem to avoid the bottom caption band, even though the GIFs have no captions. A zoom didn't help. `captionPosition: top` on that step fixed it (found by trial; it isn't documented). There is no documented way to set a step's crop directly.
- **A callout silently never appeared (Storyshot limitation):** the step-7 `note` ("Optional: set a pixel size") on the PNG-size control didn't render, first targeting the "Auto" radio and then the "Width" button. The target resolved and no warning was printed. I kept the article text explaining PNG size and didn't spend the last render on it.
- **Article formatting:** Storyshot removed `**bold**` from the `doc:` lines in README.md, so UI labels in the article are plain text. Italics and `code` were kept.
- **Minor:** the first frames of the step-7 GIF still show step 6's "Sharp at any size" callout. Downloads leave no visible trace in a headless browser, so the export steps end on the click, and the article says where the file goes.

## Assessment
The GIFs are cropped to the panel being used, so text is legible at 960×540, and the 7-step article is accurate and ready to paste. The weak spots are the export steps, which end on a click with nothing to show, and step 2's crop, which cuts off the bottom of the diagram. An editor would also want to restore bold UI labels in README.md and possibly drop the GIF bleed in step 7. With those small edits it would work in a help center. As delivered, it is about 85% there.
