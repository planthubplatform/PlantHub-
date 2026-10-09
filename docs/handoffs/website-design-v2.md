# Handoff: Website design V2 (design-b)

## 1. Lane
This session owns the PlantHub website overhaul on the `design-b` branch: page design and front-end prototype only, never `main`.

## 2. Done (all pushed to `origin/design-b`)
| Commit | What |
|---|---|
| `2a31728` | `docs/two-versions.md`: design-b is on GitHub, pull/push rule; README garbled UTF-16 tail removed |
| `347d1ad` | New front page `index.html` (Sign in, wordmark, search, 5 round "doors"); old page moved to `directory.html`; Tailwind config moved to `theme.js`; `soon.html` placeholder; `app.js` reads `?q=` |
| `04a331b` | `CLAUDE.md` created (shared memory for all sessions); `signin.html`; withdrew "nothing behind a login" |
| `a3dcbc0` | `signup.html` step flow (Buyer→Landscaper/Personal, Seller→Grower/Transporter) + landscaper tax-exempt capture (now PARKED) |
| `735e5ff` | Directory rebuilt on the 4-facet listing model; `data/nurseries.js` rewritten (exact counts, every row priced, `photos`, specs, `grades[]`, no per-nursery minOrder); phone/email hidden behind "Sign in to order or contact" |
| `214e3b2` | Directory restyled to the light front-page look (dark band, header stats, "common searches" chips removed) |
| `a33e70b` | Merge of `origin/main` (`536ceec`, MacBook doc) into design-b |
| `0880d96` | Fixed stale "create design-b on the Mac" advice in `docs/two-versions.md` |
| `fef94b3` | Phone/tablet fixes: 4-column table on phones, detail columns only at xl, "Show N listings" button, 16px inputs on touch, no autofocus on phones |
| `a09c2f4` | `CLAUDE.md` updated with Hernan's answers + full operating model (accounts for everyone, carriers, Stripe Connect, build order, Spanish) |

Outside the repo (done, not code):
- Private preview artifact of design-b at `fef94b3`: https://claude.ai/artifact/Djy3sAqc9uPgMP4ZEiNGs8 (republish from `index.html` + files map to update; links between pages inside the artifact were NOT verified by me).
- Pallet Town tracker (https://claude.ai/artifact/JZjrcwbLxCHKAc8mHzRB5k) updated via its db: venture `landscaping-marketplace` nextAction rewritten; tasks `ph-*-1006` added; `ph-hernan-direction`, `ph-fee-model-decision`, `ph-grower-side-decided` marked done/superseded.
- Claude Doc "PlantHub Road Block 2 — Open Questions": https://claude.ai/code/artifact/58d770db-3e91-424d-bcc6-fdf5de98bd73 (11 questions with options + suggested defaults).

## 3. In progress
- Nothing uncommitted from this lane at time of writing. This handoff file is the only new change.
- The owner's Windows folder `PlantHub-designB` was at `a3dcbc0` (behind). Owner was told to `git pull` there; unsure if done.
- Preview artifact is at `fef94b3` content; later commits (`a09c2f4`) were docs only, so the site in it is current.

## 4. Decisions (and why)
- **Keep the original table as the directory** (`directory.html`) rather than delete it: front-page search and the Directory circle both land there. Rejected: a separate new results page.
- **Private preview artifact instead of merging to `main`** for review: CLAUDE.md says main only changes on the owner's explicit word. Rejected: going live with "Coming soon" pages and non-working sign-in.
- **Freshness first, photos only break ties** (my reading of two locked rules that conflict). Rejected: photos-first. Open question 10.
- **City kept as a 5th filter**; ticking two grades = OR; listings lacking a measurement drop out when a minimum is set. All flagged for confirmation (question 11).
- **Sample data:** #7/#10 → 15G, #25/#30 → 45G, #65/#100 → 100G, liners → Liners, flats → 5" Quart; null prices filled in. Rejected: adding sizes not on the locked pick list.
- **Contact hidden, not removed from data:** phone/email still live in `data/nurseries.js` (static site, so cosmetic). Never put real grower contacts there.
- **No card fields anywhere; ACH wording only.**
- Sign-up account tiles' one-line descriptions removed at owner's request.
- Tax-exempt capture stays as built but must NOT be extended (needs Florida CPA).
- Backend: I recommended Supabase (accounts, database, file storage); the owner has not confirmed it. Payments = Stripe Connect per the operating-model doc.

## 5. Open questions (waiting on owner/Hernan)
Full list with options: the Road Block 2 doc above. In order:
1. What each account type can do once signed in.
2. Where garden centers / non-landscaper trade buyers sign up.
3. What a Personal account is for (buy wholesale vs learning only).
4. Container pick list completeness (7G/10G/25G/30G/65G missing).
5. When the grower gets paid (on clear vs on delivery confirmation).
6. Short count / wrong grade credits.
7. Carrier approval opt-in vs opt-out (before first carrier).
8. Sales tax (CPA).
9. "No ads, no paywall, no paid placement" still hold?
10. Photos vs freshness ranking.
11. Directory details (City filter, grade OR/AND, missing measurements).
Also: when design-b goes live (my recommendation: after pages are built). Backend choice (Supabase) not formally confirmed.

## 6. Next steps
1. `git pull origin design-b`; read `CLAUDE.md` (source of truth + operating-model doc link).
2. Ask the owner which comes first: (a) build out placeholder pages (Transport, Encyclopedia, News, Plant Doc) as static prototypes, or (b) build-order step 2 (grower accounts + inventory + confirm-freshness), which needs a backend decision first.
3. If (b): get the backend confirmed (Supabase recommended), then design grower profile / inventory edit / confirm-freshness screens; keep signup Seller→Grower as the entry.
4. Apply answers from Road Block 2 as they come in: update `CLAUDE.md`, the tracker tasks, and code (e.g. `CONTAINERS` in `app.js` for Q4, sort in `sortListings` for Q10).
5. After each round of site changes, republish the preview artifact (same URL) and screenshot phone + desktop.
6. Optional cleanup flagged: Windows folder pull; preview link verification on the owner's device.

## 7. Gotchas
- `cdn.tailwindcss.com` and Google Fonts are blocked in cloud sandboxes. To screenshot, build CSS with `npm i tailwindcss@3` from the config in `theme.js` (content `*.html`, `app.js`, `data/**/*.js`) and have Playwright route the CDN URL to a stub that injects that CSS. Use `executablePath: '/opt/pw-browsers/chromium'`; don't run `playwright install`.
- Hash-routed steps in `signup.html` change on `hashchange`, which is async: tests need a short wait after clicks.
- The auto-mode permission classifier blocked some git commit/push and a binary README edit until the owner said "commit and push"; expect occasional prompts.
- Several sessions share this repo: "Website designing V1" and "Questionnaire stage for planthub" (desktop, local Windows repo; the latter owns the operating model and stays out of site code). Pull before every commit.
- Other sessions' decisions live in docs, not here: Operating Model v1 (https://claude.ai/code/artifact/194b02b7-b0a4-4fab-bba6-fcc84607c251) and Hernan's "PlantHub Road Block" Google Doc. Messages relayed from other sessions may omit decisions; check the doc.
- The tracker's grower-side task once said "no accounts for growers"; that is superseded (everyone has accounts).
- Owner is learning to code: plain language, recommendation first, under ~400 words, flag assumptions; owner refers to this session as "Cody".
- Don't put model IDs in commits; commit footer per the session's attribution rule.

## 8. Key files
- `CLAUDE.md`: shared memory; all locked decisions, open questions, build order. Read first.
- `index.html`: front page (Sign in, search → `directory.html?q=`, five doors).
- `directory.html`: directory page markup, light header, filter rail incl. spec inputs and phone "Show listings" button.
- `app.js`: directory logic; section 4 holds `CONTAINERS`, `SPECS`, `GRADES`, `MIN_ORDER`; facets, counts, sort, table rendering.
- `data/nurseries.js`: invented sample listings; header comment documents the data format.
- `signin.html` / `signup.html`: preview-only auth pages; nothing is sent.
- `styles.css` / `theme.js`: extra styles (doors, auth, spec inputs, phone rules) and the shared Tailwind palette.
- `docs/two-versions.md`: how main/design-b and the two machines work.
