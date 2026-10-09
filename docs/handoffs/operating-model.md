# Handoff: operating model lane

> **Corrections — checked 8 October 2026.**
> - The unsent V2 prompt (section 3, next step 1) is no longer needed: the V2
>   session wrote the operating model into `CLAUDE.md` in `a09c2f4`.
> - `design-b` is now at `4350a08` or later, not `a3dcbc0`.
> - `CLAUDE.md` and `docs/two-versions.md` are on both branches.
> - The four open questions here are questions 5–8 of the 11 in the "Road
>   Block 2" doc linked from `website-design-v2.md`; use that list.

Written 8 October 2026 by the "Questionnaire stage for planthub" session.

## 1. Lane

This session owns PlantHub's business operating model and the written specs that
come out of it. It does not touch site code.

## 2. Done

No repository commits except this file. The output of this lane is documents:

- **PlantHub Operating Model v1** — the source of truth.
  Claude doc: https://claude.ai/code/artifact/194b02b7-b0a4-4fab-bba6-fcc84607c251
  Google Doc copy: https://docs.google.com/document/d/1KpMY8cMeA-fX--aluXfuX3V3mHysGwcr0o5xh-xq_GY/edit
- **PlantHub Road Block — Business Operating Questions for Review** — the questions
  sent out for review; now answered, kept for the record.
  Claude doc: https://claude.ai/code/artifact/8342c118-1e30-4af5-83e8-8d37c14c507f
  Google Doc copy: https://docs.google.com/document/d/13CcxENSz5yMldy4vquZr8dVTuwsdnV4YT6s-JIVUxAE/edit

Both Google Docs live in Drive under **Business › Planthub**. Two superseded
versions of the questions doc were trashed on 3 Oct at Kendrick's instruction;
they are recoverable from Drive's trash for 30 days.

Git housekeeping done this session (no commits of mine involved):
- The `PlantHub-designB` worktree was 5 commits behind; Kendrick fast-forwarded it
  to `origin/design-b` (a3dcbc0).
- `design-b` had no upstream. Kendrick ran `git branch -u origin/design-b`; it now
  tracks correctly.

## 3. In progress

Nothing half-done in this lane. The repo as I last saw it:

- `main` @ 536ceec, clean, synced with origin. The published site.
- `design-b` @ a3dcbc0, clean, synced, checked out in the separate worktree
  `C:\Users\Kekers\Projects\PlantHub-designB`. About 1,100 lines ahead of main.
- A prompt for the Website design V2 session is drafted but **not sent** — it is in
  the conversation, not in a file. It carries the locked decisions, the listing and
  filter spec, and an explicit "do not build yet" list. Rewrite it from the
  Operating Model doc rather than hunting for it.

## 4. Decisions

- **3% commission, grower pays.** Buyer pays the listed price. Rejected 1%: it
  cannot cover payment processing. Rejected matching brokers at 10–15%: no reason
  to, 3% is the pitch. Revisit upward only with volume.
- **ACH only, no cards.** Cards at ~2.9% + 30c would exceed the whole commission.
- **Buyer pays in full at checkout.** Rejected grower-set net 30/60 terms: they
  contradict "the money is good" and would make PlantHub finance the gap.
- **Stripe Connect**, "you handle pricing" model. Chosen over Dwolla (no published
  pricing, no cards, mid-acquisition by NMI) and Finix (cheaper payouts, worth a
  quote later at volume). The deciding factor is not price: routing funds through
  a provider's regulated rails avoids state money-transmitter licensing.
- **$250 minimum order**, because small orders stop paying for themselves.
- **Growers self-serve listings**, login required to refresh even to say nothing
  changed. **Freshness is the default sort** — that is both the incentive and the
  differentiator.
- **Listing facets follow the trade's own vocabulary**, taken from a competitor's
  filter UI Kendrick screenshotted: container size as a pick list of paired labels
  ("3G / 10\""), specs as separate numeric fields, grade as checkboxes, photos as a
  filter. This replaced an earlier three-field size model of mine, which was more
  granular than the trade needs.
- **Carriers are a third account type**: per-mile rate, per-trip minimum, what they
  can haul, equipment, insurance that auto-drops on lapse. Rejected load-based
  freight pricing: capability filtering plus the carrier's own rate achieves it.
- **Dead plants are the grower's cost**, as is the choice of carrier, with a
  disclaimer. Growers and carriers can block each other.

## 5. Open questions

Four, all waiting on Kendrick, all recorded in the Operating Model doc:

1. **When funds release** — on the debit clearing, or on delivery confirmed.
2. **Short count and wrong grade** — who judges, how a partial credit is issued.
3. **Sales tax** — "plus tax" is probably wrong for wholesale. Needs a Florida CPA
   before the first invoice, not a guess.
4. **Carrier approval, opt-in or opt-out** — the buyer picks the carrier but the
   grower carries the loss. Blocking only makes that opt-out, which is backwards
   for the party holding the risk. Decide before signing a carrier.

Also unresolved and worth watching: Kendrick states growers have no problem
logging in to keep listings fresh. He has said so twice, so treat it as decided,
but I am unsure it has been tested on a real grower. The whole model rests on it.

## 6. Next steps

1. Send the V2 prompt (section 3) to the Website design V2 session. It is a cloud
   session: it receives messages but cannot reply here.
2. Decide Website designing V1's lane. Two sessions sharing `design-b` is the main
   way work gets clobbered.
3. Get answers to the four open questions; fold them into the Operating Model doc.
4. The container-size filter belongs to a website session, not this lane.

## 7. Gotchas

- **Four or five Claude sessions share this repo.** Do not edit site files from
  this lane. Run `ListAgents` before assuming which are live.
- **There is no branch called "designb".** One branch, `design-b`, and two folders.
  `PlantHub-designB` is its worktree, not a stale copy. Retire it with
  `git worktree remove`, never by deleting the folder.
- The Windows folder created its own local `design-b` before the branch existed on
  GitHub. That is why it drifted. Now reconciled.
- **V2 already shipped tax-exempt certificate capture** (a3dcbc0) while the sales
  tax question is still open. A decision got made in code ahead of being made.
- Drive files are owned by santiago.kendrick@gmail.com; the session account is
  ksanti4326@gmail.com. Same person, different Google account.
- Exporting a Claude doc turns an @-mention into a raw principal id. Fix it in the
  Google Doc with `replaceAllText` after creating the file.
- This session runs on the Windows desktop with the real repo; Kendrick drives it
  from a Mac over Remote Control.

## 8. Key files

- `README.md` — what the project is and how to run it.
- `docs/plan.md` — the original phased plan. Phase 0 is done; the operating model
  is Phase 1 and supersedes parts of it.
- `docs/two-versions.md` — **on `design-b`, not main.** How the two design versions
  and the `v1-trade-table` tag are kept side by side. Read before touching branches.
- `data/nurseries.js` — 10 invented sample nurseries. Not real businesses.
- `index.html`, `app.js`, `styles.css` — the current prototype on main.
- `CLAUDE.md` — **on `design-b` only.** Added by the V2 session.
