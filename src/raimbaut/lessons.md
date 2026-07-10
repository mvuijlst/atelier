---
title: "Lessons, limits, and what comes next"
navLabel: "Lessons"
section: 6
status: draft
---

# Lessons, limits, and what comes next

## For anyone facing a shelf like this one

The method transfers, and these are the parts of it I would carry to the
next hidden monograph:

**Make a corpus, and make it the only source of truth.** The single most
consequential decision in the project was that the transcription's output
would become a set of plain-text files that a human edits directly, and
that no process would ever regenerate them. Everything good about the
project's maintainability follows from this: corrections are ordinary
edits, the version history records every editorial intervention, and the
AI stage could be allowed to be messy and unrepeatable because nothing
depends on repeating it.

**Use a vision model for what OCR cannot do, and distrust it in proportion
to its fluency.** On faint typescript the vision model was the difference
between a feasible project and an abandoned one. It is also a reader that
never produces visible garbage, only plausible text, so its errors are more or less hidden.
Budget the verification accordingly, and spend careful, interactive
checking where a plausible error costs the most; here, that was the
Occitan verse, checked against reference editions with the standing rule
that references detect problems and never overrule the source.

**Where an AI task can be made narrow and checkable, make it so.** The
page-number pass is the pattern: a cheap model, a cropped image, a
one-token answer, a CSV a human can read in full. The transcription could
not be made that boring; everything that could be, was.

**Everything downstream of the corpus should be deterministic and nearly
dependency-free.** The derivation scripts use no models, no network, and
no libraries beyond the language's standard installation, so a rebuild
cannot quietly change the text and the toolchain has almost nothing in it
that can rot. The vision stage's virtual environment, which briefly broke
mid-project when the Python that created it disappeared, served as the
cautionary exhibit; the derivation scripts cannot break that way.

**When a script is unsure, it must change nothing and say so.** The [review
reports](/raimbaut/editorial/#the-review-reports), with their explicit case lists, are where the editorial checking
time actually goes, and they are the difference between claiming care and
demonstrating it.

**Give every page a permanent identity first.** [The page-id
spine](/raimbaut/pipeline/#a-spine-of-page-ids) cost
minutes to establish and everything hangs from it: provenance, footnote
namespacing, the printed-page map, the facsimile alignment, every anchor
in the published site.

**Fidelity deserves its own view.** Normalizing for readability and
preserving the source exactly are both legitimate demands, and a single
layout cannot serve both. [Splitting them into a reading view and a
facsimile](/raimbaut/editorial/#one-text-two-presentations-of-fidelity) dissolved what would otherwise have been a running argument with
myself about every dash.

**Budget for design.** This is the lesson people will most want
to skip. The transcription became cheap; the edition did not, because an
edition is a designed object, and the design here consumed experience that
does not compress into two days. If the design background is not on hand,
the choices are real and respectable: keep the shape radically simple,
borrow the patterns of an edition you admire, or bring in someone who does
this work. What will not happen is a model conjuring the information
architecture; deciding what the site *is* remained entirely human work in
this project.

## What this does not prove, and what remains wrong

**Errors remain in the text.** The corpus was produced by a model whose
errors read fluently, and although the hard passages were checked closely
and the review lists worked through, I have not collated all 586 pages
word by word against the scans. Misreadings have certainly survived.
What I can say is that the system is built for the finding of them: every
page links to its provenance, doubtful readings are marked as doubtful,
and a correction, once reported, is a one-line edit followed by a
mechanical rebuild. The edition's accuracy is a process that has started,
rather than a property it possesses.

**The scholarship is from 1981, and the edition does not update it.**
Forty-five years of Occitan studies have happened since, and no AI stage
in this pipeline knows or cares. The edition presents the thesis as the
historical scholarly object it is. Bringing its arguments into
conversation with the field as it now stands would be a scholar's work,
it would be a different project, and it is the project my father would
have actually wanted; this distinction is stated in the edition rather
than blurred.

**The verification depended on the verifier.** I read French, English and German, I can
follow Occitan against reference editions, and I knew this thesis and its
author. A reader of the method should notice how much of the checking
leaned on those facts. The pipeline is transferable; the confidence is
only as transferable as the person doing the checking.

**Sustainability is a human problem that static files only shrink.** The
folder of HTML will outlive its toolchain, but a domain must be renewed,
a server bill paid, and for the moment every one of those promises is
kept by one person. The mitigation is the repository and the
corpus themselves: the edition can be rebuilt and rehosted by anyone,
which is a weaker guarantee than an institution and a stronger one than
most websites have.

**And the AI did not understand the thesis.** It read pages. The
decisions about what the edition would be, what fidelity meant, what to
normalize, what to admit uncertainty about, came from people, one of them
dead since 2009 and present through his typescript's own conventions. I
keep restating this because the alternative story, in which an AI
"brought a thesis back to life," is more flattering and will be told
about projects like this by default. It is not what happened.

## What comes next

The project as described here ends at a working edition. The pipeline was built for
one thesis, but almost nothing in its shape is specific to that thesis. A
corpus of page files with stable ids, normalization by explicit rules,
harvested apparatus with review reports, a static edition with reading
and facsimile views — that pattern would serve a very large number of
typed and shelved works, and my intention is to turn at some point it into a freely
available tool so that the next person facing such a shelf starts from
something better than an empty repository. This is future work in the
real sense, meaning unscheduled, and its shape is not settled. Some of it
is clear enough already (a published tool would show the scans themselves
at page level, [as the editorial section conceded](/raimbaut/editorial/#one-text-two-presentations-of-fidelity)), but most of the
questions are open, from how much of the design can be packaged without
flattening it, to what the checking workflow should look like for someone
who is not me. If you work on this kind of material and any of it maps
onto problems you have, I would genuinely welcome the input; the
[repository](https://github.com/mvuijlst/raimbaut) is public, and I am
not hard to find.

The thesis this piece is about was defended in 1981, deposited, shelved,
and read by almost no one for forty-five years. It is being read now. The
work it took is described above in enough detail to repeat, and the
shelves are full.
