# Excalidraw: export as PNG (docs GIFs + article)

**Request:** "We need help-center GIFs and a short article for Excalidraw (https://excalidraw.com): how to export your drawing as a PNG image — including choosing a transparent or white background — and how to copy it to the clipboard. Draw something tiny first so there's something to export."

- **Type chosen (by the skill):** `docs`: silent, 8 numbered steps, per-step cropped GIFs + PNG stills + README.md article. No voice and no music. The full MP4 is 47 s at 1920x1080.
- **Plan confirmation:** user unavailable, so assumed "ok".
- **Wall clock:** 21:41:52 to 21:47:40 PDT, about 6 minutes.
- **Renders / composes:** 2 full renders, 0 composes. Also ran 4 fast `inspect --after N` probes.
- **Flow:** draw a rectangle (light blue fill), then label it "Hello", then menu, then Export image..., then Background off (transparent), then Background on (white), then PNG, then Copy to clipboard.

## Problems and how they were solved
1. **Copy to clipboard fails inside Storyshot.** Clicking "Copy PNG to clipboard" opens Excalidraw's "Error: Couldn't copy to clipboard." dialog. Storyshot's headless Chromium context has no clipboard-write permission, and the storyboard has no `permissions` option or JS-eval action to grant it. I did not patch Storyshot. Step 8 instead *points at* the button (spotlight move plus a "Then paste anywhere" note) without clicking it. The article text describes the click and the Shift+Alt+C shortcut. So the GIF never shows a real successful copy (no "Copied" toast). This is a Storyshot gap.
2. **The PNG download shows no visible result.** The click works, but a download has no on-page feedback, and Storyshot can't show the browser's save dialog or download bar. The GIF shows the click only, and the doc text explains that the browser downloads the file or asks where to save it.
3. **The first crop of the background steps missed the payoff.** Docs clips are cropped to the union of the elements a step touches. Clicking the Background toggle cropped to the toggle only, which hid the preview where transparent vs. white is actually visible. Fix: a `note` on `.ImageExportModal__preview__canvas`. The crop now includes the preview, and the note labels it ("Checkerboard = transparent" / "White behind the drawing").
4. **No article title in the guide.** By default the README heading was "Excalidraw docs export png". The guide doesn't document a title option. I found `article: { title, intro }` in the installed package's checker/outputs (node_modules) and used it.
5. **False-positive warning:** "near-blank frames" on step 3. That frame is just a mostly empty white canvas under the spotlight, not a loading page. I ignored it.

## Assessment
The article and GIFs are usable in a help center as they stand. The steps are short, the captions and notes are correct, and the two background GIFs show the transparent vs. white difference clearly because they include the preview. The weak spots are the last two steps: "Download the PNG" ends on a click with no visible result, and "Copy to clipboard" only highlights the button, because the real copy fails in Storyshot's browser. A writer may want to replace step 8 with a real screen capture showing the "Copied" toast, and could trim step 1 (about 10 s, the longest GIF).
