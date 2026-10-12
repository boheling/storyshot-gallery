# Mermaid Live Editor: help-center GIFs + article (v2)

**Request:** "We need help-center GIFs and a short article for Mermaid Live Editor (https://mermaid.live): how to start a flowchart from the sample, edit the text to add a node, and export the diagram as an SVG or PNG."

- **Type:** `docs` (silent, no voice or music). The plan was auto-approved because the user was unavailable.
- **Wall clock:** 04:06 to 04:25 PDT (about 19 minutes)
- **Renders:** 4 full renders (limit 5; the first failed at step 8 on a bad note target), plus 2 composes
- **Output:** `video.mp4` (49.8 s, 7 captioned steps), `steps/` (7 GIFs, 7 PNGs and the `README.md` article), `storyboard.yaml`, `poster.jpg` (step 6 with the "Downloaded" bubble), `meta.json`

## Flow
1. Open the Flowchart samples
2. Pick Basic Flowchart (the editor changes from a sequence diagram to the flowchart)
3. Type a new line of code, `F --> G[Road trip]` (zoomed)
4. The new node appears (Road trip under Car)
5. Open the Actions panel
6. Download as SVG (ends on the "Downloaded …svg" bubble)
7. Or download as PNG (callout "Optional: set a pixel size", ends on the "Downloaded …png" bubble)

## Reviewer issues and fixes
- **Article H1 slug, no intro, bold stripped:** set `article: { title, intro }`. README.md now opens with "Create, edit and export a flowchart in Mermaid Live Editor" and an intro paragraph, and `**bold**` in the `doc:` lines is kept.
- **No visible change when picking Basic Flowchart:** a hidden first step loads the **Sequence** sample, so step 1 opens the menu over a sequence diagram and step 2 visibly swaps both the code and the preview to the flowchart. The article says the sample replaces the editor contents.
- **Step 3 code about 9 px tall:** set a 1.5× zoom on the code editor and switched to a 1280×720 viewport (more output px per CSS px). The typed line now renders at about 25 px in the GIF. A `move` to the end of line 7 keeps the new line inside the crop. The click spotlight is turned off because it boxed the wrong lines (Monaco's hidden textarea).
- **Step 6 callout covered an icon, crop cut "Copy Image":** removed the SVG callout (the article explains SVG). The export steps are now full-frame because they have to include the top-right download bubble, so nothing in the Actions panel is cut off. At 1280 px, Mermaid's 30 % sidebar cut off Kroki and Copy Markdown, so `setup` drags the pane divider (`[data-pane-resizer]`) to 40 %. All Actions buttons fit.
- **Step 7 note silently failed / bled from step 6:** "PNG size" is a bare text node with no element of its own, so `{ text: "PNG size" }` matched nothing (this caused render 1's failure). I targeted the toggle group instead (`[role=group]:has([data-value=width])`, found with a short Playwright DOM probe), and the callout now shows above Auto/Width/Height. `unmark` after the click clears it, and a 2 s hidden step between the SVG and PNG steps lets the SVG bubble fade, so nothing carries into the next step.
- **Downloaded bubble:** both export steps end with the bubble on screen. A pause of about 0.7 to 1.3 s after the click works. Longer pauses let the bubble start fading (it lasts about 2.8 s).

## Other problems
- The first zoom attempt used `end: 30` to hold the zoom through the GIF's final hold. It spilled into the next three steps. `end` is in seconds from the step start and isn't clamped to the step, so I set it to the measured step length (9.27 s) with a 0.05 s out-ramp (compose only).
- Inspect's fast mode once typed `G[]Road trip]` (Monaco bracket auto-close race). The real renders typed it correctly every time.
- `inspect` doesn't list the Actions panel's PNG/SVG buttons, so they use text targets as before.

## Remaining warts
- The very last frame of `06-download-as-svg.gif` (1 of 63) drops the bubble, so it flickers for one frame right before the loop. The PNG still and the rest of the hold show it.
- Steps 6 and 7 are full-frame GIFs (960 px wide for a 1280 px page, 0.75×). The Actions labels are about 10 px: readable, but not as crisp as the cropped steps.
- In `video.mp4` only (not the GIFs, which have no captions), the step 6 caption pill partly covers Copy Markdown / Load Gist.

## Assessment
I opened every GIF, every PNG and the article. All seven steps now show a visible change, the typed code is easy to read, both exports end on a real "Downloaded" confirmation, and the article has a proper title, an intro and bold UI labels, so it can be pasted straight into a help center. The weakest parts are the two export GIFs: they have to be full-frame to show the bubble, so their panel text is small, and the SVG GIF has a one-frame flicker at the loop point. I'd call it about 92 % of the way there.
