---
title: "Application structure"
navLabel: "Architecture"
section: 2
status: draft
---

# Application structure

Digest is a Django 5.2 project on SQLite, served by Gunicorn behind nginx.
There is one app, `recipes`, and no CMS: the Django admin is the editing
interface. The data model is built for structure rather than blobs of text —
a `Recipe` carries the prose fields, times, pairing, nutrition (JSON) and a
`generation_meta` JSON field holding provenance; ingredients are rows linked
to a canonical `IngredientName` (one entity per ingredient across the whole
site, with a hierarchical category tree) and a `Unit` with singular and
plural labels; instructions are ordered steps in optional titled groups.
Two further models close loops described below: `RecipeVote` (a signed-in
reader's thumbs up or down) and `RecipeImagePrompt` (the exact prompt and
composition of every generated photo).

Generation is not a separate service. It runs as Django management commands
in the same codebase, scheduled by cron on the server — one daily run of
`gen_recipe_from_nyt --save`, and every three days a scraper refresh. The
commands keep their working state in three JSON files: a pool of scraped
recipe inspirations, a ledger of already-used article and recipe URLs, and
the current state of the variety rotation. Text generation goes through
OpenAI's Responses API with JSON output; images through the Images API. The
text model comes from the environment (GPT-5 in my configuration; the code
falls back to gpt-4o-mini).
