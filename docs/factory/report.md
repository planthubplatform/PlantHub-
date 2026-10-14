# Factory report

Run started 12 October 2026. Checkout is built and reviewed twice (final
verdict: pass). The run is stopped at the checkpoint, waiting for Kendrick.
The owner reviewed it on 13 October and asked for four changes, now made
(see "Owner's review" below). Choices parked for later are items 7 to 29 in
`docs/review-later.md`.

## Checkout
Built: a landscaper or Personal buyer can press "Add to order" on any listing
(directory or grower page), collect plants from several growers in one basket,
and check out one grower at a time once that grower's plants reach $250. Paying
is a pretend "connect your bank" step with four invented banks; nothing is
typed and no money moves. The grower accepts or declines from an orders page,
seeing the order total, PlantHub's 3% fee and their payout. After acceptance the
buyer chooses pickup (with a date) or delivery (job-site city, date and one of
the carriers the grower allows, priced by sample miles times the carrier's rate
or its trip minimum). The grower confirms a pickup, the buyer confirms a
delivery, and the payout then shows as released. For 48 hours after that the
buyer can report a short count (refunded at once) or a wrong grade (the grower
accepts or disputes). Growers also get "Delivery settings": approved carriers,
an off-by-default "any carrier I haven't blocked" switch, and blocks.

New pages: `basket.html`, `orders.html`, `order.html`. New shared pieces:
`basket.js`, `data/carriers.js`, `data/distances.js`. Changed: `store.js`,
`shared.js`, `app.js`, `directory.html`, `grower.html`, `account.html`,
`inventory.html`, `styles.css`.

Screenshots: screenshots/checkout-desktop.png, screenshots/checkout-phone.png
(the basket), plus checkout-pay-*, checkout-order-*, checkout-orders-* for the
checkout step, one order, and the orders lists. checkout-order-desktop-dark.png
is the dark-mode check. account-*.png are the rebuilt account page. All were
retaken on 13 October after the owner's review.

Builder's own checks before review (all run in a real browser, console read on
every page): the buyer's whole path, the grower's whole path, a Personal buyer,
a sample grower with no account, pickup, delivery with a carrier declining then
another accepting, cancel, decline, both kinds of problem report, every page
signed out and as each of the four demo accounts, phone width with no sideways
scrolling, dark mode, and "Reset the preview". No console errors.

Review round 1: 1 blocker, 6 should-fix, 14 notes. All fixed except where said.
- Blocker: the order's history told the buyer the grower's payout ("The payout
  of $849.72 was released"), which beside the order total gives away the 3%
  fee. Fixed: the history no longer states the payout, and the store no longer
  hands the fee or payout to a buyer's page at all.
- Should-fix: pressing Back could show an order or basket as it was before a
  change. Fixed: pages that belong to one account load afresh when brought
  back; other pages redraw the header corner.
- Should-fix: the directory's search box was squeezed to a sliver for signed-in
  buyers on in-between screen widths. Fixed: it keeps a minimum width, and the
  account name gives way to its round letter first.
- Should-fix: an error stayed on the delivery form after the problem was fixed.
  Fixed: a complaint goes away as soon as its box is changed.
- Should-fix: a declined or cancelled order still showed a 3% fee. Fixed: such
  an order shows what it was for, and that nothing was taken or paid.
- Should-fix: a short-count report refunded money at once without asking.
  Fixed: both kinds of report are checked, then ask "are you sure?".
- Should-fix: the preview hint sent the reviewer to the demo grower for an
  order with a grower who had signed up. Fixed.
- Notes fixed: a console error when removing a basket line after signing out;
  the change form now starts from the current choice; a pickup card now says
  when the plants were collected; a carrier can't be booked past its
  insurance; a double-click on "Add to order" no longer whisks the message
  away; a new quantity in the basket no longer swallows the next click; a
  listing held by a waiting order can't be removed; closing an account settles
  its unanswered orders; the account page shows and can disconnect the bank;
  "-$0.00" is gone; the minimum order is now defined once; the file table in
  `CLAUDE.md` is corrected.
- Notes logged, not changed: the "Sales tax" line and the extra "Delivery
  booked" status (items 20 and 21 in `docs/review-later.md`).
Review round 2: 0 blockers, 0 should-fix, 10 notes. Verdict: pass. Every
round 1 item was re-tested by the reviewer and confirmed fixed, one of them
(the swallowed click in the basket) only partly.
- Fixed after round 2, checked by the builder, not reviewed again: the
  swallowed click in the basket when a new quantity lifts a group over the
  minimum; an outline left on a date box after the complaint was cleared; the
  order page not redrawing when the 48 hours end with the report form open;
  the delete-account question now says what happens to unanswered orders; the
  preview box no longer calls a signed-up grower a "sample grower".
- Logged, not changed (items 26 and 27 in `docs/review-later.md`): after Back,
  the directory can show a stock count a few plants out, and account pages
  drop anything typed and not saved; a deleted demo account comes back with
  its old orders.
- Left as it is: on a screen about 900 wide, a signed-in buyer's directory
  search box shows "Search a plant, nursery" with "or city" cut off.

Not checked by anyone: the Back button in Kendrick's own Chrome (seen in
headless Chrome only), dark mode at phone width, keyboard-only use and screen
readers, the browser's Spanish translation, Firefox and Safari, the real
48-hour clock (the preview's "Skip ahead" was used), and a full browser
storage.

Owner's review, 13 October (after both review rounds; checked by the builder
in a real browser, not reviewed again by the page-reviewer):
- The final action moved to the bottom of the order page. The top card now
  only says where the order stands (with a link down to the action when the
  next move is yours). Then come the plants, the money and the people, and
  last the card you act in: accept or decline, choose pickup or delivery,
  confirm, report a problem. After you act, the page returns to the top.
- Plainer words about money everywhere: a buyer is "charged" or "not
  charged", never "nothing is taken" or "payment is taken". The checkout
  step, the "order placed" message, every order state, the order history and
  the orders list were reworded.
- The grower's accept box now reads "I accept the conditions: plants that
  arrive dead are at my cost...", and leaving it empty says "Check the box to
  accept the conditions."
- New: a pending pickup or delivery request can be changed. "Change pickup or
  delivery" asks "are you sure?", cancels the current choice, and the buyer
  chooses again. Not possible once a carrier has accepted.
- The account page was rebuilt for every kind of account: the name, one row
  of page links that say where things stand, then one settings card with a
  row per subject. The plant directory is in that row, not a card of its own.
- These are now rules for the pages still to build: `CLAUDE.md` ("Rules that
  are easy to break") and `done-checklist.md`.

Parked: items 7 to 29 in `docs/review-later.md`.

Not done:
- The carrier's side of a delivery (the jobs page) belongs to the transport
  page. Until it is built, the buyer's order page has a "Preview tools" button
  that stands in for the carrier accepting or declining.
- Nothing else from the spec is missing.
