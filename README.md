# PlantHub

PlantHub is a modernized wholesale plant and nursery directory search website and app.
A buyer searches for a plant and sees which nurseries have it.

**Status:** early prototype. First coverage area is South Florida, centered on the
Loxahatchee / Palm Beach County area.

> **Sample data.** The nurseries, availability and contact details in `data/nurseries.js`
> are invented for testing. They do not describe real businesses.

## How to run it

Double-click `index.html`, or open it in any browser. Nothing to install.

If you prefer a local web address (needed later for some features), run this in the
project folder and then visit http://localhost:5173 :

```bash
python -m http.server 5173
```

## What's in here

| File | What it does |
|---|---|
| `index.html` | The page: search box, results area, footer. |
| `styles.css` | How it looks. Colors are set once at the top and reused. |
| `app.js` | The search: filters the data and draws the results. |
| `data/nurseries.js` | The nursery listings. Edit this to add or change listings. |

## What it does today

- Search by common name, botanical name, nursery name, or city.
- Partial words work (`palm` finds Foxtail Palm), and small typos still match
  (`clusa` finds Clusia).
- Matching text is highlighted in the results.
- An empty search shows every nursery.
- Readable on a phone.

## Roadmap

1. **Now:** prototype search over sample listings.
2. **Next:** publish free on GitHub Pages so there's a link to show growers.
3. **In parallel (the hard part):** gather real South Florida nurseries and find out
   how each one publishes availability today (PDF, spreadsheet, phone).
4. **Later:** a real database, nursery logins, availability uploads, and
   location-based search.

The full plan lives in `docs/plan.md`.
