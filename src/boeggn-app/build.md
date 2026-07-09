---
title: "The Build: Four Phases, One Day"
heading: "The build"
navLabel: "The build"
section: 3
status: draft
---

# The build

## Four Phases, One Day

Ambitious projects fail for a predictable reason: they attempt everything at
once. This build did the opposite. The work was sliced into four phases,
ordered not by importance but by *risk* — and that ordering is arguably the
single best decision of the day:

| Phase | Delivered | Why this order |
| --- | --- | --- |
| 1 | Auth, the repo clone service, the content index, the update-reading flow, commit + push | The smallest slice that proves the whole pipeline end-to-end |
| 2 | Edit content: search plus the full edit form and status transitions | Pure forms, no AI — immediately replaces most laptop sessions |
| 3 | Add to read: AI intake, reconciliation, proposal cards | The genuinely new machinery, built on proven plumbing |
| 4 | Polish: covers, PWA install, deploy indicator | Nice-to-haves, once the core is trusted |

All four phases shipped on 9 July 2026. So did the proposal, the production
deploy, and three feedback rounds. Let's walk through the day.

> **[Figure 5]** *The day in one timeline.* Generate a wide (21:9)
> horizontal timeline infographic, flat design, dark slate background, one
> teal (#0F8B8D) line with nine circular milestone nodes, labels
> alternating above and below in white sans-serif. Nodes, in order:
> "proposal written & accepted", "phase 1 — login + progress updates",
> "deploy to the VPS", "phase 2 — search + full edit", "feedback round 1 +
> phase 3 — AI intake", "feedback round 2 — tone & series", "phase 4 —
> covers, PWA, deploy indicator", "feedback round 3 — batched publishing",
> "buttons, badge & the site's own icon". A single date caption centred
> beneath the line: "9 July 2026". Amber highlight on the first and last
> node. Use exactly these labels. Suggested caption: "One day, nine
> milestones: from 'not the best experience' to installed on the home
> screen."

## Phase 1: The Smallest Possible Victory

Phase 1 built the skeleton — login, the clone service, the content index —
and one deliberately humble feature: updating reading progress. A list of
the books currently being read; tap one; enter pages read or time left;
submit. The cheapest write the app would ever perform, and therefore the
perfect end-to-end proof.

But even this humble phase contains a decision that protects all ~900 files
in the repository. The obvious way to edit front matter is to parse the
YAML, change a value, and write it back. The app refuses to do this —
because re-serializing YAML churns quoting and key order across hundreds of
hand-groomed files. Instead, writes are **line-targeted**: a progress update
replaces exactly the `pagesRead:` or `durationLeft:` line, or inserts it
after a known anchor, and the rest of the file stays byte-identical. Not
mostly identical. Byte-identical.

Phase 1 was verified in the browser before moving on: an audiobook of 43u
57m updated to "20u 45m te gaan" and produced a one-line diff commit; a
print book at 25% became `pagesRead: 52`; and an attempt to read *past* the
last page was rejected with a firm "Verder dan de laatste bladzijde (582
blz.)." — committing nothing. Validation isn't a feature of the happy path.
It's a feature of the unhappy one.

## The Deploy: Two Hiccups, Two Lessons

The same day, the app went to production — a Hetzner VPS, gunicorn behind
nginx with a certbot certificate, at boeggn.yusupov.cloud. And the deploy
delivered the day's first two war stories, both diagnosed remotely from
terminal output alone.

First, the systemd service refused to install because the repository still
carried the unit file under an older name — while nginx and the certificate
had already succeeded. The result was that most confusing of failure modes:
a *half-working* state. The fix was the rename plus a sweep of the runbook
for stale names.

Second — and this one is a classic worth framing — the app's `git pull`
failed with `Permission denied (publickey)`, even though the deploy key
tested fine. The culprit: GitHub deploy keys are repo-specific, so the SSH
configuration used a per-repo host alias — but the clone's remote URL still
pointed at plain `github.com`, so SSH dutifully offered the *default* key
instead. **With deploy keys, the alias must live in the remote URL itself,
not just in the SSH config.** One `git remote set-url` later, the pipeline
breathed.

## Phase 2: Editing Everything, Changing Nothing

Phase 2 delivered search and the full edit form — and with them, the app's
most quietly impressive engineering artifact.

Search first: the index re-scans ~900 directory entries per request but
re-parses only files whose modification time or size changed. Matching is
accent-folded, per token, and every token must hit — so "erikson malazan"
narrows instead of widening. Simple. Fast. Done.

The full-edit writer is where the stakes rise: it must be able to change
*any* field without disturbing any other. It extends the line-targeted
approach — each changed field is replaced in place, deleted, or inserted at
its canonical position in the key order existing posts already use. And
here is the part worth savoring: before the first real save was permitted,
**every post in the repository was round-tripped through the writer and
verified byte-identical**. Not a sample. Every post. An untouched field
cannot change by a single character, and that isn't a promise — it's a
property, proven against the entire corpus.

Even the browser tried to sneak in a change: a textarea silently strips a
leading newline, which would have deleted the blank line many posts keep
after their front matter. Caught, and preserved — the save now respects
each file's own blank-line style.

## The Nastiest Bug of the Day

Every build has one bug that earns a section of its own. This one arrived
disguised as the most innocent feedback imaginable: "make the date a
date/time picker."

The booklog's oldest posts carry timestamps inherited from WordPress, with
offsets like `+01:00` — even in summer. A naive round-trip through an HTML
`datetime-local` picker "normalizes" that offset to `+02:00` on save. That
doesn't just reformat the date. It moves the post's wall time — and since
the site's URLs embed the year and month, it can silently *move the post's
URL*. A date picker that relocates fifteen-year-old permalinks: that is the
kind of bug that never announces itself.

The first fix didn't survive contact with Django's timezone handling. The
durable rule turned out to be beautifully simple: **compare wall times, and
only write the `date:` line when the picker shows a genuinely different
moment than the file.** The same session eliminated the last remaining churn
source (an existing-but-empty field staying empty is not a change), and the
proof was re-run: unchanged submits of four differently-shaped posts all
reported "Niets gewijzigd." — and committed nothing.

> **[Figure 6]** *Anatomy of the timezone bug.* Generate a wide (16:9)
> explanatory diagram, flat design, dark background, in four stages left to
> right joined by amber arrows. Stage 1: a file card showing the single
> line "date: 2011-03-14 … +01:00" labelled "legacy post (WordPress
> inheritance)". Stage 2: a form-input card labelled "datetime-local
> picker". Stage 3: a file card showing "+02:00" in red, labelled "naive
> save: offset 'normalized'". Stage 4: a small browser-address-bar graphic
> with "/2011/03/…" crossed out in red, labelled "wall time shifts — the
> URL can move". Below the four stages, a green banner card with exactly:
> "The rule: compare wall times; write date: only when the moment actually
> changed." Use exactly these strings; a slightly technical, calm style —
> no skulls, no warning triangles. Suggested caption: "How a date picker
> almost moved fifteen-year-old URLs — and the one-line rule that stops
> it."

By the end of phase 2, the app could already replace most laptop editing
sessions. But the brief's most ambitious flow was still missing — the one
where you type "the next three Malazan books" into a box and the right
things happen. That story — AI, reconciliation, and a series called
Ringworld that refuses to be simple — is [next](/boeggn-app/ai/).
