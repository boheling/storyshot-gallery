# CRISPR screens (zh): an explainer made of scenes, with no website in it

**Request:** 做一个中文讲解视频，讲清楚 CRISPR 混合筛选是怎么回事：怎么在一瓶细胞里同时做两万次基因敲除实验，加药之后数条形码，就能找出是哪个基因让癌细胞扛住了药。用一个真实的例子从头讲到尾，把这套方法的局限也讲出来，最后讲到只改一个碱基的突变扫描。

It followed a TaqMan SNP-genotyping explainer made the same way, but unlike that one it had to be built from scratch, which was the point of the exercise: to time a from-nothing explainer against a hand-written one.

- **Type:** `explainer` (`purpose: explainer`, Storyshot 0.8.0), 16:9 1080p30, 5:38 (338.2 s), 11 chapters.
  Nothing is recorded and there is no `url` anywhere in the storyboard: all 11 steps are
  [HyperFrames](https://github.com/heygen-com/hyperframes) scenes the agent wrote.
- **Voice:** Qwen3-TTS 0.6B CustomVoice, `dylan`, free and local on an Apple Silicon Mac. A `pronounce` map
  reads the gene and drug names (`NF2` → N F 二, `Cas9` → Cas 九, `V600E` → V 六百 E, `p53` → P 五十三 …).
- **Sound:** Storyshot's own synth soundtrack, `calm` at 64 bpm, no clicks and no whooshes. −15.1 LUFS, LRA 4.1.
- **Captions:** none on the picture. `subtitles.srt` and `chapters.txt` only — the burned-in
  karaoke line was removed on 2026-11-06 (see "Revised 2026-11-06" at the end).
- **Wall-clock time:** 46 minutes, from the request to the finished file. 7 of those were the render.
- **Cost:** none beyond the agent itself. Local voice, local render, synth music, no API calls for media.

## Files
- `video.mp4`, `poster.jpg` (the recap chain, 5:37), `subtitles.srt`, `chapters.txt`
- `storyboard.yaml`: 11 `scene:` steps with their narration, the voice and `pronounce` map, the theme and
  the two scene-kit files. The sources for every number on screen are in the header comment.
- `scenes/`: the 11 scene files, plus `scenes/kit/kit.css` and `scenes/kit/kit.js`, which the storyboard
  loads before every scene (`scenes: { css: …, js: … }`). Copy the whole folder and it renders as is.

## What it explains
One real case runs through the whole film: A375 melanoma cells stop responding to vemurafenib, and a
genome-wide knockout screen names NF2 (Shalem et al. 2014, *Science* 343:84). The chain is: a drug stops
working → Cas9 plus a guide cuts NF2 → the repair breaks the gene → one library, 64,751 guides → the drug
selects → count the barcodes → several guides have to agree → three limits → base editors and saturation
genome editing for single mutations.

The DNA on screen is real: NF2 exon 2 from Ensembl GRCh38 (ENST00000338641, ENSE00001373499), with a real
NGG site in it. The consequence of the cut was computed from the real coding sequence rather than asserted:
a +1 G at the cut puts a TGA stop at codon 85, so the 595-amino-acid protein ends after 84 (14%); a 3-base
deletion keeps the frame and costs one amino acid. Those numbers, and the Poisson split at MOI 0.3
(74 / 22 / 4 cells per 100), are what the animations draw.

Sources are printed small in the top-right corner of the frame where their number appears: Shalem 2014,
Chapman 2011 (*NEJM*, 48% response rate), Joung 2017 (*Nat Protoc*), Aguirre 2016 (*Cancer Discov*),
Haapaniemi 2018 and Ihry 2018 (*Nat Med*), Hanna 2021 (*Cell*), Findlay 2018 (*Nature*), Ensembl.
Anything drawn rather than measured carries a small 示意 ("schematic") tag in the top-left.

## How it was made
1. **Facts first.** Fetch NF2 from the Ensembl REST API, pull the abstracts from PubMed E-utilities,
   and compute the frameshift locally. Nothing on screen was written before it was checked.
2. **A scene kit.** `kit.css` fixes one dark world and gives every colour a single meaning for the whole
   film (pink = guide RNA and barcodes, cyan = PAM, periwinkle = Cas9, amber = NF2, red = a cut or a stop,
   green = a base edit). `kit.js` holds the real sequence, a seeded RNG and builders for strands, codon
   rows, cell fields, barcodes and the Cas9 drawing, so eleven scenes drawn by different agents still
   look like one film.
3. **A brief** (`SPEC.md`, not shipped here): per-scene beats, the look rules, the colour meanings, and
   what each seam between two scenes has to match.
4. **Six subagents wrote the 11 scenes in parallel**, paired so that every cross-scene seam stayed inside
   one agent. Each one ran `storyshot scene storyboard.yaml --step N`, looked at its own stills and the
   layout check, and fixed what it saw. All 11 came back clean.
5. **Narration edits re-time the animations by themselves.** Every reveal is timed from `S.at(k)` (the
   start of narration phrase *k*), so the three corrections below only needed a re-preview, not an
   animation rewrite.

### Time, stage by stage
| | |
| --- | --- |
| Sources, story, narration, scene kit, brief | 10 min |
| 6 agents writing 11 scenes, in parallel (previews and fixes included) | 27 min |
| My own corrections and re-timing | 2 min |
| Render: voice, timing, burned subtitles, music, loudness | 7 min |

For comparison: the same kind of film (TaqMan SNP genotyping) took about 1 h 36 m when the animations were
hand-written in HyperFrames with no storyboard around them, and about 22 min to port into a Storyshot
storyboard once those animations already existed.

## What the scene agents caught
The scenes were written by agents reading the brief, and three of them pushed back on it. All three were right:

- **The guide pairs with the bottom strand.** My brief said the 20-base guide pairs with top-strand indexes
  19–38. The guide has the *same* sequence as the top strand, so it pairs with the bottom one. The `cas`
  agent drew it correctly, with the PAM on top.
- **The control was wrong.** I had asked for "before the drug vs. after the drug", which also counts every
  gene the cells need to grow at all. A real screen compares treated with untreated cells at the same
  timepoint. The narration and the two tube labels in `count` were changed.
- **It is the guide-encoding DNA that stays in the genome,** not the guide RNA. Reworded, keeping the same
  number of phrases so the scene's `S.at` indexes still pointed at the same beats.

Two more review notes were acted on: the 48% response rate needed its source on screen (Chapman 2011), and
the 3-base deletion in `lim` is one possible repair outcome, not *the* repair, so its 示意 tag is now up
from the first frame of that scene.

## What is weak
- **The `drug` → `count` seam.** `drug` ends on a field dominated by the amber resistant clone; `count`
  opens on a mostly grey field of barcoded cells. It is a chapter boundary and the magnifier signals the
  change of subject, but it is the one cut in the film that reads as a jump. Left as is.
- NF2 happens to be drawn with 4 guides, the off-target site in `ask` is invented, and the bar charts are
  shapes, not data. All of them are tagged 示意, but a viewer who skips the tag could over-read them.
- The film never shows a real screen's raw data, only the shape of it.

## Assessment
The film earns its length: every claim in it is sourced, the sequence is real, and the two things people
usually get wrong about pooled screens (why one guide is not enough, and that cutting is not the same as
knocking out) each get their own chapter instead of a sentence. The scene mode is what made it possible to
make at all, since none of this exists as a website to record.

## Revised 2026-11-06

Two things the first cut got wrong, both found by watching it rather than by any check.

**It had no ending.** Measured: motion stopped three seconds before the file did, and the frame it
froze on was the fullest of the whole video — six stations, six labels, every object the film had
drawn. A recap only ever adds, so its last frame is always the most crowded one, and the viewer is
still reading it when the video stops. The recap scene now takes it back instead: over the last
2.5 seconds the chain dissolves and what stays is the question the film opened with, 药为什么失效？,
and the thing that answers it — NF2 knocked out, and the cells that lived through the drug.

**Still weak:** the last spoken line is "想问具体哪个突变，就换成只改一个碱基的编辑器" — the fourth item of
a four-item list. The picture now closes; the narration still stops mid-enumeration. Fixing that means
rewriting the last one or two sentences, which has not been done.

**The burned-in subtitles are gone.** `subtitles: burn` → `subtitles: true`: nothing is drawn on the
picture, `subtitles.srt` still ships. A line lighting up word by word at the bottom competes with
scenes that are already carrying their own text.

Storyshot changed with it, so this is not a per-film patch: the `calm` soundtrack now reaches IV one
chord before the end and lands on the tonic, which rings through the tail (it used to be truncated
wherever the video happened to finish); the picture settles to the film's ground over the last
0.9 s; and `preview_scene` warns `frozen_ending` when a film's last scene has not changed for
2.5 seconds. Re-rendered from the same storyboard and the same narration — 338.2 s, unchanged.

## Revised 2026-11-07 — the ending, again

Yesterday's fix was the wrong fix. The frozen last frame, the truncated music and the missing fade
were all real, and they are all still fixed, but they were not what made these films feel like they
had no ending. > 结尾的问题不是渐变与否，而是没有很好的结论，结束语，展望，思考这样一个句点的感觉

— which is exactly right.

A recap is not an ending. It re-counts what the film already said and then runs out — and every one
of these films had its last spoken line land on a list item, a caveat or a footnote. No fade repairs
a script with nothing left to say.

So each film now has **a closing scene of its own, after the recap** (step 12, `scenes/close.html`, 51.0 s), written to do three
things: say what this actually means now that the viewer has seen all of it, name what is still open,
and leave one thought — in the film's own images, with the final words landing on it.

This film had the worst of the four: its last line was literally the fourth item of a list. The new
scene steps back — the move that matters is not the scissors and not the sequencer, it is turning a
question you would have to ask twenty thousand times into one the cells answer themselves. It does
not understand biology; it only counts. So it can ask what a cell does on its own and cannot ask what
cells do to each other. Twelve years on, the same method is going from "which gene" to "which base".
But a flask is not a person: a screen never returns an answer, it returns a list — and the film ends
on that list, with a line drawing out to a separate dish for each name, one at a time, the last one
still being drawn on the final frame. 338.2 s → 387.9 s.

The rule is now in `skills/storyshot/SKILL.md` ("How an explainer ends"), rewritten to lead with the
writing rather than the picture, and `frozen_ending` now says to read the last `say:` line before
touching the animation. One trap worth recording: the voice breaks cues on **commas** as well as full
stops, so a line like "a line, a curtain, a piece of paper" is three cues — key beats to what `cues`
prints, not to the sentences you counted.

The recap in each film keeps its dissolve but no longer holds a long tail for an ending it no longer
has: `tail` 3.5 s → 2.2 s, and the dissolve now lands with its last words, so it reads as a page turn
into the closing scene.
