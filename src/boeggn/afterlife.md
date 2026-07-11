---
title: "The afterlife: living with a static booklog"
heading: "The afterlife"
navLabel: "The afterlife"
section: 6
status: draft
---

# The afterlife

The real test of the rebuild is what the site is like to *keep*. 

## Adding a book

A book is now a Markdown file in a git repository. Adding one means telling
an agent something like *"gelezen: [title], 8/10"* and reviewing the diff:
the metadata gets looked up, the cover fetched and placed, missing author
and series pages created, the front matter written. A health linter runs
over the whole corpus and complains about missing covers, broken tags,
orphaned pages. Here is a real one, added the day I wrote this — an
audiobook, mid-read, which is why it has a `durationLeft`:

```yaml
---
title: "The Dungeon Anarchist's Cookbook"
series: ["Dungeon Crawler Carl"]
series_number: 3
publisher: "Soundbooth Theater"
year: 2021
duration: "16u 54m"
durationLeft: "15u 22m"
roles:
  dinniman-matt: "tekst"
  hays-jeff: "stem"
cover: "/wp-content/uploads/2026/07/the-dungeon-anarchists-cookbook.jpg"
status: "reading"
categories: ["audiobook", "fantasy"]
tags: ["litrpg"]
authors: ["dinniman-matt", "hays-jeff"]
---

Deel 3 van Dungeon Crawler Carl, als audiobook ingelezen door Jeff Hays.
```

That's the entire content management system. Note the cover path still says
`/wp-content/uploads/`: this is the old URL scheme, preserved for parity, now just
a naming convention for flat files. The ghost of WordPress! 

<figure class="fig">
<div class="fig-row">
<img src="/boeggn/images/fig12a.png" alt="Chat transcript: the one-line request 'Record that I've been listening to Reaper's Gale; 21h 14m left to go', the boeggn-add-book skill launching, and a first shell command checking for an existing post and the Malazan term pages." loading="lazy">
<img src="/boeggn/images/fig12b.png" alt="Chat transcript: the created reapers-gale.md with its full front matter as a 21-line diff, followed by the health linter and Hugo build both passing." loading="lazy">
<img src="/boeggn/images/fig12c.png" alt="Chat transcript: the report — the new entry summarized, the cover placed with a caveat about its size, no new term pages needed, linter clear, build clean, not committed or pushed." loading="lazy">
</div>
<img src="/boeggn/images/fig12d.jpg" style="margin-top: 0.9rem" alt="The Boeggn 'Aan het lezen' shelf: Reaper's Gale first at 52%, alongside The Odyssey, Ice, The Yiddish Policemen's Union and Victorian Psycho." loading="lazy">
<figcaption><span class="fig-n">Figure 13</span> Adding a book, as it actually looks: <em>(a)</em> the one-line request and the first sanity checks; <em>(b)</em> the entry it writes, linted and built; <em>(c)</em> the report — cover caveat included, nothing committed without my say-so; <em>(d)</em> a few minutes later, <em>Reaper's Gale</em> on the aan-het-lezen shelf, gauge at 52%.</figcaption>
</figure>

*Note that I have [changed my mind](/boeggn-app) since I wrote this. The mechanism of adding a book is still in place, but the interface is now its own (mobile) application.*

## The performance rabbit hole, for dessert

One story from a day after the initial effort, because it's the new site's whole character
in miniature. The cover-tint palette [from the redesign](/boeggn/redesign/)
needs the dominant colour of every cover, and the first implementation asked
Hugo to extract it from the image — on every cold build, for all ~900
covers. Builds crept past four minutes, which for a static site generator
chosen partly for being fast is embarrassing.

But a cover's dominant colour is a pure function of the image bytes; there
is no reason to ever compute it twice. So the extracted tints now live in a
little JSON file, 901 entries, checked into the repository, regenerated only
when covers change, and a full build dropped from four-plus minutes to
about **nine seconds**. Along the way, an audit of all 905 cover files
(880 JPEG, 21 PNG, 4 WEBP, every one of them accounted for and decodable)
made sure no cover can silently opt out of having a colour. This is what
maintenance looks like when you're not afraid of the codebase: a mild
annoyance, some thinking, a prompt to your friendly neighbourhood AI, a thirty-fold speedup, a one-paragraph note in
the decision log.

Prev/next arrows on a book page used to
walk straight off the edge of one shelf onto the next — from the oldest
*read* book to a *to-read* one, which is navigationally like stepping off
an escalator into a stockroom — so now they stay within the shelf. None of
these would have happened on the old site. Not because they were hard, but
because each would have meant touching the theme, and I wasn't about to touch that thing with a ten-foot pole.

## The accounting

In the [Raimbaut piece](/raimbaut/) I made a point of giving the honest
number and then qualifying it twice. Same rules here. The rescue happened
in the margin of a two-hour meeting. The redesign took the evening. And
what took the night — a decent part of it, anyway — was [the author
disentanglement](/boeggn/authors/). I am writing this the evening of the following
day; what has trickled in since, in dribs and drabs during lulls in
other work: the tint cache, the shelf-aware arrows, typography tweaks, better mobile design. I will at some point tackle series pages a little more, and decide what to do about rereads. 

I do realise that "I migrated a website during
a meeting" invites a misreading. There was nothing *automatic* about any
of this — no vibe coding in the sense of telling an AI what you want and
receiving a one-shot, perfect implementation. It went as smoothly as it
did for exactly two reasons. The first is that I brought the domain
knowledge: the technology, the UX and the information architecture, and
not least the content itself — my books, my reviews, my twenty-odd years
of accumulated conventions. At every fork I could decide, immediately,
because I knew exactly what I wanted. The second is that AI-assisted
development in mid-2026 has crossed some sort of boundary. With a human in
the loop who can make decisions at the pace the tools now invite, the
workflow feels almost magical.
Neither reason works without the other.

But that's the strangler-fig moral, and it's the one thing this lighter
piece has in common with the heavier one next door: **parity first,
improvement second, never both at once.** Because parity came first, the
rescue never depended on any of the fun parts, and the fun parts never
endangered the rescue.

As for Dreamhost: the site they flagged as compromised now has no PHP, no
database, no admin panel, and no way to be used for phishing short of
someone breaking into nginx to serve my book reviews *more maliciously*.
The false positive was, in the end, a favour. The site was held together by
inertia, and all it took was an eviction notice.

(It was, for what it's worth, quite a week for static sites: I moved the book log on Tuesday, the Raimbaut edition had been built the Saturday and
Sunday just before, and I created the website where I write this article on Monday evening. I am choosing to believe the universe is trying to
tell me something about databases.)
