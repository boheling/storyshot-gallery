# draw.io beginner tutorial: build notes

**Request:** Make a tutorial video for new hires who've never used diagrams.net (https://app.diagrams.net): how to start a blank diagram, add a few flowchart shapes, connect them, label them, and export the result as PNG. Then a second quick example (e.g. a decision diamond with yes/no branches) so they see the same steps work for any diagram.

- **Wall clock:** 21:42 to 22:26 PDT (about 44 min, including about 30 min of renders)
- **Renders:** 4 full renders (1 failed at step 5, 3 completed). 0 composes. Limit was 5.
- **Output:** `video.mp4` (5:31, 1080p, free local kokoro voice, soft music), `app-tutorial-flowchart.srt`, `app-tutorial-flowchart.chapters.txt` (7 chapters), `storyboard.yaml`, `poster.jpg`
- **Plan (the "ok" was assumed):** tutorial type; intro with goals; Part 1 File > New... > name > Blank Diagram > Create; Part 2 drag oval / rounded rectangle / oval; Part 3 connect them with the hover arrows; Part 4 click and type to label; Part 5 File > Export as > PNG... > Export > name > Save; Part 6 a second example on a new page (diamond "Tests pass?" with labelled Yes/No arrows to "Deploy" and "Fix the bug", then the same export); end card recapping the steps.

## Problems and fixes

1. **draw.io has almost no accessible targets.** Sidebar shapes are unnamed `a.geItem`, the canvas is SVG, and menu items and dialog contents were not listed by `inspect`. Fix: I dragged shapes from fixed points in the sidebar to fixed points on the canvas (a drop sets the shape's top-left corner, not its centre). I clicked shapes by their coordinates, used `{ text: "New..." }` / `{ text: "Export as" }` / `{ text: "PNG..." }` for menus, and used `{ role: button, name: Export/Save/Create }` for dialogs. These targets were not listed, but they worked.
2. **Connecting with the blue hover arrows failed in `inspect`.** In fast mode the drag started before draw.io had shown its hover arrows, so no edge was created. Fix: before each drag I added `waitFor: { css: "img[title^='Click to connect']", nth: 0 }`. It now works in both fast and real recording.
3. **Render 1 failed: the menu switched from File to Edit.** At tutorial pace, the cursor's diagonal path from "File" to "New..." crossed "Edit" in the menubar. draw.io switches menus on hover, so the click landed in the wrong menu and the typed name turned into shapes. `inspect` could not catch this because it moves the cursor instantly. Fix: a `move` straight down into the File menu before clicking "New...".
4. **Narration out of sync with the dialogs (render 2).** The Export click ran at the start of a step whose narration explained the options, so the voice described the Image dialog while the Save dialog was on screen, and a highlight mark sat on the wrong dialog. Fix: I split that into a look-only step that marks the option and a separate "Click Export" step.
5. **The finished diagrams were never shown whole (render 3).** The camera follows each action and stays zoomed, so the viewer never saw a full view of either result. Fix: after each diagram I added a look-only step with `follow: false` and a fixed zoom on the diagram.
6. **Things Storyshot could not show:**
   - It can't show the downloaded PNG. The download happens inside the browser, so the narration says it "lands in your Downloads folder", but the file itself is never shown.
   - There is no double-click action. I taught "select and type" for labels instead. This works in draw.io but differs from the double-click most people expect.
   - The `check` warnings about several actions in one step remain in the second example. I accepted them on purpose because that part repeats steps the viewer has already seen.
7. **Site behaviour:** no blocking. A fresh browser opens straight into an "Untitled Diagram" with no storage dialog. That differs from what some users with saved settings see.

## Assessment (after viewing extracted frames)

A beginner could follow it. Every action is its own narrated step, the camera zooms in on small controls, and both finished diagrams and both export dialogs are clearly visible. The main gaps are that the exported PNG is never shown and that the sidebar shapes are never named on screen beyond "the oval" and "the rectangle", so a viewer has to match shapes by eye. At 5.5 minutes it is a little slow for anyone with some diagramming experience, but the pace suits the stated audience.
