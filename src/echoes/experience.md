---
title: "Experience"
navLabel: "Experience"
section: 4
status: draft
---

# Experience

## User experience

The public site is laid out as a newspaper front page: a lead story with hero
image, two card stories, a grid of shorter items, then two sections that cut
across the archive — "Where & When", a Leaflet map teaser sampling four
located articles (re-sampled hourly, so the front page rotates), and a
"Picture Desk", a justified image gallery whose row layout is computed with a
Knuth-style dynamic-programming line-breaker so every image keeps its exact
aspect ratio. A dedicated *Where/When?* page plots every article on a world
map above a zoomable canvas timeline of event dates. Articles are also
browsable by month of event date. Article pages open with a full-bleed hero
treatment when a featured image exists, and the whole site has a light and a
dark theme.

The making side is the Wagtail admin plus the API documentation pages
(Swagger and a Redoc-style view served from the OpenAPI schema). The daily
workflow normally involves no interface at all: the generator runs, the
article appears. The admin is where inspection and repair happen — reading
the `ai_context` field to see what assignment produced a piece, fixing a
caption, moving a map pin.

## Current limitations and open questions

The generated images remain the weakest layer: current image models
approximate period processes convincingly at a glance and unconvincingly on
inspection, and no automated step verifies an image against the article it
illustrates. The historical reasoning is only as good as the model's — the
proportionality rule constrains the shape of a timeline but cannot fact-check
it, and errors of period detail survive when the critic pass misses them.
The event pool currently covers English and French Wikipedia only, so the
articles alternate between two press cultures; the Dutch scraper
configuration and style exemplars are in place but unused. And the
anti-convergence machinery — banned motifs, recent-article digests, the
mechanical scanner — is reactive by construction: each entry on the banned
list is there because the tell had already appeared often enough to notice,
which suggests the list will keep growing.
