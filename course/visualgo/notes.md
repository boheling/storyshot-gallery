# VisuAlgo lesson: How Dijkstra finds shortest paths

**Request:** "Make a short lesson video that makes a hard algorithm idea visible, using VisuAlgo (https://visualgo.net). For example, why merge sort is faster than insertion sort on a large shuffled array, or how Dijkstra's algorithm finds shortest paths. For first-year CS students."

- **Topic chosen:** Dijkstra's algorithm on VisuAlgo's `/en/sssp` page, using the fixed example graph "CP4 4.14 D/W" with source 0. No fallback to Compiler Explorer was needed: VisuAlgo has no login wall for this, does not block automation, and its playback controls (go to beginning, next frame) can be driven one frame at a time.
- **Why Dijkstra and not merge vs insertion sort:** VisuAlgo writes every Dijkstra value on screen: d[v] under each vertex, the priority queue and each relax() in the status panel. That means every narrated number can be checked against the screen. The sorting page doesn't give a clean comparison count I could narrate reliably.
- **Wall-clock:** 04:17:43 → 05:25:04 PDT, about **67 minutes**.
- **Renders:** 2 full renders (out of 5 allowed), plus 2 composes.
- **Output:** 3:34 at 1920×1080. Kokoro `af_heart` voice, no music. Includes the SRT file and YouTube chapters.

## Structure
Intro (what you'll learn) → Concept card "Relax an edge" (with the SVG diagram `relax.svg`) → the graph → Part 1: run Dijkstra from 0, stepping one frame at a time with VisuAlgo's own animation → **Question card** "Which vertex is finalized next?" (5 s think countdown) → answer (vertex 4, at 51) → Part 2: finish the run → final distances and shortest-path tree → Recap end card.

## Problems and how I solved them
1. **The graph is random on every visit.** Both the default graph and Example Graphs → Weighted load a random graph, and the panel colours change too. Fix: in `setup:`, load the named fixed example "CP4 4.14 D/W" (Example Graphs → Weighted → CP4 4.14 D/W). Before writing any narration, I stepped through all 19 frames in a probe script and recorded the status text of each one.
2. **The animation is too fast to narrate.** At 1x it is about 0.5 s per frame. Fix: click Original, then "go to beginning" right away, which rewinds and pauses on frame 0. After that, each storyboard step clicks "next frame" 1–2 times, so each step shows a known frame. I turned off the spotlight on those clicks (`highlight: false`) and turned off the follow camera (`follow: false`) so the camera doesn't zoom to the playback bar.
3. **e-Lecture overlay on first visit.** Fix: `dismiss: ✘` in setup.
4. **Render 1 recorded the wrong frames.** My scripted edit removed the "go to beginning" click, so the animation ran freely. The tooling didn't flag it. I found it by reading the YAML and fixed it before render 2.
5. **The Weighted sub-menu covered vertex 4 in the first shot.** Fix: open Dijkstra(s) in setup, so only the small "s = 0 / Original / Modified" bar stays visible. Step 2 now uses a `note` on the source input instead of a click.
6. **Readability.** The viewport is 1280×720 with `frame: false`, so the page is scaled 1.5× in the 1080p output. Zooms of 1.3× frame the graph and status panel together at four key moments. The zooms start 1.8 s into a step, so they peak after the new frame is on screen. In the first compose, the zoom peak showed the previous frame.
7. **Captions covered vertex 4 and its "51" during zooms.** Fix: `captionPosition: top` on the four zoomed steps (done with compose).
8. **Check warnings.** `check` warned that three steps did 3–4 things each. I split them into single-idea steps. The final check and compose have no warnings.

## Narrated values vs. what is on screen
Checked against frames extracted from the final video (status panel text and the red d[v] labels).

| Step (time) | Narration says | On screen (VisuAlgo status / labels) | OK |
|---|---|---|---|
| Graph (0:27) | weights 9, 75, 95, 42, 31, 51, 19 | edge labels 9, 75, 95, 42, 31, 51, 19 | ✔ |
| Start (0:59) | d[0]=0, others Inf | "source, 0"; 1–4 show Inf; "d[0] = 0, PQ = {(0,0)…}" | ✔ |
| Explore 0 (1:08) | d[1] becomes 9 | "relax(0,1,9) … d[1] = 0+9 = 9" | ✔ |
| Vertex 0 final (1:19) | vertex 2 gets 75; 0 is final | label 75 under 2; "d[0] = 0 is final"; 0 is orange | ✔ |
| Smallest (1:29) | PQ holds 1 at 9, 2 at 75; 1 next | "PQ {(9,1), (75,2), (999,3), …} Exploring u = 1, d[u] = 9" | ✔ |
| 9+95 (1:40) | 104, worse than 75, no change | "relax(1,2,95) … 9+95 > 75, so there is no change" | ✔ |
| Vertex 4 (1:50) | 9+42 = 51; 1 is final | "d[4] = 9+42 = 51" then "d[1] = 9 is final"; label 51 | ✔ |
| Question (1:58) | 2 waits at 75, 4 just got 51 | labels 75 and 51 | ✔ |
| Answer (2:13) | vertex 4, at 51 | "PQ {(51,4), (75,2), (999,3)} Exploring u = 4, d[u] = 51" | ✔ |
| Vertex 3 (2:25) | 51+31 = 82; 4 final | "d[3] = 51+31 = 82"; label 82; 4 orange | ✔ |
| Vertex 2 (2:35) | 2 next at 75 | "PQ {(75,2), (82,3)} Exploring u = 2, d[u] = 75" | ✔ |
| 75+51 (2:41) | 126, worse than 82; 2 final | "75+51 > 82, no change", "d[2] = 75 is final" | ✔ |
| Vertex 3 (2:51) | edge back to 1 can't beat 9 | "relax(3,1,19) … 82+19 > 9, no change" | ✔ |
| Tree (2:59) | all final, red edges = SSP tree | "This is the SSSP spanning tree from source vertex 0"; all orange | ✔ |
| Final (3:07) | 0, 9, 75, 82, 51; best route to 3 is 0→1→4→3 | labels 0, 9, 75, 82, 51; red edges 0→1, 1→4, 4→3 | ✔ |

## Quality assessment
The lesson is accurate and paced for teaching. Each number the narrator says appears on screen at that moment, and the question about vertex 2 at 75 versus vertex 4 at 51 targets a real misconception: first found is not the same as closest. Weak spots: the random panel colours are a bit loud. The d-value under vertex 1 ("9") partly overlaps the 1→4 edge in VisuAlgo's own layout. In unzoomed shots the status-panel text is small, readable at 1080p but not on a phone. The Kokoro voice is clear, though somewhat flat.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
