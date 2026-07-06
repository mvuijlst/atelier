---
title: "Annex C — The vision stage"
heading: "Annex C"
navLabel: "Annex C"
nn: ""
section: 9
status: draft
---

# Annex C — The vision stage

The transcription stage ran once, in July 2026, and its scripts were
deleted after the corpus was finalized, then restored from the repository's
history while this piece was being written. The artifacts that document the
stage are:
[`transcribe.py`](https://github.com/mvuijlst/raimbaut/blob/main/transcribe.py)
(the transcription script, both backends),
[`merge_corpus_v2.py`](https://github.com/mvuijlst/raimbaut/blob/main/merge_corpus_v2.py)
(the merge that built the hybrid corpus),
[`corpus-v2-sources.csv`](https://github.com/mvuijlst/raimbaut/blob/main/corpus-v2-sources.csv)
(per-page model provenance),
[`review-diff.md`](https://github.com/mvuijlst/raimbaut/blob/main/review-diff.md) (the
A/B comparison),
[`occitan_pages.txt`](https://github.com/mvuijlst/raimbaut/blob/main/occitan_pages.txt)
(the first attempt's verse-page list),
and `transcribe-v2.log` (the console log of the final run, git-ignored).

## Parameters

Pages are rendered from the PDFs with PyMuPDF at 300 DPI, grayscale, and
sent as PNG with the long side capped at 3400 pixels — near-full
resolution, because the faint Occitan diacritics need the detail. Calls run
at temperature 0 with a 4096-token cap (a single page never legitimately
exceeds it; the cap kills runaways), six pages in parallel, with per-page
failure isolation and a `--skip-existing` flag so a batch can resume after
failures.

One script serves two backends behind the same prompt and image
preparation: an OpenAI backend (`gpt-4o`, the base transcription of all
pages) and an Anthropic backend (its configuration names
`claude-sonnet-5`). The Anthropic backend was never used, for the least
principled reason in this annex: I did not want to pay separately for API
access when the verse pages were a volume that a Claude Code session,
already paid for, could comfortably handle. So the verse overlay was
produced by Claude in session, through Claude Code, exactly as the
script's own header records.

## The prompt

The system prompt is quoted verbatim below, because it is the single
artifact readers of a piece like this most often ask for and least often
get. Two things are worth noticing before reading it. First, most of its
rules are editorial decisions in disguise: healing soft hyphens, preserving
letter-case of names exactly, the `[[hand: …]]` convention that became the
edition's ✎ mark, and the `[guess]{.unclear}` convention that became the
wavy underline (both described in [the marks on the reading
surface](/raimbaut/editorial/#marks-on-the-reading-surface)). The prompt is
where the editorial policy [described in the editorial
section](/raimbaut/editorial/) first touched the text. Second, honesty
compels me to point out that it
says "1982" — the wrong defense year, which also sat in the repository's
documentation until this piece got it corrected to 1981. Errors travel in
packs.

```text
You transcribe scanned pages of a 1982 PhD thesis (IBM Selectric
typescript) about the chansonnier of the troubadour Raimbaut d'Orange. The main
language is French, with quotations in Occitan (Old Provençal), German, English,
Latin and Italian. You output GitHub/Pandoc-flavored Markdown ONLY -- no code
fences around the whole answer, no commentary before or after.

Goal: a READABLE MODERN EDITION. Follow these rules exactly:

1. Reading order, top to bottom. Do NOT transcribe the printed page number in
   the corner (it is recorded separately).
0. NEVER emit runs of spaces, tabs, &nbsp; or &emsp; to visually align text, and
   never attempt to line up columns. Alignment is the renderer's job, not yours.
2. HEAL soft hyphenation: when a word is split across a line-break by a hyphen
   (e.g. "sédui-" / "sante"), rejoin it ("séduisante"). Keep genuine hyphens
   (e.g. "poète-amant", "Saint-Didier").
3. Italics -> *italic*. The Selectric italic face is used for Occitan/foreign
   quotations and for cited work titles; mark all of it.
4. Footnotes: a superscript reference number in the text -> [^N]. Transcribe the
   footnote body (below the horizontal rule) as [^N]: ... at the END of the
   output, in order. Do not emit the rule itself.
5. Other superscripts (not footnote refs): use Pandoc carets --
   folio "f°36v" -> f°36^v^ ; "XIIe siècle" -> XII^e^ siècle ; exponents in
   metrical schemes like a^1^a^2^.
6. Mark the language of every non-French passage:
   - inline: [quoted words]{lang=oc}   (codes: oc, de, en, la, it)
   - a whole block/quotation of foreign text: wrap in a fenced div
     ::: {lang=oc}
     ...
     :::
   French body text needs no marker.
7. Verse. Occitan verse strophes (the italic edited text) MUST be wrapped in a
   fenced verse div -- do NOT render them as loose italic lines. Do not italicize
   inside the div; the div already marks it as Occitan. One verse line per output
   line, preserving leading line numbers. Example:
   ::: {.verse lang=oc}
   25. Gran esforz fait Dieus, qar sofer
   c'ab si no la'npueja baisan!
   :::
   Prose translations that follow are normal paragraphs (not verse). NEVER drop a
   strophe/section marker ("IV.", "V.", "VI.") or a line number -- transcribe
   every one you see.
8. Underlined text (bibliographic sigla like Archiv, MG, RO, P.-C.) ->
   [Archiv]{.underline}.
8b. Rhyme/metrical schemes (e.g. rhyme letters over syllable counts) are NOT a
    table to align: put the rhyme letters on one line and the syllable counts on
    the next, single-spaced, e.g.
    - 853,1 : a b c d e a
      8 8 8 7'8 8
8c. Preserve the letter-case of proper names and sigla EXACTLY as printed. Author
    surnames set in full capitals (WETTSTEIN, BLOMME, CROPP) stay in capitals; do
    not normalize them to title case.
9. Editorial square brackets that the author printed in the text (e.g.
   [vous en auriez], [-bas]) are meaningful -- keep them as literal square
   brackets in the text.
10. Handwritten additions/corrections: apply the correction into the text, then
    append a marker [[hand: what was added/changed]] immediately after it. A
    hand-drawn diacritic that merely completes a letter should be applied
    silently (no marker).
11. If you genuinely cannot read a word, transcribe your best guess as
    [guess]{.unclear}.

Return only the Markdown.
```

The per-page user message is one line: "Transcribe this page. It is
logical page: {label}."

## The A/B comparison and the merge

During the first attempt, the verse pages were transcribed by both models
and machine-diffed. The report (`review-diff.md`) covers 43 pages and 997
differing hunks, ordered most-divergent first, each hunk giving both
readings side by side; [the models section](/raimbaut/ai/#claude-the-verse-after-a-controlled-comparison)
quotes the Chanson I examples. On the
strength of that comparison, the corpus was assembled as a hybrid:
`merge_corpus_v2.py` copies the GPT-4o transcription of every page and
overlays Claude's transcription wherever one exists, writing the per-page
provenance record as it goes. Final tally, from that record: 499 pages
GPT-4o, 87 pages Claude, 586 in all.
