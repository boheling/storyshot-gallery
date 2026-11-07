# The mRNA cancer vaccine (zh): one dose per patient, and how it gets made

**Request:** 帮我做一个关于 moderna 的 mRNA 黑色素瘤癌症疫苗的科普，和在此基础上个性化医疗的话，需要大概什么流程，适用人群，和未来可能适用的癌症类型

Asked on 4 November 2026, eleven days after the Phase 3 result was presented at ESMO. The request has four
parts — the science, the personalised-medicine workflow, who it is for today, and which cancers come next —
and the film is built so each one has its own chapters rather than being folded into a single arc.

- **Type:** `explainer` (`purpose: explainer`, Storyshot 0.8.0), 16:9 1080p30, 4:58 (297.8 s), 11 chapters.
  Nothing is recorded and there is no `url` in the storyboard: all 11 steps are
  [HyperFrames](https://github.com/heygen-com/hyperframes) scenes the agent wrote.
- **Voice:** Qwen3-TTS 0.6B CustomVoice, `dylan`, free and local on an Apple Silicon Mac. A `pronounce` map
  spells out the abbreviations the model otherwise mangles (`mRNA` → m R N A, `PD-1` → P D 一, `DNA` → D N A).
- **Sound:** Storyshot's own synth soundtrack, `calm` at 68 bpm, no clicks and no whooshes. −14.7 LUFS, LRA 3.6.
- **Captions:** none on the picture. `subtitles.srt` and `chapters.txt` only — the burned-in
  karaoke line was removed on 2026-11-06 (see "Revised 2026-11-06" at the end).
- **Wall-clock time:** 1 h 09 m from the finished storyboard (18:40) to the finished file (19:49); the
  sources, the narration and the brief came before that. The render itself was 3 m 03 s. Five sub-agents
  wrote the eleven scenes in parallel between 19:21 and 19:46, overlapping my own review and six fixes.
- **Cost:** none beyond the agent itself. Local voice, local render, synth music, no API calls for media.

## Files
- `video.mp4`, `poster.jpg` (the RFS curve with the two honest tick-boxes, 3:23), `subtitles.srt`, `chapters.txt`
- `storyboard.yaml`: 11 `scene:` steps with their narration, the voice and `pronounce` map, `ground: light`,
  the theme and the two scene-kit files. **Every number that appears on screen is sourced in the header
  comment**, with the trial, the registry entry and the page it came from.
- `scenes/`: the 11 scene files, plus `scenes/kit/kit.css` and `scenes/kit/kit.js`, which the storyboard
  loads before every scene (`scenes: { css: …, js: … }`). Copy the whole folder and it renders as is.

## What it explains
Eleven questions, one picture each. The tumour was fully resected and the margins were clean, so why do
about 30 of 100 patients relapse within two years — and that is the arm already on standard immunotherapy →
a cancer cell is made of your own cells, but its mutations make protein fragments no healthy cell has:
neoantigens, this tumour's fingerprint, different in every patient → a PD-1 inhibitor releases the brake on
a T cell, but releasing the brake does not tell it who to chase → the vaccine hands over the fingerprint
itself: one synthetic mRNA encoding up to 34 neoantigens from your own tumour, translated by your muscle
cells, presented on MHC, recognised by a TCR; the mRNA degrades and never enters your DNA → **the pipeline,
first half:** a piece of the resected tumour plus a tube of blood, sequenced together, the mutations only
the tumour has (six positions out of two base rows on screen), an algorithm ranking them down to 34 →
**second half:** synthesis, the lipid particle, fill and release, shipping back to the patient's hospital,
a few weeks, against a 13-week window from surgery to first dose, which >99% of the 757 met → the Phase 3:
1,137 patients randomised 2:1, 82.2% vs 70.0% recurrence-free at two years, risk down 42% → **the detail
that matters:** the two curves are on top of each other for the first six months (HR 0.99) and only separate
after (HR 0.42), and overall survival still shows no difference → who it is for today: seven specific
eligibility lines, ending on "not approved anywhere" → nine Phase 2/3 trials across lung, bladder, melanoma
and kidney, why those were picked, and why pancreatic cancer is harder → a recap of the four things.

Sources are printed small in the corner of the scene where their number appears: the Merck/Moderna
INTerpath programme backgrounder (Aug 2026), INTerpath-001 as presented at ESMO 2026 (LBA1, 24 Oct 2026,
data cutoff 30 Jun 2026, median follow-up 24.6 months), ClinicalTrials.gov NCT05933577 for the eligibility
criteria and the 13-week window, and Alexandrov et al. 2013 *Nature* 500:415 for mutation burden.

## The look: the first film to use `ground: light`
The two explainers before this one were dark. This one is a medical atlas printed on paper — off-white
ground, deep ink linework, flat illustration, thin leader lines instead of legends, numbers in a mono face —
because the subject is a clinical result for an adult reader, not a lab readout. The storyshot feature built
the same day, `ground: light | dark`, is what makes that cheap: the burned-in subtitles come out as ink with
a white edge, the spoken-so-far words sweep in the theme accent, and **no scene draws a caption bar**. The
midterms explainer in this same folder had to hand-draw a dark shelf across the bottom of all ten scenes to
make white subtitles readable on paper; here that is one line of storyboard.

Four colours, one meaning each, fixed across all eleven scenes and declared as tokens in `kit.css`:

| token | colour | means, everywhere |
|---|---|---|
| `--tum` | crimson #a3203a | tumour cells, mutations, neoantigens, the fingerprint, the relapse side |
| `--imm` | teal #0f766e | the immune system, T cells, MHC, the vaccine arm, whatever is working |
| `--rna` | ochre #b45309 | the mRNA itself, the lipid particle, the vial — and **time** (weeks, the window) |
| `--ctrl` | warm grey #8a8578 | healthy cells, the control arm, anything the story is not pointing at |

Giving time the same colour as the mRNA is the one non-obvious choice, and it pays off in scenes 6 and 9,
where the 13-week ruler and the vial are visibly the same story. `--ctrl` measures 3.8:1 on paper, so the kit
restricts it to fills and large text; the other three are safe as text at any size.

On paper a glow is a smudge, so nothing glows: a thing that "lights up" gets a coloured stroke and a 12% tint
fill (`--*-soft`), or a ring. Shadows are capped at `rgba(22,24,29,.12)`.

## Where it refuses to round off
This is a film about an unapproved drug with one positive trial, and most of the editorial work went into not
overselling it:

- **Chapter 8 exists only to complicate chapter 7.** It is 28 seconds spent on the fact that the two curves
  are identical for six months and that overall survival is not significant (HR 0.77, P = 0.33, immature).
  It ends on two tick-boxes: 复发更少 ticked, 活得更久 empty. That frame is the poster.
- **The survival curve is labelled 示意.** Only two points on it are real — the 6-month overlap and the
  24-month 82.2 / 70.0. The shape between them is drawn, and the scene says so in the corner.
- **The manufacturing span inside the 13-week window carries no week numbers**, because the public sources
  say only "a few weeks". It is marked 示意 too.
- **The hook's ≈30 in 100 is shown as derived** — `(100 − 70.0 ≈ 30)` — not quoted as a published figure.
- **Chapter 9 ends on "尚未获批"**, and the narration says it in words as well, because a viewer who stops
  after the good numbers should still have heard it.
- The film never says a patient should seek this, and never names a price or a date.

One discrepancy surfaced during fact-checking and was resolved before anything was drawn: a Merck snippet
gave DMFS HR 0.50, while the ESMO presentation reports HR 0.62 overall, with 0.50 applying only to the
post-6-month period. The film uses the ESMO figures.

## How it was made
1. **Facts first.** Every number was cross-checked against two independent sources before a word of narration
   was written, and the ones that survived went into `kit.js` as plain objects (`Kit.TRIAL`, `Kit.DRUG`,
   `Kit.WHO`, `Kit.TRIALS`), so no scene retypes a figure. The backgrounder PDF came back as FlateDecode
   binary over HTTP and had to be run through `pdftotext -layout` to get the nine-trial table.
2. **A scene kit.** `kit.css` fixes the paper world and the four-colour contract above; `kit.js` holds the
   verified numbers, a seeded RNG, and builders for the recurring objects — a cell, a mutation, a notched
   neoantigen tile, an MHC cradle, a TCR notch, the mRNA strand, a lipid particle, a vial, a dot matrix, a
   week ruler, `Kit.RFS_PTS()` for the two survival curves.
3. **A brief** (`SPEC.md`, not shipped here) with the look, the colour table, the technical contract, a table
   of **every fact allowed on screen with its source**, and an eleven-row seam table: what each scene must
   end on and what the next one must pick up. Scene 4 ends on a TCR docked against a peptide; scene 5 starts
   there.
4. **Five sub-agents wrote the eleven scenes in parallel.** Each ran `storyshot scene storyboard.yaml --step N`,
   read its own stills and the layout check, and fixed what it saw. All eleven came back with no lint
   findings and a clean layout check.
5. Timing comes from `S.at(k)`, the start of narration phrase *k*, so every reveal lands on the words that
   name it and would re-time itself if a line changed.

## Problems worth recording
- **A clean layout check is not a composition review.** All eleven scenes passed the checker, and six of them
  still had the same flaw when I looked at the contact sheets myself: a small subject in a large empty frame.
  A light ground makes this much easier to miss than a dark one, because empty paper does not read as empty
  the way empty black does. Scene 1's cells went 46 → 130 px and its vessel 120 → 260 px; scene 4's strand
  went to 1620 px wide; scene 6's 34 tiles were re-laid as a column to fill the lower half; scene 10's
  scattered objects became a fixed left-illustration / right-checklist layout. **This is now the thing to
  check first on any light-ground film.**
- **A round line cap paints a dot at zero length.** The kit's self-drawing SVG paths set
  `stroke-dasharray: '1'` and tweened `strokeDashoffset` 1 → 0, which trips the `svg_round_cap_hidden_dash`
  lint: at offset 1 the dash is invisible but the cap is not. The fix is `'1 1.2'` with offset 1.1 → 0. Three
  agents were about to hit this independently, so it was relayed to all of them at once.
- **34 segments, only 19 visible.** Scene 4 staggered the strand's segments at 0.055 s each — 1.87 s of
  stagger inside a 10 s beat — so the back half never appeared. The real fix also needed the kit's cubic
  Bézier `x(t) = 0.75t + 0.75t² − 0.5t³` inverted analytically so the segments space evenly along the drawn
  curve rather than evenly in *t*.
- **`.sheet-hd` was set at 27 px**, one pixel under the layout check's 28 px floor, which failed every scene
  that used a sheet. Fixed in the kit mid-flight, with the reason written next to it.
- **Editing a shared kit while five agents are rendering against it is a live migration.** The rule that
  worked: only changes that cannot alter rendering — the font-size fix, which removed a failure, and comments.
  Everything else the agents asked for (`Kit.strand`'s `amp` semantics, a `Kit.pmhc()` docking pose, organ
  line drawings, a horizontal `Kit.steps`) was written down as a comment and left for next time, because
  scenes 4 and 6 had already been tuned against the current behaviour.
- **One `check_runtime_failure` that was not a bug.** Step 7 failed the layout check once while several
  agents were previewing concurrently and 1,137 dot elements were on screen; it passed on a solo re-run with
  no change to the scene.
- **A misread of my own, worth recording because it nearly caused a bad fix.** Scene 5's two base rows
  looked like they differed at every position; they differ at exactly 6, matching the 6 highlighted columns.
  Checking position by position before editing saved the scene.

## What is weak
- It is 4:58 and eleven scenes against a 4:00, ten-scene brief. The pipeline — the part the request actually
  asked about — needed two scenes rather than one, and the alternative was compressing the part the viewer
  came for.
- The safety data is in the storyboard's source header but never reaches the screen. Grade 3–5 adverse events
  were 23.6% vs 20.3%, pyrexia 52.2% vs 8.2%, injection-site pain 51.0% vs 9.5% — the vaccine arm is
  meaningfully more unpleasant, and the film does not say so. For a 5-minute explainer that is a defensible
  cut, but it is the biggest thing missing.
- Chapter 10's reasoning for *why* lung, bladder, kidney and melanoma ("they mutate a lot, they get resected,
  they already use immunotherapy") is the agent's synthesis from mutation-burden and trial-design facts, not
  a sourced claim by the sponsor.
- The 示意 marks are small by design, at `.credit` size with `data-layout-ignore`. A viewer who does not read
  corners could take the drawn middle of the survival curve as measured.

## Assessment
The useful thing here is not the animation, it is that chapter 8 exists. A positive Phase 3 with a 42% risk
reduction is exactly the kind of result that gets flattened into a headline, and the film spends a ninth of
its length on why the first six months show nothing and why "fewer relapses" is not "lives longer". The
colour contract is what makes the rest of it legible across eleven scenes written by five different agents:
once crimson means tumour and teal means immune everywhere, the viewer stops reading legends by scene 3, and
the one place the film breaks that habit — giving time the mRNA's ochre — is the place where the schedule and
the drug really are the same constraint.

## Revised 2026-11-06

**It had no ending.** Motion stopped three seconds before the file did, on the fullest frame of the
film — the tumour, the neoantigens, the T cell, the brake, the three manufacturing steps, both trial
numbers, all still on screen. The recap now dissolves all of it over the last 2.5 seconds and ends on
the one object the film is named after, a single person's vial, over the line that says the survival
data is not in yet. The honest caveat gets the last frame to itself, which is where it belongs.

**The burned-in subtitles are gone** (`subtitles: burn` → `subtitles: true`; `subtitles.srt` still
ships). `ground: light` did put them in ink with a white edge, as described above, and that part
worked — the reason for removing them is that a line lighting up word by word at the bottom pulls the
eye off a drawing that is already carrying its own labels. The poster was re-cut from the new render,
because the old one had a subtitle across it.

Storyshot changed with it: the `calm` soundtrack reaches IV one chord before the end and lands on the
tonic rather than being truncated wherever the video finishes; the picture settles to the film's
ground (white here) over the last 0.9 s; `preview_scene` warns `frozen_ending` when a last scene has
not changed for 2.5 seconds. Re-rendered from the same storyboard and narration; 297.8 s, unchanged.

## Revised 2026-11-07 — the ending, again

Yesterday's fix was the wrong fix. The frozen last frame, the truncated music and the missing fade
were all real, and they are all still fixed, but they were not what made these films feel like they
had no ending. > 结尾的问题不是渐变与否，而是没有很好的结论，结束语，展望，思考这样一个句点的感觉

— which is exactly right.

A recap is not an ending. It re-counts what the film already said and then runs out — and every one
of these films had its last spoken line land on a list item, a caveat or a footnote. No fade repairs
a script with nothing left to say.

So each film now has **a closing scene of its own, after the recap** (step 12, `scenes/close.html`, 58.2 s), written to do three
things: say what this actually means now that the viewer has seen all of it, name what is still open,
and leave one thought — in the film's own images, with the final words landing on it.

It says what is actually new here, which is not mRNA and not the word "个体化": it is that a drug for
one named person can be designed, made, released and shipped inside the weeks after their surgery —
and that over 99% of the 757 people in the vaccine arm made that window. Past cancer drugs were made for a disease; this one is
made for a person. Then what can honestly be claimed: fewer recurrences at two years, nothing yet
about living longer, and no approval anywhere. It ends on the film's own two pictures side by side —
the brake lifting off the T cell, and the wanted poster being handed to it. 297.8 s → 353.5 s.

The rule is now in `skills/storyshot/SKILL.md` ("How an explainer ends"), rewritten to lead with the
writing rather than the picture, and `frozen_ending` now says to read the last `say:` line before
touching the animation. One trap worth recording: the voice breaks cues on **commas** as well as full
stops, so a line like "a line, a curtain, a piece of paper" is three cues — key beats to what `cues`
prints, not to the sentences you counted.

The recap in each film keeps its dissolve but no longer holds a long tail for an ending it no longer
has: `tail` 3.5 s → 2.2 s, and the dissolve now lands with its last words, so it reads as a page turn
into the closing scene.
