# Factory questionnaire

The questions to settle before the long run. Each answer becomes a line in a
page's spec, so the builder never has to stop and ask.

**How to answer.** Every question has options and a suggested default, marked
**(suggested)**. Pick a letter, or say something else in your own words. "Take
the suggestions" for a whole section is a fine answer. Questions are asked in
chat, one section at a time, and the answers are written in here.

**This file is the permanent record.** The original questions and options stay
as written; each answer is added under its question, dated, and marked
"suggestion taken" where the suggested option was chosen. Nothing is deleted.
It is reviewed again for final changes before going live. Later changes go in as
a new dated line under the answer, not over it.

**Not asked, because already locked** (see `CLAUDE.md`): 3% commission paid by
the grower, ACH only, pay in full, $250 minimum, PlantHub holds the funds,
freshness is the default sort, exact counts, accounts for everyone, pickup or
delivery, per-mile carrier rate with a per-trip minimum, lapsed insurance hides
a carrier, dead plants are the grower's cost, no sales-tax calculation yet.

Where a question is one of the 11 "Road Block 2" business questions, it says
so. Answering here settles it for the mock only; the real answer can still
change.

---

## W. Whole site

**W1. How do people move between sections once they leave the front page?**
Today inner pages have the logo, search and the account corner, and no way to
reach Transport or the Encyclopedia without going home first.
- A. **(suggested)** Add one row of section links to every inner page: Directory, Transport, Encyclopedia, News, Plant Doc. The front page stays as it is.
- B. Keep inner pages minimal. The logo takes you home, and home has the five doors.

Answer: A (12 Oct, suggestion taken)

**W2. What can a visitor do without an account?**
- A. **(suggested)** Read everything: directory with prices, Encyclopedia, News, Plant Doc. An account is needed only to order, inquire or save something.
- B. Directory open; Encyclopedia, News and Plant Doc need a free account.

Answer: A (12 Oct, suggestion taken)

**W3. Should the sample listings look like a normal week?**
Sample dates are fixed, so nearly every listing now reads as 10+ days old.
- A. **(suggested)** Shift the sample dates when the page loads, so a realistic share look fresh, some recent, some stale.
- B. Leave them. Only the demo grower's nursery can look fresh.

Answer: A (12 Oct, suggestion taken)

**W4. Spanish.**
- A. **(suggested)** English only, built so the browser's own translation works. No language switch.
- B. Add an English / Español switch in the mock, with the main labels translated.

Answer: A (12 Oct, suggestion taken)

**W5. Garden centers and other trade buyers who aren't landscapers.** (Road Block 2, question 2)
- A. **(suggested)** Keep Landscaper and Personal, and add a "what kind of business?" question inside Landscaper.
- B. Rename Landscaper to "Trade buyer".
- C. Add a third choice, "Retailer".

Answer: A (12 Oct, suggestion taken)

---

## C. Checkout and orders

**C1. Who can place an order?** (Road Block 2, question 3)
Today Personal accounts can inquire like a landscaper, and growers can't.
- A. **(suggested)** Landscapers only. Personal accounts browse and learn; they see "wholesale ordering is for trade accounts".
- B. Landscapers and Personal accounts, same $250 minimum.
- C. Landscapers, Personal accounts and growers, since growers buy from each other.

Answer: B (12 Oct). Landscapers and Personal accounts, same $250 minimum. Growers and transporters can't order.

**C2. How does an order come together?**
- A. **(suggested)** One basket. Add listings from any grower; at checkout it splits into one order per grower, because each grower has their own pickup, delivery and payout.
- B. One grower at a time. Starting an order with a second grower asks you to finish or clear the first.
- C. No basket. "Order" on a listing goes straight to checkout for that one line.

Answer: A (12 Oct, suggestion taken)

**C3. What does the $250 minimum apply to?**
- A. **(suggested)** Each grower's order. A basket with $400 from one grower and $100 from another can only check out the first.
- B. The whole basket.

Answer: A (12 Oct, suggestion taken)

**C4. Does the grower have to accept an order?**
- A. **(suggested)** Yes. The order waits as "awaiting grower"; the grower accepts or declines from their orders page, and the bank payment starts only on accept. Counts come off the listing when the order is placed and go back if declined.
- B. No. Orders are final at checkout, because counts are exact.

Answer: A (12 Oct, suggestion taken)

**C5. How does paying look in the mock?**
No real bank details are ever typed in, whichever is chosen.
- A. **(suggested)** A pretend "connect your bank" step: pick from a list of invented banks, see "Sample Bank ····1234 connected", then confirm. Remembered for next time.
- B. A single "Pay by bank transfer" button, no bank step.

Answer: A (12 Oct, suggestion taken)

**C6. Delivery cost needs a distance. Where does it come from?**
- A. **(suggested)** The buyer picks the job-site city from a list; distance comes from a small built-in table of miles between the sample cities.
- B. The buyer types the miles.

Answer: A (12 Oct, suggestion taken)

**C7. Which carriers can a buyer pick for a delivery?** (Road Block 2, question 7)
- A. **(suggested)** Only carriers on that grower's approved list. Growers tick the carriers they trust on a new settings section; a grower with none offers pickup only.
- B. Any carrier neither side has blocked.
- C. Any carrier, and the grower confirms the choice when accepting the order.

Answer: A and B combined (12 Oct). Each grower has an approved-carrier list (A) plus one switch in the same settings section, "Also allow any carrier I haven't blocked" (B). Switch is OFF by default, so a new grower is approved-list-only. A buyer sees the union: ticked carriers, plus every unblocked carrier if the switch is on. A blocked carrier never appears either way. Grower with nothing ticked and the switch off offers pickup only. This is a mock-level answer to the open opt-in/opt-out question in CLAUDE.md; it does not settle it.

**C8. When is the grower shown as paid?** (Road Block 2, question 5)
- A. **(suggested)** When pickup or delivery is confirmed. The buyer confirms a delivery; the grower confirms a pickup. Until then the payout shows as "held".
- B. When the payment clears, shown as a few days after acceptance.

Answer: A (12 Oct, suggestion taken)

**C9. Problems with an order.** (Road Block 2, question 6)
- A. **(suggested)** A "Report a problem" button for 48 hours after delivery: short count (refunded at the unit price automatically) or wrong grade (the grower accepts or disputes; a dispute shows as "PlantHub is reviewing").
- B. Leave problems out of the mock.

Answer: A (12 Oct, suggestion taken)

**C10. What does the grower see about PlantHub's 3%?**
- A. **(suggested)** On each order: the order total, "PlantHub fee 3%", and the payout. The buyer never sees the fee.
- B. Payout amount only.

Answer: A (12 Oct, suggestion taken)

---

## T. Plant Transport

**T1. What is the Transport page?**
- A. **(suggested)** A public directory of carriers: rate per mile, trip minimum, what they haul, equipment, insurance in date. The same list is what buyers choose from at checkout.
- B. No public page. Carriers appear only inside checkout.

Answer: A (12 Oct, suggestion taken)

**T2. Can anyone contact or book a carrier outside an order?**
- A. **(suggested)** No. Carriers are booked only through a PlantHub order.
- B. Yes, an inquiry button like the one on a grower.

Answer: A (12 Oct, suggestion taken)

**T3. Does a carrier accept each job?**
- A. **(suggested)** Yes. A new delivery shows on the carrier's jobs page as "requested"; they accept or decline. If declined, the buyer is asked to pick another carrier or switch to pickup.
- B. No. Being picked is being booked.

Answer: A (12 Oct, suggestion taken)

**T4. Ratings or reviews of carriers?**
- A. **(suggested)** None for now. Show facts only: completed deliveries count, insurance in date.
- B. Star ratings from buyers after a delivery.

Answer: A (12 Oct, suggestion taken)

---

## E. Plant Encyclopedia

**E1. Which plants?**
- A. **(suggested)** Every plant that appears in the sample listings, so each entry links to "who has it now" and each listing links to its entry.
- B. About 20 hand-picked South Florida favourites.

Answer: A (12 Oct, suggestion taken)

**E2. Pictures.**
There are no photos we have the right to use.
- A. **(suggested)** No photos. A simple drawn placeholder per plant type (palm, tree, shrub, groundcover), with a note that photos come later.
- B. You will supply photos; leave marked gaps for them.

Answer: A (12 Oct, suggestion taken)

**E3. Who is it written for?**
The care notes will be drafted from general knowledge and labelled "draft, not yet reviewed by a horticulturist".
- A. **(suggested)** Beginners first (light, water, size, cold and salt tolerance, common problems), with one short "for the trade" line: usual container sizes and typical use.
- B. Beginners only.

Answer: A (12 Oct, suggestion taken)

---

## N. Plant News

**N1. What is on the News page?**
- A. **(suggested)** About 8 invented sample articles, each clearly labelled as sample. Nothing copied from real publications.
- B. A page of links out to real industry sources (this would be real content, which the mock has avoided so far).

Answer: A (12 Oct, suggestion taken)

**N2. Which topics?** Pick any.
- A. **(suggested)** Market and prices
- B. **(suggested)** Pest and disease alerts
- C. **(suggested)** Weather and storm preparation
- D. Rules and regulations
- E. Grower spotlights

Answer: A, B and C (12 Oct, suggestions taken). Market and prices; pest and disease alerts; weather and storm preparation.

**N3. Should the mock include a way to write an article?**
- A. **(suggested)** No. PlantHub staff would post news; that tool isn't part of this site.
- B. Yes, a simple "post an article" screen behind a pretend staff account.

Answer: A (12 Oct, suggestion taken)

---

## D. Plant Doc

**D1. How does someone say what's wrong?**
The mock has no real AI behind it; answers come from a fixed list.
- A. **(suggested)** Guided questions: what kind of plant, which part looks wrong, what it looks like. Then the likely causes, most likely first.
- B. A box to describe it in words and add a photo, answered with a general checklist.
- C. Both ways in, leading to the same fixed answers.

Answer: A (12 Oct, suggestion taken)

**D2. What comes after the answer?**
- A. **(suggested)** What to do about it, a link to the plant's Encyclopedia page, and "still stuck? ask a grower" linking to the directory.
- B. What to do about it only.

Answer: A (12 Oct, suggestion taken)

**D3. Does it remember past checks?**
- A. **(suggested)** Works signed out. Signed in, each check is saved under "My plant checks".
- B. Never saves.

Answer: A (12 Oct, suggestion taken)
