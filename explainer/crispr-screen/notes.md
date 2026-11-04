# CRISPR screens (zh): an explainer made of scenes, with no website in it

**Request:** 那你重做一个，这次换另一个原理，比如 CRISPR 进行 mutation screen。 (It followed a TaqMan SNP-genotyping explainer made the same way; this one had to be built from scratch, which was the point.)

- **Type:** `explainer` (`purpose: explainer`, Storyshot 0.8.0), 16:9 1080p30, 5:38 (338.2 s), 11 chapters.
  Nothing is recorded and there is no `url` anywhere in the storyboard: all 11 steps are
  [HyperFrames](https://github.com/heygen-com/hyperframes) scenes the agent wrote.
- **Voice:** Qwen3-TTS 0.6B CustomVoice, `dylan`, free and local on an Apple Silicon Mac. A `pronounce` map
  reads the gene and drug names (`NF2` → N F 二, `Cas9` → Cas 九, `V600E` → V 六百 E, `p53` → P 五十三 …).
- **Sound:** Storyshot's own synth soundtrack, `calm` at 64 bpm, no clicks and no whooshes. −15.1 LUFS, LRA 4.1.
- **Captions:** the narration burned in (`subtitles: burn`, 126 lines, word-by-word highlight), plus
  `subtitles.srt` and `chapters.txt`.
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
