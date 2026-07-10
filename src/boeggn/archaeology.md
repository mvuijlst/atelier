---
title: "What the database confessed"
navLabel: "The archaeology"
section: 3
status: draft
---

# The database

An 18 MB SQL dump: big data it isn't, and I wasn't for a minute worried about the conversion. 
I *was* dreading what I knew was in there. What follows is
what came out of it, roughly in order of how pleased I was to see it.

## The content model, such as it was

Every book entry had a `quotering` field — a 0-to-10 rating —
present on **889 of 889** published posts. Whatever
else can be said about past me, he was disciplined about giving books marks out of ten.

The rest of the bibliographic data lived in a free-text field called
`publicatie`, whose format is best described as *electronic index card*:
author(s) on one line, then publisher, year and page count on the next,
`"Author\r\nPublisher, Year, NNN blz."`, give or take whatever felt right on
the day of posting. It held authors *with roles* for comics and audiobooks,
publishers that sometimes existed, and — on 887 of 889 posts, so nearly as
disciplined as the rating — it worked, in the sense that a human reading the
rendered page saw the right words. A machine reading the field saw prose.
This field gets [an entire section of its own](/boeggn/authors/) later,
because unpicking it turned out to be the deepest rabbit hole of the whole
affair.

There was also an Amazon affiliate link on about half the books (454 of 889),
courtesy of a plugin called Toolset Types. Those did not survive the day,
unmourned. I think I collected a grand total of $ 0.58 of income from that over the years. 

## The taxonomies

Twenty-one categories, doing genre duty: *fictie* (531 books), *comic* (274),
*science-fiction* (206), *fantasy* (183), on down to three categories that
contained zero books apiece — among them one named *sonstiges*, a category *bien étonnée de se retrouver ici* as it's the catch-all category on my main weblog, and I have genuinely no recollection of why it was here. Oh, and of course the categories are not ideal — "audiobook" and "comic" are formats, "fictie" and "non-fictie" are overly broad. 

Five hundred and ten tags, the typical messy folksonomy crap we all though we needed back then but never did anything with (even the related books I showed used something else than the tags). 

And then the important one: **955 book authors**, in a custom taxonomy.Here is the single most consequential non-obvious fact in the migration:
those 955 author archives were not served at WordPress's default URL for a
custom taxonomy. They were served at `/aut/<slug>/` — a custom rewrite base I
set up in a line of PHP years ago, probably felt pretty good about back then, and then lived to rue but never
did anything about. Getting this wrong in the rebuild meant 955 URLs would die quietly.
URL parity is mostly not hard, but it's *this* kind of thing, the one-line
decision of fifteen years ago that nothing documents, that could really mess things up.

The author taxonomy had other shenanigans going on. Its labels were stored
*backwards* — `Pratchett - Terry` — and then reversed again for display, a
scheme with exactly one purpose: alphabetical sorting by surname without
having to maintain separate first-name and last-name fields. Past me
considered this elegant. Present me is not in a position to be smug, because
present me kept the scheme; but keep that backwards label in mind, because
[it returns](/boeggn/authors/) two sections from now.

## The sediment

Below the content, a couple of plugins: Jetpack for spam filtering, Gutenberg as a plugin before it ws built-in to WordPress, YARPP (Yet Another Related Posts Plugin, the thing I used instead of tags), Publicize (still valiantly trying to auto-post to social networks that in most cases no longer
exist). Remnants of Spectra page-builder metadata (installed, examined, dismissed, burned with fire). Each plugin leaving behind its own stratum of `postmeta` geology, and all of
it — along with the 2,764 revisions, the 1215 spam comments awaiting a
moderation queue that will never come, and the five comments pending approval
since whenever: dropped.

<figure class="fig fig-diagram">
<img class="svg-adapt" src="/boeggn/images/fig7-dig.svg" alt="Diagram: WordPress tables on the left (posts, postmeta, terms, comments, uploads) with arrows to the Hugo content model on the right (one Markdown file per book, author pages, parked static comments, a media folder). Below, a dashed spoil heap holding the 2,764 revisions, 1,215 spam comments, plugin postmeta strata and 454 Amazon affiliate links.">
<figcaption><span class="fig-n">Figure 7</span> What maps where, and the spoil heap of everything that didn't.</figcaption>
</figure>

What survives the sieve is pleasingly small: one Markdown file per book
(title, date, rating, cover, categories, tags, authors, the review text) plus
the images. I decided to, for now, not bring back the list of authors, tags and categories. They exist behind the scenes but I'm not linking aything up (yet). 

So that's it. That, at its heart, is all it ever was ever it: 889 books' worth of content
wearing an entire LAMP stack, a WordPress theme and a spaghetti bowl of PHP and plugin machinery, as a
coat. The [redesign](/boeggn/redesign/) that evening was, among other things,
the pleasure of dressing it in something its own size.
