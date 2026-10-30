# RCSB PDB 4HHB: hemoglobin structure lesson

**Request:** Make a short lesson video on protein structure using hemoglobin (PDB 4HHB) on RCSB PDB (start at https://www.rcsb.org/structure/4HHB, and use its 3D viewer). Explain WHY hemoglobin is built the way it is: four chains (two alpha, two beta), each holding a heme group that binds oxygen. Show where to find this on the entry page and in the 3D view. Include a quick check-your-understanding question.

- **Wall clock:** 21:47 to 22:36, about 48 minutes. Other gallery builds were running on the same machine, which slowed renders (one took 13.5 min).
- **Renders/composes:** 5 full renders (the limit), 0 composes. Renders 1, 2, 4 and 5 finished; render 3 failed. Shipped render 5. Also ran about 4 fast `inspect --after N` checks to verify targets before rendering.
- **Settings:** `purpose: course`, kokoro voice (af_heart, free and local), no music, 16:9 1080p, `.srt` subtitles and chapters. Video is 3:14 long.

## What's in it
Intro (goals) → Part 1, entry page: title and "Oxygen transport" highlighted; Global Stoichiometry "Hetero 4-mer - A2B2"; the alpha row (chains A, C) and the beta row (chains B, D) boxed in the Macromolecules table, each with a callout; the HEM row in Small Molecules (four instances, one per chain) → Concept card with a custom SVG diagram (α1/β1/β2/α2, each with an Fe-heme) explaining one O2 per heme and cooperativity → click the Structure tab → Part 2, 3D: four colors are four chains; hide the water → **Question card** ("How many O2 can one hemoglobin carry at most?", 4 s think countdown) → answer shown live: hide the Polymer, then Reset Zoom, which leaves just the four hemes (each colored like its chain, held by a histidine) → show the polymer again → recap end card.

## Problems and fixes
1. **Mark scrolled the rows under the sticky header** (render 1). `mark: "Hemoglobin subunit alpha"` scrolled the phrase to the very top, where the site's fixed nav bar half covered it and cut off the Chains column. Fix: `scrollTo` the entity table, then `scroll: -160`, then a box mark on the row with `css: "#table_…-entityId-1 tr:has(> td a[href='/sequence/4HHB#A'])"`, plus a `note` on the chain link. Inspect does not list the chain links ("A", "C") as targets, so I found the selectors with a small Playwright DOM probe.
2. **Camera follow hid the molecule in the 3D part** (render 1). The automatic follow zoomed in on the Components panel I was clicking, so the "answer" shot showed the panel and not the hemes. Fix: `follow: false` on the 3D steps, explicit point zooms on the viewer, and a click on Mol*'s **Reset Zoom** after hiding the polymer so the four hemes fill the view.
3. **The concept narration ran over the wrong picture** (render 1). The long "why" line was on the step after the card, so it played over the Small Molecules table. Fix: moved it into the card's own `say`.
4. **Dragging the WebGL viewer was very slow** (Storyshot couldn't do this). Each drag move re-renders Mol* in headless Chromium, and with the machine under load, two drag moves took about 60 s and gave a 50 s silent stretch (render 2). Render 3 aborted with "drag took over 75s". Fix: dropped the rotation. The narration now tells students they can drag to turn the molecule themselves. So the video never actually rotates the structure.
5. **A callout covered the value it pointed to.** The note on "Global Stoichiometry" was drawn on top of "Hetero 4-mer - A2B2". I removed it in render 5; the highlighter mark and the narration carry it.
6. Unresolved minor issue: about 0.6 s of near-blank viewer while the 3D page loads after clicking the Structure tab. I left it in because it reads as a natural page load.
7. Clicks in the Components panel are point clicks (`x: 1425, y: 415/481`). Every eye button has the same accessible name ("Hide component"), so inspect could not give unique targets. These depend on the 1600×900 viewport and a 220 px scroll.
8. Process slip on my side: a stray `cat > /tmp/x` in one command waited on stdin and hung one probe until I killed it. No other effect.
9. No automation blocking from RCSB. There was no cookie banner and no login.

## Assessment
Looking at the extracted frames, a student would very likely come away with the core idea. The A2B2 → alpha A/C, beta B/D → four HEM chain is shown with highlights on the real page, the diagram card states the "why" (one O2 per heme iron, cooperativity), and the question is answered by visibly stripping the protein away to show exactly four hemes. Weaknesses: the macromolecule and ligand tables are small in the full-page frames (readable at 1080p, cramped on a phone), cooperativity is only explained in words on one card and never shown, and the 3D molecule never rotates. A teacher may want to demo the rotation live.

## Files
`video.mp4`, `storyboard.yaml`, `hemoglobin-diagram.svg` (concept card image), `poster.jpg` (1280 px, 3D view with four colored chains), `rcsb-lesson-hemoglobin.srt`, `rcsb-lesson-hemoglobin.chapters.txt`.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
