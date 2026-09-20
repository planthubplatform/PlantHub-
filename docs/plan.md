# PlantHub — Plan for the first working version

## Context

PlantHub is a modernized wholesale plant and nursery directory: a buyer searches for a plant and sees which nurseries have it. Today the repo holds only a README, and the owner is learning to code, so this plan optimizes for **learning by building** and for **proving the idea cheaply** before committing to heavier tools.

Decisions made together:
- **Users:** wholesale buyers of both kinds — landscapers/contractors and garden centers/retail nurseries.
- **Core action:** search for a plant, see who has it.
- **Coverage:** South Florida first (Loxahatchee / Palm Beach County).
- **Form:** mobile-friendly website first; a phone app can come later reusing the same data.
- **Approach:** a working prototype first, then the real stack.

**The real risk is data, not code.** Plant-level search only feels good if availability is real and current. The prototype is therefore also a test of whether nursery availability can be collected and kept fresh.

## Phase 0 — The prototype (what I'd build next)

A single-page search site with a small, hand-built data file. No database, no logins, no accounts.

Files to create in `C:\Users\Kekers\Projects\PlantHub`:

| File | Purpose |
|---|---|
| `index.html` | The page itself: a search box and a results area. |
| `styles.css` | How it looks; readable on a phone. |
| `app.js` | The search logic: filter the data, show matching nurseries. |
| `data/nurseries.json` | ~10 real nurseries from the chosen state, each with a handful of plants they grow. |
| `README.md` | Update with the idea, the plan, and how to run it. |

What it does:
1. Type a plant name, e.g. "red maple".
2. See nurseries carrying it, with city, distance-friendly location, container size, quantity available, and contact info.
3. Partial and misspelled matches still work (e.g. "maple" finds "Red Maple"), and searching by botanical or common name both work.
4. Empty search shows all nurseries so the site never looks broken.

Why this shape: it is plain HTML, CSS and JavaScript — the three things every website is made of, and the best possible first lesson. There is nothing to install, nothing to pay for, and the whole thing is small enough to read top to bottom.

**Data note:** the JSON file will use real nurseries and realistic plants, clearly marked as sample availability, so nothing misrepresents a real business.

## Phase 0.5 — Put it online

Publish with **GitHub Pages**, free hosting straight from the repo we already created. This gives a real link to show nurseries and buyers, which makes the next step much easier.

## Parallel track — Solve the data question (owner's homework)

This runs alongside the coding and matters more than any feature:
1. Pick the state or metro area.
2. List 20–30 wholesale nurseries there from state nursery association directories and trade listings.
3. Contact 5–10 and ask two questions: *how do you publish availability today* (PDF, spreadsheet, phone) and *would you send it to a directory that sends you buyers*.
4. Save whatever they send in a `data/` folder. Their real formats decide how the real version is designed.

## Phase 1 — The real version (later, after the prototype proves out)

Only once search feels right and a few nurseries are willing to share availability:
- **Next.js** (a popular website framework built on JavaScript) for the site.
- **Supabase** (a hosted database with logins built in) to store nurseries, plants and availability.
- Nursery accounts, availability uploads from spreadsheets, and location-based search.

These are recommendations to revisit at the time, not decisions to lock in now.

## How we'll verify Phase 0

1. Open `index.html` in a browser; the search box and full nursery list appear.
2. Search "maple" → only nurseries with maples show, with size and quantity.
3. Search "xyzzy" → a friendly "no matches" message, not a blank screen.
4. Clear the search → the full list returns.
5. Narrow the browser to phone width → everything stays readable, nothing runs off the edge.
6. Commit with a short message, and push to GitHub.

## Open question for the owner

**Answered:** South Florida, centered on Loxahatchee.
