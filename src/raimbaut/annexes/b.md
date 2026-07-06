---
title: "Annex B — Data shapes"
heading: "Annex B"
navLabel: "Annex B"
nn: ""
section: 8
status: draft
---

# Annex B — Data shapes

One real, lightly trimmed record from each artifact, because a data shape
is easier shown than described. Every example below is quoted from the
repository as of July 2026; [Annex A](/raimbaut/annexes/a/) has the
commands that produce each file.

## The corpus (`corpus/v1p051.md`)

One Markdown file per typescript page, opening with its page anchor. Verse
sits in fenced divs that carry the language; nothing else marks it, so the
line structure survives every later processing stage untouched:

```markdown
<!-- page: v1p051 -->

[CHANSON I]{.underline} : TEXTE ET TRADUCTION

::: {.verse lang=oc}
Cars, douz e fenhz  del bederesc
m'es sos bas chanz,  vas cui m'azerc;
c'ap joi s'espan,  viu e noire,
...
:::
```

## Provenance tables (CSV)

`page_numbers.csv` maps page ids to printed numbers (`v1p050,45`).
`corpus-v2-sources.csv` records which model transcribed each page:

```csv
pageid,provenance
v1p000,gpt-4o
...
```

Totals: 499 × `gpt-4o`, 87 × `claude`.

## `manifest.json` — reading order

```json
{ "order": 50, "pageid": "v1p050", "vol": 1, "idx": 50,
  "printed": "45", "file": "corpus/v1p050.md", "kind": "body" }
```

## `chansons.json` — the catalogue (39 records)

```json
{ "num": 1, "roman": "I", "incipit": "Cars, douz e fenhz  del bederesc",
  "remarques": { "pages": ["v1p038", "…", "v1p050"],
                 "printed_range": ["33", "45"] },
  "texte":     { "pages": ["v1p051", "v1p052"], … } }
```

## `bibliography.json` — the real vol. 2 bibliography (printed pp. 470–554)

A `sections` tree mirrors the thesis's own hierarchy (I. Généralités → A.
Études littéraires générales, …). Entries keep the full printed text plus
extracted fields:

```json
{ "author": "AUERBACH",
  "title": "Mimésis — la représentation de la réalité dans la littérature occidentale",
  "siglum": "",
  "text": "AUERBACH, Erich, *Mimésis — la représentation de la réalité…*" }
```

`par_chanson` holds, per chanson, the manuscript sigla lines and the
editions and studies lists:

```json
{ "raw": "RvO,86",
  "cite": "APPEL, Carl, *Raïmbaut von Orange*, Berlin, Weidmannsche
           Buchhandlung, 1928, …, p. 86" }
```

## `citations.json` — the sigla (24)

The [editorial section on sigla](/raimbaut/editorial/#the-sigla) explains
how these are harvested and overridden.

```json
{ "siglum": "ALF",
  "definition": "GILLIERON, Atlas linguistique de la France",
  "defined_on_page": null,
  "source": "bibliography",
  "bibliography": { "section": "general", "author": "GILLIERON",
                    "title": "Atlas linguistique de la France", "page": 475 } }
```

Plus `manuscript_sigla`, a `usage` list of every occurrence, and an
`unresolved` list (currently one entry) for what resisted.

## `references.json` — the op. cit. resolutions

Confidence grades and the resolution method are discussed in [the internal
references section](/raimbaut/editorial/#the-internal-references).

```json
"stats": { "resolved": 473, "unresolved": 4, "high_conf": 126,
           "medium_conf": 347, "low_conf": 0, "via_bibliography": 9 }
```

```json
{ "page": "v1p006", "note": "3", "kind": "bare", "phrase": "ibid.",
  "target": { "author": "BRUYNE", "title": "Etudes d'esthétique médiévales", … },
  "confidence": "medium" }
```

## `footnote-normalization.json` — reading-view rewrites

Keyed by `pageid|note`; consumed only by the reading views (the file's own
`_note` field says so: "Consumed by
[site/lib/render.js](https://github.com/mvuijlst/raimbaut/blob/main/site/lib/render.js)
applyFootnoteNorm() in reading views only"). The facsimile never sees it.

```json
"v1p006|3": { "backrefs": [
  { "idx": 0, "from": "ibid.", "kind": "short-ibid",
    "to": "BRUYNE, *Etudes d'esthétique médiévales*", "conf": "medium" } ] }
```

## `book.md` — the assembled edition

The 586 corpus pages joined into one document, with page anchors preserved,
footnotes namespaced by page id, overflowed notes reunited, and cross-page
hyphenations healed (each repair logged to a CSV). This file plus the JSONs
above is everything the site build consumes.
