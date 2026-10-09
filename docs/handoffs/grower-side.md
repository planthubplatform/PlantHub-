# Handoff — grower side

> **Mostly superseded — checked 8 October 2026.** This note was written against
> the old card design on `main`. Since then:
> - Hernan answered the questions, and the Hernan doc rewrite is done (see
>   `operating-model.md`).
> - Growers get accounts and self-serve their inventory. The "rejected: accounts"
>   decision below no longer holds; `CLAUDE.md` is the source of truth.
> - `design-b` has prices on every sample row and a table, not cards.
>
> Still live from this note: the grower mock screens (now build-order step 2 on
> `design-b`), the interview order under Decisions, and renaming the sample
> nurseries to unmistakably fake names.

## 1. Lane

Specifying how growers list on PlantHub and keep their availability current — specs,
docs and the grower-facing screens; not the buyer search code.

## 2. Done

Nothing was committed to the site in this session. The buyer side was already finished
when this lane started, at these commits:

- `0c3f2a6` — new wordmark and palette; green reserved for listing freshness
- `6d25831` — stop tracking `__pycache__`
- `f074aaa` — dev server starts on any free port
- `7dee611` — show listing age, more character
- `0d623ca` — Tailwind redesign
- `9318e30` — the original prototype search

What this session produced was analysis, not code:

- Confirmed the grower side is **completely absent**. Grepped `index.html` and `app.js`
  for grower / signup / submit / upload / claim: one hit, the word "contact" inside the
  footer disclaimer. No login, no claim flow, no upload, no confirm button.
- Narrowed the Hernan questionnaire from 13 questions to the 3 that actually block work.
- Confirmed the on-page sample-data disclaimer already exists (`index.html:235`); an
  earlier session had claimed it was README-only, which is wrong.

## 3. In progress

Nothing uncommitted except this file. No branches. `main` was clean at `0c3f2a6` at the
start of the session; unsure whether other sessions have committed since.

Two things were asked for and **not done**:

1. **Rewrite of the Hernan doc.** User wants it retitled away from "questions for Hernan"
   and away from the "we're deciding, we need your input" framing — something like
   "PlantHub Road Block — Business Operating Questions for Review". Body should be plain
   and non-conversational: roughly 3 questions covering taking payments, how we interact
   with sellers, and our pay structure, each with a hint at the kind of answer needed.
   The doc still has its old shape (see Key files).
2. **The grower mock.** Agreed as the next step; not started. User was asked twice and
   has not said go.

## 4. Decisions

- **Grower mock comes before publishing.** Publishing now yields a link to show people,
  not something to evaluate — a grower landing on the site today sees the buyer's search
  over ten invented nurseries and nothing addressed to them.
- **The mock presents options rather than assuming one.** One screen showing, side by
  side: a one-tap "still accurate" confirm, inline edit of a row, "send us your list
  however you keep it", and a price field in all three states (figure / range / call).
  Reason: the screen then doubles as the interview instrument. "Would you update weekly?"
  gets a polite yes that means nothing; "show me which of these you'd do" is observable.
- **Interview order matters.** Ask "how do you keep your availability today, and who
  updates it?" *before* showing the mock. A mock anchors people into critiquing the design
  instead of describing their business.
- **Renaming the sample nurseries gates publishing, not the mock.** Names like "Everglades
  Native Plant Farm" and "Royal Palm Tropicals" are plausible enough that a real business
  could be showing invented inventory under its own name. Footer disclaimer is not enough.
- **Rejected:** building real grower intake, accounts or upload parsing now — all three
  change shape depending on Hernan's answers. The mock is the only grower-side work that
  is upstream of those answers rather than downstream.
- **Rejected:** sending Hernan all 13 questions. One person answers about three well.

## 5. Open questions

Waiting on the user:

- Go-ahead to build the grower mock.
- Whether to rewrite the Hernan doc before or after the mock. My read: after, because two
  of the three questions become things you show rather than ask.

Waiting on Hernan — these three are the ones that block:

1. **What does a grower keep today, and who in the business updates it?** Decides whether
   stage 2 is a web form, a spreadsheet upload, or an inbox where we parse what they send.
2. **Would a grower confirm their list weekly, and on what channel?** If yes, freshness is
   a feature. If "you'll have to call them", freshness costs staff labour per nursery per
   week forever and the business model changes.
3. **Would a grower publish a price, even a range?** If no, PlantHub is a faster Betrock
   rather than the transparency play.

Not blocking — pick a default and revisit: honest counts vs "100+", whether ranking below
a competitor kills a signup conversation, whether growers want their phone number public
or screened, freight as a share of a job.

## 6. Next steps

1. Build `grower.html` (name unconfirmed) as a static mock, no backend: one nursery's
   listing as the buyer sees it, plus the four elements under Decisions. Mark it clearly
   as a mock on the page.
2. Put it in front of Hernan, open question first, then the screen.
3. Rewrite the Hernan doc down to the three questions, in the new framing.
4. Rename the ten sample nurseries to something unmistakably fake.
5. Publish to GitHub Pages — all paths are relative, nothing to build, roughly 15 minutes.
   Remote is `https://github.com/planthubplatform/PlantHub-.git`.

## 7. Gotchas

- **Several sessions share this repo.** Memory says this lane is specs, not site code.
  Run `git log --oneline -5` before editing anything; another session may have moved on.
- **`data/nurseries.js` is deliberately `.js`, not `.json`.** A browser will not load JSON
  off the local disk, so the page would look empty on double-click. Do not "fix" this.
- **There is no price field anywhere in the data.** Plant rows carry common, botanical,
  size, quantity, updated. The nursery carries `minOrder`, which is not a price. Adding
  price touches the data shape, the card, and the grower screen together.
- **The freshness date is currently a claim we type ourselves.** Publishing with real
  nursery names would mean asserting freshness on behalf of businesses that confirmed
  nothing — which is the exact lie the category already tells, with a nicer badge.
- **Do not trust a prior session's factual claims without checking.** One asserted the
  sample-data disclaimer existed only in the README; it is on the page at `index.html:235`.
- Remote Control is already on for this session; `python serve.py` honours `PORT=5174`.
- Unsure: `MEMORY.md` mentions 3% commission, ACH only, Stripe Connect and freshness sort
  with four items open. That came from the index line, not the memory file itself — read
  `memory/planthub-operating-roadblock.md` before relying on any of it.

## 8. Key files

- `index.html` — the page; footer disclaimer at line 235.
- `app.js` — search, filtering, result cards, the age badge logic.
- `data/nurseries.js` — ten invented nurseries; header comments explain the date rules.
- `styles.css` — colours defined once at the top.
- `serve.py` — local dev server; honours `PORT`.
- `docs/plan.md` — the original phased plan; Phase 0 is done, 0.5 (publish) is not.
- Hernan doc — `https://claude.ai/code/artifact/8342c118-1e30-4af5-83e8-8d37c14c507f`
  (a Claude doc; read it with the docs connector, never by fetching the URL).
- Competitor teardown — `https://claude.ai/code/artifact/bf8de371-5547-4756-8e10-ce61921eb701`
  Has the scorecard, what's worth copying from PlantANT, and the revenue reasoning.
