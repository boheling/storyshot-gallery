# NCBI protein BLAST: tutorial (v2)

**Request:** "Make a tutorial video for new lab members on how to use NCBI protein BLAST (blastp): paste a query sequence, choose the database, run it, and read the results (hits table, what E-value / identity mean, opening one alignment). Use human hemoglobin beta as the main example, then show a second example with human insulin so they see how results differ."

**How it was made:** remade from scratch with Storyshot (local build `storyshot-local6.tgz`, CLI only, free local `kokoro` voice `af_heart`). Wall clock: 04:06 to 05:45 (about 99 minutes; each compose of the 5:21 video took about 22 min, most of the time). **2 full renders, 2 composes.** Before rendering, 3 `inspect --after` probes ran the real BLAST searches. I read the real hit tables from the BLAST JSON output for those RIDs, so the narration was written from real values before the first render.

## Problems and fixes

| reviewer problem | fix |
|---|---|
| Narration did not match the highlighted row (e.g. "other mammals ~90%, 1e-90" over a primate at 95.21%) | Rows are no longer picked by position (`tr:nth-child(24)`). Each row is targeted by accession: `#dscTable tbody tr:has(a[href*="protein/P02042."])`. The row that is marked is always the protein being talked about, even if BLAST reorders hits. Every number spoken was read from the real results. Each row step marks the row **and** the exact cell spoken about (`td.c9` E value / `td.c10` identity). I then checked each value against frames of the final video (table below). The old storyboard also had the gorilla substitution at "position 104". The real alignment shows it at position 105 (query R / gorilla K, `+`), and that is now fixed and marked. |
| 0:15–0:26 dimmed page | Step 1 no longer uses the dimming spotlight (`highlight: false`). It moves to the blastp tab, adds a callout and highlights "Enter Query Sequence". The intro was cut from 11.2 s to about 5 s (Storyshot warned about it). |
| 1:00–1:12 footer + loading screen | The click on BLAST now ends the visible step, after narration that explains the wait ("usually under a minute"). The wait for results is a `hidden: true` step that also scrolls to the top. The insulin wait works the same way. The final compose shows no dead-air or near-blank warnings. |
| Hits table unreadable on a phone | Each table step has an explicit `zoom` at scale 1.9 on the discussed cell (the target is the same element as the mark), offset so species, E value and identity are all in view. Notes use `side: bottom` so they don't cover the neighbouring E value or species. In render 1 they had covered "2e-105" and "Homo sapiens". The alignment steps use point zooms that show the whole alignment block. |
| Survey/feedback pop-ups | `hide: '[id*="QSI"], [class*="QSI"]'` in `setup` (plus a no-op `dismiss` of the feedback tab). No pop-up shows in any checked frame. |

Other warnings fixed: step 17/21 "caption moved to top" (set `captionPosition: top`). In compose 1, the new zoom targets on the alignment steps had no recorded position, so I switched them to point targets taken from the frame. The final compose shows **no warnings**.

## Narration vs. screen (checked on frames of the final video.mp4)

| time | said | shown and marked at that moment |
|---|---|---|
| 1:01–1:12 | database swissprot, query length 147 | "swissprot" and "Query Length" highlighted; value 147 |
| 1:12–1:27 | first row is human hemoglobin beta | row 1 marked: Homo sapiens, P68871.2, 100.00% |
| 1:27–1:45 | E value 6e-106 | row 1 E cell marked: 6e-106 |
| 1:45–2:06 | itself 100.00%; gorilla, row two, 99.32%, E 2e-105 | row 1 identity cell 100.00% marked; row 2 marked: Gorilla gorilla gorilla, 2e-105, 99.32% |
| 2:06–2:22 | human hemoglobin delta, 93.20%, E 2e-99 | row marked: "Hemoglobin subunit delta", Homo sapiens, P02042.2, 2e-99, 93.20% |
| 2:22–2:37 | mouse hemoglobin beta 1, 80.27%, E 2e-86 | row marked: "Hemoglobin beta-1", Mus musculus, P02088.2, 2e-86, 80.27% |
| 2:47–3:24 | 146 of 147 identical, 99%, no gaps; difference at position 105, R vs K, plus sign | "146/147(99%)" highlighted, Gaps 0/147(0%); "ENF+LLG" highlighted on the midline of the Query 61 line (61 + 44 = position 105; query R, Sbjct K) |
| 3:50–4:12 | human insulin 100.00%, E 2e-76 (vs 6e-106); 110 amino acids | row 1 marked: Homo sapiens, P01308.1, 2e-76, 100.00%, Acc. Len 110 |
| 4:12–4:27 | row six, rat insulin 2, 82.73%, E 3e-56 | 6th row marked: "Insulin-2", Rattus norvegicus, P01323.1, 3e-56, 82.73% |
| 4:27–4:41 | chicken insulin 63.64%, E 3e-39 | row marked: Gallus gallus, P67970.1, 3e-39, 63.64% |
| 4:41–5:07 | human insulin-like growth factor 2, 33.98%, E 2e-07 | row marked: "Insulin-like growth factor II", Homo sapiens, P01344.1, 2e-07, 33.98% |

## Quality assessment

The core error is fixed. In every checked frame the marked row and cell show exactly the species and numbers being spoken, and the 1.9x zoom makes the table cells readable at 1280 px wide. The tutorial structure works well: four parts, one action per step, a meaningful second example (shorter query gives a larger E value, identity falls sooner, and a real but different relative, IGF-2, at the bottom). Weak points: the long description column is still cut off at the left edge of the zoomed frames. The BLAST-click step keeps the page dimmed around the button for about 12 s while the narration explains the wait. At 5:21 with a slow pace, it may feel long to experienced users.
