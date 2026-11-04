# US midterm elections for 3rd–5th graders: an explainer made of scenes, with no website in it

**Request:** Make an explainer video for 3rd–5th graders about what a midterm election is and why it matters: what Congress actually does, why there is an election in the middle of a President's term, what is on the ballot all the way down to the school board, and why fewer people showing up makes each vote count for more. Keep it strictly non-partisan.

Asked on 4 November 2026, the day after Election Day.

- **Type:** `explainer` (`purpose: explainer`, Storyshot 0.8.0), 16:9 1080p30, 3:51 (231.1 s), 10 chapters.
  Nothing is recorded and there is no `url` in the storyboard: all 10 steps are
  [HyperFrames](https://github.com/heygen-com/hyperframes) scenes the agent wrote.
- **Voice:** Kokoro `af_heart` at speed 0.95, free and local. Slower than the default because the
  audience is eight to eleven years old.
- **Sound:** Storyshot's own synth soundtrack, `calm` at 72 bpm. −13.8 LUFS, LRA 5.2.
- **Captions:** the narration burned in (`subtitles: burn`, 124 lines, word-by-word highlight), plus
  `subtitles.srt` and `chapters.txt`.
- **Wall-clock time:** 1 h 15 m from the request to the finished file. Roughly: 16 min for the sources,
  the story, the narration, the scene kit and the brief (the voice synthesises in the background during
  this); 53 min of five sub-agents writing ten scenes in parallel, overlapping my own review and two
  fixes; 4 min 16 s to render. For comparison, the Chinese CRISPR explainer in this section took 46 min
  with six agents over eleven scenes — this one spent longer because the scenes went through more preview
  rounds and one cut was reworked after the first pass.
- **Cost:** none beyond the agent itself. Local voice, local render, synth music, no API calls for media.

## Files
- `video.mp4`, `poster.jpg` (the term bar with the midterm pin, 1:30), `subtitles.srt`, `chapters.txt`
- `storyboard.yaml`: 10 `scene:` steps with their narration, the voice, the theme and the two scene-kit
  files. Every number on screen is sourced in the header comment.
- `scenes/`: the 10 scene files, plus `scenes/kit/kit.css` and `scenes/kit/kit.js`, which the storyboard
  loads before every scene (`scenes: { css: …, js: … }`). Copy the whole folder and it renders as is.

## What it explains
Ten questions, one picture each. Who decided when recess is, and who decides the same kind of thing for a
whole country → the President does not make the laws, Congress does, in two rooms of 435 and 100 → every
state sends two senators, but California has 52 House seats and Wyoming has 1 → a four-year term bar with
the pin landing dead centre, which is where the word *midterm* comes from → what is actually on a 2026
ballot, ending on the school board → Congress writes the rules and holds the money (Article I, Section 9,
drawn as a gate on the treasury jar) → the midterm as a report card: in the last 23 midterms the
President's party lost House seats 20 times → fewer people show up, 64 out of 100 in 2024 against 45 in
2022, and a real state race that tied at 11,608 votes each and was settled by drawing a name out of a bowl
→ what a ten-year-old can actually do → a recap chain back to the opening question.

Sources are printed small in the corner of the scene where their number appears: the U.S. Constitution
(Art. I, and §9 cl. 7 for the money clause), the Reapportionment Act of 1929 for the 435, the 2020 census
apportionment, Pew Research Center and the U.S. Elections Project, the University of Florida Election Lab,
The American Presidency Project at UCSB, and AP for the Virginia tie. The four spending buckets are the
one illustrative picture in the film and say so on screen.

## Non-partisan by construction
The film explains the machinery and takes no side, and that is enforced in the kit rather than left to
each scene:

- No party, candidate, mascot, slogan, map or election result appears anywhere.
- **The palette contains no red/blue pair at all**, so the film cannot accidentally code a side. Teal is
  the House, lavender the Senate, peach local offices, green money, yellow "you, the viewer, and whatever
  is being pointed at right now".
- Where two options share a frame — "Keep going" / "Slow down", the two tied candidates — they are the
  same shape in the same colour and differ only in their words. Each pair is literally one CSS class.
- The row of 23 midterms is labelled "the President's party" and nothing else; which party that was in
  any given year is never shown. Lost seats are grey, gained seats yellow.
- The two folded slips in the bowl are the same drawing, and the one drawn shows a blank line where a
  name would be. The President is a plain grey figure with a text label, never a likeness.

## Nothing about the election that had just happened
It was made the day after the 2026 election and states no result from it, because the agent's knowledge
ends in May 2026. The 2026 figures it does show are scheduled facts rather than outcomes: 435 House seats,
33 Class 2 Senate seats, 36 governorships. The turnout numbers are from completed cycles.

## How it was made
1. **Facts first**, then the narration, written at a 3rd–5th grade reading level: short sentences, one
   idea per scene, every number checked before a word was drawn.
2. **A scene kit.** `kit.css` fixes one friendly dark-navy world, chunky rounded shapes and a 34 px type
   floor (higher than Storyshot's 28 px, because of the audience). `kit.js` holds the verified numbers
   (`Kit.US`, `Kit.Y2026`, `Kit.TURNOUT`, `Kit.MIDTERMS`, `Kit.VA_TIE`), a seeded RNG, and builders for
   little people, seat dots, ballot rows, the Capitol and the ballot box.
3. **A brief** (`SPEC.md`, not shipped here) with the per-scene beats, the colour meanings, the
   non-partisan rule, and exact pixel coordinates for the two cuts where an object carries from one
   agent's scene into another's.
4. **Five sub-agents wrote the ten scenes in parallel**, paired so most seams stayed inside one agent.
   Each ran `storyshot scene storyboard.yaml --step N`, read its own stills and the layout check, and
   fixed what it saw. All ten came back with no lint findings and a clean layout check.
5. Timing comes from `S.at(k)`, the start of narration phrase *k*, so every reveal lands on the words
   that name it and would re-time itself if a line changed.

## Problems worth recording
- **The kit's ballot box read as a briefcase.** At 460 px the slot rectangle looks like a suitcase handle.
  The fix, found by the agent drawing scene 1 and passed to the other two scenes that use it, is a folded
  paper slip entering the slot, clipped so the paper disappears as it goes in.
- **A border-box mismatch nearly broke a seam.** A `.ballot` declared 360 × 300 renders 370 × 310 under
  the browser default, which would have made the cut between scenes 4 and 5 jump 10 px.
- **The ballot → money cut was reworked.** It first went from a full ballot sheet straight to a single
  card in an otherwise empty frame, which then sat there for two phrases. Scene 6 now opens on scene 5's
  exact last frame and the Law card grows out of the shrinking ballot.
- **A dimmed ballot-row colour failed the layout check's contrast test** on the cream sheet and was
  changed in the kit rather than worked around per scene.
- **Two agents independently hit the same trap:** in the preview project two elements carry the
  composition id — the outer HyperFrames mount and the scene's own root — so `getElementById` returns the
  mount, and anything appended there renders outside the scene's scoped styles.

## What is weak
- The recap opens on a near-empty frame for about a second, on the word "So".
- The spending buckets are shapes, not a budget. They are labelled illustrative, but a viewer who skips
  the credit could over-read them.
- The film says "about a third of the Senate" and shows a third-filled ring; it never explains the
  six-year terms and three classes that produce that third. That is the right omission for the age, but
  it is an omission.

## Assessment
It does the thing a civics explainer for this age usually fails at: it answers "why should I care" with
machinery a child can see — who writes the rules, who holds the money, and what happens when fewer people
show up — instead of telling them voting matters. The Virginia bowl is the detail that will survive the
week. The main risk in a film like this is looking partisan, and the way to beat it turned out to be
removing the means: a palette with no red and no blue in it cannot take a side by accident.
