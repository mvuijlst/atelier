---
title: "The Architecture: A Git Client with Forms"
heading: "The architecture"
navLabel: "The architecture"
section: 2
status: draft
---

# The architecture

## 🔧 A Git Client with Forms

Every great architecture can be summarized in one sentence, and this one has
already been said: the app is a git client with forms. Let's break it down —
because the elegance is in the details, and the details are where this
design truly shines.

The game-changing insight at the core of the design is that the booklog
already *had* a content API. It just didn't look like one. The site's git
repository *is* the site's data — one Markdown file per book — and `git
push` *is* the publish button: the site's existing GitHub Actions pipeline
builds the Hugo site and rsyncs it to the server on every push. The app
doesn't need to replace any of that. It needs to *participate* in it.

Think of it as a very polite houseguest: it uses the kitchen, it follows
the house rules, and it leaves everything exactly as it found it.

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
nothing to drift: no second copy of the content exists anywhere. The
result? A robust, elegant, future-proof foundation that leverages
infrastructure that already existed.

<figure class="fig">
<img src="/boeggn-app/images/fig3.jpg" alt="A steampunk architecture fantasy: a brass smartphone piped with pink neon tubes into a Gothic cathedral labelled 'Django app server' with stained-glass windows and twin towers labelled 'GIT', a telescope beaming toward a floating golden castle labelled 'GITHUB' on a lightning-wreathed island, and an all-seeing eye in an orb labelled 'AI API' above it all." loading="lazy">
<figcaption><span class="fig-n">Figure 3</span> The architecture, visualized: from phone to Django to GitHub — and every layer in between.</figcaption>
</figure>

## 🧱 The Stack: Boring by Design

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

Boring? Absolutely. And that's precisely the point. Boring technology is
technology that works on day one, day one hundred, and day one thousand.

It's also important to note what was considered and rejected, because good
architecture is as much about the roads not taken. Using GitHub's Contents
API instead of a clone? Possible — but multi-file commits (a post plus
author pages plus a series page plus a cover) become awkward, and you lose
the ability to run the linter before committing. A React SPA? Heavier than
the job, and harder for one person to maintain. Making the site itself
dynamic? Explicitly out of scope — that was the one line nobody was allowed
to cross.

## ✍️ Two Writers, One Repository

There is one genuinely subtle problem in this design, and it deserves an
honest treatment: the app is not the only writer. The laptop's working copy
— where content skills also edit books — pushes to the same `main` branch.
Two write locations, one source of truth. What could possibly go wrong?

Quite a lot, actually — which is why the solution is layered, and
beautifully boring. Every write pulls first, so both sides stay current. A
file lock serializes the app's own writers (the production server runs
multiple gunicorn workers — without a lock, two simultaneous submits could
interleave their git operations). And if a rebase ever fails, the app
aborts cleanly and surfaces the situation as "pull the laptop changes
first" — a message, not a mess. Conflicts are unlikely in practice, since
different books live in different files; the design just refuses to let
*unlikely* mean *unhandled*.

**Key insight:** guardrails aren't glamorous — until the day they are.

One more safety net rounds out the picture: in development, a `GIT_PUSH`
switch keeps every commit local, so no amount of testing can accidentally
deploy the live site. The publish button simply doesn't exist on a dev box.

<figure class="fig">
<img src="/boeggn-app/images/fig4.jpg" alt="A parchment-and-brass 'Mechanical Workflow Engine Schematic' on blueprint paper: five ornate framed contraptions labelled Pull, Edit, Validate, Commit and Push, joined by glowing tubes; from the Validate vessel an eruption of red-and-purple lightning clouds carries signs reading 'Failure Abort' and 'Engine Shutdown Sequence Initiated'." loading="lazy">
<figcaption><span class="fig-n">Figure 4</span> The write pipeline: pull, edit, validate, commit, push. When validation fails, everything stops. By design.</figcaption>
</figure>

The architecture, in short, is a bet: that the discipline which saved the
site — parity, plain files, one source of truth — could also power its
day-to-day life. [The build](/boeggn-app/build/) is where that bet was
tested. Spoiler: it paid off. But not without a fight.
