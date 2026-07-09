---
title: "Lessons Learned: What One Day Can Teach You"
heading: "The lessons"
navLabel: "The lessons"
section: 6
status: draft
---

# The lessons

## The Honest Accounting

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
Neither half works alone. Together, they build an app in a day.

> **[Figure 11]** *By the numbers.* Generate a wide (16:9) stat-card
> infographic: a 2×4 grid of rounded rectangles on a dark slate background,
> each with a large teal (#0F8B8D) figure and a small grey label. Cards,
> exactly: "1 — day from proposal to production", "4 — phases, ordered by
> risk", "3 — feedback rounds, all applied", "3 — flows: toevoegen ·
> voortgang · bewerken", "~900 — posts round-tripped byte-identically
> before the first real save", "0 — book content stored in the app's
> database", "2 → 1 — two writers, one source of truth", "22 px — of very
> red publish badge". Give the "0" card an amber accent instead of teal.
> No other decoration or text. Suggested caption: "The build, quantified."

## Key Takeaways

Every journey deserves a summary, and this one earned its bullet points:

- **Find the API you already have.** The repository was the content API all
  along; `git push` was already the publish button. The best integration is
  the one you don't build.
- **Order phases by risk, not by glamour.** The humble progress update
  proved the entire pipeline before a single line of AI code existed.
- **Never re-serialize what you can line-target.** Hundreds of hand-groomed
  files stayed byte-identical because the writer edits lines, not documents
  — and *proved* it against every post in the repo.
- **Reconcile before you show.** AI proposals are checked against the
  repository first; the one expensive mistake (an invented book) is the one
  the prompt explicitly forbids.
- **Never guess; degrade honestly.** An unknown series becomes one
  null-entry, not three invented books. A too-small cover becomes no
  candidate, not a bad one. A missing API token renders nothing, not an
  error.
- **Make publishing a decision.** Atomic local commits plus one deliberate
  publish button solved a deploy-cancellation problem *and* made the
  workflow calmer. The badge is red for a reason.
- **Test on the device you built for.** The phone screenshot found what
  desktop spot-checks missed twice.
- **With deploy keys, the alias goes in the remote URL.** Some lessons cost
  an evening; this one is yours for free.

## The Road Ahead

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

That's not a compromise. That's the whole point.

> **[Figure 12]** *Closing illustration.* Generate a wide (16:9) flat-design
> illustration with soft gradients: a quiet evening scene — a couch armrest
> with a paperback lying face-down, and next to it a smartphone whose
> screen glows softly with a tidy shelf of tiny colourful book covers and
> one small red badge dot in its top corner. Through a window behind, a
> distant city at dusk. Palette: deep slate blues, warm amber lamplight,
> teal (#0F8B8D) accents on the phone screen. No legible text anywhere.
> Mood: settled, unhurried, complete. Suggested caption: "The gap between
> finishing a book and the booklog knowing: one couch, one phone, one red
> badge."
