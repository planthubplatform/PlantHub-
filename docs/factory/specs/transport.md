# Spec: Plant Transport

Written from the questionnaire answers on 12 October 2026 (section T, plus C7).
If something isn't here, the builder takes the sensible default and logs it in
`docs/review-later.md`.

## What it is for
A public directory of carriers, a profile page for each, and a jobs page where a
carrier accepts or declines deliveries that buyers requested at checkout.

## Files
New:
- `transport.html` (+ `transport.js`): the directory.
- `carrier.html?id=<carrier id>`: one carrier's public profile.
- `my-carrier.html`: a transporter edits their own profile.
- `jobs.html`: a transporter's delivery jobs.

Changed: `store.js` (carrier profile and job functions; carriers added by
transporters who sign up), `data/carriers.js` (already made by the checkout
page), `account.html` (links for transporters), checkout code that creates a
job when a delivery is requested, `styles.css`, `CLAUDE.md` file table.

## A visitor can
- Signed out, anyone can open the directory and see each carrier's per-mile
  rate, per-trip minimum, what they haul, equipment, "insurance in date" and
  completed-deliveries count. No phone, no email, no contact button.
- Anyone can filter by what is hauled (plant types and sizes) and by equipment,
  and sort by per-mile rate or by trip minimum.
- Anyone can open a carrier's profile and read the full details.
- A carrier with lapsed insurance does not appear in the directory.
- A transporter can open My carrier profile, edit their details
  (company name, base city, per-mile rate, per-trip minimum, what they haul
  from a list, equipment from a list, insurance expiry date) and save.
- A transporter who sets the insurance expiry to a past date sees a clear note
  that they are hidden from the directory and from checkout until it is renewed.
- A transporter can open Jobs and see each delivery as Requested, Accepted,
  Delivered or Declined, with the order, from and to cities, miles and the
  delivery cost.
- A transporter can Accept or Decline a requested job. A declined job returns
  the order to the buyer, who is asked to pick another carrier or switch to
  pickup.
- A transporter can block a grower. A blocked pair never appears on an order.
- A buyer or grower pressing anything carrier-only sees a plain message that it
  is for transport accounts.

## Rules
- T1 (A): the directory is public. The same list, minus blocked pairs and
  anyone not allowed by that grower (checkout spec, C7), is what buyers pick
  from.
- T2 (A): no inquiry button, no contact outside an order. The profile says
  carriers are booked through a PlantHub order.
- T3 (A): a carrier accepts or declines each job; being picked is not booking.
- T4 (A): no ratings. Facts only: completed deliveries, insurance in date.
- Locked in `CLAUDE.md`: per-mile rate with a per-trip minimum; a lapsed
  insurance date hides the carrier automatically; dead plants are the grower's
  cost (carrier insurance covers accidents in transit).
- Insurance in date is checked against today's date every time the directory
  or checkout loads, never stored as a yes/no.
- "Delivered" is confirmed by the buyer on the order page (checkout, C8). The
  carrier's job page shows it as delivered once the buyer has.

## Pretend data
- Sample Carrier 01 (Flatbed) to 08, from `data/carriers.js`, each labelled
  sample. One has lapsed insurance (hidden), one expires within 30 days (shown
  with a "renew soon" note on its owner's page only).
- The demo transporter account owns Sample Carrier 01 and starts with two
  pretend jobs so the jobs page is not empty.
- A transporter who signs up gets an empty carrier profile and stays out of the
  directory until it is complete and in date.

## Where else it shows
- `account.html`: "My carrier profile" and "Jobs" for transporters.
- Header account corner: count of requested jobs waiting.
- Checkout's carrier picker reads the same data.
- `index.html`'s Plant Transport circle and any section link row go to
  `transport.html`, not `soon.html`.

## Not in this page
- Booking or messaging a carrier outside an order.
- Ratings, reviews, tracking, live maps.
- Real insurance documents; the expiry date is a typed date only.
- Quotes beyond miles x rate or the trip minimum.
