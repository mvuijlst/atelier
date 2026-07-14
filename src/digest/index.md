---
title: "Digest: a daily recipe from the day's news"
heading: "Digest"
navLabel: "Opening"
section: 1
status: draft
---

# Digest

*Daily recipes inspired by the news*

## What it is

[Digest](https://digest.yusupov.cloud/) publishes one recipe a day. The
starting point is that day's *New York Times*: the generator downloads the
morning's front-page scan, samples the home-page RSS feed, and produces a
dish that traces back to two of the day's stories — through their places,
their season, their mood, occasionally their words. The connection is meant
to be felt rather than announced, and the recipe has to stand on its own
terms: cookable on a weeknight in Belgium, from supermarket ingredients, in
at most seventy-five minutes.

<figure class="fig">
<img class="theme-light" src="/digest/images/digest-light.jpg" alt="A daily seasonal recipe on the Digest site." loading="lazy">
<img class="theme-dark" src="/digest/images/digest-dark.jpg" alt="A daily seasonal recipe on the Digest site." loading="lazy">
<figcaption>A day's recipe from <em>Digest</em>: seasonal, AI-assisted, with the morning's headlines in its mood.</figcaption>
</figure>

A published recipe consists of a title of at most eight words, a short
introduction, an "inspiration" note of 120–200 words that ends by linking the
two source stories, one of ten fixed course types, prep and cook times, a
scalable ingredient list organised in groups with quantities and units,
numbered instructions, an optional cook's note, a one-line drink pairing that
prefers Belgian beer, per-serving nutrition estimates, and a generated hero
photograph. A collapsible "Why this dish?" panel on each page shows the
provenance: the two headlines, the day's constraint draw, the mood read off
the front page, and a thumbnail of the scanned front page itself.

The hard problem is not producing *a* recipe — models do that readily. It is
producing a *different* recipe every day, one that doesn't turn a tragedy
into a pun, doesn't converge on the same three components, and reads as if
someone chose it on purpose. Most of the engineering in Digest exists to
force that variety and restraint.

## Why I made it

I am interested in generated content, and recipes are a good test case: the
output has to satisfy hard practical constraints — quantities, timings,
what a Belgian supermarket actually stocks — while still needing a reason to
exist beyond "another weeknight pasta". A newspaper front page appealed to me
as a source of ideas because it is unusual but structured: it changes every
day, it carries places, subjects and an overall mood, and it arrives on a
fixed schedule. I wanted to see whether a generation process could produce
recipes that were both surprising and still practical, and whether the
output could feel edited and deliberate rather than obviously generated.
