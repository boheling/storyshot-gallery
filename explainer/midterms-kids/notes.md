# US midterm elections for 3rd–5th graders: an explainer made of scenes, with no website in it

**Request:** Make an explainer video for 3rd–5th graders about what a midterm election is and why it matters: what Congress actually does, why there is an election in the middle of a President's term, what is on the ballot all the way down to the school board, and why fewer people showing up makes each vote count for more. Keep it strictly non-partisan.

Asked on 4 November 2026, the day after Election Day.

- **Type:** `explainer` (`purpose: explainer`, Storyshot 0.8.0), 16:9 1080p30, 3:51 (231.1 s), 10 chapters.
  Nothing is recorded and there is no `url` in the storyboard: all 10 steps are
  [HyperFrames](https://github.com/heygen-com/hyperframes) scenes the agent wrote.
- **Voice:** Kokoro `af_heart` at speed 0.95, free and local. Slower than the default because the
  audience is eight to eleven years old.
- **Sound:** Storyshot's own synth soundtrack, `calm` at 72 bpm. −13.8 LUFS, LRA 5.2.
- **Captions:** none on the picture. `subtitles.srt` and `chapters.txt` only — the burned-in
  karaoke line was removed on 2026-11-06 (see "Revised 2026-11-06" at the end).
- **Wall-clock time:** 1 h 15 m from the request to the first finished file, plus about 1 h 10 m to
  repaint it from a dark world into this light one (see "The look, and why it changed" below). Roughly: 16 min for the sources,
  the story, the narration, the scene kit and the brief (the voice synthesises in the background during
  this); 53 min of five sub-agents writing ten scenes in parallel, overlapping my own review and two
  fixes; 4 min 16 s to render. For comparison, the Chinese CRISPR explainer in this section took 46 min
  with six agents over eleven scenes — this one spent longer because the scenes went through more preview
  rounds and one cut was reworked after the first pass.
- **Cost:** none beyond the agent itself. Local voice, local render, synth music, no API calls for media.

## Files
- `video.mp4`, `poster.jpg` (the term bar with the midterm pin landing on year 2, 1:30), `subtitles.srt`, `chapters.txt`
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

## The look, and why it changed
The film was first drawn on a dark navy ground, because it reused the world built for the Chinese CRISPR
explainer in this same section. That was wrong: a civics explainer for eight- to eleven-year-olds should
look like a classroom poster, not a lab readout. It was repainted — warm paper, dark navy ink, chunky
shapes, thick strokes — with the five story colours darkened so they hold on light: teal House, violet
Senate, deep pink local, green money, amber "you".

Two problems the light ground created, and how they were settled once in the kit rather than ten times
in the scenes:

- **The burned-in subtitles are white with a dark outline**, which sits badly on paper. Every scene now
  carries a dark caption bar across the bottom `var(--safe-bottom)` (173 px), solid across the part the
  lines actually occupy and feathered only in its top 24 px, so no line straddles a soft edge. It reads
  as the film's lower third. Scenes were already required to keep their content above that band.
- **Amber text measures about 2.8:1 on paper** and fails the layout check, while darkening the token
  would have dulled every amber shape in the film. So amber words carry an ink outline (`.hl`) at display
  size and a darker shade of the same hue (`--you-ink`) at label size, and amber *fills* are untouched.

The conversion was done by five sub-agents under one rule — change the look and nothing else, no position,
duration or cue moves — and each re-previewed its own scenes until the lint and layout checks were clean
again. Things that did not survive the move and needed a different answer: every glow (a halo on paper is
a stain, so each became a flat tinted panel), the cream sheets (now white sheets with their own shadow and
three weights of rule inside, so a form still reads as a form), the 435 seat dots inside their own teal
wing (1.75:1 on white, so the dots are now the same hue inked down), and the School board row (its band
went from light peach to dark magenta, so its text flipped from ink to white).

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
2. **A scene kit.** `kit.css` fixes one world — warm paper, dark navy ink — chunky rounded shapes and a
   34 px type floor (higher than Storyshot's 28 px, because of the audience). `kit.js` holds the verified numbers
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
- A few subtitle lines sit high enough to clip the caption bar's top edge by a glyph's ascender. Legible,
  because the text is outlined, but visible if you look for it.
- The film says "about a third of the Senate" and shows a third-filled ring; it never explains the
  six-year terms and three classes that produce that third. That is the right omission for the age, but
  it is an omission.

## Assessment
It does the thing a civics explainer for this age usually fails at: it answers "why should I care" with
machinery a child can see — who writes the rules, who holds the money, and what happens when fewer people
show up — instead of telling them voting matters. The Virginia bowl is the detail that will survive the
week. The main risk in a film like this is looking partisan, and the way to beat it turned out to be
removing the means: a palette with no red and no blue in it cannot take a side by accident.

## Revised 2026-11-06

**It had no ending.** Motion stopped three seconds before the file did, on the fullest frame of the
film: the whole chain, every label, all seven links. The recap now gives it back — the term bar, the
House and Senate dots, the local rows, the law, the jar of money and the crowd all dissolve over the
last 2.3 seconds, and what is left is the question from scene 1, *Who gets to decide?*, with its
answer under it: the three who walked over, still walking the last few steps into the box.

**The burned-in subtitles are gone** (`subtitles: burn` → `subtitles: true`; `subtitles.srt` still
ships). That also retires the dark caption bar described above, and at no cost: it is drawn as
`height: var(--safe-bottom, 173px)`, and storyshot injects `--safe-bottom: 0px` whenever subtitles
are not burned in (`src/scenes.mjs:121`), so the bar is already zero-height in every scene. The rule
can stay in the kit; it costs nothing and comes back correctly if subtitles are ever burned again.
(An earlier note here said the bar was still being drawn. It is not — that was wrong.)

Storyshot changed with it: the `calm` soundtrack now resolves on the tonic instead of being cut off
mid-loop, the picture settles to the film's ground over the last 0.9 s, and `preview_scene` warns
`frozen_ending` when the last scene has not changed for 2.5 seconds — a warning this film's old recap
triggered, which is how the check was verified. Re-rendered from the same storyboard and narration;
231.1 s, unchanged.

## Revised 2026-11-07 — the ending, again

Yesterday's fix was the wrong fix. The frozen last frame, the truncated music and the missing fade
were all real, and they are all still fixed, but they were not what made these films feel like they
had no ending. > 结尾的问题不是渐变与否，而是没有很好的结论，结束语，展望，思考这样一个句点的感觉

— which is exactly right.

A recap is not an ending. It re-counts what the film already said and then runs out — and every one
of these films had its last spoken line land on a list item, a caveat or a footnote. No fade repairs
a script with nothing left to say.

So each film now has **a closing scene of its own, after the recap** (step 11, `scenes/close.html`, 35.7 s), written to do three
things: say what this actually means now that the viewer has seen all of it, name what is still open,
and leave one thought — in the film's own images, with the final words landing on it.

It goes back to the question scene 1 opened with and answers it. *Somebody decides everything — when
recess is, what is for lunch, where the money goes. The only question is ever who.* Right now it is
the grown ups who show up; in a few years it will be you. Not dramatically — just a line, a curtain,
a piece of paper, on a Tuesday in November. The last words, *so when it is your turn, show up*, land
on the kid walking the line into the booth, and the curtain closes over them while the file is still
running. 231.1 s → 265.5 s.

The rule is now in `skills/storyshot/SKILL.md` ("How an explainer ends"), rewritten to lead with the
writing rather than the picture, and `frozen_ending` now says to read the last `say:` line before
touching the animation. One trap worth recording: the voice breaks cues on **commas** as well as full
stops, so a line like "a line, a curtain, a piece of paper" is three cues — key beats to what `cues`
prints, not to the sentences you counted.

The recap in each film keeps its dissolve but no longer holds a long tail for an ending it no longer
has: `tail` 3.5 s → 2.2 s, and the dissolve now lands with its last words, so it reads as a page turn
into the closing scene.
