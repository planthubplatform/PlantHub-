# Done checklist

A page is done when every line here is true. The builder checks before asking
for review; the reviewer checks again without taking the builder's word.

"Checked" means done just now in the running preview, not remembered.

## It does what the spec says
- [ ] Every "A visitor can" line in the spec works, start to finish.
- [ ] Nothing in the spec's "Not in this page" list was built.
- [ ] Every choice the spec didn't cover is logged in `docs/review-later.md`.

## Everything clickable works
- [ ] Every button, link and form control was clicked or used. None is dead,
      and none leads to `soon.html` unless the spec says so.
- [ ] Every form was sent empty, with bad values, and with good values. Bad
      values get a plain message next to the problem; nothing is lost.
- [ ] Anything that can't be undone asks first.
- [ ] After a change, the page says it worked.
- [ ] Read first, answer last: on a page that ends in a decision, the button
      that settles it is at the bottom, after everything it acts on.
- [ ] A choice that is still pending can be changed, in two steps: cancel it
      (with an "are you sure?"), then choose again.
- [ ] The browser's Back button and a page refresh leave things sensible.

## Accounts
- [ ] Tried signed out, and as each of the four demo accounts. Each sees what
      the spec says, and a clear message where the page isn't for them.
- [ ] Pages that need an account send signed-out visitors to
      `signin.html?next=<page>` and bring them back.

## It fits the rest of the site
- [ ] Same header and account corner as the other inner pages.
- [ ] Changes show wherever else they should. An order appears for the buyer
      and for the grower; a quantity bought comes off the listing.
- [ ] Existing pages still work: front page, directory, grower page, inquiries,
      inventory, account, sign in, sign up.
- [ ] "Reset the preview" wipes everything this page stores.
- [ ] Pretend data goes through `store.js`. The page has no `localStorage` calls.

## It looks right
- [ ] Desktop (1280 wide) and phone (375 wide) screenshots were taken and
      looked at, in light mode. Dark mode looked at on desktop.
- [ ] No sideways scrolling on a phone. Nothing overlaps or is cut off.
- [ ] Green is used only for freshness and the logo dot.
- [ ] Cards, buttons, spacing and type match the existing pages.
- [ ] Empty states are designed, not blank: no orders yet, no results.

## It reads plainly
- [ ] Money: a buyer is "charged" or "not charged", a grower is "paid". Never
      "taken" or "authorized".
- [ ] "Check the box", not "tick". No sentence a visitor has to read twice.

## It is honest
- [ ] Every invented business, person, article and price is visibly sample data.
- [ ] No card fields anywhere. No real bank details are ever typed in.
- [ ] No sales tax is calculated.
- [ ] Anything a real version would do that the mock only pretends (sending
      email, moving money) says so on the page.

## It is clean
- [ ] No errors in the browser console on any page touched.
- [ ] Comments are plain and explain why, like the existing files.
- [ ] `CLAUDE.md`'s file table lists any new file.
- [ ] `docs/handoffs/site-build.md` and `docs/factory/report.md` are updated.
