---
title: "Generation"
navLabel: "Generation"
section: 3
status: draft
---

# Generation

## Generating the articles

The generator walks through six steps. The design
principle throughout: anything that can be decided or checked in ordinary
code is decided or checked in ordinary code, and the model works inside those
decisions. Every model call uses strict JSON schemas (OpenAI structured
outputs), so each step returns machine-checkable data, not prose to be
parsed. Each completed step is checkpointed to disk, so a crashed run resumes
where it stopped. After three failed attempts a step falls back to a cheaper
model, and the article is permanently tagged as degraded so it can be found
later.

**The assignment is drawn in code, before any model writes a word.** A
variety module holds fifteen article genres (news analysis, obituary,
interview, business-page report, reportage in the letter-from-X mode,
opinion column, book review, court report, local human-interest feature,
profile, unsigned editorial, arts review, science feature, reporter's
notebook, and — deliberately down-weighted — the anniversary feature), each
with a weight, a target length, required block counts, and its own
repertoire of plausible news hooks; and five publication registers, from
sober broadsheet to trade paper. Quote sources are composed per article from three orthogonal axes: an
occupation from a hundred-odd trades (a canal lock-keeper, an insurance
assessor, a rival paper's reporter), a stance toward the writer's argument
(flatly opposed; evasive; angrier about a side issue than the main
question), and a relation to the event's legacy (benefited; lost and knows
it; custodian of something it created). Three sources are cast this way,
occupations and stances sampled without replacement so no two share either,
and the prompt insists these are casting axes, not characters — each source
must get a name, an age, a workplace, and one detail that cuts against type.
Every published article carries its assignment stamped into an internal
field, and the next runs read those tags back: the genres of the last three
articles and the hooks of the last five are excluded from the draw, so the
same form cannot run on consecutive days. All of this exists because a
model asked daily for "an alternate history article" converges on one
template; drawing the constraints in code makes convergence impossible at
the level where it matters.

**Most news hooks come from the real news.** Before the draw, the generator
pulls up to thirty items from five live feeds — the NYT front page and world
desk, the Guardian, the BBC, Le Monde — and a model call reduces them to at
most fifteen "event skeletons": one- or two-sentence story shapes with every
proper noun, date and period-bound artifact stripped out, but the human
specificity kept ("a repair bill for a beloved public clock exposes that
nobody can say who owns it"), each tagged with domains such as law,
transport, or religion. Genres that take an open hook draw one of these
skeletons seventy per cent of the time, filtered to the genre's domains; the
selection step is told the shape is binding but every particular — names,
places, institutions, period — must be invented natively inside the
article's world. Another twenty per cent of draws compose a seed from a
domain crossed with an occurrence shape ("a shortage, glut, or price shock"
in "agriculture, food, and drink" — some three hundred and fifty
combinations), and the remainder falls back to a static pool of twenty-nine
written hooks, which is also where the occasion-bound genres always draw: an
obituary needs a death, a book review needs a book. The reasoning is that
real news never repeats and never regresses to a genre mean, which makes the
wire a better variety source than any hand-written pool — provided only the
shape survives. If the feeds are unreachable, the skeleton stage fails soft
and the composed and static pools carry the day.

**Step 1 — selection.** Five unused events matching today's month and day
(CE only, and at least fifty years old) are sampled from the database. The
model is given the assignment and the five candidates and returns the one
best able to support that exact genre and hook, along with a divergence
date, a publication date (at least fifty years after the divergence, within
the last hundred years, and explicitly *not* near the event's anniversary
unless the hook is an anniversary), a concrete news hook — who died, what
was ruled, what broke — a publication context (name, city, editorial stance,
intended readership), an angle for the piece, and a note of which subjects
would photograph well. The code verifies the chosen event was actually among
the candidates.

**Step 2 — the world brief.** A second call produces an internal dossier the
writer must follow: a timeline of at least five dated developments between
divergence and publication date, canonical facts to preserve, real-history
traps to avoid, named entities, and — this matters most — friction. The brief
must contain a question people in that world genuinely disagree about, at
least two groups for whom the change turned out badly and whose grievance is
still alive, and two to four current problems (disputes, shortages, strikes,
price rises) usable as texture. The prompt's central rule is proportionality:
change only what the divergence actually changes, and the further a domain is
from the causal chain, the more it should resemble real history. The brief
also invents the writer — a persona with an age, a history at the paper, and
a visible bias — and sketches a visual brief for the photo editor: subjects
worth shooting, with the reason each fits.

**Step 3 — the draft.** The article is written in one pass, in the language
of the source event, opening from the news hook rather than the historical
event. The prompt includes a period style anchor: the variety module keeps,
for each language and each of six eras, a list of the era's stylistic
markers plus a short original pastiche paragraph — clipped wire-service
prose for 1914–1945, colour-supplement irony for 1976–1999 — which the model
is told to match in register and rhythm but not in content. The prompt also
carries a digest of the last ten published articles (titles, subtitles, and
final paragraphs) that the new piece must not resemble, and a list of banned
motifs compiled from observed convergence in earlier output — among them the
closing scene in which the writer walks along a waterfront and reflects, and
the two-clause aphoristic final sentence ("The engines are new; the task is
old."). A structural rule backs the ban: the final paragraph must end on a
fact, a scene, or a quote — never an aphorism or a restatement of the
thesis.

**Step 4 — critic and revision.** Before any model critique, a mechanical
scanner goes over the draft in plain code: regular expressions for "not X,
but Y" constructions in the article's language, counts of em-dashes and
exclamation marks, heuristics for epigram endings and aphoristic callouts,
and a check for quote casting that leans too academic. Its findings seed a
critic pass — a model call prompted as an outside line editor that lists up
to twelve defects, each with the exact offending sentence quoted and a
concrete fix, hunting in order for machine accents, period mismatch,
resemblance to recent articles, missing friction, in-world leaks, and genre
drift. If defects are found, a revision pass rewrites exactly those sentences
and nothing else. The revised article then passes through hard validation in
code: the dates are overwritten with the canonical ones from step 1 (the
model is not trusted with them), the publication name is rejected if it
contains any meta term like "alternate" or "uchronie", block minimums for the
genre are enforced, and no quotation may be attributed to the article's own
author. The same checks run again server-side in the API serializer, so even
a buggy client cannot publish a meta-named publication.

The system prompt shared by all steps enforces the in-world frame with a flat
vocabulary ban: the visible text may never contain "in our world",
"timeline", "divergence", "what if", or comparisons to real history —
internal planning fields may reference real history freely, visible article
text may not.

**A worked example.** One run drew the *anniversary feature* — the single
genre the module deliberately down-weights — in the sober-broadsheet
register, with three quote sources cast in code: an antiques dealer who
argues both sides in a breath and lost by the outcome, a hospital porter
angrier about a side issue than the main one, and a cartographer flatly
opposed to the writer's line. From five candidate events for the date, the
model chose this one:

> **[10156] 1973-07-12** — A fire destroys the entire sixth floor of the
> National Personnel Records Center of the United States.

The brief made the divergence concrete: the fire burns unchecked for nearly
two days instead of being contained, destroying most United States service
records from 1912–1968, and the loss drives fifty years of litigation and
repair — a Veterans Proof Act, a geospatial "Muster Map" program that
reconstructs service from payrolls and ship logs, a running national
argument about fraud versus redress. The resulting article is dated
2023-07-12, fifty years on, in an invented St. Louis daily, and — as the
form demands even of an anniversary piece — opens not on the fire but on
this week's news of it:

> Under a gray Midwestern sky on Tuesday morning, in the parking lot of the
> National Personnel Records Center annex off Goodfellow Boulevard, the
> National Archives and Records Administration and the Department of
> Veterans Affairs marked the 50th year since the fire with a ceremony, a
> 212-page report, and a small rule change with large implications. The
> pilot unveiled there allows sworn neighborhood and workplace affidavits to
> corroborate lost service when coupled with a concrete locator — a payroll
> stub, a ship log extract, or a geospatial placement on the long-running
> Muster Map.

<figure class="fig">
<img class="theme-light" src="/echoes/images/article-light.jpg" alt="an article titled 'Fifty years after the fire, the state asks for proof it helped burn'" loading="lazy">
<img class="theme-dark" src="/echoes/images/article-dark.jpg" alt="an article titled 'Fifty years after the fire, the state asks for proof it helped burn'" loading="lazy">
<figcaption>The article, as published <em>Echoes</em></figcaption>
</figure>

## Generating the images

Images get their own step after the article is final. A model call prompted
as a photo editor working inside the article's world proposes one to five
image concepts — one hero, the rest supporting — each with an English
generation prompt, an aspect ratio, and alt text, caption and credit in the
article's language. The concepts are asked to prefer oblique, story-bearing
scenes (a corridor conversation, a loading dock, a kitchen table) over
ceremonial ones, and to default supporting images toward objects, documents,
interiors and streetscapes rather than people.

The prompt encodes a table of visual technology by publication date: an
article dated 1870 gets wet-plate collodion with its chemical artifacts, one
from 1950 gets flashbulb press photography on Tri-X-like stock, one from 1990
gets colour film with a named cast, pre-1840 gets engraving or oil painting
with a specified school. Before generation, code wraps each prompt with
medium-specific instructions — one wrapper for photographs (grain, uneven
lighting, imperfect focus, "candid press photo, not posed"), one for
paintings and prints (brushwork, plate marks, craquelure), one for object
studies (patina, foxing, neutral archival lighting) — plus a common prefix
against the failure modes of image models: cloned faces, mirrored poses, tidy
formations, perfect symmetry, and any text or lettering in the image.
"Dramatic lighting" and "cinematic" are banned outright because they reliably
produce the AI-art look.

A possible enhancement is left open: currently no check compares the generated image against the article — consistency is enforced only by prompting, not verified afterwards.

Generated images come back as PNG, are converted to JPEG, uploaded through
the media API (which checks file signatures and size and stores the prompt as
the image description), and attached: the hero becomes the article's featured
image, and supporting images are inserted into the body at evenly spread
positions, with a rule that an image never lands directly above a section
heading.

The results are period-plausible rather than period-authentic. A reader who
knows photography will find tells — the processes are described to the model,
not simulated — and the captions claim archives that do not exist. The images
are meant to carry the same fiction as the text, at the same level of craft,
not to survive forensic inspection.

<figure class="fig prompt-table">
<table>
<colgroup><col style="width:38%"><col></colgroup>
<thead>
<tr><th>Image</th><th>The prompt the model wrote for it</th></tr>
</thead>
<tbody>
<tr>
<td><img src="/echoes/images/fifty-years-after-the-fire-the-s.2e16d0ba.fill-2200x1400.jpg" alt="Outside the NPRC annex, a woman holds a framed portrait while a VA official speaks with her as staff wheel archival boxes past an affidavit tent." loading="lazy"></td>
<td><strong>Hero — the ceremony, 2023.</strong> Documentary photograph taken July 11, 2023 outside the National Personnel Records Center annex in St. Louis. Asymmetric, candid composition from shoulder height with a full-frame DSLR and 35mm lens at f/4. The dominant subject is an older woman in a light cardigan standing left of frame, holding a framed portrait of a serviceman at chest height; a VA official in a dark suit leans slightly toward her mid-conversation. Midground shows a records cart with gray archival boxes being pushed past a small tent where a staffer administers a sworn affidavit at a folding table; a few veterans and family members of varied ages stand or sit in scattered folding chairs. Overcast sky, flagpoles and the annex facade recede at a diagonal. Natural color, gentle falloff toward the edges, slight motion blur on the cart wheels, fine high-ISO noise in shadow areas. No readable text or signage in frame; incidental litter near a curb and water spots on asphalt after a light drizzle.</td>
</tr>
<tr>
<td><img src="/echoes/images/fifty-years-after-the-fire-the-state-asks-for.width-1200.jpg" alt="Interior view of the NPRC in 1973 with charred shelves, smoke damage, and firefighters moving through wet debris." loading="lazy"></td>
<td><strong>Supporting — the fire, 1973.</strong> Archival photograph from inside the NPRC building in July 1973. Shot on Ektachrome 64 color slide film with a 28mm lens, handheld; visible blue-green color cast, moderate grain, slight motion blur on moving figures. Off-center framing shows charred metal shelving sagging to the right, smoke-blackened ceiling above, and pools of water reflecting flashlight beams on the floor. Two firefighters in turnouts move through wet debris; one is half-turned, face distinct and streaked with soot, the other bends to lift a warped folder with tongs. Incidental background detail includes fallen ceiling tiles and a hose snaking past a doorway. No readable text visible anywhere in the scene.</td>
</tr>
<tr>
<td><img src="/echoes/images/fifty-years-after-the-fire-the-state-asks-for_wovzzLN.width-1200.jpg" alt="Gloved hands in the NPRC lab steady a warped personnel folder on a light table, with drying racks and humidity domes behind." loading="lazy"></td>
<td><strong>Supporting — the reconstruction lab, 2023.</strong> Documentary close-up photograph inside the NPRC Reconstruction Lab, 2023. Shot with a full-frame DSLR and 100mm macro lens at f/5.6. The dominant action is a pair of gloved hands stabilizing a warped personnel folder on a backlit light table; paper fibers, water wrinkling, and singed edges are clearly visible. Background shows humidity domes, drying racks, and a conservator's apron hanging on a peg; labels and barcodes are turned away to avoid readable text. Soft spill from overhead fluorescents, shallow depth of field with the hands and paper crisp and edges falling out of focus; minor sensor noise in shadows.</td>
</tr>
<tr>
<td><img src="/echoes/images/fifty-years-after-the-fire-the-state-asks-for_pvO3feS.width-1200.jpg" alt="A cartographer studies a deck log against a coastal chart with acetate overlays and a magnifier at a drafting desk." loading="lazy"></td>
<td><strong>Supporting — the geospatial desk, 2023.</strong> Documentary photograph of a cartographer's drafting desk in a St. Louis studio, 2023. Captured with a mirrorless camera and 50mm lens at f/2.8 from a standing angle over the left shoulder. The dominant subject is a middle-aged woman with short, graying hair and wire-rim glasses pushed up, leaning in with a magnifier to compare a Navy deck log page to a coastal chart; her right hand holds a compass divider over an acetate overlay marked with grease pencil lines. The desk is cluttered with map weights, an erasable pencil, and a coffee mug ring; computer monitor kept out of frame. Fluorescent overhead light, natural skin texture and fine lines visible, slight lens vignetting. Any text on charts or logs is angled away and unreadable; background shows flat files and a rolled wall map edge with worn tape.</td>
</tr>
</tbody>
</table>
<figcaption>The four concepts the photo editor proposed for the article, each with the English prompt it wrote. The fire itself is rendered as a 1973 archival slide; the present-day ceremony, lab, and mapping desk as digital press photography — the medium follows the moment each image claims to document.</figcaption>
</figure>

## Editorial control and plausibility

The text and image pipelines share one idea: the signals that make something
read as real news are mostly signals of friction and imperfection, and a
generative model left to itself produces neither. So the system manufactures
them:

- **Variation is structural, not stylistic.** Article length runs from a
  700-word unsigned leader to a 2,000-word feature; some genres forbid
  section headings, others require three; the quote casting changes daily.
  None of this is the model's choice.
- **Disagreement is mandatory.** Every article must take a side a reasonable
  reader could reject, quote at least one source who pushes against the
  writer, give a loser of history space and voice, and criticise an
  institution its own readers respect.
- **The world is unfinished.** The brief's required frictions — the strike,
  the price rise, the unresolved lawsuit — keep the alternate world from
  presenting as a solved success story, which was an observed failure mode.
- **Knowledge is assumed, not explained.** Writing from inside the timeline
  means the article cannot explain what its readers would already know; the
  in-world vocabulary ban makes the explanatory register grammatically
  difficult to reach.
- **Names, dates and places are held fixed in code** across selection, brief,
  article and revision, so the parts of an echo cannot drift apart.
- **The images match the supposed source**, not the subject: the technology
  table keys on the publication date, so a piece about an 1850 event
  published in 1960 gets 1960 press photography.

Perfect deception is not the goal, and the site's own subtitle gives the game
away. What interests me is which of these signals do the work — how much of
"this reads like a newspaper" is register, how much is friction, how much is
a photograph with the right grain. Echoes is a machine for varying those
parameters one day at a time.
