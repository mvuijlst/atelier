---
title: "More Than a Migration: How a 24-Year-Old Booklog Turned Its Darkest Hour into Its Finest Chapter"
heading: "More than a migration"
navLabel: "The journey"
section: 1
status: draft
---

# More than a migration

*How a 24-year-old booklog turned its darkest hour into its finest chapter*

## Introduction

In today's fast-paced digital landscape, few things are as fragile — or as
precious — as a personal website. On Tuesday, 7 July 2026, just minutes before
a two-hour meeting, I typed the address of
[boeken.tsuk.org](https://boeken.tsuk.org), the Dutch-language booklog I had
been keeping since 2002, and was greeted by a cheerful hosting placeholder:
*"boeken.tsuk.org is almost here!"*

It wasn't almost here. It had been there for close to twenty years.

What followed was not just a migration. It was a rescue, a redesign, and a
rediscovery — all unfolding within a single remarkable day. In this article,
we'll take a comprehensive deep dive into that journey: the incident that
started it all, the technology choices that made it possible, the challenges
that emerged along the way, and the valuable lessons learned. The story has
already been told once on this site, section by section and in a rather more
conversational register, in [Your website is almost here!](/boeggn/) —
consider this companion piece the version that leaves nothing out. Whether
you're a seasoned developer, a WordPress refugee, or simply someone who loves
books, there's something here for you.

Let's dive in.

> **[Figure 1]** *Hero illustration.* Generate a wide (16:9) flat-design
> digital illustration in a modern isometric style. Subject: a warm, cozy
> digital library rising out of an old, cracked server rack — wooden
> bookshelves filled with colourful book spines growing organically from the
> top of a grey, dented server tower with a sad blinking amber LED. Palette:
> deep teal (#0F8B8D) as the dominant accent, warm amber highlights, dark
> slate background (must sit comfortably on a dark page). Soft gradients
> allowed, no photorealism. Absolutely no legible text anywhere in the image.
> Mood: hopeful, transformative, slightly whimsical. Suggested caption:
> "Every ending is a new beginning: from legacy hosting to a living library."

## The Incident: When Everything Changed

Every transformation story has an inciting incident. This one arrived without
fanfare.

There was no warning banner. No grace period. No email in the inbox. Just a
placeholder page where twenty-four years of book reviews used to be —
and, underneath, helpfully: *Upload your website to get started.*

The explanation, it turned out, had been sitting in the spam folder all
along. Dreamhost's automated security systems had flagged the site as
compromised and being used for phishing — citing a file dating back to 2018 —
and had responded decisively: by writing `.htaccess` files into every single
folder of the site, locking visitors out of all of it. The site owner could
still log in. Visitors could not. For a public website, this is what the end
looks like.

It's important to note that the initial reaction was not panic. It was
something closer to relief. The site had been running on inertia for years —
too cheap to move, too tangled to improve, too familiar to abandon. Sometimes
it takes an eviction notice to make you pack. And sometimes, that eviction
notice is exactly the push you didn't know you needed.

## A Legacy Worth Preserving

To understand why this rescue mattered, we need to understand what was at
stake. Boeggn — tagline: *Altijd al een boeklog willen bijhouden*, "always
wanted to keep a booklog" — is not a large website. But it is a *long* one.

The numbers tell a compelling story:

- **889 published book entries**, one page per book — a cover, a rating, and
  a review — the first dated 21 August 2002, the most recent late May 2026.
- **567 approved comments**, a snapshot of a blogging culture whose comment
  sections peaked somewhere around 2013.
- **1,367 uploaded images** and **2,764 post revisions**, quietly
  accumulating in the database like sediment.
- **955 book authors** in a custom taxonomy, each with their own archive
  page.

This wasn't just a website. It was a reading life, meticulously documented —
a rich tapestry of two and a half decades of books, opinions, and habits.
And the rhythm of that documentation is a story in itself: a single entry in
2002, a trickle in 2009, an astonishing 138 entries in 2011 and 248 in 2012,
a long taper to zero in 2019 and 2020, exactly one book in 2023, and a
resurgence to 86 in 2024. The gaps are not a flaw in the data. The gaps *are*
the data.

> **[Figure 2]** *Timeline infographic.* Generate a wide (about 21:9)
> horizontal timeline infographic in a clean flat-design style, dark slate
> background, teal (#0F8B8D) accent, thin amber highlight lines. A single
> horizontal axis from 2002 to 2026 with small circular milestone markers and
> short labels above/below in a neutral sans-serif: "2002 — first entry
> (21 August)", "2009 — 21 entries", "2011 — 138 entries", "2012 — peak:
> 248 entries", "2018 — 3 entries", "2019–2020 — silence", "2021 — 58
> entries", "2023 — exactly one book", "2024 — 86 entries", "2026 — the
> placeholder incident (7 July)". Make the 2012 marker visibly the largest
> and the 2019–2020 stretch visibly dimmed. Numbers must match exactly.
> Suggested caption: "Twenty-four years at a glance: the milestones of a
> booklog."

The genre distribution is equally revealing. The site's twenty-one categories
were dominated by *fictie* (531 books), *comic* (274), *science-fiction*
(206) and *fantasy* (183) — with a long tail that included three categories
containing zero books apiece, among them one mysteriously named *sonstiges*,
German for "miscellaneous". Add 510 tags, and you have a folksonomy that grew
the way real gardens grow: organically, enthusiastically, and without a
master plan.

> **[Figure 3]** *Category chart.* Generate a horizontal bar chart as a
> flat-design infographic, dark background, bars in a teal-to-amber gradient
> ramp. Data (label — value): "fictie — 531", "comic — 274",
> "science-fiction — 206", "fantasy — 183". Include a small footnote row of
> three empty bars labelled "3 categories — 0 books (including 'sonstiges')".
> Add a one-line caption inside the image, small and unobtrusive: "A book can
> carry several categories." Use exactly these numbers and spellings; a clean
> geometric sans-serif; no other text. Suggested caption: "What 889 books
> look like, by genre."

## The Rescue: Two Hours That Changed Everything

Here's the thing about emergencies: they reward preparation, and they punish
hesitation. The rescue unfolded in parallel with the two-hour meeting the
placeholder had so rudely interrupted, and it followed four decisive steps:

1. **Repoint the DNS.** The A records were aimed at a Hetzner VPS that was
   already running for other projects. DNS propagation takes time, so you
   start that clock first — a small decision that pays dividends later.
2. **Secure the files.** SSH into the Dreamhost server — which was still
   perfectly happy to admit its owner; it was only visitors it had opinions
   about — and dump all 1.5 GB of files, carefully excluding the freshly
   sprayed `.htaccess` files and the thousands of WordPress-generated resized
   image duplicates.
3. **Secure the database.** One MySQL dump: 18 MB of history.
4. **Begin the strangler fig.** Rebuild the site around the old one — same
   URLs, same content, same everything the visitor can see — until the
   original is no longer load-bearing.

That last step deserves a closer look, because it is the philosophical heart
of the entire project. A strangler fig is a tree that grows around a host
tree, using it for structure, until the host is no longer needed. Applied to
software, it is a migration discipline with one golden rule: **first
reproduce exactly, then improve — never both at once.**

> **[Figure 4]** *Migration flowchart.* Generate a left-to-right flowchart in
> a clean flat-design style with rounded rectangles, dark slate background,
> teal (#0F8B8D) boxes with white labels, amber arrows. Nodes, in order:
> "Dreamhost (locked)" → "1.5 GB file dump + 18 MB MySQL dump" → "conversion
> to Markdown (one file per book)" → "Hugo (static site generator)" →
> "nginx on a Hetzner VPS". A separate branch from a git/GitHub icon labelled
> "push → GitHub Actions → rsync" feeding into the nginx node, and a small
> DNS icon labelled "A records repointed" pointing at the VPS. Exactly these
> labels, nothing more. Suggested caption: "The rescue pipeline: from locked
> server to static site."

"Exactly" means exactly *from the visitor's side* — and the visitor's side
means URLs. Every address the old site had ever served — year/month
permalinks, category archives, tag archives, paginated everything, the feed —
had to keep resolving on the new site. The static site generator chosen for
the job was [Hugo](https://gohugo.io/): a single Go binary, selected for its
speed and its first-class taxonomy support. The heart of the parity work fits
in a handful of permalink configuration lines.

There were exactly two exceptions to perfect parity, and honesty demands
both be recorded. First, comments are offline: the 567 approved comments came
along in the database dump and may yet return as static HTML, but new
comments require a comment service, and a self-hosted one (Isso) is on the
to-do list rather than on the server. Second — and this is the delightful
one — a single post URL contained an actual zero-width space, an invisible
Unicode character faithfully served by WordPress for years. That URL was
retired rather than redirected. Final score: **one hundred percent URL
parity, minus one invisible character.**

By the time the meeting reached its question-and-answer section, the site was
back. Not a prototype. Not a staging environment. The site — static HTML
built by Hugo, served by nginx over HTTPS, deploying automatically via GitHub
Actions and rsync, with search handled by [Pagefind](https://pagefind.app/),
also fully static. The acceptance test — old and new side by side,
indistinguishable to a visitor — passed before dinner.

> **[Figure 5]** *The strangler fig, visualized.* Generate a square (1:1)
> isometric illustration, flat design with soft gradients, dark background.
> Subject: a majestic fig tree whose luminous teal roots wrap around and
> gently envelop a grey, fading server tower; the tree's canopy is made of
> small colourful book covers instead of leaves. The server should look
> peaceful, not violent — this is succession, not destruction. Accent
> palette: teal #0F8B8D, warm amber, muted greys. No legible text. Suggested
> caption: "The strangler fig: the new site grows around the old until the
> old is no longer needed."

## The Technology Stack: A Closer Look

No modern write-up would be complete without a summary table, so let's break
down the transformation at a glance:

| Aspect | Before (2002–2026) | After (2026–) |
| --- | --- | --- |
| Platform | WordPress with a custom theme (built ~2011) | Hugo, a single Go binary |
| Hosting | Shared Dreamhost server | Hetzner VPS running nginx, over HTTPS |
| Content | Rows in an 18 MB MySQL database | One Markdown file per book, in git |
| Search | WordPress built-in search | Pagefind, fully static |
| Comments | 567 approved WordPress comments | Parked; static return planned, Isso on the to-do list |
| Deployment | Editing on the live server | git push → GitHub Actions → rsync |
| Attack surface | PHP, plugins, admin panel, database | A folder of HTML files and nginx |

The result? A site that is faster, simpler, and dramatically more secure.
The security posture Dreamhost's scanners had imagined is now the actual
security posture: no PHP, no plugins, no admin panel, not even a database.
There is nothing left to hack but a web server and a folder of HTML files.
The attack surface didn't just shrink — it left the building.

## Digital Archaeology: What the Database Revealed

Every database tells a story. This one had been waiting twenty-four years to
tell it, and reading an 18 MB SQL dump written by a sequence of past selves —
none of whom documented anything — is less database work than archaeology.
You dig. You find a layer. You reconstruct what the people of that era
believed.

The findings were fascinating:

- **Discipline, in exactly one place.** Every single one of the 889 published
  books carried a `quotering` field — a 0-to-10 rating. 889 out of 889. Past
  me was rigorous about precisely one thing, and it was giving marks out of
  ten.
- **Structure by vibes, everywhere else.** The bibliographic data lived in a
  free-text field called `publicatie` — author(s) on one line, then
  publisher, year and page count on the next, give or take whatever felt
  right on the day of posting. Present on 887 of 889 posts. Readable by
  humans; opaque to machines.
- **The single most consequential discovery:** the 955 author archives were
  not served at WordPress's default taxonomy URL. They lived at
  `/aut/<slug>/` — a custom rewrite base configured in a couple of lines of
  PHP around 2011 and documented nowhere. Missing this one detail would have
  silently killed 955 URLs. This is why you read the old system's
  configuration before you reproduce it.
- **A curious sorting hack.** The author taxonomy stored its labels
  *backwards* — `Pratchett - Terry` — and reversed them again for display,
  purely to get alphabetical sorting by surname without maintaining separate
  name fields. Elegant? Debatable. Effective? Undeniably — the new site kept
  the scheme.
- **The sediment.** Jetpack, YARPP, Publicize (still valiantly trying to
  auto-post to social networks that mostly no longer exist), Gutenberg
  installed as a plugin before it was part of WordPress, traces of an
  examined-and-rejected page builder, and a plugin-powered Amazon affiliate
  link on 454 of the 889 books. Lifetime affiliate earnings: **$0.58**. The
  links did not survive the day, and they were not mourned.

Everything that didn't map to the new content model — the 2,764 revisions,
the 1,215 spam comments awaiting a moderation queue that will never come,
five comments pending approval since time immemorial, the plugin metadata
strata — was dropped. What survived is pleasingly small: one Markdown file
per book, plus the images. That, at its heart, is all the site had ever
been: 889 books' worth of content wearing an entire LAMP stack as a coat.

> **[Figure 6]** *Archaeology cross-section.* Generate a vertical
> cross-section "excavation" infographic in flat design: geological strata
> viewed side-on, dark background, each stratum a muted earth tone with a
> teal label chip. From top (surface) to bottom: "889 book entries + 1,367
> images (kept)", "955 authors at /aut/ (kept)", "21 categories · 510 tags
> (kept)", "567 approved comments (parked)", "2,764 revisions (dropped)",
> "1,215 spam comments (dropped)", "plugin metadata: Jetpack, YARPP,
> Publicize, page-builder traces (dropped)", "454 Amazon affiliate links —
> lifetime earnings $0.58 (dropped)". Kept strata warm and saturated; dropped
> strata desaturated grey. A small shovel icon at the top. Use exactly these
> labels and numbers. Suggested caption: "The dig site, layer by layer: what
> was kept, what was parked, what was dropped."

## The Redesign: Where Form Meets Function

With parity banked before dinner, the evening belonged to improvement — and
this is where the strangler-fig discipline pays its built-in reward. Once the
copy is exact, every change is free: no change needs to be weighed against
"but then I'd have to dig into the old theme", because the old theme is no
longer load-bearing. It went in the bin that same evening.

The new design rests on one deceptively simple insight: **a booklog is not a
blog. It's a library.** The old home page was shaped like the software it ran
on — reverse-chronological posts, forty-five pages deep. The new home page is
a bookshelf: covers bottom-aligned, spines out, unapologetic about divergent
aspect ratios. Reading states became first-class shelves — *gelezen* (read),
*lezende* (currently reading, with a progress gauge), *te lezen* (the
to-read pile) — instead of being categories, because when all you have is a
taxonomy, everything looks like a term.

The details matter here, and they matter deeply:

- **Typography:** IBM Plex, self-hosted — serif for reading, mono for the
  chrome — with a dark theme as the default.
- **Content quality:** every review was hauled out of fossilized WordPress
  HTML into clean Markdown, with curly quotes, proper em dashes, and the
  occasional centred ⁂.
- **Series as a real taxonomy:** 277 books across 68 series, with a sort key
  that lets an omnibus live at position 4.5, between 4 and 5, where it
  belongs.

But the crown jewel of the redesign — the feature that elevates the entire
experience — is the cover-tint system. **Each book's page takes its colour
from the book's cover.** The dominant colour is extracted from the cover
image and becomes an accent that tints the page: background, surfaces,
rules, metadata. The page for a Penguin orange paperback and the page for a
gloomy fantasy tome feel like different rooms in the same house.

Crucially, this is done without ever letting a cover break the page. The raw
cover colour is first darkened toward near-black, and the page surfaces mix
toward *that* — so a pale or garish cover can tint the chrome but can never
lighten it. Body text never mixes at all, and the header keeps fixed colours
outright, so navigation contrast stays at WCAG-AA levels no matter what the
cover throws at it. It's not just a colour scheme. It's a colour scheme with
guardrails.

> **[Figure 7]** *Cover-tint pipeline.* Generate a wide (16:9) explanatory
> diagram in flat design, dark slate background, four stages left to right
> connected by thin amber arrows: (1) a generic book cover swatch labelled
> "cover"; (2) a colour droplet labelled "dominant colour extracted"; (3) the
> same droplet shown much darker, labelled "darkened toward near-black"; (4)
> a miniature webpage wireframe whose background and panels carry that dark
> tint, labelled "surfaces mix toward the deep tint — text never mixes".
> Below the four stages, a small row of three miniature webpage thumbnails
> tinted warm copper, cold blue-grey, and violet, labelled "every book gets
> its own room". Clean sans-serif labels exactly as given; no other text.
> Suggested caption: "From cover to room: how a book colours its own page
> without ever breaking it."

## The Author Data: Embracing the Challenge

Every project has one place where the floor gives way. It wasn't the
emergency — solved in under two hours. It wasn't the redesign — an evening of
pure pleasure. It was the author data, and it consumed a decent part of the
night.

The database, remember, held every author *twice*. Once in the proper
taxonomy — 955 authors with URLs and backwards-sorted labels — and once
again inside the free-text `publicatie` field, where the second copy was by
far the richer, because the free text had **roles**. For comics: *tekst*,
*beeld*, *kleur*, *letters* — writer, art, colours, lettering. For
translated books: the *vertaling*. For audiobooks: the voices. Consider one
specimen from 2022, the *Carpe Jugulum* audiobook (Discworld #23):

```text
Terry Pratchett (auteur), Indira Varma (stem), Peter Serafinowicz (voetnoten), Bill Nighy (DEATH)
Penguin Audio, 2022, 11u 36m
```

Terry Pratchett, author. Indira Varma, narration. Peter Serafinowicz,
*footnotes*. And Bill Nighy, whose role in this database is **DEATH** —
entirely correct, since he voices the character DEATH, and something no
schema designed in advance would ever have permitted. This data was
precious. It was also completely unqueryable. It deserved to be structured —
and it deserved to be structured *without losing Bill Nighy as DEATH*.

The target shape: authors stay a taxonomy, and each book gains a `roles:`
map keying author slugs to their credited role, alongside real `publisher`,
`year` and extent fields — `pages` for print, `duration` for audio, `issues`
for comic runs. A role is just a string; the schema's only opinion is which
author it belongs to.

The conversion was semi-automatic — and the record must show it was much
more *semi* than *automatic*. The automatic half was a converter script with
one governing virtue: **it is strict, and it never guesses.** A book is only
rewritten when every part of the field parses unambiguously *and* the
credits reconcile, name by name, against the book's own author taxonomy —
accent-folded, tolerant of initials spacing, matched against display name,
backwards label, and slug alike. Everything else lands in a review file for
a human.

And the review file delivered every failure mode imaginable, plus several
that weren't: comic runs whose "year" is a date range; publishers that are
two publishers; names entered surname-first in 2011 and first-name-first in
2014. Best of all, one genuine import bug: a list of names followed by a
single trailing "(vertaling)" smeared the translator role onto *every* name
in the list — so for roughly six glorious hours, the science-fiction author
Cixin Liu stood credited as the translator of his own novel. Eight books
were affected. One small fixing script later, order was restored.

The final tally is the kind of number that tells its own story: **889 books,
888 converted.** The lone holdout, which never parsed cleanly and has been
deliberately left on the legacy field as a monument, is Plato's *Symposium* —
its year, "385-380 v. Chr.", being more than any strict parser should be
asked to endure. Twenty-four centuries old, and still resisting structure.

> **[Figure 8]** *Data transformation, before and after.* Generate a wide
> (16:9) two-panel comparison diagram, flat design, dark background. Left
> panel, headed "Before — prose", shows a rough text card containing exactly:
> "Terry Pratchett (auteur), Indira Varma (stem), Peter Serafinowicz
> (voetnoten), Bill Nighy (DEATH) / Penguin Audio, 2022, 11u 36m" rendered as
> two typewriter-style lines. Right panel, headed "After — structure", shows
> four neat teal chips labelled "auteur", "stem", "voetnoten", "DEATH", each
> chip linked by a thin line to a name card ("Pratchett", "Varma",
> "Serafinowicz", "Nighy"), plus three small metadata tiles: "Penguin Audio",
> "2022", "11u 36m". A single amber arrow between the panels labelled
> "strict parser — never guesses". Highlight the "DEATH" chip with a subtle
> glow. Use exactly these strings. Suggested caption: "One audiobook, two
> eras: from formatted-by-feel prose to a role-aware credits map — Bill Nighy
> still credited as DEATH."

Why does this matter? Because roles now *mean* something. Author names
render large on a book page; translators, narrators and other contributors
render smaller — the typography knows who made the book. An author's own
page can distinguish the books someone wrote from the books someone merely
translated, which for an author archive is roughly the difference between a
bibliography and a search result.

## Performance Matters: From Four Minutes to Nine Seconds

There's one more chapter to this story, and it's a masterclass in why caching
pure functions is never wasted effort.

The cover-tint system needs the dominant colour of every cover, and the
first implementation asked Hugo to extract it from the image on every cold
build — for roughly 900 covers. Builds crept past four minutes. For a
generator chosen partly for its speed, this was more than a performance
issue. It was an identity crisis.

The fix rests on a simple observation: a cover's dominant colour is a pure
function of the image bytes, so there is no reason to ever compute it twice.
The extracted tints now live in a small JSON file — 901 entries — checked
into the repository and regenerated only when covers change. Along the way,
an audit of all 905 cover files (880 JPEG, 21 PNG, 4 WEBP — every one
accounted for and decodable) ensured no cover can silently opt out of having
a colour.

The result? Full builds dropped from over four minutes to about **nine
seconds** — a thirtyfold improvement. Moreover, the same unafraid-to-touch-it
energy produced a stream of small refinements in the days that followed:
prev/next arrows that stay within their shelf instead of walking off the
edge of *read* into *to-read*, typography tweaks, better mobile behaviour.
None of these would have happened on the old site — not because they were
hard, but because each would have meant touching the old theme.

## Life After WordPress: A New Chapter

So what is the site like to *live with* now? In a word: frictionless.

A book is a Markdown file in a git repository. Adding one means telling an
AI agent something like *"gelezen: [title], 8/10"* and reviewing the diff:
metadata looked up, cover fetched and placed, missing author and series
pages created, front matter written. A health linter runs over the whole
corpus and complains about missing covers, broken tags and orphaned pages.
Push to git, and GitHub Actions builds and deploys. That is the entire
content management system. In a charming nod to the site's heritage, cover
paths still begin with `/wp-content/uploads/` — the old URL scheme,
preserved for parity, now just a naming convention for flat files.

Honesty compels a clear accounting, and the accounting is this: the rescue
happened in the margin of a two-hour meeting; the redesign took the evening;
the author disentanglement took a decent part of the night; and a trickle of
refinements — the tint cache, the shelf-aware arrows, typography and mobile
polish — arrived in the days after, in lulls between other work.

And one point must be made with absolute clarity: **none of this was
automatic.** This was not a matter of telling an AI "migrate my website" and
receiving a finished product. It worked because two ingredients came
together. First, deep domain knowledge — of the technology, the UX, the
information architecture, and above all the content itself: my books, my
reviews, my twenty-odd years of accumulated conventions — which meant every
fork in the road could be decided instantly. Second, AI-assisted development
in mid-2026 has crossed a threshold where, with a decisive human in the
loop, the workflow feels almost magical. Neither ingredient works without
the other. AI didn't replace the expertise. It amplified it.

> **[Figure 9]** *By the numbers.* Generate a wide (16:9) stat-card
> infographic: a 2×4 grid of rounded rectangles on a dark slate background,
> each card with a huge teal number and a small grey sans-serif label.
> Cards, exactly: "889 — books published since 2002", "955 — author archive
> pages preserved", "888 / 889 — books converted to structured data",
> "100% − 1 — URL parity (one invisible character retired)", "≈ 2 h — from
> placeholder to rescued site", "9 s — full site build, down from 4+
> minutes", "$0.58 — lifetime Amazon affiliate earnings, retired", "0 —
> databases in production". One card — the "9 s" one — gets an amber accent
> instead of teal. No other decoration or text. Suggested caption: "The
> migration, quantified."

## Key Takeaways

For those skimming — and no judgment; this is a long article — here are the
core lessons of the Boeggn migration:

- **Inertia is not a hosting strategy.** It merely feels like one, right up
  until the day it doesn't.
- **Parity first, improvement second — never both at once.** The
  strangler-fig discipline kept the rescue independent of the fun parts, and
  the fun parts from endangering the rescue.
- **Read the old system's configuration.** The one-line `/aut/` rewrite rule
  from 2011, documented nowhere, stood between the migration and 955 silently
  dead URLs.
- **Strict beats clever.** A converter that never guesses, plus a human
  review file, beats a clever one that confidently credits Cixin Liu as his
  own translator.
- **Schemas should hold data, not opinions.** A role is just a string —
  which is why Bill Nighy can still be DEATH.
- **Cache pure functions.** A 901-entry JSON file turned four-minute builds
  into nine-second builds.
- **Expertise plus AI is the multiplier.** Neither the domain knowledge nor
  the tooling would have carried the day alone.

## Conclusion: The Journey Continues

The story of Boeggn is, at its heart, a story about resilience — but not the
resilience of software. Software did not save this site. A person who knew
exactly what the site was, what it should remain, and what it could become —
working with tools that had finally grown into the job — saved this site, in
the margins of a meeting, over one evening, and through a decent part of one
night.

From a locked server to a nine-second build. From an 18 MB database to a
folder of Markdown. From a placeholder that promised *"boeken.tsuk.org is
almost here!"* to a site with nothing left to hack. The journey is not
entirely finished — the 567 comments are still waiting in the wings, series
pages deserve more love, and the question of rereads remains delightfully
unresolved — and that's okay. A library is never finished. That's what makes
it a library.

The books are still there. The reviews are still there. And now, at long
last, the website is truly here.

> **[Figure 10]** *Closing illustration.* Generate a wide (16:9) flat-design
> illustration with soft gradients: a warm, dimly lit reading room at night,
> seen straight-on — a large bookshelf whose books' spines subtly glow in
> many colours, one reading chair, a small side table with a steaming mug,
> and through a window a calm night sky. In the corner of the room, barely
> noticeable and unplugged, the same grey server tower from Figure 1, now
> repurposed as a plant stand with a thriving fig plant on top. Palette:
> deep slate blues, warm amber light, teal (#0F8B8D) accents. No legible
> text. Mood: peaceful, permanent, earned. Suggested caption: "The library,
> at rest: nothing left to hack, everything left to read."
