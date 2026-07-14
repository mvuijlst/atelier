---
title: "Echoes: histories that never were"
heading: "Echoes"
navLabel: "Opening"
section: 1
status: draft
---

# Echoes

*Dispatches from histories that never were*

## What it is

[Echoes](https://echoes.yusupov.cloud/) publishes one fictional news article a
day. Each article is written as if by a journalist inside an alternate
timeline: a world in which one historical event went differently, read fifty
years or more downstream of the change. The article never announces this. It
opens from whatever is in the news that week in its own world — a court
verdict, an obituary, a strike, a controversial new book — and treats its
history the way real journalism treats history: as background the readers
half-know already.

<figure class="fig">
<img class="theme-light" src="/echoes/images/echoes-light.jpg" alt="A daily alternate-history dispatch on the Echoes site." loading="lazy">
<img class="theme-dark" src="/echoes/images/echoes-dark.jpg" alt="A daily alternate-history dispatch on the Echoes site." loading="lazy">
<figcaption>A day's dispatch from <em>Echoes</em>, written as if by the press of a timeline one hinge from ours.</figcaption>
</figure>

A published article consists of a headline, subtitle, the name of an invented
(but ordinary-sounding) publication, a byline with a role, a dateline with a
place and a publication date, a body built from paragraphs, section headings,
pull-out callouts and attributed quotations, a hero photograph and usually a
few supporting images with captions and credits, and coordinates for the
place where history branched. Behind the public page, each article also
stores the real event it started from and a plain statement of what changed —
visible to me in the CMS, never rendered on the site.

The articles are fiction and the site says so in its subtitle. But the point
of the exercise is the opposite of a disclaimer: the project is a study of
the conventions — textual and visual — that make something read as news. Word
choice that fits a period and a register, sourcing that disagrees with
itself, photographs with the right grain and the wrong composition,
institutions that get criticised, people who lost out and are still angry.
Most of the engineering in Echoes exists to force those signals into
generated text and images, and to catch their absence.

## Why I made it

I have read alternate history for most of my life, and the genre's usual
forms — the novel, the essay, the forum timeline — always seemed to me to
miss the texture of how history is actually experienced: through newspapers
that assume you already know the context. I also use Wagtail extensively in
my day job, and I wanted to find out how far it could be driven purely
through an API — whether a CMS built for human editors could serve as the
publishing end of a fully programmatic pipeline. And I was curious about
generated content itself: how close model-written prose can get to the
restraint of human journalism, and what kind of scaffolding — structured
content, validation, revision loops — it takes to keep it there. Echoes is
where those three interests meet.
