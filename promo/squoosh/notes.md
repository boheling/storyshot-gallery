# Squoosh promo — build notes

## User request
"Make a short promo video of Squoosh (https://squoosh.app), Google's in-browser image compressor — show how it shrinks an image while you compare before/after. For a landing page / social post."

## Stats
- Wall clock: 21:19:46 → 21:24:41 PDT (about 5 minutes)
- Full renders: 3. Compose-only runs: 0. Inspect runs: 3 (after steps 1, 3 and 4).
- Output: 17.8 s, 1920x1080, `pitch` type. Captions plus synth music and SFX, no voiceover (silent autoplay on social, so captions carry the message).
- The plan was auto-confirmed ("ok"): pitch, about 15–18 s, 6 shots, no voice, upbeat music, 16:9.

## Shot list
0.0–2.2 intro "Squoosh / Shrink images right in your browser" → 2.2–4.6 landing page, zoom onto the demo row, click the red-panda "Large photo" demo → 4.6–7.4 drag the before/after split slider → 7.4–9.6 switch codec MozJPEG → WebP → 9.6–12.0 drag quality 75 → 20 → 12.0–14.2 zoom on the size badge, "2.79 MB → 228 kB, 92% smaller" → 14.2–16.8 drag the split slider again, "Still sharp. Way smaller." → end card "Free, private, no upload needed / Try it at squoosh.app".

## Problems and fixes
- **Upload:** I didn't need a local file. Squoosh offers demo images (`alt: "Large photo"`), so the flow clicks one.
- **Render 1 had a near-blank frame.** The editor showed a dark-grey canvas while the photo decoded, and it fell inside step 1. The compose step did not warn about it. Fix: a `hidden: true` step that waits for the encoded size text ("862" kB) to appear, so the decode time is cut.
- **Caption over the payoff:** the size-badge caption sat bottom-centre over Squoosh's own bottom bar and badge. Storyshot doesn't detect this for point zoom targets. Fix: `captionPosition: top`. In render 2 the cursor also covered the badge; render 3 moved the cursor away.
- **Hero shot too small:** the demo thumbnails were tiny inside the browser frame. Render 3 added a 1.3x zoom on the demo row.
- **Things Storyshot couldn't do:**
  - `select` changes the native `<select>` programmatically, so the dropdown never opens on screen. The codec switch shows as the label changing, not as a menu pick.
  - The quality slider and split handle have no stable accessible names. I used pixel points taken from inspect's screenshot, which is fragile if the layout changes.
  - The final size (228 kB, 92%) was read from an inspect screenshot and hard-coded into a caption. That is deterministic for this demo image, but it is not data-bound.

## Quality assessment
It reads as a clean, believable product promo. The real app runs on a real photo, the split-slider drag clearly demonstrates before/after, and the size-drop payoff ("2.79 MB → 228 kB, 92% smaller") is legible and zoomed. The weaker spots:
- The codec-switch shot is static, because the dropdown never visibly opens.
- The Squoosh UI text in the side panel is small at frame scale.
- At quality 20 the "still sharp" claim is fair at 100% zoom, but a pixel-peeper would see some softening. A quality of about 40 would be a more honest setting.
