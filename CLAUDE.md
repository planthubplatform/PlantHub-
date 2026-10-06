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

## Branches

| Branch | What it is |
|---|---|
| `main` | The published site. Tag `v1-trade-table` marks the 4 Oct 2026 version. |
| `design-b` | The overhaul. Not live. **Never merge into `main` unless the owner says so.** |

More in `docs/two-versions.md`.

## Who is working on what

| Session | Branch | Job |
|---|---|---|
| Website design V2 | `design-b` | The site overhaul, page by page. |
| Roadblocks review | — | Works out the open questions below. Writes answers here. |

Add your session to this table when you start long-running work.

## The owner

Learning to code. Explain new ideas in plain language. Lead with the
recommendation. Keep code comments plain and explanatory, like the ones
already in the files.

## How the site is built

Plain HTML, CSS and JavaScript. No install, no build step.

| File | What it is |
|---|---|
| `index.html` | Front page: Sign in, the PlantHub wordmark, search, five round section links. |
| `directory.html` + `app.js` + `data/nurseries.js` | The plant directory: the trade listing table that used to be the whole site. Light header like the front page (logo home, search, Sign in). Both the front-page search and the "Plant Directory" circle land here; it reads `?q=`. |
| `signin.html` | Sign in, with a "Create an account" button below. Preview only: nothing is saved or sent. |
| `signup.html` | Create an account, one question per screen (steps after `#`). Preview only. |
| `soon.html` | "Coming soon" page for sections not built yet (`soon.html#news` etc). |
| `theme.js` | Colours and fonts for every page (the Tailwind config). |
| `styles.css` | Styles Tailwind classes can't say cleanly. |

Rules that are easy to break:
- **Green means fresh.** Green is only for how recently a listing was confirmed (and the logo dot). Hover and selected states use clay.
- **Sample data stays labelled.** `data/nurseries.js` is invented. Never present it as real businesses.
- Tailwind comes from `cdn.tailwindcss.com`. Cloud sandboxes block that address, so screenshots there need a locally built copy of the CSS.

## Decisions made

- **6 Oct 2026 — Front page:** Sign in top right, PlantHub in the middle, search below, then five round links: Plant Directory, Plant Transport, Plant Encyclopedia (beginner friendly), Plant News, Plant Doc ("my plant is sick, help").
- **6 Oct 2026 — Accounts are coming.** Sign in opens a log-in page with "Create an account" below.
- **6 Oct 2026 — Sign-up flow.** "Who are you?" → **Buyer** or **Seller**. Then "Ok, but who?" → Buyer: **Landscaper** or **Personal**; Seller: **Grower** or **Transporter**. Then name, email, password. No one-line descriptions under the choices.
- **6 Oct 2026 — Tax exempt landscapers (PARKED).** `signup.html` lets landscapers tick "Are you tax exempt?", attach a certificate, and enter its number and expiration date (renewed yearly). This was built ahead of the sales-tax decision. **Do not extend it** until a Florida CPA signs off.
- **6 Oct 2026 — Browsing is open.** Prices are public. Ordering and contacting a grower need an account. The directory shows no phone or email; it says "Sign in to order or contact this grower".

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

The lists live at the top of section 4 in `app.js` (`CONTAINERS`, `SPECS`, `GRADES`). The data format is described at the top of `data/nurseries.js`.
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
