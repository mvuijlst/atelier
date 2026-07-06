---
title: "Not Just OCR: Turning a Typescript Doctoral Thesis into a Digital Scholarly Edition"
heading: "Not just OCR"
navLabel: "Context"
section: 1
status: draft
---

# Not Just OCR

*Turning a typescript doctoral thesis into a digital scholarly edition*

## What and why?

In 1981 my father defended a doctoral thesis at Ghent University. It was never
published. Since July 2026 it has been a website:
[raimbaut.yusupov.cloud](https://raimbaut.yusupov.cloud/).

<figure class="fig">
<div class="fig-row">
<img src="/raimbaut/images/fig1a.png" alt="A crop of typescript page 51 of volume 1: the opening strophe of Chanson I." loading="lazy">
<img src="/raimbaut/images/fig1b.png" alt="The same lines transcribed in the Markdown corpus file." loading="lazy">
<img class="theme-light" src="/raimbaut/images/fig1c-light.png" alt="The same strophe rendered on the finished chanson page." loading="lazy">
<img class="theme-dark" src="/raimbaut/images/fig1c-dark.png" alt="The same strophe rendered on the finished chanson page." loading="lazy">
</div>
<figcaption><span class="fig-n">Figure 1</span> One strophe, three states: the 1981 typescript, the Markdown corpus that is the edition's source of truth, and the published page. <span class="provenance">Scan of vol. 1, page id v1p051; <a href="https://github.com/mvuijlst/raimbaut/blob/main/corpus/v1p051.md"><code>corpus/v1p051.md</code></a>; <a href="https://raimbaut.yusupov.cloud/chansons/1/">raimbaut.yusupov.cloud/chansons/1/</a>.</span></figcaption>
</figure>

Open any of its thirty-nine chansons and you get the Occitan poem with my
father's French (scholarly) translation beside it, his commentary anchored to the verses it
discusses, his footnotes reconnected to their references, and the abbreviations
he used resolved against his own bibliography. Hovering over a siglum (one of
the short codes scholars use for manuscripts and standard reference works:
*RO*, *SW*, *LR*) brings up a card that says what the code stands for and links
to the full bibliography entry. The thesis says *op. cit.* and *ibid.* 477
times, in the manner of older scholarship, and each of those pointers has been
traced back to the work it refers to; 473 were resolved, and the 4 that
resisted resolution are marked as unresolved, visibly, on the page.

The same edition can also be read the other way. A book view presents each
chanson in the exact order the thesis prints it, commentary first, text after,
with the printed page numbers in the margin; inside it, a facsimile view gives
one screen page per typescript page, with nothing normalized: names in
capitals, sigla underlined as the typewriter underlined them, the
handwritten corrections on the typescript marked where they occur. Anyone who wants to check the
edition against the physical thesis (it sits in the Ghent University Library
at Rozier 9, call number BIB.L14X.1981.VUIJLSTEKE) can do so page by page.

This piece is about how that website came to exist, and it makes one claim up
front. A vision model, meaning an AI system that reads images rather than
text, made the first step feasible where conventional OCR had failed. But "AI
read my father's thesis and made a website" is not what happened, and the
interesting part is everything that sentence skips. The edition was produced
by a system: AI-assisted transcription, human and AI checking of the hard
passages, a normalized plain-text corpus as the single source of truth, a
deterministic pipeline that derives every piece of apparatus data from that
corpus, a static site (plain HTML files, with no database or server code
behind them) generated from the data, and a set of editorial decisions about
fidelity and uncertainty that no model made or could have made. Taken
separately, the parts are unremarkable. What seems worth writing down is the
system, because the world is full of valuable scholarship in exactly this
condition — typed, bound, shelved, and invisible — and the cost of
reactivating it has just fallen through the floor.

One number fixes the scale of that last sentence: the transcription, the
checking, the data pipeline and the website were built from scratch by one
person in two days, on 4 and 5 July 2026. Later sections will qualify that number twice
over. The two days bought a first trustworthy edition rather than a finished
one, and the checking is open-ended in a way the building was not; and the
two days spent something that took far longer to acquire, because the design
of the edition, from its information architecture down to how navigation
behaves on a phone, drew on my twenty-odd years of working as an information
architect. Still, as a measure of what used to require a funded project and
a team, two days is the honest figure.

## The source

The thesis is:

> Vuijlsteke, Marc, *Interprétation "philologique" et "poétique" du Chansonnier
> de Raimbaut d'Orange*. Diss. Doct. Letteren en Wijsbegeerte. Romaanse
> filologie, Ghent, 1981.

It is a *Proefschrift voorgelegd tot het behalen
van de graad van doctor in de Letteren en Wijsbegeerte (groep: Romaanse
filologie)*, which is to say a doctoral thesis in Romance philology. Its
subject is the chansonnier of [Raimbaut d'Orange](https://fr.wikipedia.org/wiki/Raimbaut_d%27Orange), a twelfth-century troubadour,
and it works through his thirty-nine chansons one by one: for each poem a
critical discussion of readings and interpretation (the *remarques*), then the
established Occitan text with a facing French translation. Around that core
sit an introduction, a concluding essay on Raimbaut's poetics, a bibliography,
and indexes.

The author was my father, Marc Vuijlsteke. He died in 2009. I am his sole
heir, which settles the rights question entirely; there is no one else to ask.
That is all this piece needs to say about rights, though not quite all it
needs to say about motive. He never stopped intending to return to this work,
and he ran out of time -- the edition's
[colophon](https://raimbaut.yusupov.cloud/colophon/) tells that story
properly. For
the method, which is what you are reading this for, the relevant part is
simpler: I did not want to be the last person who could still find this
thesis.

It is findable, technically speaking. A doctoral thesis is a public document:
submitted, defended, deposited, catalogued. This one has sat in the
university library for forty-five years, and the library has digitized all
three volumes; a reasonably good scan exists online for anyone who already
knows to look for it, with an automatically generated text layer behind the
page images that I will have more to say about shortly. What the thesis never
had is a form in which a person could *encounter* it: no publisher, no
journal, no entry in the bibliographies and databases where people actually
look. Occitan studies is a small field, and a thesis that was never published
is, for practical purposes, invisible even to specialists. Public and
inaccessible at the same time: that condition is the real subject of this
piece, and my father's thesis is one instance of a very large class.

The obvious cheap fix would have been to post the scans. Volumes 1 and 2 hold
the thesis proper, 586 typescript pages (298 and 288). Volume 3 is an annex
containing reproductions of his source material, the medieval chansonniers,
in the form of 1970s black-and-white photocopies of such poor quality that I
decided not to reproduce them at all; the edition instead links each chanson,
where possible, to publicly available images of the same manuscripts from the
libraries that hold them, and several of those are already in place. Posting
the two main volumes would have been preservation of a sort, and I want to be
precise about why it would not have been enough, because the answer is not
that PDFs are ugly.

The first reason is that a scan preserves the page but loses the *apparatus*,
the machinery of footnotes, abbreviations, and cross-references through which
a scholarly text actually functions. The thesis has 1,257 footnotes, numbered
per page. It cites through 24 bibliographic sigla, defined once, deep in
running prose, and used everywhere. It says *op. cit.* and *ibid.* 477 times,
and such a pointer can only be followed by someone who can find the
antecedent, sometimes hundreds of pages earlier. On paper, in hand, with a
finger holding the bibliography open, all of this works. In a scanned PDF
every one of those pointers is dead.

The second reason is that OCR does not revive them, and on this typescript
OCR barely functions at all. I say that with some history behind it. Years
ago, while my father was still alive, he and I went down exactly this road:
we ran a few dozen pages through OCR software and concluded that correcting
the output was costing us nearly as much work as retyping would have. The
library's digitization makes the same point a second time, because the text
layer behind its page images is exactly the kind of automated OCR output we
had given up on, and it is abysmal. The typescript itself is cleaner than
those results suggest. My father typed it on an IBM Selectric with two type
elements, a regular monospace face and an italic one, so the pages carry true
italics rather than the usual typewriter improvisations; underlining he
reserved for the sigla, and there are corrections in pen, in the hands of
the thesis's first readers. What defeats
OCR is the combination: type that is faint in places, formatting that carries
meaning (an underline is a siglum, a run of capitals is a name), handwritten
interventions, and long stretches of Old Occitan, a language OCR training
data has no particular reason to know. And even a correct OCR reading of a
siglum would only produce two grey letters. The apparatus stays dead either
way.

<figure class="fig">
<img src="/raimbaut/images/fig2.jpg" alt="A typewritten page fragment in French with true italic type, a word corrected by hand in ink, and an underlined abbreviation." loading="lazy">
<figcaption><span class="fig-n">Figure 2</span> The raw material: an IBM Selectric typescript, cleaner than its forty-five years suggest and still beyond conventional OCR. The italic is real (a second type element), the underline marks a siglum, and the correction is in the hand of one of the thesis's first readers. <span class="provenance">Scan of p. 78.</span></figcaption>
</figure>

The third reason is editorial rather than technical: the thesis's structure
is better than the form paper forced on it. Each chanson's commentary
discusses the poem verse by verse, but the poem itself sits pages away, after
the commentary, and the translations, notes, sigla, bibliography and indexes
are all satellites of the poems, serialized into a single line of pages
because a book has no other option. A digital edition can put the poem back
in the middle and let the apparatus orbit it. That restructuring, more than
the transcription, is what makes the result an edition rather than a copy. At
the same time it should be said plainly that this is no new critical edition:
every reading, every translation, every judgement in it is my father's, from
1981, and is presented as such. What I built is best described as the
scholarly reactivation of a hidden public work — the thesis, made
encounterable, with its apparatus functioning again.

The rest of this piece walks through how, in order: [where exactly the AI
models entered and what each one did](/raimbaut/ai/); [the pipeline from
scans to website](/raimbaut/pipeline/); [the editorial work of normalization
and honest uncertainty](/raimbaut/editorial/); [the information
architecture that puts the poem at the hub](/raimbaut/architecture/); [the
technical build](/raimbaut/architecture/#the-build-in-accessible-terms); and
[what all this does and does not prove](/raimbaut/lessons/) about reviving
the rest of that very large class.
