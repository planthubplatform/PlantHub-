# PlantHub

PlantHub is a modernized wholesale plant and nursery directory search website and app.
A buyer searches for a plant and sees which nurseries have it.

**Status:** early prototype. First coverage area is South Florida, centered on the
Loxahatchee / Palm Beach County area.

> **Sample data.** The nurseries, availability and contact details in `data/nurseries.js`
> are invented for testing. They do not describe real businesses.

## How to run it

Double-click `index.html` (the front page), or open it in any browser. Nothing to install.

If you prefer a local web address (needed later for some features), run this in the
project folder and then visit the address it prints, normally http://localhost:5173 :

```bash
python serve.py
```

If that port is already busy — usually a copy of the server left running from
earlier — pick another one instead of hunting down the old process:

```bash
PORT=5174 python serve.py
```

## What's in here

| File | What it does |
|---|---|
| `index.html` | The front page: sign in, the wordmark, a search box, and five round links into the site. |
| `directory.html` | The plant directory: filters, the listing table, footer. A front-page search lands here. |
| `signin.html` | Sign in, with a way to create an account below. A preview: nothing is saved or sent yet. |
| `signup.html` | Create an account one question at a time: buyer or seller, then which kind, then details. |
| `soon.html` | The "coming soon" page behind the sections that aren't built yet. |
| `theme.js` | The colors and fonts, shared by every page. |
| `styles.css` | The few styles Tailwind classes can't say cleanly. |
| `app.js` | The search: filters the data and draws the results. |
| `serve.py` | Puts the site on a local web address for testing. |
| `data/nurseries.js` | The nursery listings. Edit this to add or change listings. |

## What it does today

- One row per listing, the way the trade reads it: plant, nursery, container,
  specs, grade, exact quantity on hand, price, and how long ago the nursery
  confirmed it. A camera marks listings with photos. Click a row for the
  $250 minimum order and a "sign in to order or contact" link.
- Filter down the left the four ways the trade describes stock, each option
  with a count: container size (a pick list such as 3G / 10" or Field Grown),
  specs (the minimum caliper, height, spread or clear trunk), grade and
  features (Florida Fancy, Staked, ...), and photos. City too.
  Everything is open to browse without an account, prices included. An
  account is needed to order, to contact a grower, or to list plants
  (`signin.html` and `signup.html` are previews).
- Search by common name, botanical name, nursery name, or city. Partial words
  work (`palm` finds Foxtail Palm), and small typos still match (`clusa` finds
  Clusia). Matching text is highlighted so you can see why a row came back.
- Freshest first by default, and it stays that way however you filter.
  Among equally fresh listings, ones with photos come first. You can also
  sort by most in stock, lowest price, plant or nursery.
- An empty search shows every listing.
- Fills the screen on a desktop and stacks into one column on a phone, where
  the filter panel starts folded shut. The site's width is set once, by
  `.page` at the top of `styles.css`.

## Why it looks the way it does

Every wholesale plant directory in the trade — PlantANT, Betrock — uses a
filter rail on the left and one dense table on the right, because a buyer
sourcing thirty items compares *listings*, not nurseries. Cards are a consumer
pattern. So the shape here matches the trade, and the three columns the others
hide behind a login — quantity, price, and the date the listing was last
confirmed — are the reason to use this one instead.

## Roadmap

1. **Now:** prototype search over sample listings.
2. **Next:** publish free on GitHub Pages so there's a link to show growers.
3. **In parallel (the hard part):** gather real South Florida nurseries and find out
   how each one publishes availability today (PDF, spreadsheet, phone).
4. **Later:** a real database, nursery logins, availability uploads, and
   location-based search.

The full plan lives in `docs/plan.md`.

An alternative design is being tried in a second folder alongside this one.
`docs/two-versions.md` says how that works and how to publish or drop it.
