---
title: "The Build: Four Phases, One Day"
heading: "The build"
navLabel: "The build"
section: 3
status: draft
---

# The build

## 🗓️ Four Phases, One Day

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
deploy, and three feedback rounds. One calendar day. Zero shortcuts.
Buckle up — let's walk through it.

<figure class="fig">
<img src="/boeggn-app/images/fig5.jpg" alt="A gilded timeline of four elaborate clockwork timepieces connected by copper pipes against a vaporwave sunset, with scroll banners reading 'Morning: Proposal (7 AM – 11 AM)', 'Afternoon: Core Build', 'Evening: Feedback Loops' and 'Night: Live Deploy'." loading="lazy">
<figcaption><span class="fig-n">Figure 5</span> The build day at a glance, from morning proposal to night deploy. One day. Four clocks. Zero shortcuts.</figcaption>
</figure>

## 🐣 Phase 1: The Smallest Possible Victory

Phase 1 built the skeleton — login, the clone service, the content index —
and one deliberately humble feature: updating reading progress. A list of
the books currently being read; tap one; enter pages read or time left;
submit. The cheapest write the app would ever perform, and therefore the
perfect end-to-end proof. Start small. Prove everything. Then scale.

But even this humble phase contains a decision that protects all ~900 files
in the repository. The obvious way to edit front matter is to parse the
YAML, change a value, and write it back. The app refuses to do this —
because re-serializing YAML churns quoting and key order across hundreds of
hand-groomed files. Instead, writes are **line-targeted**: a progress update
replaces exactly the `pagesRead:` or `durationLeft:` line, or inserts it
after a known anchor, and the rest of the file stays byte-identical. Not
mostly identical. Byte-identical. Let that sink in.

Phase 1 was verified in the browser before moving on:

- ✅ An audiobook of 43u 57m updated to "20u 45m te gaan" — a one-line diff
  commit.
- ✅ A print book at 25% became `pagesRead: 52`.
- ✅ An attempt to read *past* the last page was rejected with a firm
  "Verder dan de laatste bladzijde (582 blz.)." — committing nothing.

Validation isn't a feature of the happy path. It's a feature of the unhappy
one.

## 🚧 The Deploy: Two Hiccups, Two Lessons

The same day, the app went to production — a Hetzner VPS, gunicorn behind
nginx with a certbot certificate, at boeggn.yusupov.cloud. And the deploy
delivered the day's first two war stories, both diagnosed remotely from
terminal output alone. Because of course it did. No deploy in history has
ever been boring, and this one was no exception.

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
breathed. Lesson learned. Lesson earned.

## ✏️ Phase 2: Editing Everything, Changing Nothing

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
verified byte-identical**. Not a sample. Not a subset. Every. Single. Post.
An untouched field cannot change by a single character, and that isn't a
promise — it's a property, proven against the entire corpus.

Even the browser tried to sneak in a change: a textarea silently strips a
leading newline, which would have deleted the blank line many posts keep
after their front matter. Caught, and preserved — the save now respects
each file's own blank-line style. The devil, as always, is in the details.

## 🐛 The Nastiest Bug of the Day

Every build has one bug that earns a section of its own. This one arrived
disguised as the most innocent feedback imaginable: "make the date a
date/time picker." What happened next is a masterclass in why legacy data
deserves respect.

The booklog's oldest posts carry timestamps inherited from WordPress, with
offsets like `+01:00` — even in summer. A naive round-trip through an HTML
`datetime-local` picker "normalizes" that offset to `+02:00` on save. That
doesn't just reformat the date. It moves the post's wall time — and since
the site's URLs embed the year and month, it can silently *move the post's
URL*. A date picker that relocates fifteen-year-old permalinks: that is the
kind of bug that never announces itself. It just waits.

The first fix didn't survive contact with Django's timezone handling. The
durable rule turned out to be beautifully simple: **compare wall times, and
only write the `date:` line when the picker shows a genuinely different
moment than the file.** The same session eliminated the last remaining churn
source (an existing-but-empty field staying empty is not a change), and the
proof was re-run: unchanged submits of four differently-shaped posts all
reported "Niets gewijzigd." — and committed nothing.

<figure class="fig">
<img src="/boeggn-app/images/fig6.jpg" alt="A two-panel steampunk allegory in purple smoke. Left, a rusted frame labelled 'The Bug': a cracked clock reading 'Oct 32, 2023 — 24:61 PM', red lightning, gears grinding, and signs reading 'Critical failure', 'Offset mismatch', 'URL breakage imminent' and 'Data corruption detected' above broken links. Right, a gleaming gold frame labelled 'The Fix': a calm clock reading 'Nov 01, 2023 — 10:00 AM', green glows, and signs reading 'Offset preserved', 'URL stable', 'Data integrity secured', 'UTC synchronized' and 'Fix applied' above stabilized links." loading="lazy">
<figcaption><span class="fig-n">Figure 6</span> The bug and the fix, side by side. Left: what almost happened. Right: what ships today.</figcaption>
</figure>

By the end of phase 2, the app could already replace most laptop editing
sessions. But the brief's most ambitious flow was still missing — the one
where you type "the next three Malazan books" into a box and the right
things happen. That story — AI, reconciliation, and a series called
Ringworld that refuses to be simple — is [next](/boeggn-app/ai/). Trust me:
you'll want to read this one.
