# regex101 lesson: how a regex matches text

## User request
"Make a short lesson video that explains how regular expressions match text, using regex101 (https://regex101.com) to show it live: literal characters, character classes like \d, and quantifiers like + and {3}. I want students to understand WHY a pattern matches or not, not just click buttons. A quick check-your-understanding question would be great."

## Stats
- Wall clock: 21:19:58 to 21:45:24 PDT (about 25.5 minutes)
- Full renders: 3 (of 5 allowed). Compose-only runs: 0
- Several fast `storyshot inspect --after N` dry runs to test typing, waits and marks before the first render
- Output: 4:05, 1080p, course type, free local kokoro voice (af_heart), no music, .srt and chapters

## Flow
Intro (goals) → Part 1 literals: `cat` gives 2 matches (inside "Concatenate" counts; "Cats" fails on capital C; the explanation panel says "case sensitive") → Part 2: `\d` gives 13 one-character matches → Part 3: `\d+` gives 4 whole numbers (greedy) → question card "How many matches will \d{3} find?" with a 5 s pause-and-think → reveal: 3 matches (555, 019, 941); hovering shows regex101's "Match 2 … 019" tooltip, and the leftover 9 has none → "Why" card with a diagram (no overlap, leftovers) → `\d{3}-\d{4}` gives 1 match (the phone number) → recap card.

## Problems and fixes
- **The first pattern never finished processing.** In the headless browser, regex101's PCRE engine loads lazily. The first pattern stayed at "Processing…" with no highlights and no match list, while later edits worked. Fix: in `setup`, type a warm-up pattern `a`, wait 6 s, and delete it. After that, every pattern evaluated right away.
- **A "regex101 v14.2.2 is here!" toast** covered the lower right. `dismiss` with role/name didn't find it. Fix: click its × by point in `setup`.
- **`inspect` didn't list the test-string editor**, only the regex textbox. Clicked it by point (from the screenshot) and typed the three test lines in `setup`, so they aren't typed on camera.
- **`mark` hid the lesson (render 1).** A lime text mark on "555-0199" covered regex101's own alternating match shading, which is what shows that `\d` makes separate 1-character matches and `\d{3}` splits 0199 into 019 plus 9. In the last step, the mark also landed on the Match Information copy of "555-0199", so the camera panned away from the test text. Fix (render 2): drop those marks and hover the cursor on the third line, with a zoom on that line. The hover pops up regex101's own tooltip ("Match 3 · 0199"), which explains better than a mark would.
- **`mark: "Cats"` drew nothing visible.** It probably matched elsewhere or failed silently inside CodeMirror spans. Replaced it with a highlighted cursor move onto "Cats".
- **Render 3:** in the reveal step, hover "019" first (tooltip: Match 2, 019), then move onto the leftover "9" (no tooltip), so the answer is shown in the app and not only described.
- **Storyshot can't draw concept diagrams.** It shows images on cards, so I generated 3 SVGs with a small Python script (literal-scan.svg, question.svg, answer.svg).
- **Minor, left as is:**
  - `check` warns that edit steps do 3 things (click, Cmd+A, type). This is one logical edit, so I didn't split it.
  - Point zooms with `scale: 1.7` came out at about 1.25×, but the text is still readable at 1080p.
  - Kokoro needed `pronounce: regex → rejex`.

## Assessment (after looking at extracted frames)
A beginner would most likely come away understanding why each pattern matches. Each idea gets a prediction-style explanation, a live result with the count shown, and a "why" moment: the case-sensitive Cats, one digit per match, greedy +, and the 019/9 leftover with the tooltip proving it. The quiz is a real question and not filler. Weak spots: regex101's match shading is subtle, and the test text is small even when zoomed, so on a phone a student leans on the narration and diagrams. And at about 4 minutes it is "short" only by lesson standards.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
