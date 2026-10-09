# Handoff — site design lane

> **Corrections — checked 8 October 2026.**
> - `design-b` was built by the Website design V2 session; see
>   `website-design-v2.md`. It is the active line of site work.
> - The login question under Open questions was settled on 6 October: browsing
>   and prices stay public, ordering and contacting a grower need an account
>   (`CLAUDE.md`). The live footer's no-login line needs rewording when
>   `design-b` goes live.
> - `main` is pushed and the `PlantHub-designB` folder is up to date, so next
>   steps 1 and 2 are done.

Written 8 October 2026.

## 1. Lane

The public site's look and front-end behaviour: `index.html`, `app.js`,
`styles.css` and the shape of the sample data — not business specs, which
another session owns.

## 2. Done

All pushed to `origin/main` and live at
https://planthubplatform.github.io/PlantHub-/

| Commit | What |
|---|---|
| `5402222` | Page uses the full screen on desktop. One `.page` class in styles.css sets the site width (1600px cap, padding that grows with the screen), replacing `max-w-4xl` in four places. |
| `6f8cde1` | The big one. Results went from nursery cards to a dense trade listing table plus a filter rail. Added `grade` and `price` to all 50 sample rows. New headline. Working header instead of a hero. |
| `572de38` | Filter scrollbar no longer covers the facet counts. |
| `2bdc204` | `docs/two-versions.md` — the two-folder setup. |
| `536ceec` | Added the MacBook / second-machine section to that doc. |

Tag `v1-trade-table` points at `572de38` and is pushed. It never moves —
`git checkout v1-trade-table` always restores the design that went live on
4 October.

Each deploy was verified by fetching the live files directly (page, app.js,
styles.css, data, favicon) rather than trusting the push. Pages takes 40–80s.

## 3. In progress

**Nothing of this lane's is uncommitted,** so there is no `wip-` branch. All
the work above is committed. Note that `61816f0` and three other sessions'
handoff notes are committed but **not yet pushed** to `origin/main`.

**`design-b` now holds real work, and it is not this lane's.** Corrected
8 October after checking: earlier in this session the branch was empty and
unpublished, and an earlier version of this note said it could be discarded.
That is now **wrong and destructive** — do not delete it.

- `origin/design-b` is at `4350a08`, **8 commits ahead** of the local worktree
  copy at `a3dcbc0`. The local copy has nothing unique; it just needs
  `git pull`.
- What is on it: a front page, `signin.html`, `signup.html`, `directory.html`,
  `soon.html`, `theme.js`, a `CLAUDE.md`, and a rewritten `index.html` —
  roughly 1,100 lines added.
- Unsure who built it. Treat it as another lane's and ask before touching.

## 4. Decisions

**Cards → dense table.** Driven by looking at the real competitors. PlantANT
(613k listings) and Betrock both use a left filter rail plus one row-per-listing
table. Cards are a consumer pattern, and they were also functionally wrong: a
buyer sourcing thirty items compares listings across nurseries, which a card
per nursery cannot express. Rejected a visual-only pass — the user was offered
it and chose the full restructure.

**Show what the others hide.** PlantANT gates price behind "Account Req'd" on
every row; nobody shows quantity or listing age. Those three columns are the
reason to use this site. Keep them visible.

**Green means fresh, nothing else.** Pre-existing rule from an earlier session,
deliberately preserved. Green appears only on freshness dots, the "updated this
week" total, and the logo dot.

**Headline:** "Wholesale plant availability — Palm Beach County". Chosen over
two wordier options. Deliberately did **not** put live counts in it the way
PlantANT does — "10 nurseries · 50 listings" against their 613,149 is a
comparison we lose.

**Price in sample data:** about one row in six shows "Call" instead of a
number, because plenty of growers genuinely won't publish a price. More honest
than inventing 50 of them.

**Fraunces serif is now the wordmark only.** Using it for headings read as a
garden-centre brochure rather than a trade tool.

**Two versions via worktree (two folders), not branch switching.** The user
wanted to compare side by side. Also rejected: publishing the experiment to a
`/v2/` subfolder or a second repo — local-only was enough.

**No Google Drive copy.** The user asked, then confirmed GitHub access from the
remote machine was sufficient.

## 5. Open questions

- **`design-b` withdraws the no-login promise** (commit `04a331b`) and adds
  sign-in and sign-up pages. The live site's footer still reads "nothing is
  hidden behind a login", and the competitive position recorded for this
  project is open, transparent search *against* the gated directories. Those
  two cannot both ship. This lane did not make that call and has not acted on
  it — whoever owns it should reconcile them.
- Real nursery data is blocked on another lane; everything here is invented.

## 6. Next steps

1. Push `main` — four handoff commits are sitting unpushed.
2. In the `PlantHub-designB` folder, `git pull` to pick up the 8 commits it is
   behind before doing anything there.
3. Settle the login question in Open questions before either branch moves
   further; it changes what the site is.
4. When real listings arrive, check the facets still hold up — grade and
   container values are currently drawn from a small invented set.

## 7. Gotchas

- **The repo name ends in a hyphen:** `PlantHub-`. Easy to drop.
- **`core.autocrlf` is true.** Files look byte-different between the two
  worktrees and `git status` still says clean. Not a problem; don't "fix" it.
- **Tailwind is a CDN `<script>`, no build step.** The console always warns
  about CDN-in-production. That warning is expected, not a bug.
- **Facet counts deliberately ignore their own facet's ticks** — ticking `#7`
  must not zero every other size's count. Preserve that if you touch
  `passesFilters` / `renderFacet`.
- **`serve.py` is `python` on Windows but `python3` on a Mac.** It auto-picks a
  free port, so two copies can run at once; the port is not always 5173.
- **The browser pane refused to load the public URL** at one point having
  allowed it earlier. Verify deploys with `curl` rather than fighting it.
- Dark-mode secondary text was at 3.8:1 before being fixed to 7.28:1. If you
  add muted text, check it against the near-black table background.
- **Another session owns business specs** (commission, payments). Don't edit
  those docs from this lane.

## 8. Key files

- `index.html` — page structure: working header, search bar, filter rail,
  results container. Tailwind colour tokens are defined inline in `<head>`.
- `app.js` — flattens the nested nursery data into one flat `LISTINGS` array,
  then searches, facets, sorts and draws the table. Sections are numbered.
- `styles.css` — only what Tailwind can't say: `.page` width, chips, filter
  tags, table rows, the facet scrollbar fix.
- `data/nurseries.js` — 50 invented listings. Header comment documents every
  field. `price: null` renders as "Call".
- `docs/two-versions.md` — the two-folder / two-machine workflow.
- `docs/plan.md` — the original phased plan. Phase 0 is done; the data-gathering
  track is the real blocker.
