---
title: "The pipeline: scans to site"
navLabel: "Pipeline"
section: 3
status: draft
---

# The pipeline: scans to site

[The previous section](/raimbaut/ai/#one-time-exploratory-and-honestly-so)
ended with a division that organizes everything in this
one. The transcription happened once and created the corpus; from the corpus
onward, every artifact of the edition is generated, and generated in a way
that is deliberately boring. This section walks the whole path, from PDF to
published page. Readers who want commands, file formats and data shapes will
find them in [Annex A](/raimbaut/annexes/a/); the aim here is the shape of the thing and the
reasoning behind it.

<figure class="fig fig-diagram">
<img class="svg-adapt" src="/raimbaut/images/fig4.svg" alt="Flow diagram from PDF scans through transcription, a Markdown corpus, derived JSON data files and a static-site generator to a deployed website.">
<figcaption><span class="fig-n">Figure 4</span> The pipeline. Everything above the corpus ran once; everything below it is deterministic and can be regenerated at any time. <span class="provenance">Drawn for this piece; the authoritative prose version is <a href="https://github.com/mvuijlst/raimbaut/blob/main/WORKFLOW.md"><code>WORKFLOW.md</code></a> in the repository.</span></figcaption>
</figure>

## A spine of page ids

Before any content work, every page got a permanent identity. The scanned
volumes are three PDFs; each page of volumes 1 and 2 receives an id of the
form `v1p051` (volume 1, 51st page image), assigned simply by PDF page order.
That id never changes, and it threads through the entire system: the corpus
file is named after it, the printed-page-number table is keyed on it, every
footnote is namespaced by it, and the anchors in the published HTML carry it.
When I write *provenance* in this piece, this is the concrete thing I mean:
the ability to take any sentence on the website and follow it back, through
the data files, to a specific page image of a specific scanned volume.

The page id also solves a problem that sounds trivial and is not. The
typescript's own printed page numbers restart, skip, and occasionally
misprint; my father's cross-references cite those printed numbers, and so
will anyone citing the thesis on paper. So the edition keeps both notions of
"page" and maps between them: physical scan order (the page id) and printed
number (read off each page by GPT-4o-mini, [as described
previously](/raimbaut/ai/#gpt-4o-mini-one-narrow-boring-job)). The map lives
in one small CSV, and the site can resolve a citation
like "p. 46" to the right place because of it.

## The corpus and its normalization

The corpus is 586 Markdown files, one per typescript page, and it is the
single source of truth for the edition's text. Everything else in this
section is derived from it and can be deleted and rebuilt without loss.
Getting it into shape after transcription took one dedicated script and a set
of editorial rules that [the next section describes
properly](/raimbaut/editorial/#from-typewriter-conventions-to-typographic-ones);
the pipeline fact worth stating here is that the normalization script rewrites the corpus
*in place* and is idempotent, meaning that running it a second time changes
nothing. Corrections found during checking are made directly in these files.
The corpus is, in the old sense, the manuscript.

## Eight small scripts, seven data files

From the corpus, a chain of eight Python scripts derives everything the site
needs. They run in a fixed order, because later scripts read the output of
earlier ones:

1. **[`build_manifest.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_manifest.py)** establishes the reading order: which pages exist,
   in which volume, with which printed number.
2. **[`assemble_book.py`](https://github.com/mvuijlst/raimbaut/blob/main/assemble_book.py)** joins the 586 pages into one continuous document,
   `book.md`. This is where per-page mechanics get healed: footnote labels
   are namespaced by page id so that each page's "note 1" stays distinct;
   footnotes that overflow onto the next typescript page are reunited with
   their beginnings; words hyphenated across a page break are joined back
   together, with a log of every such repair.
3. **[`build_bibliography.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_bibliography.py)** extracts the thesis's real bibliography
   (volume 2, printed pages 470–554) into structured data: general works,
   works on Raimbaut, and per-chanson lists of manuscripts, editions and
   studies.
4. **[`build_catalogue.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_catalogue.py)** produces the catalogue of the thirty-nine
   chansons, each with its incipit and its page ranges.
5. **[`build_citations.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_citations.py)** harvests the sigla: the thesis defines its
   abbreviations inline, in phrases like "(ci-après *SW*)", and this script
   collects the definitions, links them to bibliography entries, and records
   every place each siglum is used.
6. **[`build_references.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_references.py)** resolves the internal references: every
   *op. cit.*, *ibid.*, *art. cité* is traced to the work it points at, with
   a confidence grade attached to each resolution.
7. **[`build_footnote_norm.py`](https://github.com/mvuijlst/raimbaut/blob/main/build_footnote_norm.py)** prepares, for the reading views only, a
   per-note list of textual replacements that make footnotes self-contained
   ([the next section explains why](/raimbaut/editorial/#the-footnotes)); the book view is exempt and keeps the
   printed wording.
8. **[`normalize_typography.py`](https://github.com/mvuijlst/raimbaut/blob/main/normalize_typography.py)** is the in-place corpus normalizer already
   mentioned, run whenever a corpus page has been hand-edited.

The output is seven JSON files (a manifest, the assembled book, bibliography,
chanson catalogue, sigla, references, footnote normalizations) plus [review
reports I will come back to](/raimbaut/editorial/#the-review-reports). Two properties of these
scripts carry most of the project's maintainability, and both were chosen on
purpose.

First, they are **deterministic**: the same corpus in, the same JSON out,
every time, with no network calls and no models involved. Generative AI has
no role anywhere in this stage, which means a rebuild can never quietly
change the edition's text. Second, they are **stdlib-only**, importing
nothing beyond the Python standard library. There is no dependency list to
rot, no virtual environment to reconstruct in five years; any Python
installed on any machine runs the whole chain. I had a small taste of the
alternative during the project itself, when the vision stage's virtual
environment, which does need third-party packages, briefly broke because
the Python that had created it was gone. It was quickly rebuilt and works
again, but the stages that must survive were built so the question cannot
come up.

## One tool to run it

Nobody remembers an eight-script dependency order, so the repository has a
single entry point: [`manage.py`](https://github.com/mvuijlst/raimbaut/blob/main/manage.py), a small menu-driven console tool, itself
also stdlib-only. It knows which script reads which files, compares
modification times, and shows a dashboard of what is stale. After editing one
corpus page, "rebuild stale" runs the normalizer, then exactly the scripts
whose inputs changed, in the correct order, and nothing else; other menu
choices build the site, serve it locally, or deploy. The same reasoning is
written out as a table in [`WORKFLOW.md`](https://github.com/mvuijlst/raimbaut/blob/main/WORKFLOW.md) ("you changed X, re-run Y"), so the
knowledge exists in prose as well as in code.

<figure class="fig">
<img src="/raimbaut/images/fig5.png" alt="A console dashboard listing pipeline stages such as manifest, book and bibliography, each marked fresh or stale." loading="lazy">
<figcaption><span class="fig-n">Figure 5</span> <code>manage.py</code>, the pipeline's single entry point. It compares file modification times across the dependency graph and rebuilds only what an edit actually made stale. <span class="provenance">Screenshot of <code>manage.py</code> running in the repository.</span></figcaption>
</figure>

## Eleventy, and the shape of the site build

The website itself is generated by [Eleventy](https://www.11ty.dev/), a
static-site generator: a program that runs once, at build time, and emits
plain HTML files. One data module reads `book.md` and the seven JSON files
and assembles them into the structures the page templates consume; the
templates then produce a page per chanson, per introduction chapter, per
essay chapter, plus the bibliography, the manuscripts table, the indexes and
the colophon. The rendering logic that makes the apparatus work — footnote
normalization gates, siglum hovercards, reference links, concordance
building — lives in a handful of JavaScript modules that run at build time,
not in the browser. What ships to the reader is HTML and CSS; the JavaScript
that does ship is comfort only (the view toggle, note synchronization,
keyboard shortcuts), and the text remains fully readable with it switched
off. [The architecture section](/raimbaut/architecture/#the-build-in-accessible-terms) returns to why this matters for a work that
should outlive its toolchain.

Deployment is [one PowerShell script](https://github.com/mvuijlst/raimbaut/blob/main/deploy.ps1): build the site, pack it into a tarball,
copy it to the server over SSH, unpack. A static site makes this the whole
story; there is no application server, no database migration, nothing to
restart. The one lesson learned the hard way and encoded in a comment is
that binary files must travel inside a tarball, because piping raw bytes
through the PowerShell pipeline corrupts fonts and images.

## What the pipeline adds up to

The design can be stated as one rule. **Between the scans and the corpus,
judgement; between the corpus and the site, none.** Every place where a
human or a model exercised discretion (how to read a faint word, how to
normalize a dash, whether a reference resolves) either happened before the
corpus was frozen or is recorded *in* the corpus and the hand-authored data
files where it can be seen and revised. Everything after that point is
mechanical, and its mechanicalness is what makes the edition correctable: a
fix is one edit to one Markdown file, followed by a rebuild that cannot
introduce surprises of its own.
