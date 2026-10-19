# PlantHub — read this first

Every Claude Code session on this repo reads this file automatically. It is the
shared memory between sessions and machines (Mac, Windows PC, cloud). **If you
settle something, write it here and push, so the next session knows.**

## The rule

**Pull before you start, push when you stop.**

```bash
git pull origin <your-branch>
```

Several sessions and two computers commit to this repo. If two commit without
pulling in between, the second push is refused. Pull, then push again.

## Handoff notes

Long sessions get retired, so each lane keeps a short note in `docs/handoffs/`
that lets a fresh session pick up without the old conversation.

- At the start of a session, read `docs/handoffs/` before exploring anything
  else. Read your own lane's note in full; skim the others only if your task
  touches them.
- Keep your lane's note at `docs/handoffs/<lane>.md` current: update it after
  each commit and before stopping work. Follow the template in
  `docs/handoffs/README.md`.
- Edit only your own lane's note.
- This file holds decisions; handoff notes hold the state of the work. If they
  disagree on a decision, this file wins.

## Branches

| Branch | What it is |
|---|---|
| `main` | The published site. Tag `v1-trade-table` marks the 4 Oct 2026 version. |
| `design-b` | The overhaul. Not live. **Never merge into `main` unless the owner says so.** |

More in `docs/two-versions.md`.

## Who is working on what

| Session | Branch | Job |
|---|---|---|
| Site build | `design-b` | Builds every page as a working mock, one at a time. The only session editing site files. Note: `docs/handoffs/site-build.md`. |

The earlier sessions (Website design V1 and V2, grower side, operating model)
were retired on 8 Oct 2026. Their handoff notes are in `docs/handoffs/`.

Add your session to this table when you start long-running work.

## The owner

Learning to code. Explain new ideas in plain language. Lead with the
recommendation. Keep code comments plain and explanatory, like the ones
already in the files.

## The light factory

The remaining pages are built in one long run: one builder, one independent
reviewer, written specs. How it works, the page order, and when to stop are in
`docs/factory/README.md`. Read it before building any new page.

## Working standards

- **Find the cause before fixing a bug.** Reproduce it, trace it back to where it starts, and say what the cause is before changing anything. No guess-and-retry fixes, and no patching the symptom.
- **Evidence before "done".** Never say something works or is fixed without having just checked it: run it, click it, read the result, and report what was seen. If a check was skipped or failed, say so.

## How the site is built

Plain HTML, CSS and JavaScript. No install, no build step.

| File | What it is |
|---|---|
| `index.html` | Front page: Sign in, the PlantHub wordmark, search, five round section links. |
| `directory.html` + `app.js` + `data/nurseries.js` | The plant directory: the trade listing table that used to be the whole site. Light header like the front page (logo home, search, Sign in). Both the front-page search and the "Plant Directory" circle land here; it reads `?q=`. |
| `shared.js` | What every page showing a listing or an order needs: the freshness date helpers, price, money and date text, the trade's vocabulary (`CONTAINERS`, `SPECS`, `GRADES`) and the transport vocabulary (`HAUL_TYPES`, `HAUL_SIZES`, `HAUL_LOADS`, `EQUIPMENT`). Load it before `app.js`. |
| `store.js` | The pretend back end. Keeps mock accounts, growers' listing changes, baskets, orders and each grower's carrier rules in the browser's own storage (localStorage) and draws the account corner in every header. Nothing is sent anywhere. Pages read nurseries through `PH.nurseries()`, never `NURSERIES` directly. Every function is listed at the top of the file. |
| `grower.html` | One grower's public page (`grower.html?id=<nursery id>`): who they are, how fresh their listings are, everything they have, with "Add to order" and "Inquire" on every listing. No phone or email. |
| `inquiry.js` | The "send an inquiry" pop-up, shared by the directory and the grower page. `openInquiry(nursery, listing)`. |
| `inquiries.html` | Conversations between buyers and growers. Either side can reply. |
| `basket.js` | The "add to order" pop-up, shared by the directory and the grower page. `openAddToOrder(nursery, listing)`. |
| `basket.html` | A buyer's basket, grouped by grower, and checking out one grower's group: review, pretend bank, place order. Three views picked by what follows `#`. Buyers only. |
| `orders.html` | Every order the signed-in buyer or grower is part of. Growers also keep their delivery settings here: approved carriers, the "any carrier I haven't blocked" switch, blocks. |
| `order.html` | One order (`order.html?id=PH-1001`) and everything done to it: accept or decline, pickup or delivery, confirm, report a problem. The "Preview tools" box stands in for people a reviewer can't sign in as. |
| `data/carriers.js` | Eight invented transport companies ("Sample Carrier 01 (Flatbed)"). Insurance is given as days from today so the samples never all lapse. |
| `data/distances.js` | Sample mileage between 18 South Florida cities, worked out from rough positions. Not road-accurate, and says so. |
| `inventory.html` | A grower's own listings: one-tap "still accurate" (all, or one row), quantity and price edited in the row, add / edit / remove, photos, and the nursery's name and city. Growers only. |
| `signin.html` | Sign in, reset a password (`#forgot`), one-click demo accounts, and a "Create an account" button. Works against `store.js`. |
| `signup.html` | Create an account, one question per screen (steps after `#`). Makes a mock account and signs in. |
| `account.html` | The signed-in person's page, in three parts: who they are; "Your pages", one row of links for their kind of account (directory, basket, orders, inquiries, inventory), each saying where things stand; and "Account settings", one card with a row per subject (details, bank, password, leaving). Sends signed-out visitors to sign in first. |
| `transport.html` | Plant Transport, a first simple version: the carriers with their rate per mile, trip minimum, what they haul, equipment and insurance date, filtered by what they haul. Lapsed insurance is left off automatically. Carriers are booked only through an order. |
| `encyclopedia.html` + `data/plants.js` | Plant Encyclopedia, a first simple version: an entry for every plant in the listings, all 41 written, with search, a kind-of-plant filter, and who has each plant now. One entry is `encyclopedia.html#sabal-palm`. Draft notes, labelled as not reviewed by a horticulturist. |
| `news.html` + `data/news.js` | Plant News, a first simple version: a few invented sample articles in three topics, each labelled "Sample article". One article is `news.html#<id>`. |
| `plant-doc.html` + `data/plant-doc.js` | Plant Doc, a first simple version: three questions (kind of plant, part, what it looks like), then the likely causes from a fixed list, with what to do and links to the encyclopedia and the directory. No AI, and it says so. |
| `theme.js` | Colours and fonts for every page (the Tailwind config), and light or dark: it follows the device until the sun/moon switch in the top corner is pressed, then remembers that choice on the device. |
| `styles.css` | Styles Tailwind classes can't say cleanly. |

Rules that are easy to break:
- **Green means fresh.** Green is only for how recently a listing was confirmed (and the logo dot). Hover and selected states use clay.
- **Sample data stays labelled.** `data/nurseries.js` is invented. Never present it as real businesses.
- **Read first, answer last.** On a page that ends in a decision (accept an order, choose a delivery, confirm, report), what there is to review comes first and the button that settles it comes last, at the bottom. The top of the page only says where things stand. (Owner, 13 Oct 2026.)
- **Plain words about money.** A buyer is "charged" or "not charged"; a grower is "paid". Never "taken", "authorized" or "payment is taken". Say "check the box", not "tick". (Owner, 13 Oct 2026.)
- **Changing your mind takes two steps.** A pending choice (a pickup, a delivery request) is changed by cancelling it, after an "are you sure?", and choosing again. It is never an open form that can be fiddled with.
- **Order status tags are never green.** Clay means "your move", sand means done, a dashed outline means the order came to nothing (`orderPillClass` in `shared.js`).
- **The buyer never sees PlantHub's 3%.** Only the grower's side of an order shows the fee and the payout, and `store.js` only puts them on the copy of an order a grower gets. An order's history is read by both sides, so it never states the payout: beside the order total, that gives the fee away.
- **A page that changes stock must load `data/nurseries.js`.** Placing, declining or cancelling an order, and deleting an account, all move plants on or off listings.
- **No bank or card details are ever typed.** The buyer picks an invented bank from a list and that is the whole step.
- **Preview tools are marked as preview.** Anything that stands in for a person or for time passing (`PH.preview...` in `store.js`) sits in the "Preview tools" box and says it exists only in the preview.
- **Dark mode is a class.** theme.js puts `dark` on `<html>`; Tailwind's `dark:` classes and the `html.dark ...` rules in `styles.css` follow it. Never write `@media (prefers-color-scheme: dark)` for page colours, or the switch stops working for that part.
- Script order on pages with deliveries: `shared.js`, `store.js`, `data/nurseries.js`, `data/carriers.js`, `data/distances.js`, then the page's own script.
- Tailwind comes from `cdn.tailwindcss.com`. Cloud sandboxes block that address, so screenshots there need a locally built copy of the CSS.

## Decisions made

- **6 Oct 2026 — Front page:** Sign in top right, PlantHub in the middle, search below, then five round links: Plant Directory, Plant Transport, Plant Encyclopedia (beginner friendly), Plant News, Plant Doc ("my plant is sick, help").
- **6 Oct 2026 — Accounts are coming.** Sign in opens a log-in page with "Create an account" below.
- **6 Oct 2026 — Sign-up flow.** "Who are you?" → **Buyer** or **Seller**. Then "Ok, but who?" → Buyer: **Landscaper** or **Personal**; Seller: **Grower** or **Transporter**. Then name, email, password. No one-line descriptions under the choices.
- **6 Oct 2026 — Tax exempt landscapers (PARKED).** `signup.html` lets landscapers tick "Are you tax exempt?", attach a certificate, and enter its number and expiration date (renewed yearly). This was built ahead of the sales-tax decision. **Do not extend it** until a Florida CPA signs off.
- **8 Oct 2026 — Build every page as a working mock.** No real data, clients or users. Each page is fully clickable against pretend data kept in the browser by `store.js`; no server, no real payments, no real email. One page at a time, reviewed by the owner before the next. Pages that need an account send signed-out visitors to `signin.html?next=<page>`.
- **8 Oct 2026 — Sample nurseries are named "Sample Grower 01 (Palms)" and so on**, so none can pass for a real business. Demo accounts (one per account type) are defined at the top of `store.js`.
- **8 Oct 2026 — Touching a listing confirms it.** Any save on `inventory.html` (a new quantity, a new price, a full edit) stamps the listing with today's date, the same as pressing "still accurate". A listing at quantity 0 stays in the grower's inventory but is hidden from the directory.
- **10 Oct 2026 — Contact goes through inquiries.** A buyer is never shown a grower's phone or email, signed in or not; they send an inquiry and the conversation stays on PlantHub. The grower is given the buyer's name, email and phone. The owner expects growers who do get a call to send the buyer back to PlantHub anyway, because selling through it is easier. This replaces "signed-in buyers see contact details".
- **10 Oct 2026 — One shape rule.** Buttons and tags are pills, cards are 16px (`.auth-card`, `.data-card`), boxes you type in are 8px. No em dashes in text a visitor can see.
- **6 Oct 2026 — Browsing is open.** Prices are public. Ordering and contacting a grower need an account. The directory shows no phone or email; it says "Sign in to order or contact this grower".

- **19 Oct 2026 — First simple versions of Transport, Encyclopedia, News and Plant Doc.** Built as skeletons to edit from. Their questionnaire sections (T, E, N, D in `docs/factory/questionnaire.md`) are left untouched for Hernan to review; the fuller versions in `docs/factory/specs/` wait on his answers.
- **19 Oct 2026 — Named orders replace the basket.** A buyer presses "Create order" on `orders.html`, names it, and lands in the directory; "Add to order" adds to that open order (or asks which one). Buyers can keep several. The order page (`basket.html`) shows one named order and checks out one grower at a time, so one named order still becomes one order per grower. There is no separate cart link any more. The word "basket" is gone from visible text (the owner wanted "cart" briefly, then named orders took its place); file and function names still say basket.
- **13 Oct 2026 — Owner's review of checkout.** Four changes, which also bind the pages still to build: the final action on a page goes at the bottom, after what it acts on; money is described as "charged" and "paid"; a pending pickup or delivery can be changed by cancelling it with a confirm; and the account page is a row of page links over one settings card, not a stack of cards.
- **12 Oct 2026 — Factory questionnaire answered.** Every answer is recorded in
  `docs/factory/questionnaire.md` (the permanent record) and turned into the
  specs in `docs/factory/specs/`. Highlights: landscapers and Personal accounts
  can order (not growers or transporters); one basket split into one order per
  grower, $250 minimum per grower; the grower accepts or declines each order;
  a grower's carriers are an approved list plus an off-by-default "also allow
  any carrier I haven't blocked" switch; carriers accept or decline each job;
  no carrier ratings; Encyclopedia, News and Plant Doc are public and use
  invented or draft-labelled content; English only. These settle the mock only.

### Operating model (locked 6 Oct 2026, from the operating-model session)

Source of truth: the "PlantHub Operating Model v1" doc
(https://claude.ai/code/artifact/194b02b7-b0a4-4fab-bba6-fcc84607c251), built from
Hernan's answers in the "PlantHub Road Block" Google Doc. If this file and that doc
disagree, the doc wins; fix this file.


- PlantHub is an **agent on 3% commission, paid by the grower**.
- **ACH only.** No cards, no card fields anywhere.
- Buyer **pays in full at checkout**. No net 30/60, no grower-set terms.
- **$250 minimum order.**
- **PlantHub invoices and holds the funds.** Purchases run through PlantHub, never grower to buyer.
- **Payments provider: Stripe Connect** (recommended in the doc: ACH debit, grower payouts, grower identity checks, 1099s). Buyers verify their bank instantly at checkout.
- **Freshness is the default sort**, and stays the sort inside filtered results. It is the product's whole differentiator.
- Growers list **exact counts**, never "100+" buckets.

### Accounts (locked 6 Oct 2026, Hernan)

- **Everyone who interacts has an account and a profile**: buyers, growers and transport companies. The earlier idea of growers working from a link with no account is **dropped**.
- **Growers self-serve.** They keep their own inventory on their profile (the grower decides who on their side manages it). A grower must **log in to confirm freshness**, even to say "nothing changed".
- **Buyers** must be signed in to order or contact a grower. Their "inquiry" button sends the signed-in buyer's details straight to the grower.
- **Transport companies** are an account type (Seller → Transporter in `signup.html`).
- **Spanish**: the whole site must work in Spanish. For now that means not blocking the browser's built-in translation; a real Spanish version may come later.

### Checkout and delivery (locked 6 Oct 2026)

- After paying, the buyer picks **pickup** or **delivery**. Pickup = a reservation on that grower's profile with a collection date. Delivery = the buyer picks a carrier from the **transport directory**; cost = distance grower → site × the carrier's per-mile rate.
- A **carrier profile** holds: per-mile rate, **per-trip minimum**, what they can haul (plant types, sizes, quantities, from a list), equipment, and insurance with its expiry date. A carrier whose **insurance lapses drops out of the directory automatically**.
- **Plants that arrive dead are the grower's cost**, shown as a disclaimer the grower accepts. Carrier insurance covers accidents in transit.
- Growers and carriers can **block each other**; a blocked pair never appears on an order.

### Build order (from the operating-model doc)

The static prototype ends here; the next steps need accounts and a real database.

1. Sizes on listings and the four filter facets. **Done on `design-b`** (sample data).
2. Grower accounts and self-maintained inventory, with the confirm-freshness action. No money.
3. Buyer accounts and the inquiry button.
4. Checkout: Stripe Connect onboarding for growers, ACH debit, the hold, payout release.
5. Transport directory with carrier accounts.

### Listing and filter model (locked 6 Oct 2026)

Four separate facets, in the trade's own words. **A value never appears in two facets.** Every option shows a count.

1. **Container size** — a pick list, not a number: Liners, Bare Root, 5" Quart, 1G / 6", 3G / 10", 15G / 17", 45G / 28", 100G / 36", 60" Box, 108" Box, Field Grown, Grow Bags.
2. **Specs** — numbers; the buyer enters the minimum: Caliper (in), Height (ft or in), Spread (ft or in), Clear Trunk (ft).
3. **Grade and features** — tick boxes: Florida Fancy, Grade #1, Grade #2, Specimen, Single Leader, Standard, Balled and Burlapped, Staked, Multi, Seedling.
4. **Photos** — yes/no. Listings with photos rank above those without; in the directory that means "among equally fresh listings", so freshness still leads. Each photo is timestamped on upload; label it "added", never "taken".

The lists live in section 3 of `shared.js` (`CONTAINERS`, `SPECS`, `GRADES`). The data format is described at the top of `data/nurseries.js`.
- What each account type can do beyond that is **not decided**. Review it page by page.

## Open questions

Being worked out in the roadblocks review. Replace each with the answer once
it is decided.

- What does each account type (landscaper, personal, grower, transporter) do once signed in?
- Where do garden centers and other trade buyers who aren't landscapers sign up?
- The front-page search only searches wholesale listings. What should a Personal user's search find?
- Do "no ads, no paywall, no paid placement" (directory footer) still hold?
- Should "photos rank above" ever beat freshness? Today photos only break ties between equally fresh listings.

### Do not build yet (undecided)

- **Sales tax treatment.** Needs a Florida CPA. Includes whether installing landscapers can buy tax exempt, and where certificate files would be stored.
- **When funds release** to the grower: when the payment clears, or when delivery is confirmed.
- **Short count / wrong grade credits.**
- **Whether a grower approves carriers** opt-in or opt-out. Settle before signing the first carrier: growers carry dead-plant losses, so opt-out (block-only) is the risky way round.
- **Confirm with Stripe:** how long funds can be held before release, who carries a returned ACH debit, and whether the extra 0.25% routing fee stacks.

### Later ideas (not v1)

- Subscription fees to list, once there are enough sellers.
- Raising the commission, or a dynamic rate that falls as a grower sells more.
