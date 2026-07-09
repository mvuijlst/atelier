---
title: "The AI Flow: One Textarea, Zero Guesswork"
heading: "The AI flow"
navLabel: "The AI flow"
section: 4
status: draft
---

# The AI flow

## 🤖 One Textarea, Zero Guesswork

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

But the simplicity is a stage performance, and this is where the magic
happens. The machinery behind the curtain has three acts. Let's unpack
them.

**Act one: structure, not prose.** The app makes a single OpenAI
chat-completions call — the model is `gpt-5.5` — with a **strict JSON
schema**. No free-text parsing, no "hopefully the model formats it right".
The schema *is* the contract. And in a detail that does a surprising amount
of heavy lifting, the site's closed list of categories travels along in the
prompt, so the model picks from what exists instead of inventing taxonomy.
The model also writes the one-line Dutch note that becomes the post's body.

**Act two: reconcile before showing.** Everything the model returns is
checked against the repository *before* the user sees it. Authors are
fuzzy-matched on name parts in any order — "Rebecca Yarros" resolves to the
existing `yarros-rebecca` — and unknown authors are simply flagged as "new,
will be created". Tags are de-duplicated against near-misses. Series are
matched against the site's existing series pages. And a genuinely new
*category* — the one place where the bar stays deliberately high — requires
an explicit confirmation checkbox. The model proposes. The repository
disposes. It's not just validation — it's a philosophy.

**Act three: plain forms, all the way down.** Each proposal card is an
ordinary bound Django form — several coexist, prefixed — which means edited
values are re-validated by the same rules automatically, and *accepting* a
card runs the exact same pull → write → lint → commit pipeline as every
other write in the app. The AI flow gets no special powers. It fills in
forms, like everybody else. Democracy, but for software components.

<figure class="fig">
<img src="/boeggn-app/images/fig7.jpg" alt="A blueprint-blue alchemical assembly line: handwritten scrolls feed an ornate boiler labelled 'AI Furnace' with glowing AI chips, which pours molten light onto a golden cassette labelled 'Structured Book Data'; pipes lead to a mirror labelled 'Server Validator' with a holographic shield, then to a porthole labelled 'User Review' showing a book stamped 'Published', beside a wax-sealed scroll reading 'Approved draft for publishing' and a small brass robot." loading="lazy">
<figcaption><span class="fig-n">Figure 7</span> From free text to published book: the intake pipeline, end to end. The AI proposes; the server validates; the human decides.</figcaption>
</figure>

Verified with a real API call, the first live test read: "The Tainted Cup
van Robert Jackson Bennett, en Fourth Wing van Rebecca Yarros als
audioboek". Two cards came back. Bennett matched his existing author slug;
the audiobook arrived with a duration of 20u 43m and two narrators as new
authors with `stem` (voice) roles; both books matched existing series
pages. Accepting produced exactly one commit: the post, two author pages,
two tag pages — linted first, naturally. The results speak for themselves.

## 🪐 The Ringworld Problem

Then came feedback round two, and with it the most delicious modelling
problem of the day. The request: series input should be recognised and
expanded — "commonwealth saga" should become Pandora's Star and Judas
Unchained, its main constituent books. Simple enough, right?

Wrong. Because, as the feedback itself pointed out: a name like "Ringworld"
means both the first book *and* the whole series. Welcome to natural
language, where nothing is ever simple and everything is a special case.

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
honest null-entry, exactly as designed. Four inputs. Four correct
behaviours. Zero invented books. As a bycatch, the model's occasional
comma-style "Hamilton, Peter F." taught the author matcher to be
punctuation- and comma-insensitive, both forms now resolving to the site's
legacy slug.

<figure class="fig">
<img src="/boeggn-app/images/fig8.jpg" alt="A baroque clockwork triptych titled 'Series Decision': three porthole dials wreathed in purple smoke, labelled A 'Whole series' (a shelf of matched volumes), B 'First book only' (an open book with a gear stamped 1), and C 'Unknown to AI' (a locked tome), with piping below leading to indicators reading 'Single entry log' and 'Manual review queue'." loading="lazy">
<figcaption><span class="fig-n">Figure 8</span> The series decision, demystified: whole series, first book only, or unknown to AI — and never, ever an invented book.</figcaption>
</figure>

## 🗣️ The Tone Audit

The same feedback round contained a second, subtler correction — about
words, not features. Out went the chatty spinner line ("Even kijken wat dit
voor boeken zijn…"), the explanatory labels, anything cutesy — and, in a
phrasing that deserves preservation, anything "that sounds like it's
someone from Holland speaking". A single-user app needs no small talk with
its only user. "Hoe ver zit je?" became "Voortgang". A jokey validation
quip became "Meer dan 100%." The analyse button, which had given no
feedback at all when tapped, now disables itself and reads "Bezig…" until
the model answers.

The takeaway? Interface copy is a feature like any other: it ships, it gets
feedback, it gets fixed. The best products sweat these details — and this
one sweats them in two languages.

With all three flows from the brief now live, the app was *functional*. But
functional and *finished* are two very different words, and the difference
— covers, home-screen installation, and one very red badge — is the subject
of [the polish](/boeggn-app/polish/).
