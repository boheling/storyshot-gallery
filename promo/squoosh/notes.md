# Squoosh promo (v2): build notes

**Request:** "Make a short promo video of Squoosh (https://squoosh.app), Google's in-browser image compressor — show how it shrinks an image while you compare before/after. For a landing page / social post."

## Stats
- Wall clock: 04:06:52 → 04:15:55 PDT (`date`), about 9 minutes.
- Full renders: 2. Compose-only runs: 1. Inspect runs: 7, used to find targets and to test slider positions and quality settings before rendering.
- Output: 23.3 s, 1920x1080, `pitch` type. Captions, synth music (120 bpm) and SFX, no voiceover.
- The plan was auto-confirmed ("ok"): pitch, about 20 s, 7 shots, no voice, upbeat music, 16:9.
- Storyshot warnings: none in any render or compose (no dead air, no near-blank frames, no caption-placement warnings).

## Shot list

| time (s) | shot | caption |
|---|---|---|
| 0.0–2.2 | Intro card | Squoosh / Shrink images **right in your browser** |
| 2.2–4.6 | Landing page, 1.3x zoom onto the demo row, click the red-panda "Large photo" demo | Drop in any image, or **try a demo** |
| 4.6–7.4 | Drag the before/after split handle left, right, then back | Drag to compare **before / after** |
| 7.4–10.0 | 1.7x zoom on the codec dropdown. The native menu opens on screen and WebP is picked | Switch the codec to **WebP** |
| 10.0–12.6 | 2.2x zoom on the Quality slider while `slide` drags it from 75 to 60 | Set quality to **60** |
| 12.6–14.8 | 3x zoom on the bottom-left badge, with "2.79 MB" marked | Original: **2.79 MB** |
| 14.8–17.2 | 3x zoom on the bottom-right badge: ↓82%, "509 kB" marked, slider reads 60 | WebP: **509 kB, 82% smaller** |
| 17.2–20.0 | 1.5x zoom on the eye while the split handle is dragged across it | Up close, **hard to tell apart** |
| 20.0–23.3 | End card (fades in; fully visible from about 20.5 s, so about 2.8 s fully readable) | Squoosh / Free, private, **no upload needed** / Try it at squoosh.app |

## Reviewer issues and how I fixed them
- **End card too short:** I removed any `duration` from the end card, so it uses the new default. It now runs 3.3 s, and I checked extracted frames: it is fully opaque from about 20.5 s to 23.3 s, roughly 2.8 s.
- **Codec dropdown never opened:** I used the new `select` action on the second codec `<select>`. Frames at 8.6 s and 9.2 s show the native option list open (Original Image … WebP v2), the cursor moving to "WebP", and the panel then switching to WebP options. A 1.7x zoom makes it readable.
- **Tiny quality slider:** I replaced the pixel `drag` with `slide: { target: { css: "input[type=range]", nth: 1 }, to: 0.594 }` (nth 0 is WebP's Effort slider) and zoomed 2.2x on the same target. The live value bubble (74.0 → 60) and the "60" label are legible. The track maps non-linearly to the value (0.5 gave 50, 0.6 gave 60.6, 0.7 gave 71.3), so I tuned the position with inspect runs until it landed on exactly 60. A fractional "60.6" would have looked odd.
- **Original size never on screen:** I added two payoff steps. One zooms 3x on Squoosh's own left badge (2.79 MB, `mark: "2.79 MB"`) and the next on the right badge (↓82%, 509 kB, `mark: "509"`). Both captions are at the top, so the badges at the bottom stay clear. In render 2 a 2.4x zoom still left the numbers small, so one compose raised it to 3x.
- **Debatable "still sharp" at quality 20:** I tested WebP at quality 50, 60 and 70 with inspect screenshots, cropped around the split at about 2.5x. At 50, fine white whiskers were slightly smeared on the compressed side. At 60, the eye and the fur across the seam looked continuous. I chose quality 60 (509 kB, 82% smaller, numbers read from Squoosh's UI, not computed). I also dropped "sharp" and claim only what the last shot shows: with the split line across the eye at 1.5x zoom, the two halves are hard to tell apart.

## Other problems
- **Decode/encode waits:** after the demo click, a hidden step waits for "862" kB, which avoids the dark-canvas near-blank frame v1 had. After the quality change, a second hidden step waits for "509" so the badge shots never show a mid-encode size. In the slider shot the size still reads 704/783 kB while encoding; that is real and not claimed as the result.
- **Elements without stable names:** the size badges and split handle are still point targets (taken from inspect screenshots at 1600x900), so they would break if Squoosh changes its layout. The sizes are hard-coded in captions; they are deterministic for this demo image and settings, and the video shows Squoosh's own numbers matching them.

## Quality assessment
I checked extracted frames from the final file. It is a clean, honest promo: the real app on a real photo, a visibly opening codec menu, a readable quality slider, and the payoff that v1 lacked, 2.79 MB → 509 kB (82% smaller), shown on Squoosh's own badges at 3x. Weaker spots:
- The highlighter marks on the size numbers are only a subtle green tint; the zoom and the caption do most of the work.
- Zooming into the bottom-corner badges clamps the camera to the edge, so the badges sit off-centre.
- At 23 s it is a little long for a social loop.
