# Spec: Checkout and orders

Written from the questionnaire answers on 12 October 2026 (section C, plus W2
and W3 where noted). If something isn't here, the builder takes the sensible
default and logs it in `docs/review-later.md`.

## What it is for
A landscaper or Personal buyer collects plants from one or more growers, pays by
pretend bank transfer, and chooses pickup or delivery. Growers accept or decline
orders and confirm pickups. Both sides keep an order history.

## Files
New:
- `basket.html` (+ `basket.js`): the basket and the checkout steps.
- `orders.html`: order history. Buyers see what they ordered; growers see orders
  to fill. A grower also has a "Delivery settings" section here (approved
  carriers, the "also allow any carrier I haven't blocked" switch, blocked
  carriers).
- `order.html?id=<order id>`: one order, its status, what happens next, the
  report-a-problem box.
- `data/carriers.js`: 8 sample carriers (the transport page reuses this file;
  its spec describes the fields). Built here because checkout needs carriers
  first.
- `data/distances.js`: miles between the sample cities (see Pretend data).

Changed: `store.js` (basket, orders, bank, carrier approvals, blocks; all new
functions listed at the top of the file like the existing ones), `app.js` and
`grower.html` (Add to order button), `account.html` (links), the account corner
in `store.js` (basket count), `inventory.html` (quantities come off when an
order is placed), `styles.css`, `CLAUDE.md` file table.

## A visitor can
- Signed out, press "Add to order" and be sent to `signin.html?next=...`, then
  come back to the same listing.
- A landscaper or Personal buyer can add a listing to the basket with a quantity
  (1 up to the exact count on hand), from the directory detail strip and from the
  grower page.
- A buyer can open the basket and see it grouped by grower, each group with its
  own subtotal, "$250 minimum" progress, and a Check out button that stays off
  until that group reaches $250. Other groups stay in the basket.
- A buyer can change a quantity, remove a line, or clear the basket.
- A buyer can check out one grower's group: connect a pretend bank (first time
  only), confirm, and see the order as "Awaiting grower".
- A grower can open Orders, see the new order with the buyer's name, the lines,
  the total, "PlantHub fee 3%" and "Your payout", and Accept or Decline. Accept
  needs a tick on "Plants that arrive dead are my cost".
- After Accept, the buyer sees the order as paid (held by PlantHub) and is asked
  to choose pickup or delivery.
- A buyer choosing pickup picks a collection date; the grower marks it "Picked
  up" when it happens. The payout then shows as released.
- A buyer choosing delivery picks the job-site city from a list, sees only
  eligible carriers with a delivery cost for each, and picks one. The carrier
  sees a "requested" job (handled by the transport spec). The buyer confirms
  "Delivered" when it arrives; the payout then shows as released.
- A buyer can open an order within 48 hours of pickup or delivery and press
  "Report a problem": short count (refund at unit price, shown at once) or wrong
  grade (the grower accepts or disputes; a dispute reads "PlantHub is
  reviewing").
- A grower can decline an order and see the counts return to the listing.
- A grower can tick approved carriers, turn the "also allow any carrier I haven't
  blocked" switch on, and block a carrier.
- A grower or transporter pressing Add to order sees a box saying ordering is for
  buyer accounts.

## Rules
- C1 (B): landscapers and Personal accounts can order, same $250 minimum.
  Growers and transporters can't.
- C2 (A): one basket across growers; checkout splits it into one order per
  grower.
- C3 (A): the $250 minimum is per grower group, on the plants subtotal (delivery
  isn't counted).
- C4 (A): orders wait as "awaiting grower". Counts come off the listing when the
  order is placed and go back if declined. The grower sees the order only after
  it is placed. The buyer can cancel while it is still awaiting.
- C5 (A): pretend bank step. Pick from 4 invented banks, see "Sample Bank
  ····1234 connected". No typing of any account or routing number, ever.
  Remembered on the buyer's account. No card fields.
- C6 (A): job-site city from a list; miles from `data/distances.js`; delivery
  cost = miles x the carrier's per-mile rate, or the carrier's per-trip minimum
  if higher.
- C7 (A and B combined): a buyer sees a grower's ticked carriers, plus every
  carrier neither side has blocked if the grower's switch is on (off by
  default). A carrier with lapsed insurance never shows. A blocked pair never
  shows. Nothing ticked and switch off means pickup only, and the buyer is told
  why.
- C8 (A): the payout shows "Held" until pickup is confirmed by the grower or
  delivery by the buyer, then "Released". Nothing moves in real life; the page
  says so.
- C9 (A): the problem window is 48 hours from confirmation. After that the
  button is gone with a plain note.
- C10 (A): the grower's order shows total, "PlantHub fee 3%", payout. The buyer
  never sees the fee. Fee is 3% of the plants subtotal.
- Locked in `CLAUDE.md`: ACH only, pay in full, PlantHub holds the funds, no
  sales tax calculated, exact counts, pickup or delivery after paying.
- Order statuses, in order: Awaiting grower, Accepted (paid, held), Ready for
  pickup or Delivery requested, Picked up or Delivered, Complete. Also Declined
  and Cancelled.

## Pretend data
- Order numbers like "PH-1001", labelled sample orders. No orders exist at the
  start; a fresh visitor sees an empty state with a link to the directory.
- 4 invented banks ("Sample Bank", "Example Credit Union", and so on).
- `data/carriers.js`: "Sample Carrier 01 (Flatbed)" through 08, with per-mile
  rate, per-trip minimum, what they haul, equipment, insurance expiry (one
  already lapsed, one expiring within 30 days), and a completed-deliveries
  count.
- `data/distances.js`: about 16 Palm Beach County and nearby cities, including
  the 10 nursery cities. Labelled "sample mileage, not road-accurate".
- The demo grower (Sample Grower 01) starts with 3 carriers ticked so delivery
  can be tried at once; every other grower starts with none.

## Where else it shows
- Directory detail strip and grower page: "Add to order" next to Inquire.
- Header account corner: basket count for buyers; "Orders" for everyone signed
  in, with a count of orders needing the grower's action.
- `account.html`: "My orders" (buyers), "Orders to fill" (growers).
- `inventory.html`: quantities already reflect orders placed; a note on a
  listing when part of it is in an order awaiting acceptance.
- "Reset the preview" wipes baskets, orders, bank and carrier approvals.

## Not in this page
- Sales tax of any kind, tax-exempt handling.
- Real or typed bank details, card fields, real emails.
- Net terms, grower-set payment terms.
- Changing an order's lines after it is placed (cancel and re-order instead).
- Carrier-side screens (jobs page, carrier profile): the transport spec.
- Ratings, reviews, tracking maps.
