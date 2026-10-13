# Spec: Plant News

Written from the questionnaire answers on 12 October 2026 (section N, plus W2).
If something isn't here, the builder takes the sensible default and logs it in
`docs/review-later.md`.

## What it is for
A news page for the trade: market prices, pest and disease alerts, and weather
and storm preparation.

## Files
New:
- `news.html` (+ `news.js`): the list, with a topic filter.
- `article.html?id=<article id>`: one article.
- `data/news.js`: the sample articles.

Changed: `styles.css`, `CLAUDE.md` file table.

## A visitor can
- Signed out, anyone can open News and see about 8 articles, newest first, each
  with title, topic, date and a two-line summary.
- Anyone can filter by topic: Market and prices, Pest and disease alerts,
  Weather and storm preparation, or All.
- Anyone can open an article and read it, then go to the next or previous one in
  the same topic.
- Where an article names a plant that has an Encyclopedia entry, the name links
  to it.
- A topic with no articles shows a designed empty state.

## Rules
- N1 (A): every article is invented and carries a visible "Sample article"
  label on the list and on the page. Nothing is copied or paraphrased closely
  from a real publication. No links out to real sources.
- N2 (A, B, C): exactly three topics. Rules and regulations and grower
  spotlights are not built.
- N3 (A): no writing or posting tool, and no staff account.
- Prices, shortages, storm names and pest outbreaks in articles are invented
  and must not name real places' real events. Use generic wording ("a recent
  cold snap"). Dates are spread over the last two months, set relative to
  today's date when the page loads, so the page never looks old.
- W2 (A): no account needed.

## Pretend data
8 articles: 3 market and prices, 3 pest and disease alerts, 2 weather and storm
preparation. Each 120 to 250 words. Authors are "PlantHub sample desk", never a
person's name.

## Where else it shows
- `index.html`'s Plant News circle goes here, not `soon.html`.
- Pest alerts may link to Plant Doc; weather articles may link to the directory.

## Not in this page
- Real news, comments, sharing buttons, email sign-up, an article editor.
- Rules and regulations, grower spotlights.
