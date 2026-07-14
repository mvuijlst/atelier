---
title: "Architecture"
navLabel: "Architecture"
section: 2
status: draft
---

# Architecture

## Application and content structure

Echoes is a Django 5.2 project with Wagtail 7.3 as the CMS, running on
SQLite, served by Gunicorn behind nginx. It has three main parts:

- **`news`** — the content models. `ArticlePage` is a Wagtail page type
  carrying the article fields (subtitle, publication, dates, location,
  byline, body, featured image) plus internal editorial fields. `ArticleIndexPage`
  is the front page and archive. `HistoricalEvent` is a plain Django model
  holding real historical events scraped from Wikipedia. A custom Wagtail
  image model adds a description field, which stores the prompt an image was
  generated from.
- **`api`** — a Django REST Framework layer: `POST /api/articles` creates and
  publishes an article, `POST /api/media` uploads an image,
  `GET /api/markers` feeds the map, plus read endpoints, health checks, and
  an OpenAPI schema served at `/openapi.json` with Swagger and Redoc-style
  documentation pages. Write operations require a bearer token.
- **The generator** — a standalone Python script (`_generate_article.py`,
  with a companion variety module) that runs outside the web application
  entirely. A daily cron job has it read the `HistoricalEvent` table, talk to OpenAI's API for
  text and images, and deliver the finished article to the site through the
  same public REST API any other client would use. The web application never
  calls a language model; the generator never touches Wagtail's internals.

The article body is a Wagtail StreamField: a typed sequence of blocks
(heading, paragraph, callout, quote, image, aside, lists, horizontal rule),
each with its own template. The generator produces the body as a JSON list of
exactly those block types, so what arrives over the API maps one-to-one onto
what an editor sees in the admin. Images referenced by URL in the payload are
resolved to Wagtail image objects on save. An `assets` JSON field keeps a
flat list of every image used, with alt text, caption, credit, and the
generation prompt.

The raw material is a table of 37,528 historical events (at the time of
writing), scraped from the day-of-year pages of English and French Wikipedia
— the pages like "12 July" that list what happened on that date across the
centuries. The scraper parses years (including BC dates, stored as
astronomical years), keeps the one-line event summaries, and records which
language edition each came from, because that later decides the language of
the article. A `used` flag ensures no event generates two articles. A Dutch
configuration exists in the scraper but has not been run.

## Wagtail as the editorial layer

Wagtail's role is deliberately conventional: it is the publishing system, not
part of the generation loop. The generator does not know Wagtail exists — it
posts JSON to an API. On the Wagtail side, the API serializer builds a proper
`ArticlePage` under the index page, sanitises any HTML with nh3, resolves
image references, and publishes.

Publication is immediate. `POST /api/articles` ends with a save-revision-and-
publish; there is no draft stage and no human approval gate in the daily
flow. Editorial control is retrospective: every part of an article — the
StreamField body block by block, the images, the metadata, the map location —
can be opened and edited in the Wagtail admin after the fact, using the same
Draftail and StreamField editing any hand-written page would use. The admin
also shows the fields readers never see: the original event, the departure
point, and an `ai_context` field that records the generation assignment
(genre, hook, register) and flags any degraded runs where a fallback model
had to be used.

As a general rule, I don't intervene once the article has been published. 

The map location gets its own treatment: articles carry latitude and
longitude for the branching event, synced both ways with a Google Maps
geocoding widget in the admin, so a generated coordinate pair can be checked
and corrected by dragging a pin.
