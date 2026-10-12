# Site build
Last updated: 10 October 2026

## Lane
Builds every page of the site on `design-b` as a fully clickable mock, one page
at a time, each reviewed by Kendrick before the next. The only lane editing site
files; it took over from Website design V2.

## Done
- `9106eb2` — main's handoff notes merged into `design-b`; one `CLAUDE.md`.
- `410f75b` (and `7b3a842` on `main`) — sample nurseries renamed "Sample Grower
  01 (Palms)" … "10 (Mixed)".
- Page 1, accounts (see the latest commit on `design-b`): `store.js` mock back
  end, working `signin.html` (sign in, `#forgot` reset, demo accounts),
  working `signup.html`, new `account.html`, account corner in the headers of
  `index.html` and `directory.html`. Signed-in visitors see the grower's phone
  and email in a directory row's detail; signed-out ones see the sign-in link.
- Page 2, grower inventory (latest commit on `design-b`): `inventory.html`,
  nursery and listing functions in `store.js`, `shared.js` split out of
  `app.js`, a "Manage your inventory" link on `account.html` for growers. The
  directory now reads `PH.nurseries()`, so a grower's changes show at once.
- Page 3, directory tune-up and inquiries (latest commit on `design-b`):
  `grower.html` profile page, `inquiry.js` pop-up, `inquiries.html`
  conversations, inquiry functions in `store.js`. In the directory the nursery
  name links to the grower page, the detail strip has Inquire and View grower,
  and phone and email are gone. Table and filter rail restyled to the site's
  16px cards.

## In progress
The light factory is set up in `docs/factory/` (12 Oct) but not ready to run:
`questionnaire.md` has no answers yet and `specs/` holds only the template.
Next: ask Kendrick the questionnaire in chat, section by section, write the
answers in, write the five page specs plus `site-wide`, and get his go.

Nothing uncommitted. Page 3 is waiting on Kendrick's review; pages 1 and 2
were approved with "go".

## Decisions
- **Mock back end is localStorage, in one file (`store.js`).** No server exists
  and none is wanted yet. Everything a later real back end replaces is behind
  the `PH` object, so pages don't touch storage directly.
- **Demo accounts, one per type, as one-click buttons on the sign-in page.**
  Kendrick is non-technical and reviews by clicking; nobody should need to
  remember a test password.
- **Passwords are plain text in the browser.** Acceptable only because the
  accounts are invented; both auth pages warn not to reuse a real password.
- **Tax-exempt capture left as built.** Sign-up stores the number, expiry and
  file name (never the file); the account page shows them read-only. Not
  extended, per `CLAUDE.md`.
- **Grower changes are an overlay, not a copy of the sample data.** `store.js`
  keeps `{ nurseryId: { plants, profile } }` only for nurseries a grower has
  touched; everything else still comes from `data/nurseries.js`. Editing the
  sample file keeps working, and "Reset the preview" undoes every change.
- **A grower who signs up gets an empty nursery on first visit**, and must give
  a city before adding listings (buyers search and filter by city).
- **Photos are shrunk to 320px thumbnails and kept in the browser**, five per
  listing at most, each stamped with the day it was added. Sample listings
  carry only a photo count; adding real pictures replaces the count.
- **Quantity 0 hides a listing from buyers** but keeps it in the inventory.
  My default, not yet confirmed by Kendrick.
- **Add to order moved to the checkout build.** A button that adds to an order
  needs an order page to land on, so both arrive together in page 4.
- **Only buyer accounts (landscaper, personal) can send inquiries.** Growers
  and transporters get a box saying so. My default for open question 1.
- **Opening `inquiries.html` marks everything read**; the "New" mark stays for
  that visit so the reader can see what was new.
- **Account page links only to pages that exist.** Each new page adds its own
  link there, so there is never a dead link.

## Open questions
- Order of the remaining pages (proposed under Next steps).
- Choices made while building are parked in `docs/review-later.md` for one
  review at the end. Kendrick asked for this on 12 Oct: build a default, log
  it there, keep going.
- The 11 "Road Block 2" questions in `website-design-v2.md`. Where a page needs
  one, build the doc's suggested default and say so on review.

## Next steps
The remaining pages are built by the light factory, in the order and by the
rules in `docs/factory/README.md`, with a checkpoint after checkout. The list
below is the earlier page-by-page plan it replaces:
1. Grower inventory. **Built, in review.**
2. Directory: grower profile page and inquiries. **Built, in review.**
3. Checkout: add to order from the directory and grower page, the order page,
   $250 minimum, mock ACH, pickup or delivery; order history for buyer and
   grower.
4. Plant Transport: carrier directory, carrier profile and rates.
5. Plant Encyclopedia.
6. Plant News.
7. Plant Doc.
8. Retire `soon.html` once nothing links to it.

## Gotchas
- **Sample listing dates are fixed**, so they age: by 8 Oct every listing is 8+
  days old and "updated this week" reads 0 until a grower confirms. Only the
  demo grower's nursery (Sample Grower 01) can be confirmed from the site.
- **Script order matters:** `shared.js`, `store.js`, `data/nurseries.js`, then
  `app.js` or the page's own script.
- **Tailwind's layout classes beat the `hidden` attribute.** An element with
  `flex` or `inline-block` needs its own `[hidden] { display: none }` rule in
  `styles.css`, or it never hides.
- Preview from the main folder's session with the `planthub-design-b` entry in
  `PlantHub/.claude/launch.json`; it serves this folder on port 5174.
- The taste-skill named in Kendrick's global instructions is written for landing
  pages and rules itself out for data tables and product UI. Apply only its
  consistency rules here (shape, one accent, contrast, no em dashes), and keep
  the existing palette and Fraunces wordmark: they are the established brand.
- The Browser pane's screenshot sometimes times out when the app window is in
  the background. Retry, or check with `javascript_tool` / `read_page`.
- Pushing is Kendrick's: hand over the command, don't push.

## Key files
- `store.js` — mock accounts, nurseries and listings, and the header's account
  corner; the `PH` object.
- `shared.js` — freshness helpers and the listing vocabulary.
- `grower.html`, `inquiry.js`, `inquiries.html` — the grower's public page and
  buyer-to-grower messages.
- `inventory.html` — the grower's page; its script is numbered in sections.
- `signin.html`, `signup.html`, `account.html` — the account pages.
- `app.js` — directory logic; the signed-in contact line is in `rowHtml`.
- `styles.css` — the "Accounts" section at the bottom.
- `CLAUDE.md` — decisions and the file map.
