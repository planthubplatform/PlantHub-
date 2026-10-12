# The light factory

How the rest of the site gets built in one long run: one builder, one
independent reviewer, and written rules both follow. Set up 12 October 2026.

Nothing here is site code. The site's rules and decisions stay in `CLAUDE.md`.

## What is in this folder

| File | What it is |
|---|---|
| `questionnaire.md` | The questions Kendrick answers before the run. Every answer becomes a line in a spec. |
| `specs/` | One short spec per page, written from the answers. The builder builds to it; the reviewer checks against it. `_template.md` is the shape. |
| `done-checklist.md` | What every page must pass before it counts as done. |
| `report.md` | Written during the run: what was built, what the reviewer caught, what was parked. Kendrick reads this at the checkpoint and at the end. |
| `screenshots/` | Desktop and phone screenshots of each finished page, named `<page>-desktop.png` and `<page>-phone.png`. |

The reviewer is defined in `.claude/agents/page-reviewer.md`.

## The run is not ready until

1. Every question in `questionnaire.md` has an answer.
2. Each page in the order below has a spec in `specs/`.
3. Kendrick has read the specs and said go.

## Page order

1. `checkout` — add to order, the order page, mock bank payment, pickup or
   delivery, order history for buyer and grower.
2. **Checkpoint. Stop and wait for Kendrick.** Later pages build on order data.
3. `transport` — carrier directory, carrier profile, carrier jobs.
4. `encyclopedia`
5. `news`
6. `plant-doc`
7. `site-wide` — navigation and anything the questionnaire's whole-site answers
   change on pages that already exist. Then retire `soon.html` if nothing
   links to it.

## The loop, for each page

1. **Read** `CLAUDE.md`, the page's spec, and `done-checklist.md`.
2. **Build** the page in the style of the pages that exist. Same header, same
   cards, same buttons, same comment style. New pretend data goes through
   `store.js`; pages never touch browser storage directly.
3. **Self-check** against the done checklist. Click every control. Take the
   desktop and phone screenshots and look at them.
4. **Review.** Start the `page-reviewer` agent with the spec path and the list
   of files changed. It reports problems as blocker, should-fix or note. It
   never edits.
5. **Fix** every blocker and should-fix, then ask for a second review.
   Two rounds at most.
6. **Record** in `report.md`: what was built, what the reviewer found in each
   round, what was fixed, what is still open.
7. **Commit** the page on `design-b` with a plain-language message, update
   `docs/handoffs/site-build.md`, and go to the next page.

## Rules for the whole run

- **Park, don't ask.** A choice the spec doesn't cover: build the sensible
  default, add it to `docs/review-later.md` (what was built, the alternative,
  where it lives), and keep going.
- **One builder.** Only the main session edits files. Helper agents review or
  look things up; they do not write site code.
- **Work only in this folder, on `design-b`.** Never touch `main`.
- **Never push.** Kendrick pushes at the checkpoint and at the end.
- **No new dependencies, no build step, no server.** Plain HTML, CSS and
  JavaScript, as now.
- **Nothing real.** No real businesses, people, prices, bank details or
  payments. Invented names say so: "Sample Carrier 01 (Flatbed)".
- **Do-not-build list in `CLAUDE.md` still holds**: no sales-tax calculation,
  no extension of tax-exempt capture.

## Stop and wait for Kendrick when

- The checkpoint is reached.
- A page still has a blocker after two review rounds.
- Something would need a real service, real money or real personal data.
- A change would touch `main` or the live site.
- A decision would contradict something locked in `CLAUDE.md`.
- An existing page breaks and the cause can't be found.

When stopping, write the reason at the top of `report.md` first.

## The report

`report.md` starts with a three-line summary, then one section per page:

```
## <Page>
Built: what a visitor can now do, in plain language.
Screenshots: screenshots/<page>-desktop.png, screenshots/<page>-phone.png
Review round 1: N blockers, N should-fix. One line each.
Review round 2: ...
Parked: the numbers of the items added to docs/review-later.md.
Not done: anything the spec asked for that isn't there, and why.
```

## Starting the run

In a fresh session opened on the `PlantHub-designB` folder:

```
Read CLAUDE.md, docs/handoffs/site-build.md and docs/factory/README.md, then run the light factory from the first page that has a spec and no entry in docs/factory/report.md. Stop at the checkpoint.
```

After the checkpoint, the same prompt with "Continue past the checkpoint and
run to the end."
