# Spec: Whole site

Written from the questionnaire answers on 12 October 2026 (section W). This is
the last page in the run: navigation, sample dates, sign-up wording, and a
final pass over every page. If something isn't here, the builder takes the
sensible default and logs it in `docs/review-later.md`.

## What it is for
Make the finished pages feel like one site: reachable from each other, with
believable sample data and the right sign-up wording.

## Files
Changed: every inner page's header (`directory.html`, `grower.html`,
`inquiries.html`, `inventory.html`, `account.html`, `signin.html`,
`signup.html`, and every page added by the factory), `store.js` (sample dates,
business kind), `signup.html`, `account.html`, `styles.css`, `CLAUDE.md`
(file table, decisions, shape of the header row). `index.html` stays as it is.
Removed only if nothing links to it: `soon.html`.

## A visitor can
- On any inner page, see one row of links: Directory, Transport, Encyclopedia,
  News, Plant Doc, with the current section marked. Every link opens a built
  page.
- On a phone, use the same row without sideways scrolling.
- Signed out, read the directory (with prices), Encyclopedia, News, Plant Doc and
  Transport. Only ordering, inquiring and saving need an account.
- Open the directory and see a realistic mix of fresh, recent and stale
  listings, with the freshest first.
- Sign up as a Landscaper and be asked "What kind of business?" (landscape
  contractor, garden center, other trade buyer), see it on the account page.
- Use the browser's own translate tool on any page without parts being blocked.

## Rules
- W1 (A): the section row on inner pages only; the front page keeps its five
  circles.
- W2 (A): no page except account, inventory, orders, inquiries, basket, jobs and
  my-carrier requires sign-in, and none of the public ones redirects.
- W3 (A): sample listing dates are set relative to the day the page loads, in
  `store.js`'s `nurseries()`. Each listing gets a fixed, repeatable age: about
  40% within 6 days, 35% 7 to 29 days, 25% 30 days or more. Demo grower's
  nursery gets a mix too, so "still accurate" has something to do. A grower's
  own confirmation or edit (an overlay date) always wins over the shifted one.
  Sort order is still freshness first.
- W4 (A): English only, no language switch. Every page has `<html lang="en">`,
  no `translate="no"` on body text, no text drawn inside images.
- W5 (A): Landscaper sign-up gains the question "What kind of business?".
  Stored on the account as `businessKind`. It changes nothing else in the mock.
- No em dashes in visitor-visible text, pill buttons, 16px cards, 8px inputs
  (`CLAUDE.md`).

## Pretend data
Nothing new, except the age rules above applied to the existing sample
listings. Sample data stays labelled.

## Where else it shows
All of the above. After the change the builder runs through every page, signed
out and as each demo account, and every nav link and circle.

## Not in this page
- A Spanish switch, a mega-menu, search changes, redesign of any page.
- Anything about money, orders or carriers beyond making sure their links are
  in the row.
