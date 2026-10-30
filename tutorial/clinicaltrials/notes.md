# ClinicalTrials.gov: how to find a clinical trial (tutorial)

**Request:** "Make a tutorial video for patients and caregivers on how to find a clinical trial on ClinicalTrials.gov (https://clinicaltrials.gov): search for a condition near where you live, keep only studies that are recruiting, open one study, and understand the key parts of the study page: what's being tested, who can join (eligibility), where it runs and who to contact. Plain language, no jargon, calm pace."

- **Wall clock:** 04:17 to 05:47 PDT, about 90 minutes. Most of that was render time: the machine was shared with other jobs, so a render took 16 to 28 minutes instead of 1 to 3.
- **Renders:** 3 full renders and 1 compose (limit was 5 renders).
- **Output:** 4:37 (276.9 s), 1920×1080, kokoro `af_heart` voice, soft music, step numbers, spotlight, camera follow. Includes an SRT file and 5 chapters (Intro, Part 1 Search near you, Part 2 Keep only recruiting studies, Part 3 Read a study page, Part 4 Same steps, another example) plus a recap end card.
- **Final warnings:** none. The last render and the compose both finished with zero ⚠.

## Flow
1. Intro: the goals, no account needed.
2. Part 1: type "type 2 diabetes", type "Boston", pick "Boston, MA" from the list, press Search.
3. Part 2: show 298 matches and a "Completed / No longer looking for participants" card. Explain "Recruiting", tick Recruiting, Apply Filters, 28 studies left.
4. Part 3: open NCT07662109, a Phase 3 study of elecoglipron and dapagliflozin. The video covers its status, what is being tested (Intervention/Treatment), what a placebo is, what phase means, eligibility (inclusion, exclusion, age and sex), the study contact and the locations. It ends with an honest note that the government does not review every study, a listing is not medical advice, and to talk with your doctor.
5. Part 4: the same steps for "high blood pressure" near Chicago, IL: 348 studies, then 33 recruiting.
6. Recap end card.

## Problems and how I solved them
- **Location field hidden under the sticky Search bar.** On the home page, a sticky footer with the Search button covers the Location box. My first inspect typed into the wrong place. I fixed it with `scroll: 350` before typing in Location.
- **Autocomplete dropdowns.** The Location box needs a suggestion picked from the list (`{ role: option, name: "Boston, MA" }`), or the Search button stays disabled. My probe found this. The Condition box also opens a suggestion list ("heart attack", etc. on the first keystrokes), which covered the Location field in render 1. Fix: `press: Escape` (hidden badge) after typing the condition. I tested that the typed text survives the Escape.
- **Status checkboxes are not exposed as accessible targets**, so `inspect` did not list them. I used `label[for="adv-check0-status1"]` (Recruiting), which I checked against the live DOM.
- **Shared Playwright MCP browser.** Partway through exploring, the MCP browser was taken over by another agent's page (learngitbranching). I stopped using it and probed with a private Playwright script from the project's own `node_modules`.
- **Render 1 warnings:** intro too long (9.5 s), so I shortened its line. Four "caption moved to top" warnings, so I set `captionPosition: top` explicitly. Render 2 still had a 0.2 s near-blank frame after the second Apply Filters, plus a brief flash of the page footer while the study page loaded. Fix: I moved each load wait (`waitFor` + `networkIdle`, and `scrollTo: body` for the study page) into its own `hidden: true` step. Render 3 had zero warnings.
- **Subtitles:** the step-1 line was spelled "Clinical Trials dot gov" in `say:`. I switched it to "ClinicalTrials.gov" and let `voice.pronounce` handle the speech, then composed again.
- **Privacy:** I chose a study whose contact is a company information center ("AstraZeneca Clinical Study Information Center"), not a named person, and no names are read aloud. There is no personal data from the viewer, and no login was needed.
- **Feedback popups:** hidden with `hide: '.QSIFeedbackButton, [id^="QSI"], [class*="QSI"]'` (the Qualtrics "Feedback" tab).

## Narrated values vs. what's on screen (checked on frames extracted from the final video)
| Time (s) | Narration | On screen | Match |
|---|---|---|---|
| ~51–61 | "found 298 studies about type 2 diabetes with a location in Boston" | "Viewing 1-10 out of 298 studies for: type 2 diabetes \| In Boston, MA" | ✔ |
| ~61–70 | first study "says Completed, no longer looking for participants" | First card: red "Completed / No longer looking for participants" | ✔ |
| ~87–93 | "Now the list shows 28 studies, every one marked Recruiting" | "out of 28 studies … \| Recruiting studies", green "Recruiting" badges; filter shows "Recruiting (28)" | ✔ |
| ~96–101 | "its status … This one is Recruiting" | Study NCT07662109 status box "Recruiting" | ✔ |
| ~108–122 | "two diabetes pills, elecoglipron and dapagliflozin, alone and together" | Intervention/Treatment: Drug: Elecoglipron, Drug: Dapagliflozin (+ matched placebos); title "…Combination … Compared With Elecoglipron Alone and Dapagliflozin Alone" | ✔ |
| ~122–132 | "Some groups get a placebo" | "Drug: Elecoglipron-matched placebo" highlighted | ✔ |
| ~132–143 | "Phase 3" | Phase: "Phase 3" highlighted | ✔ |
| ~163–173 | "a type 2 diabetes diagnosis for at least 90 days" | "Diagnosed with Type 2 Diabetes Mellitus (T2DM) for at least 90 days prior to screening" | ✔ |
| ~173–181 | "people with type 1 diabetes can't join" | Exclusion Criteria, first item "Type 1 Diabetes, …" | ✔ |
| ~181–190 | "18 years and older … all sexes" | "18 Years and older (Adult, Older Adult)", Sexes Eligible "All" | ✔ |
| ~190–202 | "a contact phone number and email" | Study Contact: phone 1-877-240-9479, email shown (not read aloud) | ✔ |
| ~202–214 | "the two Boston sites say Not yet recruiting" | Massachusetts Locations: Boston 02114 and Boston 02115, both "Not yet recruiting" | ✔ |
| ~214–226 | "the government does not review every study" | Banner "does not review or approve the safety and science of all studies" highlighted | ✔ |
| ~243–249 | "There are 348 studies" | "Viewing 1-10 out of 348 studies for: high blood pressure \| In Chicago, IL" | ✔ |
| ~254–263 | "Now 33 studies are left" | "of 33 studies … \| Recruiting studies"; filter showed "Recruiting (33)" | ✔ |

All values were read from the live site on 2026-10-12 and checked again in the final recording. They will drift as ClinicalTrials.gov updates.

## Quality assessment
The tutorial is clear and honestly paced: one action per step, a spoken plain-language definition for recruiting, eligibility, inclusion/exclusion, placebo and phase, a real second example that shows the same pattern, and an accurate "not medical advice, talk with your doctor" line. Every narrated number matches the frame on screen. The weaknesses: the camera-follow zoom sometimes crops the left edge of long titles (e.g. the study title and the "Phase 3" view). Several study-page shots are dense government text that a phone viewer will struggle to read. The site's own "On this page" sidebar highlights the wrong section while scrolling. These are cosmetic, and the video is usable as is for the advocacy group.

**Remade 2026-10-29** with Storyshot 0.4.2+ (section cards no longer flash the next page; no whoosh at cards). The live counts had moved, so the narration now says 299 (was 298) and 32 (was 33); the rest still matched the site.

## Update, 2026-10-29

Re-composed from the same recording with `hyperframes: true` (Storyshot 0.5.0), so the intro, section and end cards are now HyperFrames animations: titles land word by word, a bar shows the parts, and the intro's steps and the recap points light up as the narration names them. Nothing else changed.
