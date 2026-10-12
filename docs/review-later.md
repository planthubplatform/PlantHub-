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

4. **Can a Personal account send inquiries and, later, order wholesale?**
   Built: yes, the same as a landscaper.
   Alternative: Personal accounts browse and learn only.
   Where: `ACCOUNT_TYPES` in `store.js`. Also question 3 in Road Block 2.

5. **Should the sample listings look like a normal week?**
   Built: sample dates are fixed, so they age. Only the demo grower's nursery
   can be confirmed from the site; the other nine read as 10+ days old.
   Alternative: shift the sample dates on load so a realistic share look fresh.
   Where: `data/nurseries.js`, `nurseries()` in `store.js`.

6. **Does the directory footer's promise still hold?**
   Built: the footer still says "No ads, no paywall, no paid placement."
   Alternative: soften or remove it if subscriptions or paid placement are
   on the table. Also question 9 in Road Block 2.
   Where: the footer in `directory.html`.

## Decided

Nothing yet.
