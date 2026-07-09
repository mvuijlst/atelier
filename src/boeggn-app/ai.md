---
title: "The AI Flow: One Textarea, Zero Guesswork"
heading: "The AI flow"
navLabel: "The AI flow"
section: 4
status: draft
---

# The AI flow

## One Textarea, Zero Guesswork

Phase 3 is where the app earns the "AI-assisted" in its description — and
where the design philosophy faces its sternest test. Because nothing erodes
trust in a carefully groomed, hand-validated corpus faster than a language
model with creative opinions about your metadata.

The flow itself is disarmingly simple. One textarea. Type anything:
"fourth wing rebecca yarros", a pasted blurb, an ISBN, "the next three
Malazan books". Press one button. Receive one or more proposal cards —
author, title, publisher, year, pages or duration, categories, tags, series
and series number — every field editable, nothing accepted until a human
says so.

But the simplicity is a stage performance, and the machinery behind the
curtain has three acts.

**Act one: structure, not prose.** The app makes a single OpenAI
chat-completions call — the model is `gpt-5.5` — with a **strict JSON
schema**. No free-text parsing, no "hopefully the model formats it right".
The schema *is* the contract. And in a detail that does a surprising amount
of work, the site's closed list of categories travels along in the prompt,
so the model picks from what exists instead of inventing taxonomy. The
model also writes the one-line Dutch note that becomes the post's body.

**Act two: reconcile before showing.** Everything the model returns is
checked against the repository *before* the user sees it. Authors are
fuzzy-matched on name parts in any order — "Rebecca Yarros" resolves to the
existing `yarros-rebecca` — and unknown authors are simply flagged as "new,
will be created". Tags are de-duplicated against near-misses. Series are
matched against the site's existing series pages. And a genuinely new
*category* — the one place where the bar stays deliberately high — requires
an explicit confirmation checkbox. The model proposes. The repository
disposes.

**Act three: plain forms, all the way down.** Each proposal card is an
ordinary bound Django form — several coexist, prefixed — which means edited
values are re-validated by the same rules automatically, and *accepting* a
card runs the exact same pull → write → lint → commit pipeline as every
other write in the app. The AI flow gets no special powers. It fills in
forms, like everybody else.

> **[Figure 7]** *The intake pipeline.* Generate a wide (16:9) flow diagram,
> flat design, dark slate background, teal boxes, amber arrows, left to
> right. Node 1: a textarea graphic labelled "free text — 'fourth wing
> rebecca yarros'". Node 2: "gpt-5.5 — strict JSON schema (closed category
> list in the prompt)". Node 3: a tall box labelled "server-side
> reconciliation" containing four stacked rows: "authors — fuzzy match, any
> order", "tags — near-duplicates squeezed", "series — matched to existing
> pages", "new category? — explicit checkbox required". Node 4: a proposal
> card graphic labelled "editable proposal card — nothing publishes
> unseen". Node 5: "pull → write → lint → commit". Use exactly these
> labels. Suggested caption: "The model proposes, the repository disposes:
> every proposal is reconciled against the site before a human ever sees
> it."

Verified with a real API call, the first live test read: "The Tainted Cup
van Robert Jackson Bennett, en Fourth Wing van Rebecca Yarros als
audioboek". Two cards came back. Bennett matched his existing author slug;
the audiobook arrived with a duration of 20u 43m and two narrators as new
authors with `stem` (voice) roles; both books matched existing series
pages. Accepting produced exactly one commit: the post, two author pages,
two tag pages — linted first, naturally.

## The Ringworld Problem

Then came feedback round two, and with it the most delicious modelling
problem of the day. The request: series input should be recognised and
expanded — "commonwealth saga" should become Pandora's Star and Judas
Unchained, its main constituent books. Simple enough. Except, as the
feedback itself pointed out: a name like "Ringworld" means both the first
book *and* the whole series. Welcome to natural language.

The resolution is a small masterpiece of prompt jurisprudence, with the
ambiguity rule spelled out explicitly:

- **Explicit series wording** — or a name that only exists as a series —
  expands to one entry per main book, in reading order, novellas and side
  stories excluded.
- **A name that can be both** book one and the series, like "Ringworld",
  *without* clear series intent → just that one book.
- **An unknown series is never invented.** One honest entry with the given
  title and null fields beats three confidently imagined books every single
  time.

And the live verification reads like a set of unit tests written by a
librarian: "commonwealth saga" → two correct entries. "Ringworld" → one
book. "de hele Ringworld-reeks" → all four main books, in order.
"Confessions of a trash droid series" — unknown to the model — → one
honest null-entry, exactly as designed. As a bycatch, the model's
occasional comma-style "Hamilton, Peter F." taught the author matcher to be
punctuation- and comma-insensitive, both forms now resolving to the site's
legacy slug.

> **[Figure 8]** *The series decision tree.* Generate a square-ish (4:3)
> decision-tree diagram, flat design, dark background, teal nodes, amber
> yes/no edge labels, white text. Root: "input mentions a series?". Branch
> "explicit series wording, or series-only name" → leaf "one entry per main
> book, in reading order — novellas excluded", annotated with a small
> example chip: "'de hele Ringworld-reeks' → 4 books". Branch "name could
> be book 1 or the series" → leaf "just that one book", chip: "'Ringworld'
> → 1 book". Branch "series unknown to the model" → leaf "one honest entry,
> null fields — never invent books", chip: "'Confessions of a trash droid
> series' → 1 null entry". Use exactly these strings. Suggested caption:
> "Prompt jurisprudence: how the intake flow decides what a series name
> means — and when to admit it doesn't know."

## The Tone Audit

The same feedback round contained a second, subtler correction — about
words, not features. Out went the chatty spinner line ("Even kijken wat dit
voor boeken zijn…"), the explanatory labels, anything cutesy — and, in a
phrasing that deserves preservation, anything "that sounds like it's
someone from Holland speaking". A single-user app needs no small talk with
its only user. "Hoe ver zit je?" became "Voortgang". A jokey validation
quip became "Meer dan 100%." The analyse button, which had given no
feedback at all when tapped, now disables itself and reads "Bezig…" until
the model answers.

It's a reminder that interface copy is a feature like any other: it ships,
it gets feedback, it gets fixed. The best products sweat these details.

With all three flows from the brief now live, the app was *functional*. But
functional and *finished* are different words, and the difference — covers,
home-screen installation, and one very red badge — is the subject of
[the polish](/boeggn-app/polish/).
