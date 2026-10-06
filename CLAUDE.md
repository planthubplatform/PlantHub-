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
| `directory.html` + `app.js` + `data/nurseries.js` | The plant directory (the trade listing table). Reads `?q=` from the front-page search. |
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
- **6 Oct 2026 — Tax exempt landscapers.** Landscapers can tick "Are you tax exempt?", attach a tax exempt form or resale certificate, and type in the certificate number. PlantHub asks for a new certificate **every year**, so it records the expiration date too.
- **6 Oct 2026 — No account needed to look.** Without an account, people can see everything (including price and quantity). They can't place orders or list plants.
- What each account type can do beyond that is **not decided**. Review it page by page.

## Open questions

Being worked out in the roadblocks review. Replace each with the answer once
it is decided.

- What does each account type (landscaper, personal, grower, transporter) do once signed in?
- Where do garden centers and other trade buyers who aren't landscapers sign up?
- Can landscapers who install plants buy tax exempt at all? In Florida a contractor who installs plants into a customer's property may owe the tax themselves. Check with an accountant before relying on it.
- Where certificate files are stored, and who can see them (they hold business tax details).
- The front-page search only searches wholesale listings. What should a Personal user's search find?
- Commission rate and payment method.
- Pay at checkout, or net terms (pay later)?
- Who maintains grower profiles?
- How freight is priced, and who is liable for plants that arrive dead.
- When payment is released to the grower.
- Do "no ads, no paywall, no paid placement" (directory footer) still hold?
