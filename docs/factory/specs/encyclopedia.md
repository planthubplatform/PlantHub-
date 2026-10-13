# Spec: Plant Encyclopedia

Written from the questionnaire answers on 12 October 2026 (section E, plus W2).
If something isn't here, the builder takes the sensible default and logs it in
`docs/review-later.md`.

## What it is for
A beginner-friendly guide to every plant that appears in the sample listings,
linked both ways to the directory.

## Files
New:
- `encyclopedia.html` (+ `encyclopedia.js`): the index, with search and a type
  filter.
- `plant.html?name=<common name>`: one plant's entry.
- `data/plants.js`: one entry per distinct common name in `data/nurseries.js`.

Changed: `app.js` and `grower.html` (a listing's plant name links to its entry),
`styles.css`, `CLAUDE.md` file table.

## A visitor can
- Signed out, anyone can browse the index, search by common or botanical name,
  and filter by type (palm, tree, shrub, groundcover, other).
- Anyone can open an entry and read: the common and botanical name, a drawn
  placeholder for its type, beginner care (light, water, mature size, cold
  tolerance, salt tolerance, common problems), and one "for the trade" line
  (usual container sizes, typical use).
- Anyone can press "Who has it now" and land in the directory searching for that
  plant (`directory.html?q=`), freshest first.
- Anyone can press the plant name on a directory row or a grower page listing
  and land on its entry.
- An entry shows how many growers list it right now, taken live from
  `PH.nurseries()`, not typed in.
- A search with no match shows a designed empty state with a link to the
  directory.

## Rules
- E1 (A): every distinct common name in the sample listings gets an entry. If a
  grower adds a plant whose name has no entry, its row simply doesn't link.
- E2 (A): no photographs. One simple drawn placeholder per type (four drawings),
  with a note on each entry that photos come later.
- E3 (A): beginners first, plus the single trade line.
- Every entry carries the label "Draft, not yet reviewed by a horticulturist".
  Care notes are written from general knowledge and kept cautious; where unsure,
  say "check before planting" rather than inventing a figure.
- W2 (A): no account needed anywhere on these pages.

## Pretend data
`data/plants.js` is the only content. It is not sample in the invented-business
sense, so the draft label is what keeps it honest. The builder checks with a
small script that every common name in `data/nurseries.js` has an entry.

## Where else it shows
- Directory rows and grower pages link names to entries.
- Plant Doc results (its spec) link to the entry.
- `index.html`'s Plant Encyclopedia circle goes here, not `soon.html`.

## Not in this page
- Photos, user-submitted plants, comments, saving favourites.
- Plants that no listing carries.
- Buying from the entry: it links to the directory only.
