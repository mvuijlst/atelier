---
title: "Built in a Day: The Complete Story of Boeggn, the Booklog's Mobile Companion App"
heading: "Built in a day"
navLabel: "Introduction"
section: 1
status: draft
---

# Built in a day

*Rome wasn't built in a day. This app was.*

## Introduction

In today's fast-paced digital world, we expect to manage everything from our
phones — our photos, our finances, our front doors. Everything, that is,
except a twenty-four-year-old Dutch booklog running as a static Hugo site.
Until now.

On 9 July 2026 — two days after the booklog's dramatic rescue from a hosting
placeholder, a story this site has already told in [Your website is almost
here!](/boeggn/) — a proposal was written for a small, mobile-first companion
app. By the end of that same day, the app had been designed, built through
four phases, deployed to production, and refined through three rounds of
real-world feedback. It has a name: **boeggn**. It has a home:
[boeggn.yusupov.cloud](https://boeggn.yusupov.cloud). And it has a mission:
to make managing a booklog from a phone not just possible, but delightful.

This wasn't just a productivity tool. It was a test of a philosophy — the
idea that a static site doesn't need to become dynamic to become manageable.
In this multi-part deep dive, we'll explore every layer of that journey: the
architecture, the build, the AI, the polish, and the lessons. Whether you're
a developer, a booklover, or simply someone who has ever sighed at their own
content workflow, this story has something for you.

Let's get started.

> **[Figure 1]** *Hero illustration.* Generate a wide (16:9) flat-design
> illustration in a modern isometric style, dark slate background, teal
> (#0F8B8D) dominant accent with warm amber highlights. Subject: a hand
> holding a smartphone whose screen shows a tidy shelf of small colourful
> book covers; from the phone, a glowing dotted line arcs across the scene
> through a stylized git branch symbol (two dots merging into one line) and
> lands on a cozy bookshelf website on a laptop in the distance. No clouds,
> no gears, no robots. Absolutely no legible text. Mood: effortless,
> connected, calm. Suggested caption: "From pocket to published: the booklog
> finally fits in a hand."

## The Problem: A Site You Can Only Feed from a Desk

Here's the thing about static sites: they are wonderful to serve and
wonderful to own, but every change is, by definition, a file edit. After the
migration, adding a book or updating reading progress meant a laptop, a git
repository, and a working session. The verdict from daily use was as honest
as it was concise: managing the content by hand "is not the best experience."

The brief that followed was refreshingly clear. It asked for a lean,
mobile-first web app with a standard login and exactly three tasks —
no more, no less:

1. **Add to read.** One free-form textarea. Type anything — an author and a
   title, a pasted blurb, an ISBN — and let AI propose one or more complete
   book entries, every field editable, checked against the site's existing
   authors, categories, tags and series before anything is accepted.
2. **Update reading.** A list of the books currently being read. Tap one,
   enter how far along you are — hours and minutes for an audiobook, pages or
   a percentage for print — and submit.
3. **Edit content.** Search across all books, open one, edit everything —
   metadata, rating, status, review text — and publish.

And one hard constraint, stated in no uncertain terms: do **not** make the
site dynamic. The site stays a static Hugo build. The app must consume the
site's data and publish through the site's existing pipeline. The site's
architecture was the prize of the migration, and no convenience feature was
going to be allowed to erode it.

> **[Figure 2]** *The three flows.* Generate a wide (16:9) flat-design
> infographic: three rounded vertical cards side by side on a dark slate
> background, each with a simple line icon at the top, a title, and one short
> line below. Card 1: a plus-sign-on-a-book icon, title "Toevoegen", line
> "free text in, AI-proposed entries out". Card 2: a progress-gauge icon,
> title "Voortgang", line "pages or hours, one tap away". Card 3: a
> pencil-on-a-card icon, title "Bewerken", line "search, edit, publish".
> Teal (#0F8B8D) icons, white titles, grey body text, thin amber divider
> under each title. Use exactly these strings; no other text. Suggested
> caption: "Three tasks. Three screens. Nothing else."

## The Answer in One Sentence

The solution is so simple it fits in a single sentence: **the app is a git
client with forms.**

That sentence is doing a lot of heavy lifting, and unpacking it is the
subject of [the next section](/boeggn-app/architecture/). From there, we
follow [the build itself — four phases in one day](/boeggn-app/build/), take
a closer look at [the AI intake flow](/boeggn-app/ai/), tour [the polish
that makes it feel like an app](/boeggn-app/polish/), and close with [the
lessons learned along the way](/boeggn-app/lessons/).

One number before we dive deeper, because it frames everything that
follows: the amount of book content stored in the app's database is
**zero**. Not a cache. Not a copy. Zero. The stack is Django 5 with HTMX and
plain mobile-first CSS, and its SQLite database holds authentication and
sessions — nothing else. The roughly nine hundred Markdown files in the
site's git repository remain the single source of truth, exactly as they
were the day before the app existed.

That is not a limitation. That is the entire point.
