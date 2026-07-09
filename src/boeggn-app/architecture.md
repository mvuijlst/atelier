---
title: "The Architecture: A Git Client with Forms"
heading: "The architecture"
navLabel: "The architecture"
section: 2
status: draft
---

# The architecture

## A Git Client with Forms

Every great architecture can be summarized in one sentence, and this one has
already been said: the app is a git client with forms. Let's unpack what
that actually means — because the elegance is in the details.

The insight at the core of the design is that the booklog already *had* a
content API. It just didn't look like one. The site's git repository *is*
the site's data — one Markdown file per book — and `git push` *is* the
publish button: the site's existing GitHub Actions pipeline builds the Hugo
site and rsyncs it to the server on every push. The app doesn't need to
replace any of that. It needs to *participate* in it.

So the app keeps a working clone of the site's repository on the VPS, right
next to itself. For reads, it parses front matter directly from the clone's
content files. For writes, every single submit — whether it's a one-line
progress update or a fully new book — runs the exact same sequence:

1. **`git pull --rebase`** — freshness first, which also picks up anything
   pushed from the laptop;
2. **edit the Markdown** — the post file, plus any author, series or tag
   term pages, plus a cover file when there is one;
3. **validate** with `check_books.py` — the site repository's *own* linter,
   run straight from the clone, so the rules can never drift from the site's;
4. **commit** — author "Boeggn beheer", with low-key Dutch commit messages
   matching the existing history, like `Voortgang Reaper's Gale (20u 45m te
   gaan)`;
5. **push** — and the site's pipeline takes it from there.

Nothing is committed if the linter objects. Nothing drifts, because there is
nothing to drift: no second copy of the content exists anywhere.

> **[Figure 3]** *System architecture.* Generate a wide (16:9) architecture
> diagram in clean flat design: rounded rectangles, dark slate background,
> teal (#0F8B8D) boxes, thin amber arrows, white sans-serif labels. Left: a
> phone icon labelled "phone (PWA)" with an HTTPS arrow to a large container
> labelled "boeggn — Django 5 + HTMX (VPS)". Inside the container, three
> small boxes: "working clone of the site repo", "check_books.py (the
> site's own linter)", "SQLite — auth & sessions only". From the container,
> one arrow labelled "git push" to a box "GitHub", which flows on to a box
> "Actions: Hugo build + rsync" and finally to a box "boeken.tsuk.org
> (static)". A separate small box "OpenAI API" connected to the container
> with a dashed line labelled "add-flow only". Use exactly these labels.
> Suggested caption: "The app doesn't replace the pipeline. It joins it."

## The Stack: Boring by Design

The technology choices follow directly from the philosophy, and each one is
worth a brief spotlight:

- **Django 5** — because login, sessions and CSRF protection come for free,
  and a single-user app deserves exactly zero hand-rolled auth code.
- **HTMX** — because three screens of forms is precisely the job HTMX was
  born for. No build step. No bundle. No framework fatigue.
- **Plain mobile-first CSS** — the app lives on a phone's home screen, so
  the phone is not an afterthought; it is the design target.
- **SQLite** — for auth and sessions *only*. It's worth repeating, because
  it is the load-bearing decision of the whole design: **content never
  lives in a database.** The site stays fully rebuildable from git alone.

It's important to note what was considered and rejected, because good
architecture is as much about the roads not taken. Using GitHub's Contents
API instead of a clone? Possible — but multi-file commits (a post plus
author pages plus a series page plus a cover) become awkward, and you lose
the ability to run the linter before committing. A React SPA? Heavier than
the job, and harder for one person to maintain. Making the site itself
dynamic? Explicitly out of scope — that was the one line nobody was allowed
to cross.

## Two Writers, One Repository

There is one genuinely subtle problem in this design, and it deserves an
honest treatment: the app is not the only writer. The laptop's working copy
— where content skills also edit books — pushes to the same `main` branch.
Two write locations, one source of truth.

The solution is layered, and beautifully boring. Every write pulls first,
so both sides stay current. A file lock serializes the app's own writers
(the production server runs multiple gunicorn workers — without a lock, two
simultaneous submits could interleave their git operations). And if a
rebase ever fails, the app aborts cleanly and surfaces the situation as
"pull the laptop changes first" — a message, not a mess. Conflicts are
unlikely in practice, since different books live in different files; the
design just refuses to let *unlikely* mean *unhandled*.

One more safety net rounds out the picture: in development, a `GIT_PUSH`
switch keeps every commit local, so no amount of testing can accidentally
deploy the live site. The publish button simply doesn't exist on a dev box.
Guardrails aren't glamorous — until the day they are.

> **[Figure 4]** *The write pipeline.* Generate a wide (21:9) horizontal
> step diagram, flat design, dark background: five rounded steps connected
> by amber arrows, each with a small icon and a label. Steps, exactly:
> "1 · git pull --rebase" (down-arrow icon), "2 · edit Markdown" (pencil
> icon), "3 · lint — check_books.py" (checklist icon), "4 · commit" (git
> commit dot icon), "5 · push → site deploys" (rocket-free: use a paper
> plane icon). Around steps 1–4, a subtle dashed teal outline labelled
> "file lock — one writer at a time". Under step 3, a small red branch
> arrow labelled "lint fails → nothing is committed". Use exactly these
> labels. Suggested caption: "Every write, no exceptions: pull, edit, lint,
> commit, push."

The architecture, in short, is a bet: that the discipline which saved the
site — parity, plain files, one source of truth — could also power its
day-to-day life. [The build](/boeggn-app/build/) is where that bet was
tested. Spoiler: it paid off. But not without a fight.
