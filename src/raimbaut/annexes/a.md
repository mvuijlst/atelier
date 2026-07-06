---
title: "Annex A — Pipeline reference"
heading: "Annex A"
navLabel: "Annex A"
nn: ""
section: 7
status: draft
---

# Annex A — Pipeline reference

This annex is the terse version of [the pipeline
section](/raimbaut/pipeline/) and the technical half of [the architecture
section](/raimbaut/architecture/#the-build-in-accessible-terms), for anyone building the
same way. The living original is
[`WORKFLOW.md`](https://github.com/mvuijlst/raimbaut/blob/main/WORKFLOW.md)
in the repository; if the two ever disagree, trust the repository.

## Sources

Three library-digitized PDFs at the repo root, git-ignored on purpose (the
scans stay private provenance):

| File | Volume | Role |
|---|---|---|
| `910001066311_…AC.pdf` | 1 | Introduction + chansons (298 pages, `v1p000…`) |
| `910001066313_…AC.pdf` | 2 | Chansons cont., bibliography, indexes (288 pages, `v2p000…`) |
| `910001066314_…AC.pdf` | 3 | Annex (manuscript photocopies) — excluded |

Stable page id: `v{vol}p{idx}` by PDF page order, zero-padded (`v1p051`).
Printed page numbers are separate metadata (`page_numbers.csv`).

## Stage 1 — vision

One-time; needs `OPENAI_API_KEY` in `.env` and a venv with `pymupdf openai pillow python-dotenv`.

```
python transcribe.py                  # all vol1+vol2 pages → per-page Markdown
python ocr_page_numbers.py            # printed numbers → page_numbers.csv (gpt-4o-mini)
python merge_corpus_v2.py             # gpt-4o base + Claude verse overlay → corpus
```

Ran once, in July 2026; per-page model provenance in
`corpus-v2-sources.csv` (499 pages gpt-4o, 87 Claude). See [Annex
C](/raimbaut/annexes/c/) for the prompt and parameters.

## Stage 2 — normalization

```
python normalize_typography.py        # rewrites corpus/*.md in place, idempotent
```

Run after any manual corpus edit. Rules: reflow prose (verse divs and page
anchors untouched), collapse multiple spaces, spaced hyphen → spaced em dash
(not between capitals), narrow no-break space before `; : ! ?` and inside
« », stacked `+` → ⁂.

## Stage 3 — derived data

(stdlib-only, deterministic; run in this order)

| # | Command | Reads | Writes |
|---|---|---|---|
| 1 | `python build_manifest.py` | corpus, `page_numbers.csv` | `manifest.json` |
| 2 | `python assemble_book.py` | corpus, manifest | `book.md` (+ hyphen-repair log, footnote issues) |
| 3 | `python build_bibliography.py` | corpus, manifest | `bibliography.json` |
| 4 | `python build_catalogue.py` | corpus, manifest | `chansons.json` |
| 5 | `python build_citations.py` | corpus, manifest, bibliography, `sigla-overrides.json` | `citations.json` |
| 6 | `python build_references.py` | corpus, manifest, citations, bibliography | `references.json` |
| 7 | `python build_footnote_norm.py` | book, references, bibliography, citations | `footnote-normalization.json` |

[Review reports](/raimbaut/editorial/#the-review-reports) (`*-flags.md`) are regenerated alongside; they are build
outputs, not committed artifacts. Hand-authored and never regenerated:
`manuscripts.json`, `sigla-overrides.json`, the manuscript photos. Data
shapes for all seven JSONs are in [Annex B](/raimbaut/annexes/b/).

Or let the tool compute the order and staleness:

```
python manage.py            # interactive dashboard
python manage.py stale      # rebuild exactly what an edit made stale
python manage.py publish    # rebuild stale → site build → deploy
```

## Stage 4 — site

Eleventy 3 (ESM, Node ≥ 18) in `site/`; `markdown-it` +
`markdown-it-attrs` + `markdown-it-bracketed-spans`.
`site/src/_data/edition.js` reads `book.md` + the seven JSONs;
`site/lib/*.js` does the apparatus rendering at build time.

```
cd site && npm install && npm run build     # → site/_site/
npm run serve                               # local dev server
```

## Stage 5 — deploy

```
.\deploy.ps1
```

Builds, packs `_site/` into a tarball, ships it over `scp`, extracts on the
server. Tarball because piping raw binaries through the PowerShell pipeline
corrupts fonts and images.
