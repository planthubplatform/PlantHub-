# Spec: Plant Doc

Written from the questionnaire answers on 12 October 2026 (section D, plus W2).
If something isn't here, the builder takes the sensible default and logs it in
`docs/review-later.md`.

## What it is for
"My plant is sick, help." Someone answers a few guided questions and gets the
likely causes and what to do.

## Files
New:
- `plant-doc.html` (+ `plant-doc.js`): the questions, the answer, and "My plant
  checks".
- `data/plant-doc.js`: the fixed list of problems and the answers.

Changed: `store.js` (saved checks), `account.html` (link), `styles.css`,
`CLAUDE.md` file table.

## A visitor can
- Signed out, anyone can run a check. Step 1: what kind of plant (palm, tree,
  shrub, groundcover or vine, other). Optional: pick the plant by name from the
  Encyclopedia list. Step 2: which part looks wrong (leaves, trunk or stem, new
  growth, roots or soil, the whole plant). Step 3: what it looks like, from a
  list that depends on step 2 (for example yellowing, brown tips, spots, wilting,
  holes, sticky residue, white powder).
- Anyone can go back a step and change an answer without losing the others.
- Anyone gets a result: up to three likely causes, most likely first, each with
  what it means and what to do about it in plain steps.
- The result links to the chosen plant's Encyclopedia entry (or to the
  Encyclopedia filtered by type if no plant was named) and shows "Still stuck?
  Ask a grower", which opens the directory.
- A signed-in visitor sees the check saved automatically under "My plant
  checks" (date, plant, what was wrong, top cause), can reopen a past result, and
  can delete one.
- A signed-out visitor sees a short line that signing in keeps their checks.
- An answer combination with no match gets a designed "we couldn't match this"
  result with general advice and the ask-a-grower link.

## Rules
- D1 (A): guided questions only. No free-text box, no photo upload.
- D2 (A): result = what to do, link to Encyclopedia, ask-a-grower link.
- D3 (A): works signed out; saved only when signed in.
- The page says plainly that answers come from a fixed list, not an expert or
  AI, and that a serious or fast-spreading problem should go to a local
  horticulturist or extension office. Advice stays cautious: no named chemical
  products or dosages.
- W2 (A): no account needed to use it.

## Pretend data
About 15 problems (for example overwatering, underwatering, nutrient
deficiency, scale insects, spider mites, fungal leaf spot, root rot, cold
damage, salt burn, transplant shock), mapped from the three answers. Content is
general knowledge and carries the label "Draft, not yet reviewed by a
horticulturist". Saved checks live in `store.js`.

## Where else it shows
- `index.html`'s Plant Doc circle goes here, not `soon.html`.
- `account.html`: "My plant checks" for any signed-in account.
- News pest alerts and Encyclopedia "common problems" may link here.
- "Reset the preview" wipes saved checks.

## Not in this page
- Real AI, photo upload, free-text description, product recommendations or
  dosages, selling anything.
- Notifications or follow-up reminders.
