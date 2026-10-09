# Site build
Last updated: 9 October 2026

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

## In progress
Nothing uncommitted. Page 1 is waiting on Kendrick's review.

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
- **Account page links only to pages that exist.** Each new page adds its own
  link there, so there is never a dead link.

## Open questions
- Order of the remaining pages (proposed under Next steps).
- The 11 "Road Block 2" questions in `website-design-v2.md`. Where a page needs
  one, build the doc's suggested default and say so on review.

## Next steps
Proposed order, each a separate review:
1. Grower inventory: add, edit, remove a listing; one-tap "still accurate";
   the directory shows the result.
2. Directory: grower profile page, inquiry button, add to order.
3. Checkout: order, $250 minimum, mock ACH, pickup or delivery; order history
   for buyer and grower.
4. Plant Transport: carrier directory, carrier profile and rates.
5. Plant Encyclopedia.
6. Plant News.
7. Plant Doc.
8. Retire `soon.html` once nothing links to it.

## Gotchas
- **Sample listing dates are fixed**, so they age: on 9 Oct every listing is 8+
  days old and "updated this week" reads 0. The grower inventory page fixes
  this naturally (confirming resets the date); until then it looks stale.
- **`app.js` now needs `store.js` loaded first** (it calls `PH.currentUser()`).
- Preview from the main folder's session with the `planthub-design-b` entry in
  `PlantHub/.claude/launch.json`; it serves this folder on port 5174.
- The Browser pane's screenshot sometimes times out when the app window is in
  the background. Retry, or check with `javascript_tool` / `read_page`.
- Pushing is Kendrick's: hand over the command, don't push.

## Key files
- `store.js` — mock accounts and the header's account corner; the `PH` object.
- `signin.html`, `signup.html`, `account.html` — the account pages.
- `app.js` — directory logic; the signed-in contact line is in `rowHtml`.
- `styles.css` — the "Accounts" section at the bottom.
- `CLAUDE.md` — decisions and the file map.
