---
title: "A few days later"
heading: "A few days later"
navLabel: "PS"
nn: ""
section: 7
status: draft
---

# A few days later

The previous section ended with two loose ends — series pages, and "decide
what to do about rereads" — and an accounting of the process. It has been two days, and the accounting needs redoing.

## The flood

The WordPress site was "on and off", but of course the off years didn't stop me reading, they only stopped me *logging*. Or, actually: they stopped me logging *there*. The
books went to Goodreads instead, or got a review on my other weblog, or
nowhere at all. As long as adding a book meant dealing with that WordPress install, none of it was
ever coming back.

Weellll... it *kind of* came back in two days. A Goodreads export, compared against the
catalogue, turned up some **340** dated reads that had simply never made it
onto the site; a small interactive importer (look at the metadata, pick a
cover from candidates keyed to the actual ISBN, next) walked through the
lot. Then the series gaps — books I demonstrably read because I read the
sequel — another 43. Then recent audiobooks from my Audible account: 29, of which 9 turned out to be
rereads of things already on the site.

Net result: **416** new book pages. The catalogue went from 935 posts to
**1,351**. 

## The reviews that lived next door

The backfilled books mostly arrived without reviews — but a lot of the
reviews existed, on my personal weblog, which for years cheerfully carried
"Gelezen: …" posts that (almost) never got cross-posted to the booklog. Same story as
the authors: a content-based matcher, strict auto-apply for the beyond-doubt
cases, and a side-by-side decision screen for the rest — blog version,
booklog version, or a mix, one keypress each. Around a hundred and thirty
reviews recovered, plus 41 images restored to posts that had been quietly
serving broken links since who knows when.

## Rereads: decided

Every read stays its own post — own date, own rating, own review — and a
later read carries a `rereadOf` pointing at the first one. Explicitly
linked, not matched by title, because I own two different books called
*Nemesis* and one book with two different titles. Detail pages cross-link
the readings ("Herlezen op …"); series pages collapse the reads of one book
into a single tile that lists every date (and has fun overlapping covers, and yes, I know those aren't ideal on mobile). That also means the series pages
got their promised attention, so both loose ends are tied off.

## And a stats page

Because of course there is a stats page now: books per year, categories,
page-count histograms, languages — computed at build time, drawn as static
SVG, no database, no API, nothing to hack. I'll get back to this later, I pretty sure, because it really is *too* basic right now. 

The moral of the strangler fig was *parity first, improvement second*. What
the fig doesn't tell you is what happens after: once the thing is pleasant
to touch, you touch it. Twenty-odd years of deferred logging cleared in two
days — not because two days is what it takes, but because it was never
about the time.

(Reading continued throughout, I should note. *[Victorian Psycho](https://boeken.tsuk.org/2026/07/victorian-psycho/)* advanced
sixty-five pages while all this was going on. Priorities intact.)
