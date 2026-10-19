# Review later

Questions parked while the site is being built. Each one has a default already
built in, so nothing here blocks the work. Go through the list once every page
exists.

Add to it whenever a page needs a choice Kendrick hasn't made: say what was
built, what the alternative is, and where it lives. Remove an item when it is
decided, and record the decision in `CLAUDE.md`.

The business questions (payouts, sales tax, carrier approval and so on) are
kept separately, in the "Road Block 2" doc linked from
`docs/handoffs/website-design-v2.md`.

## Open

1. **Should growers be able to message other growers?**
   Built: only buyer accounts (landscaper, personal) can send an inquiry. A
   grower or transporter who presses Inquire gets a box explaining that.
   Alternative: let growers inquire too, since growers buy from each other.
   Where: `canBuy` in `store.js`, the "seller" view in `inquiry.js`.

2. **What happens to a listing at quantity 0?**
   Built: it is hidden from buyers and stays in the grower's inventory with a
   note saying so.
   Alternative: keep showing it to buyers, marked "sold out".
   Where: the flatten step in `app.js`, the listings filter in `grower.html`.

3. **Must a new grower give a city before adding listings?**
   Built: yes, because buyers search and filter by city.
   Alternative: let them list first and ask for the city later.
   Where: `drawNurseryLine` in `inventory.html`.

6. **Does the directory footer's promise still hold?**
   Built: the footer still says "No ads, no paywall, no paid placement."
   Alternative: soften or remove it if subscriptions or paid placement are
   on the table. Also question 9 in Road Block 2.
   Where: the footer in `directory.html`.

7. **Is the delivery fee paid separately from the plants?** (checkout)
   Built: the plants are paid when the grower accepts and held. The delivery
   fee is a second pretend bank charge once the buyer picks a carrier, taken
   when the carrier accepts and held until delivery. `CLAUDE.md` says the
   buyer picks delivery after paying, so the fee can't be in the first charge.
   Alternative: choose pickup or delivery before paying, one charge.
   Where: `chooseDelivery` and `settleJob` in `store.js`.

8. **Where does a grower manage approved carriers?** (checkout)
   Built: a "Delivery settings" section at the bottom of `orders.html`.
   Alternative: a section on `inventory.html` or `account.html`.

9. **Should the payout wait until the 48 hours to report a problem are up?**
   (checkout) Two questionnaire answers pull against each other: C8 releases
   the payout when pickup or delivery is confirmed, and C9 lets the buyer
   report a short count for 48 hours after that.
   Built: the payout shows "Released" at confirmation. A short count reported
   afterwards shows as refunded to the buyer and "taken off the grower's
   payout", so the grower's payout figure drops after it was released.
   Alternative: hold the payout until the 48 hours pass with nothing open.
   Where: `describeOrder` and `reportProblem` in `store.js`.

10. **What is PlantHub's 3% taken on after a refund?** (checkout)
    Built: 3% of what the buyer ends up paying for the plants (the order total
    less any short-count refund). Delivery carries no PlantHub fee.
    Alternative: 3% of the original order total, or a fee on delivery too.
    Where: `describeOrder` in `store.js`.

11. **What does the buyer get when a grower accepts a wrong-grade report?**
    (checkout) `CLAUDE.md` lists short count and wrong grade credits as
    undecided, and the questionnaire only said the grower accepts or disputes.
    Built: no amount. The page says "PlantHub will settle the credit". A
    dispute says "PlantHub is reviewing". Neither goes any further.
    Alternative: a price difference the grower enters, or a fixed percentage.
    Where: `answer` in `store.js`, the problems card in `order.html`.

12. **Should a buyer only be offered carriers that can haul what they bought?**
    (checkout) Built: every carrier the grower allows is offered, whatever is
    in the order. A box truck is offered for 18-foot palms.
    Alternative: match the order's plants and sizes to each carrier's haul list.
    Where: `allowedCarriers` and `deliveryOptions` in `store.js`.

13. **What if the grower's city has no mileage?** (checkout)
    Built: a grower who signs up and types a city outside the 18 in
    `data/distances.js` offers pickup only, and both sides are told why.
    Alternative: a real mapping service, which the mock can't have.

14. **Can a buyer cancel after the grower accepts?** (checkout)
    Built: no. A buyer can cancel the order only while it is "awaiting
    grower". After that they can still change how they get the plants (item
    28), but not back out of the order.
    Alternative: allow a cancel with a refund up to some point.
    Where: `cancelOrder` and `arrangingProblem` in `store.js`.

15. **"Basket" or "cart"?** (checkout) Built: "basket", the questionnaire's
    word. Spelling in what a visitor reads is American. Dates still read
    "12 Oct", as on the older pages.

16. **Orders on a phone.** (checkout) Built: the basket stays in the header on
    a phone, but "Orders" and "Inquiries" don't fit and are reached from the
    account page. The whole-site navigation row (last page of the run) is the
    place to fix this.

17. **A delivery asks for a date.** (checkout) The spec asked for a date on a
    pickup only. Built: a delivery asks for one too, since the carrier needs
    it. Either date can be today up to 90 days out.

18. **Transport accounts have no "Orders" link.** (checkout) The spec said
    "Orders for everyone signed in". Built: buyers and growers only, because a
    carrier has no orders. Their jobs page comes with the transport pages.

19. **Preview tools on the order page.** (checkout) Nine of the ten sample
    growers have no account, and the carrier's page isn't built yet, so the
    buyer's order page has a clearly marked "Preview tools" box: stand in for
    the sample grower, stand in for the carrier, and skip the 48 hours. The
    carrier stand-in goes when the transport pages are built. The others
    should stay as long as this is a mock.
    Where: `previewGrower`, `previewCarrierAnswer`, `previewSkipAhead` in
    `store.js`.

20. **The "Sales tax" line on a buyer's order.** (checkout) No tax is
    calculated anywhere. Built: the buyer's money summary carries a line
    "Sales tax: Not worked out in this preview", at checkout and on the order,
    so nobody takes the total for a final figure. It touches the undecided
    sales-tax question only by naming it.
    Alternative: leave the line out until the CPA has answered.
    Where: `basket.html` step 3, `moneyHtml` in `order.html`.

21. **A "Delivery booked" status.** (checkout) The spec listed "Delivery
    requested" and then "Delivered". Built: one more in between, "Delivery
    booked", for when the carrier has accepted and the plants are on the way.

22. **A carrier can't be booked past its insurance.** (checkout) Built: a
    delivery date after the carrier's insurance runs out is refused, and each
    carrier in the list shows "insured until" its date.
    Alternative: check only that the carrier is insured today.
    Where: `chooseDelivery` in `store.js`.

23. **A listing held by a waiting order can't be removed.** (checkout) Built:
    the grower is told to accept or decline the order first. The quantity can
    still be edited.
    Where: `removeListing` in `store.js`.

24. **Closing an account settles its unanswered orders.** (checkout) Built: a
    buyer's waiting orders are cancelled and a grower's are declined, and the
    plants go back. Orders already accepted are left as they are.
    Where: `deleteAccount` in `store.js`.

25. **A problem report asks "are you sure?".** (checkout) Built: both kinds of
    report are checked, then confirmed, because neither can be withdrawn and a
    short count is refunded on the spot.

26. **Pressing Back.** (checkout) A browser can bring a page back exactly as
    it was left, without running it again. Built: pages that belong to one
    account (basket, orders, an order, inventory, inquiries, account) load
    afresh when that happens, so they never show an order or basket as it
    was. The cost: anything typed and not yet saved on those pages is gone
    after Back. The directory and grower page keep what was typed and only
    refresh the header corner, so a stock count there can be a few plants out
    until the page is refreshed. Asking for more than the grower has is still
    refused when adding to an order.
    Alternative: reload every page on Back (the directory loses a typed
    search), or redraw each page in place (more code on every page).
    Where: the `pageshow` listener at the bottom of `store.js`.

27. **A deleted demo account comes back with its old orders.** (checkout)
    The one-click demo buttons re-make a deleted demo account under the same
    id, and deleting an account leaves its accepted and finished orders in
    place (item 24), so those orders show again. "Reset the preview" clears
    them. A real account can't be re-made this way.

28. **Changing a pending pickup or delivery.** (checkout, owner's review 13
    Oct) Built as asked: "Change pickup or delivery" opens an "are you sure?"
    that cancels the pickup or the delivery request, and the buyer chooses
    again from scratch. Each change is written into the order's history.
    Still open: there is no limit on how many times, and once a carrier has
    accepted the delivery it can't be changed at all (the buyer has been
    charged for it by then).
    Alternative: a limit of, say, two changes; or allow cancelling a booked
    delivery with a refund and a notice to the carrier.
    Where: `cancelArrangement` in `store.js`, the "Need to change it?" card in
    `order.html`.

29. **The account page's layout.** (owner's review 13 Oct) Built: the name,
    then one row of links for that kind of account (buyers: Plant directory,
    Basket, Orders, Inquiries; growers: Inventory, Orders to fill, Inquiries,
    Plant directory; transporters: Plant directory only, until their pages
    exist), then one "Account settings" card with a row per subject. Each
    link says where things stand ("1 waiting for you").
    Still open: whether a grower's row should also link to their public page,
    and what a transporter's row holds once the transport pages are built.

30. **The four skeleton pages** (19 Oct). Transport, Encyclopedia, News and
    Plant Doc were built as simple first versions while Hernan reviews their
    questionnaire sections. Left out on purpose, until his answers: a page per
    carrier and a carrier's own profile and jobs; pictures, and links from
    each directory listing to its encyclopedia entry; more than a few sample
    articles; saving Plant Doc checks to an account. All 41 encyclopedia
    entries are written, as drafts for a horticulturist to check. Plant Doc
    covers 11 symptoms.

31. **Sign out on a phone** (19 Oct). The light/dark switch now sits first in
    the top corner. On a phone there was no room for it as well as Sign out,
    so the corner's Sign out is hidden there; it is on the account page (tap
    the round letter), under "Leaving". On a computer nothing changed.
    Alternative: a menu behind the round letter holding Sign out and the
    switch.

## Decided

- **Where the final action sits** (13 Oct, owner): at the bottom of the page,
  after what it acts on. Recorded in `CLAUDE.md` and the done checklist.
- **Words about money** (13 Oct, owner): "charged" and "paid", never "taken"
  or "authorized". "Check the box", not "tick". Recorded in `CLAUDE.md`.

- **Item 4, Personal accounts** (12 Oct, questionnaire C1): Personal accounts can
  inquire and order wholesale, same $250 minimum. Growers and transporters can't.
- **Item 5, sample dates** (12 Oct, questionnaire W3): sample dates shift on
  load so a realistic mix looks fresh. Built in the site-wide page.
