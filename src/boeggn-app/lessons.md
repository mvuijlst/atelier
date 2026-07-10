---
title: "Lessons Learned: What One Day Can Teach You"
heading: "The lessons"
navLabel: "The lessons"
section: 6
status: draft
---

# The lessons

## 🧾 The Honest Accounting

Let's be clear about what "built in a day" means, because the phrase invites
exactly the wrong picture. It does not mean effortless. It does not mean
automatic. And it certainly does not mean unsupervised.

The day's rhythm, as the build log records it, was a steady alternation:
a human brief, an AI build, a human feedback round, an AI fix — nine
dated entries deep. The AI wrote the code; the human wrote the requirements,
made the calls that require owning the consequences, created the DNS record,
performed the production deploy as root, and supplied the three feedback
rounds — each one a numbered list of things that were wrong, from
misaligned checkboxes to cancelled deploys to interface copy that had no
business sounding the way it did. Every phase shipped only after being
verified against the real repository, in a real browser, and eventually on
the real phone.

That division of labour is not a footnote to the story. It *is* the story.
The same pattern powered the site's rescue two days earlier, and it repeats
here at a smaller scale and a faster tempo: deep domain knowledge steering,
tireless tooling executing, and a feedback loop measured in minutes.
Neither half works alone. Together, they build an app in a day. This is
what modern software development looks like — and we're only at the
beginning of that journey.

<figure class="fig">
<img src="/boeggn-app/images/fig11.jpg" alt="A close-up of a polished brass instrument panel with glowing circuit traces and four round neon gauges reading '1 day build', '4 phases', '3 feedback loops' and '0 databases'." loading="lazy">
<figcaption><span class="fig-n">Figure 11</span> The build, quantified: one day, four phases, three feedback loops, zero databases. The numbers don't lie.</figcaption>
</figure>

## 🎯 Key Takeaways

Every journey deserves a summary, and this one earned its bullet points:

- ✅ **Find the API you already have.** The repository was the content API
  all along; `git push` was already the publish button. The best
  integration is the one you don't build.
- ✅ **Order phases by risk, not by glamour.** The humble progress update
  proved the entire pipeline before a single line of AI code existed.
- ✅ **Never re-serialize what you can line-target.** Hundreds of
  hand-groomed files stayed byte-identical because the writer edits lines,
  not documents — and *proved* it against every post in the repo.
- ✅ **Reconcile before you show.** AI proposals are checked against the
  repository first; the one expensive mistake (an invented book) is the one
  the prompt explicitly forbids.
- ✅ **Never guess; degrade honestly.** An unknown series becomes one
  null-entry, not three invented books. A too-small cover becomes no
  candidate, not a bad one. A missing API token renders nothing, not an
  error.
- ✅ **Make publishing a decision.** Atomic local commits plus one
  deliberate publish button solved a deploy-cancellation problem *and* made
  the workflow calmer. The badge is red for a reason.
- ✅ **Test on the device you built for.** The phone screenshot found what
  desktop spot-checks missed twice.
- ✅ **With deploy keys, the alias goes in the remote URL.** Some lessons
  cost an evening; this one is yours for free.

## ❓ Frequently Asked Questions

**Is the site still static?**
Absolutely. This is the question the whole project answers, and the answer
is a resounding yes: the site remains plain HTML built by Hugo, and the
app's database contains zero book content. Nothing about the site changed
at all — that's the beauty of it.

**Did AI really build this in one day?**
Yes — and no. The AI wrote the code; a human wrote the brief, made every
decision that mattered, deployed to production, and supplied three rounds
of sharp-eyed feedback. The one-day timeline is real (the build log is
dated), but it was one day of *collaboration*, not one day of magic.

**What happens if the AI proposes a book that doesn't exist?**
It doesn't get the chance. Unknown series produce a single honest entry
with empty fields rather than invented books, every proposal is reconciled
against the repository before it's shown, and nothing — nothing — publishes
without human review.

**Can I use this app?**
No — and that's by design. It's a single-user tool for a single booklog,
with one account and one very specific job. But every pattern in it — the
git-client-with-forms architecture, the line-targeted writes, the explicit
publish button — is yours to steal.

## 🛣️ The Road Ahead

Is the app finished? Of course not — finished is not a state, it's a
direction. The deploy indicator waits for its access token to be installed
on the server. Slug and URL editing remain on the wish list, as does
removing a book. There will be a feedback round four, and a five; the build
log ends with a standing instruction that every future work session must
append its entry, and there is no reason to doubt it will be obeyed.

But step back and look at what one day produced. A booklog that survived
twenty-four years of desktop-bound maintenance can now be fed from a
phone on the couch, from a train, from the bookshop itself: type a title
into a box, glance at what the AI proposes, correct what needs correcting,
tap accept, tap the red badge, and watch the checkmark arrive. The site
remains exactly what the migration made it — static files, one repository,
no database — and yet it now has the one thing static sites are never
supposed to have: convenience.

The site stayed pure. The workflow got easy. And the gap between "I
finished a book" and "the booklog knows" has shrunk to the length of one
red badge.

That's not a compromise. That's not a trade-off. That's the whole point. ✨

<figure class="fig">
<img src="/boeggn-app/images/fig12.jpg" alt="A photorealistic velvet-and-brass Victorian reading room at night: a tufted purple sofa with an open book, a steampunk pipe organ, marble busts with glowing diadems, botanical prints, and by the sofa a brass-mounted smartphone whose neon screen reads 'Booklog: 97% complete'; through the arched window, a neon wireframe crescent moon." loading="lazy">
<figcaption><span class="fig-n">Figure 12</span> Journey's end: a quiet room, a good book, and a booklog that is finally — almost — complete.</figcaption>
</figure>


<div class="author-note">
<h2>What it actually looks like</h2>
<p>All AI slop kidding aside, I'm pretty happy with the little app. The book cover lookups don't quite work like I think they should, and I really need to test some of the edge cases (adding books that are already in there under the same name, under a slightly different name, how does it deal with re-reads, some additional polish) — but overall Claude did a great job with really <em>minimal</em> additional prompting:</p>
</div>

<figure class="fig">
<div class="fig-row">
<img src="/boeggn-app/images/Screenshot_20260710_020805_Chrome.jpg" alt="The boeggn app home on a phone: 'Toevoegen', 'Lezende' and 'Bewerken' cards above an 'Aan het lezen' shelf listing Reaper's Gale at 52%, The Odyssey, Ice, The Yiddish Policemen's Union and Victorian Psycho, each with cover and progress bar." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_020826_Chrome.jpg" alt="The update-reading screen for Victorian Psycho: cover, a 'Voortgang' field showing 36, gelezen/te gaan/% mode pills with % selected, and a 'Bijwerken & publiceren' button, numeric keyboard open." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_020911_Chrome.jpg" alt="The 'Bewerken' search screen: the query 'Foot' returns Slewfoot: A Tale of Bewitchery by Brom and Footnotes in Gaza by Joe Sacco; a small red '1' pending-publish badge sits in the header." loading="lazy">
</div>
<div class="fig-row">
<img src="/boeggn-app/images/Screenshot_20260710_020919_Chrome.jpg" alt="The Slewfoot edit form: cover and the '/slewfoot/' slug, 'begin te lezen' and 'uitgelezen — quoteer & bespreek' buttons, and fields for Titel, a Datum picker (08/07/2026), Plank set to 'te lezen' and a Score slider with 'geen score' ticked." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_020937_Chrome.jpg" alt="The taxonomy part of the same edit form: category toggle buttons with 'horror' selected, a 'nieuwe categorieën' field gated behind a confirmation checkbox, a Tags field, and an Auteurs field reading 'brom'." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_021336_Chrome.jpg" alt="The 'Toevoegen — te lezen' screen: a free-text box containing two lines, '100 years of Solitude' and 'Licanius trilogy', above an 'Analyseer' button." loading="lazy">
</div>
<div class="fig-row">
<img src="/boeggn-app/images/Screenshot_20260710_021421_Chrome.jpg" alt="An AI proposal card for 'The Shadow of What Was Lost': the author matched to islington-james, the series 'The Licanius Trilogy' flagged as new, and editable Uitgever (Orbit), Jaar (2014) and Reeks # (1) fields — the trilogy expanded to its first volume." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_021737_Chrome.jpg" alt="Back on the app home with edits queued: a red '5' badge and a 'Publiceer 5' button in the header, above the currently-reading shelf, Victorian Psycho now showing 36%." loading="lazy">
<img src="/boeggn-app/images/Screenshot_20260710_022302_Chrome.jpg" alt="The published result on the live boeken.tsuk.org 'Te lezen' shelf in the browser: the three James Islington Licanius covers dated 10 jul 2026, alongside One Hundred Years of Solitude, Chasing Graves, Snakewood and more." loading="lazy">
</div>
<figcaption><span class="fig-n">Figure 13</span> What it actually looks like — one pass through the app, in order: browsing the currently-reading shelf <em>(a)</em>; nudging <em>Victorian Psycho</em>'s progress <em>(b)</em>; searching <em>(c)</em>, then editing a book <em>(d)</em> and its taxonomy <em>(e)</em>; adding books from a couple of lines of free text <em>(f)</em> and reviewing the AI's proposal, the Licanius trilogy expanded to its volumes <em>(g)</em>; five edits queued to publish <em>(h)</em>; and, minutes later, the result on the live site <em>(i)</em>.</figcaption>
</figure>