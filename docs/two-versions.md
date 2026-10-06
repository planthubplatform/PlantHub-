# Working on two versions at once

Set up 5 October 2026, so the trade-table design could be kept while trying
something different alongside it.

## What exists

| Where | Branch | What it is |
|---|---|---|
| `C:\Users\Kekers\Projects\PlantHub` | `main` | The published site. This is what the live link shows. |
| `C:\Users\Kekers\Projects\PlantHub-designB` | `design-b` | The experiment. Local only — not published. |

Both folders are the same project. Git keeps them in step; they just have
different versions open at the same time.

There is also a **tag** called `v1-trade-table` on the design that went live on
4 October. A tag is a permanent bookmark — it never moves, whatever else
happens. `git checkout v1-trade-table` always brings that exact version back.

## Day to day

Work in whichever folder you want. They don't interfere with each other, and
neither one changes under you while you're in the other.

Run either version the usual way, from inside its own folder:

```bash
python serve.py
```

It picks a free port automatically, so you can have both running at once and
compare them in two browser tabs.

Commit in whichever folder you're in — the commit lands on that folder's
branch. Nothing from `design-b` can reach the live site by accident.

## Publishing

Only `main` is published. To put the experiment live, it has to be merged into
`main` first:

```bash
git checkout main
git merge design-b
git push
```

Do that only once you've decided. Until then the live link keeps showing the
trade-table design, no matter what happens in the other folder.

## Working from the MacBook (or any second machine)

The Windows PC is where this was set up, but nothing ties the work to it.

**First time only.** Install GitHub Desktop from https://desktop.github.com and
sign in — that also sorts out the permission to push. Then File → Clone
Repository → `planthubplatform/PlantHub-` → Clone. It lands in
`~/Documents/GitHub/PlantHub-`.

**Check whether `design-b` is on GitHub.** Open the Current Branch dropdown. If
`design-b` is listed, pick it and you are ready. If it isn't — it was created
on the Windows PC and never published — make it here instead: New Branch, name
it `design-b`, base it on `main`, then press Publish branch. It holds nothing
unique, so nothing is lost by creating it on this machine.

**Run the site to see your changes.** In Terminal:

    cd ~/Documents/GitHub/PlantHub-
    python3 serve.py

Then open the address it prints. On a Mac the command is `python3`, not
`python`.

**Save your work.** In GitHub Desktop: write a summary, Commit, then Push
origin. Pushing is what makes the work visible on the other machine.

**Before starting on the other machine again**, pull first, or the two copies
drift apart:

    git pull

### Editing without installing anything

On the repo page on github.com, press `.` — a full editor opens in the
browser, and the branch picker is at the bottom left. Fine for text and small
fixes. It cannot show you the rendered page, so it is poor for design work.

### A warning about having both machines going

If `design-b` was created separately on two machines, the two will not match,
and pushing from the second one will be refused. The fix is to keep whichever
copy has real work on it and recreate the other from `main`. Avoid the problem
by only committing to `design-b` from one machine until it is published.

## If you decide against it

Delete the branch and the folder:

```bash
git worktree remove ../PlantHub-designB
git branch -D design-b
```

Nothing on the live site changes.

## If you want a third version later

```bash
git worktree add -b design-c ../PlantHub-designC main
```

That makes another folder from the current published design, same as before.

## Useful checks

```bash
git worktree list
```

Shows every folder and which branch each one has open — handy when you've
forgotten which is which.

```bash
git branch -vv
```

Lists the branches. The `*` marks the one the folder you're in is using.
