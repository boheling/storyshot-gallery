# Learn Git Branching: git merge vs. git rebase (course)

**Request:** "Make a short lesson video using Learn Git Branching (https://learngitbranching.js.org/) that explains the difference between git merge and git rebase: start from the same two branches, show what merge does to the history, then what rebase does, and when you'd pick each. For developers who use git daily but never really got rebase."

- **Wall clock:** 04:17 to 05:06 PDT, about 49 minutes
- **Renders:** 1 full render. **Composes:** 2 completed, plus 1 stopped early because it ran on a stale file.
- **Output:** 166 s, 1920x1080. Voice is kokoro af_heart. There is no music. Subtitles (.srt) and chapters come from Storyshot.

## Structure
1. Intro: what you'll learn.
2. Part 1: the starting point is built live with one chained command (`git branch feature; git commit; git checkout feature; git commit; git commit`). main is at C2, feature is at C3 then C4, and both come off C1.
3. Part 2: on feature we run `git merge main`. The result is merge commit C5 with parents C4 and C2.
4. Part 3: a hidden step reloads the page and rebuilds the same history. The video shows it is the same start, then asks a question with a 4 s pause ("where do C3 and C4 end up?"). The answer is `git rebase main`, which gives C3' and C4' on top of C2, with the old C3 and C4 left behind and faded. Then `git checkout main` and `git merge feature` do a fast-forward, so main and feature both point at C4'.
5. Concept card: when to pick each (merge shared branches, rebase your own branch before sharing, never rebase commits other people have pulled). After that, the final linear graph and a recap end card.

## Problems and solutions
- **Getting a clean sandbox:** `?NODEMO&locale=en_US` opens straight into the sandbox, with no intro dialog or level picker.
- **Typing commands:** the command box keeps keyboard focus, so a plain `type:` plus `press: Enter` works and no click target is needed. The sandbox accepts `;`-chained commands.
- **Waiting for the graph animation:** commands run as a queue that takes several seconds. I found the DOM marker in a local Playwright probe: `#commandDisplay .reactCommandView:last-child p.finished`. Each command step does a short pause, then `waitFor` on that marker, then a 1 s settle. The narration was written from probe screenshots of the real graph, and the commit names and positions match the frames.
- **Late overlays:** an upsell image and a "Waiting on your coding agents…" toast showed up after the first command. I hid them in `setup` (`#upsell, #upsellImageLink, #upsellImage`).
- **Resetting for the rebase part:** `reset` works, but it leaves the earlier commands in the terminal. I used a hidden `goto` of the same URL plus the same setup command instead, so the terminal and graph are identical to Part 1.
- **The graph is small at 1600x900** (it sits in the upper half of the page). I turned off follow, which would have zoomed toward the terminal, and added point zooms (1.5 to 1.7x) on the graph for every result step. The zooms start after typing ends, so the command is visible first.
- **Warnings:** the first render's intro ran 10.4 s, so I shortened its narration (now 6.3 s). Compose 2 warned that step 8's caption had moved to the top to avoid a hover target, so I set `captionPosition: top` explicitly. The final compose has no warnings.
- **Side note:** I made one Playwright MCP call, and it wrote a snapshot file into the storyshot repo's `.playwright-mcp/` folder. I deleted that one file right away and used a local Playwright script from this project's node_modules after that.

## Quality assessment
The lesson is clear and correct. Every narrated commit (C1–C5, C3', C4') and every branch position matches the graph on screen, and seeing merge and rebase side by side from the same starting graph makes the difference obvious. Weak spots: Step 1 (building the history) and the "switch back to main" step are unzoomed, so the commit labels are small there. In the rebase result step the top caption covers C0, which matters little because the narration doesn't mention C0. The concept card is a long static 20 s stretch.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
