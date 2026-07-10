---
title: "Where generative AI entered (or not)"
navLabel: "The models"
section: 2
status: draft
---

# Where generative AI entered (or not)

Accounts of projects like this one tend to say "AI" the way one says
"electricity," and her it sort of works, because different models did
different jobs under different amounts of supervision, and the trust you can
place in the result depends on knowing which was which. Three models touched
the text of the edition, in three distinct roles, and the corpus records
which pages came from which. No single model "did the OCR." (Models were
also involved in a different capacity, as drafting partners in designing the
site; that story belongs to [the architecture
section](/raimbaut/architecture/#designed-around-readers-not-around-the-print).)

## GPT-4o: the bulk transcription

The first and largest job was turning 586 page images into text. Each page
of volumes 1 and 2 was rendered from the PDF scans at high resolution and
sent to **GPT-4o**, OpenAI's vision model, with a prompt asking for a
faithful Markdown transcription under a small set of structural conventions:
italics as `*...*` (these are real italics, set with the Selectric's italic
element, so the transcription records a fact about the page rather than an
interpretation), underlined runs as `[...]{.underline}` (underlining in this
typescript is meaningful, since it is how the sigla are marked), Occitan
verse wrapped in blocks tagged with the language (`::: {lang=oc}`), and each
page's footnotes as numbered Markdown notes. The output was one Markdown
file per page, named for its page id.

[The previous
section](/raimbaut/#the-source) tells why I used a vision model rather than OCR software. OCR had been tried on this typescript years earlier, while my
father was alive, and lost the race against retyping within a few dozen
pages; the text layer inside the library's own digitization shows what the
conventional route still produces. A vision language model reads the page
more nearly the way a person does, using context to decide what a faint
character must be and what the formatting around it means. On this material
the improvement was large enough to change the nature of the project, from
a transcription effort measured in months to one measured in hours.

The same mechanism is also the risk: a
model that uses context to read a faint word can use the same context to
produce a *plausible* word that is not the word on the page. An OCR error
announces itself by looking like garbage, whereas a vision-model error looks
like fluent text and announces nothing. On the French prose this risk stayed
manageable, and GPT-4o's output there was close to publication quality. On
the Occitan verse it was not manageable at all.

## Claude: the verse, after a controlled comparison

The heart of the thesis, and the place where a plausible-but-wrong reading
would do the most damage, is the Occitan verse: the poems themselves, in a
medieval language, in my father's own editorial versions, whose precise
readings are the point of the thesis. Raimbaut is a poet of deliberate
verbal difficulty. A transcription error in the French prose is a typo; a
transcription error in the Occitan can silently change a reading my father
spent pages arguing for.

So the verse pages were transcribed twice, by two different models, and the
outputs were machine-compared. **Claude**, working interactively inside
Claude Code (an agentic coding environment) rather than through scripted
API calls, transcribed the verse pages in session; a diff report then laid
the two transcriptions side by side, chunk by chunk. Across the 43 pages of
that comparison there were 997 differing chunks, and reading them settles
the question at a glance. Where the typescript of Chanson I reads *Cars,
douz e fenhz del bederesc / m'es sos bas chanz*, Claude's transcription
says exactly that, while GPT-4o offered *Canz, doncs e fenhz del bedeneira
/ m'ee sose bez chanz*: fluent-looking, metrically shaped, and wrong in
almost every word. The same model that was near-publication quality on
French prose was inventing plausible Occitan.

<figure class="fig">
<img src="/raimbaut/images/fig3.png" alt="A diff listing showing pairs of readings of Occitan verse, one incorrect and one correct, next to the typewritten source lines." loading="lazy">
<figcaption><span class="fig-n">Figure 3</span> Two vision models read the same typewritten strophe. On Old Occitan, GPT-4o produces fluent inventions, and only a controlled comparison makes that visible because nothing about the wrong text <em>looks</em> wrong if you don't know the language. <span class="provenance"><a href="https://github.com/mvuijlst/raimbaut/blob/main/review-diff.md"><code>review-diff.md</code></a> in the repository (restored from its history — see <a href="/raimbaut/annexes/c/">Annex C</a>), pages compared during the first transcription attempt; scan of vol. 1.</span></figcaption>
</figure>

The corpus that everything else is built on is therefore a documented
hybrid. GPT-4o's transcription is the base; the verse and other
Occitan-heavy pages carry Claude's transcription instead; and a provenance
table records, for every one of the 586 pages, which model's text it
carries. The final tally is 499 pages from GPT-4o and 87 from Claude. 

On top of the transcription came the checking. The Occitan was then read
against external reference points, Walter Pattison's 1952 edition of
Raimbaut and the Rialto corpus of Occitan texts online, under one standing
rule: reference editions are used to *detect* suspicious readings, never to
replace my father's. Where his text differs from Pattison, that difference
is his editorial judgement, which is precisely the matter of the thesis,
and the checking pass exists to make sure the difference is his and not a
model's. Every difference is presented to me to resolve, never resolved automagically.

## GPT-4o-mini: one narrow, boring job

The third job shows the opposite end of the technique. The edition needs to
know, for every scanned page, which *printed* page number it carries,
because that number is what my father's own cross-references and any future
citation of the thesis refer to. This task has none of the transcription's
difficulty: crop the top-right corner of the page image, read the number,
or report that there is none. A small script
([`ocr_page_numbers.py`](https://github.com/mvuijlst/raimbaut/blob/main/ocr_page_numbers.py))
does exactly that with **GPT-4o-mini**, the cheap sibling model, at
temperature 0, and produces a plain CSV mapping page ids to printed
numbers.

I mention this stage separately not for its difficulty but because it is
the correct pattern in miniature: the narrowest possible model, the
narrowest possible question, a machine-checkable output format, and a
result (a 586-row CSV) small enough to be checked by eye in its entirety.
Wherever an AI task can be made this boring, it is worth making it this
boring.

## What none of the models did

No model chose what the edition would be. No model decided that underlines
mean sigla and small capitals mean names, that the annex volume was out of
scope, that the corpus, once transcribed, would be hand-edited rather than
re-transcribed, that unresolved references would be shown rather than
hidden, or that the poem, and not the page, would be the unit of the site.
No model verified its own output; the A/B comparison, the reference
editions, the [review reports](/raimbaut/editorial/#the-review-reports) and
the flagged uncertainty are exactly the apparatus a model cannot supply for
itself. And no model "understood" the
thesis in any sense that would let me skip understanding it myself. I read
a great deal of my father's prose very closely in those two days, which is
perhaps the least automatable thing that happened.

## One-time, exploratory, and honestly so

A last structural fact about the AI stage, which the rest of the pipeline
depends on: it ran once. The transcription was exploratory, and it took
two starts. The first attempt worked from scans I had made myself of my
own physical copy of the typescript; partway in I discovered that the
university library had digitized all three volumes at better quality, and
the transcription was redone from the library's scans. After the corpus
was finalized, the transcription scripts were deleted in a cleanup of
clunky one-time code.

Deleted, it turns out, is a relative term in a version-controlled
repository. While writing this piece I restored the scripts, the A/B diff
report and the page-provenance table from the repository's history (they
are catalogued in [Annex A](/raimbaut/annexes/a/) and [Annex
C](/raimbaut/annexes/c/)), since they document the stage better than any
retelling, and the prompt — quoted in full in Annex C — is the first thing
anyone reproducing the approach will ask for. With those files back and the
environment rebuilt, the stage could in principle even be run again. There is simply never a reason to, and that asymmetry is the
principled part. Once the corpus exists and has been verified, the scans
stop being the source of truth and the corpus takes over. A typo is fixed
by editing the Markdown file, the way one would edit any manuscript, never
by re-transcribing the page. The transcription belongs, in retrospect,
with the acts that create a source rather than with the processes that
transform one. It stands where hand-keying the text would have stood, and
the question of whether hand-keying is re-runnable never comes up.
