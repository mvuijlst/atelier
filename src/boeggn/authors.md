---
title: "The authors, or: the actual rabbit hole"
heading: "The authors"
navLabel: "The authors"
section: 5
status: draft
---

# The authors, or: the actual rabbit hole

Every project of this kind has one place where the floor gives way. Not the
emergency — solved in under two hours — and not the redesign, which was an
evening of pure pleasure. The place where this project's floor gave way was
the author data.

## Double bookkeeping

Recall the two facts [the archaeology](/boeggn/archaeology/) turned up.
First: 955 authors lived in a proper taxonomy, with archive pages and URLs —
but with their labels stored backwards, `Pratchett - Terry`, reversed again
on display, purely so they would sort by surname without my having to
maintain separate name fields.

Second: the *same authors were in the database a second time*, inside the
free-text `publicatie` field — and the second copy was by far the
richer one, because the free text had *roles*. Most of the time. For comics:
*tekst*, *beeld*, *kleur*, *letters* — writer, art, colours, lettering,
the whole studio. For translated books: the *vertaling*. For audiobooks: the
voices. All of it in prose, formatted by years of "I guess this feels OK".

One specimen in the collection, an audiobook from 2022 — *Carpe Jugulum*,
Discworld #23:

```yaml
publication: |-
  Terry Pratchett (auteur), Indira Varma (stem), Peter Serafinowicz (voetnoten), Bill Nighy (DEATH)
  Penguin Audio, 2022, 11u 36m
```

Terry Pratchett, author. Indira Varma, narration. Peter Serafinowicz,
*footnotes*. And Bill Nighy, whose role in my database is **DEATH** — which
is entirely correct, he voices the character DEATH, and which no schema
designed in advance would ever have permitted. This data was precious, and it was completely unqueryable. It deserved to be structured,
and it deserved to be structured without losing Bill Nighy as DEATH.

## The target

The shape it needed to have was obvious enough. Authors stay a taxonomy —
they have pages, the pages have URLs, the URLs have parity obligations — and
each book gains a `roles:` map keying author slugs to their credited role,
alongside real `publisher`, `year`, and extent fields (`pages` for print,
`duration` for audio, `issues` for comic runs). Once captured, the free-text
field is deleted. The Pratchett entry, after:

```yaml
authors: ["pratchett-terry", "varma-indira", "serafinowicz-peter", "nighy-bill"]
publisher: "Penguin Audio"
year: 2022
duration: "11u 36m"
roles:
  pratchett-terry: "auteur"
  varma-indira: "stem"
  serafinowicz-peter: "voetnoten"
  nighy-bill: "DEATH"
```

Bill Nighy: still DEATH. A role is just a string; the schema's only opinion
is *which author it belongs to*. All the opinions about what roles mean
live in the templates, where they belong.

## Much more semi than automatically

Between those two code blocks lies the rabbit hole. I converted the field
semi-automatically, and I need the record to show that it was much more
*semi* than *automatically*.

The automatic half was a converter script with one governing virtue: it is
strict and it never guesses. A book is only rewritten when every part of the
field parses unambiguously *and* the credits on line one reconcile, name by
name, against the book's own author taxonomy — accent-folded, tolerant of
initials spacing ("George R. R." versus "R.R."), matching against the
display name, the backwards `wpName`, and the slug, so it cannot mis-assign
a role across books. Everything that fails any of this is left untouched and
written to a review file.

The semi half was the review file, and me slaving awoy over it for, ahem, quite a
while.

Because all those years of formatted-by-feel produces every failure mode
you can imagine and several you cannot. Comic runs whose "year" is a date
range ("januari 2006 – juli 2011"). Publishers that are two publishers.
Credits whose names almost-but-don't match the taxonomy because one of them
was entered surname-first in 2011 and first-name-first in 2014. And my
favourite, an actual import bug rather than a data quirk: a list of names
followed by one trailing "(vertaling)" got the role smeared onto *every*
name in the list — so for about six glorious hours, Cixin Liu stood in my database
credited as the translator of his own novel. Eight books were affected;
a small fixing script and a lesson about trailing modifiers later, Liu
Cixin went back to being the author.

Final tally: 889 books, 888 converted. The lone holdout that never parsed
cleanly and that I have decided to leave on the legacy field as a monument:
Plato's *Symposium* — twenty-four centuries old and still resisting
structure. Good for him.

<figure class="fig">
<img src="/boeggn/images/plato.jpg" alt="The Symposium page on the new site: Plato, four stars out of five, 'Project Gutenberg, 385-380 v. Chr., 144 blz.', read on 20 May 2012." loading="lazy">
<figcaption><span class="fig-n">Figure 10</span> The monument, as it renders today — via the legacy-field fallback, and nobody can tell. Note the year: <em>385-380 v. Chr.</em> A strict parser wants a single four-digit year; Plato declines to provide one.</figcaption>
</figure>


## Why bother

Roles now *mean* something. Author
names render large on a book page; translators, narrators and other
contributors render smaller — the typography knows who made the book. A
comic credits its whole team, each name a link. And an author's own page
can know the difference between the books someone wrote and the books
someone merely translated, which for an author archive is roughly the
difference between a bibliography and a search result.

<figure class="fig">
<pre><code>mysql&gt; SELECT name, slug FROM wp_9v7ezm_terms
    -&gt; WHERE slug IN ('pratchett-terry','varma-indira',
    -&gt;                'serafinowicz-peter','nighy-bill');
+----------------------+--------------------+
| name                 | slug               |
+----------------------+--------------------+
| Pratchett - Terry    | pratchett-terry    |
| Varma - Indira       | varma-indira       |
| Serafinowicz - Peter | serafinowicz-peter |
| Nighy - Bill         | nighy-bill         |
+----------------------+--------------------+</code></pre>
<pre><code>publicatie

Terry Pratchett (auteur), Indira Varma (stem), Peter Serafinowicz (voetnoten), Bill Nighy (DEATH)
Penguin Audio, 2022, 11u 36m</code></pre>
<img src="/boeggn/images/carpejugulum.png" alt="The rendered Carpe Jugulum header: Discworld #23, Terry Pratchett (auteur) large; Indira Varma (stem), Peter Serafinowicz (voetnoten) and Bill Nighy (DEATH) smaller; then Penguin Audio · 2022 · 11u 36m." loading="lazy">
<figcaption><span class="fig-n">Figure 11</span> One book, three eras of data: <em>(a)</em> the author taxonomy as the database stored it, backwards; <em>(b)</em> the free-text <code>publicatie</code> field, roles and bibliography in prose; <em>(c)</em> the rendered <em>Carpe Jugulum</em> header, role-aware — author large, contributors smaller, Bill Nighy still DEATH.</figcaption>
</figure>

None of which the visitor sees as a *feature*, of course. They see a credits
line that happens to be right. That's the whole aesthetic of this migration,
and [the last section](/boeggn/afterlife/) is about making it stay that way.
