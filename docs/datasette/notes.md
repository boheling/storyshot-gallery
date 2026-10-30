# Datasette: filter, facet, export CSV (docs GIFs)

## Request
"We need help-center GIFs and a short article for Datasette: how to filter a table, use a facet, and export the filtered rows as CSV. Use the public demo at https://global-power-plants.datasettes.com/global-power-plants/global-power-plants (e.g. show only solar plants in one country)."

## Numbers
- Wall clock: 21:20:05 to about 21:27 PDT, roughly 7 minutes.
- Full renders: 2 (limit 5). Compose-only runs: 0.
- Type: `docs`, chosen by the skill. Silent, no voice, no music. 5 steps, 43.7 s MP4, plus 5 cropped GIFs, 5 PNGs and a README.md article.
- Flow: filter primary_fuel = Solar (9,662 rows), then the country_long facet "Spain" (243 rows), then the CSV link (raw CSV in the browser), then Advanced export with "download file" ticked and Export CSV.

## Problems and fixes
1. **The public demo blocks automated filtering.** global-power-plants.datasettes.com redirects to datasette.io. That site sends any table URL with more than one query parameter (the filter form submit, facet-on-filter, `_sort=...&col=...`) to a Cloudflare Turnstile "Verify you are human" page. Single-parameter URLs and curl are not blocked. Storyshot cannot get past a CAPTCHA, and it shouldn't try. Its `login` flow needs a human, and the user was unavailable.
   Fix: I downloaded the demo's own `global-power-plants.db` (11.7 MB, a public download). I served it locally with Datasette 1.0a41, installed in a venv inside the work dir, using the same facets metadata (country_long, owner, primary_fuel). Then I recorded against `http://127.0.0.1:8765`. The UI and data match the live demo, and docs GIFs show no URL bar. The demo runs a slightly different Datasette build, though, so a few details differ: its suggested facets, and the cluster-map/GraphQL plugins, which are absent locally. The storyboard therefore points at localhost and will not re-render unless that server is running.
2. **Step-label notes covered UI** on the first render: "Column to filter" sat on the operator dropdown, and "Saves a .csv file" sat on the "download file" label. Fixed with `side: top` / `side: bottom`. The top note in step 1 still partly covers the "10,000+ rows" heading.
3. **The CSV result was cropped mid-file** (rows 20171+ with no header) on the first render. Fixed by marking the header row (`mark: "rowid,country,country_long,name"`), which pulls the crop to the top.
4. **The README article drops `**bold**` from `doc:` text.** Bold is treated as caption accent and stripped. I used quotes for UI labels instead. Backticks survive.
5. **Storyshot can't show a finished download.** In headless Chromium, clicking Export CSV with "download file" ticked gives no visible result, so step 5 ends on the ticked box and the click. The article text carries that step.
6. The article's H1 is the storyboard slug ("global-power-plants-docs-filter-facet-export"). There is no intro sentence and no field to set a title, so it needs a manual title before publishing.

## Assessment
Steps 1–3 (filter and facet) work well as help-center GIFs. Each one is short, cropped and readable, with a highlighted row count that confirms the result, and the doc text is accurate, including the real counts 9,662 and 243. The export steps are weaker. Step 4 shows a wall of raw CSV that proves "it's the filtered data" but looks unfriendly. Step 5 can't show a file arriving, and the Advanced export box sits above a confusing CREATE TABLE schema. The article needs a real title, a one-line intro, and bold UI labels added by hand before it goes live. It is also worth saying in the help center that the screenshots come from a local copy of the demo.
