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

7. **Is the delivery fee paid separately from the plants?** (parked 12 Oct, from
   the checkout spec)
   Built (in the spec): the plants are paid at checkout and held; the delivery
   fee is a second pretend bank charge once the buyer picks a carrier, held
   until delivery. `CLAUDE.md` says the buyer picks delivery after paying, so
   the fee can't be in the first charge.
   Alternative: choose pickup or delivery before paying, one charge.

8. **Where does a grower manage approved carriers?** (parked 12 Oct)
   Built (in the spec): a "Delivery settings" section on `orders.html`.
   Alternative: a section on `inventory.html` or `account.html`.

## Decided

- **Item 4, Personal accounts** (12 Oct, questionnaire C1): Personal accounts can
  inquire and order wholesale, same $250 minimum. Growers and transporters can't.
- **Item 5, sample dates** (12 Oct, questionnaire W3): sample dates shift on
  load so a realistic mix looks fresh. Built in the site-wide page.
