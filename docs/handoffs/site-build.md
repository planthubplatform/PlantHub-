# Site build
Last updated: 19 October 2026 (skeletons of the four empty sections built)

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
The light factory is running (`docs/factory/README.md`). The questionnaire is
answered and the six specs are written. **Checkout is built** and the run is
stopped at the checkpoint, waiting for Kendrick. What happened is in
`docs/factory/report.md`; the choices parked along the way are items 7 to 19
in `docs/review-later.md`.

Kendrick reviewed checkout on 13 Oct and asked for four changes, all made:
the final action sits at the bottom of the order page, money is "charged" and
"paid" (never "taken"), a pending pickup or delivery can be changed by
cancelling it with a confirm, and `account.html` was rebuilt as a row of page
links over one settings card. The first three are now rules in `CLAUDE.md`
and lines in `docs/factory/done-checklist.md`, so the remaining pages follow
them from the start.

Next, when Kendrick says to continue: `transport`, then `encyclopedia`,
`news`, `plant-doc`, `site-wide`, each by its spec in `docs/factory/specs/`.

Page 3 (grower page and inquiries) was never reviewed on its own; it is
reviewed together with checkout at the checkpoint.

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
- **An order is a copy, not a pointer.** Each order line copies the listing as
  it was, price included, so a later edit to the listing doesn't change the
  order. The basket is the opposite: it keeps only which listing and how many,
  and reads the price live.
- **Stock comes off when the order is placed**, by writing the nursery's
  overlay in `store.js` (`changeStock`), and goes back on decline or cancel.
  The "updated" date is left alone: only the grower confirms freshness.
- **Carrier, grower and time stand-ins are preview tools**, in one marked box
  on the buyer's order page (`PH.preview...`). `previewCarrierAnswer` is
  temporary: remove it and its two buttons when `jobs.html` exists.
- **A carrier's insurance is never stored as yes or no.** `PH.carriers()` works
  out `insured` from the expiry date each time it is called.
- **An order page has two halves** (`stage()` in `order.html`): what is going
  on, drawn at the top, and what this person can do, drawn at the bottom
  under the plants, money and people. New order states add to both.
- **The account page's links are a list in one function** (`pageLinks()` in
  `account.html`). A new page for a kind of account is one more entry there.
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
8. Retire `soon.html` once nothing links to it. **Done 19 Oct 2026** (deleted).

## Gotchas
- **Long shell commands are cut off on this PC** (heredocs over a few thousand
  characters arrive truncated). Write scripts with the Write tool, then run them.
- **The Browser pane's 1280-wide screenshots come out tiny.** For readable
  desktop screenshots, and for scripted click-throughs, drive a headless Chrome
  from a small Node script (Node 24 has `WebSocket` built in, so nothing needs
  installing). Phone-width screenshots in the pane are fine.
- **`data/nurseries.js` is not loaded on every page.** `PH.addToBasket` and
  friends only find listings on pages that load it (directory, grower, basket,
  orders, order, inventory).
- The preview for this folder is the `planthub` entry in this folder's own
  `.claude/launch.json`, on port 5173.
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

## Skeleton pages (19 Oct 2026)
Kendrick asked for simple versions of every empty section, to edit from:
`transport.html`, `encyclopedia.html` (+ `data/plants.js`), `news.html`
(+ `data/news.js`) and `plant-doc.html` (+ `data/plant-doc.js`). The front
page circles now open them. The questionnaire's T, E, N and D sections are
left untouched for Hernan; the fuller specs wait on his answers. Each data
file explains at the top how to add or write an entry. Checked by the builder
in a real browser (all four pages, phone, dark, no console errors); not
reviewed by the page-reviewer.

## Light and dark (19 Oct 2026)
A sun/moon switch is first in every page's top corner (and in the sign-in
and sign-up headers). theme.js applies the choice before the page draws and
remembers it per device; with no choice made it follows the device. All of
`styles.css`'s dark rules were moved from `@media (prefers-color-scheme:
dark)` to `html.dark ...`, and Tailwind is set to `darkMode: 'class'`.
Checked: every page in both modes, the choice carrying across pages, a
light choice on a dark device, phone headers. No console errors.

## Shareable preview link
https://claude.ai/artifact/WcJ635k193vKXCDPuixrg6 is a clickable copy of the
design-b site for Kendrick's partner (published 14 Oct 2026, private until
Kendrick shares it from the page's Share menu). It is a snapshot: it does not
follow the branch, so republish to the same URL after each page is built.
How the copy is made from this folder: copy every .html, .js, .css, .svg and
`data/*.js`; pin Tailwind to `https://cdn.tailwindcss.com/3.4.17` (the host
only accepts pinned versions); make `index.html` the main page by removing its
doctype, html, head and body tags and setting the body classes from a
one-line script (the host wraps the main page itself); and move grower.html's
inline script into a `grower.js` beside it (the host's publish check mistook
the page for a different kind of page while the script was inline). Each
viewer's pretend data stays in their own browser, as it does locally.

## Key files
- `basket.html`, `basket.js`, `orders.html`, `order.html` — the basket,
  checking out, and orders for both sides.
- `data/carriers.js`, `data/distances.js` — sample carriers and mileage.
- `docs/factory/` — the run's rules, specs, report and screenshots.
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
