---
title: "Experience"
navLabel: "Experience"
section: 4
status: draft
---

# Experience

## Editing, storage, publication

Publication is immediate: the daily command saves and the recipe is live.
There is no draft stage and no approval gate; editorial control is
retrospective, through the Django admin and through affordances that appear
on the site itself when I'm signed in — an image editor, an edit link into
the admin, and a delete action that also sweeps up ingredient names and
course types left orphaned by the deletion. Votes are sign-in only. The
recipes are not cooked or tested before publication; the food-safety rules
(internal temperatures for poultry and ground meat) are constraints placed
on the generation, not verification of the result.

## User experience

The reading side is a deliberately conventional recipe site, because the
generated content is the strange part and the container shouldn't be. The
front page features the newest recipe with a photo, then a grid of the
latest seven. A recipe page puts the photo left and the words right, with
the inspiration note and its two source links up front and the "Why this
dish?" panel folded beneath them. The ingredient card is sticky, with a
servings stepper: base quantities are rendered server-side (so the page
works without JavaScript and search engines see real quantities, including
in the schema.org markup with nutrition), and scaling happens client-side,
down to singular/plural unit handling. Steps are numbered, the cook's note
sits apart from them, and the drink pairing gets one line.

Beyond the daily page, the structured data model earns its keep: every
recipe is browsable by course type, by ingredient — each canonical
ingredient has its own page listing every recipe that uses it — and by a
hierarchical category tree (fruit, meat, spices…). A year calendar marks
which days of the year have a recipe, any year, and each day page collects
that date's recipes across years — the site's own way of accumulating an
archive one day at a time. There is an RSS feed with the photo as enclosure,
a light and a dark theme, per-view file-based caching, and every response
carries an `X-Clacks-Overhead: GNU Terry Pratchett` header.

## Current limitations and open questions

Seasonality remains prompt-deep, as described — the honest fix would be a
small ingredient calendar the code checks against, and I haven't decided
whether that rigour is worth it. The sensitivity gate reads only a story's
title and the first four hundred characters of its description, so a story
whose weight sits deeper in the text can slip past classification. The
anti-convergence machinery is reactive by construction: the staples list and
the archetype keywords each exist because that repetition had already been
noticed on the site, which suggests both lists will keep growing. Nutrition
figures are the model's stated ballpark and nothing recomputes them. And the
vote-feedback loop is honest but mostly dormant: voting requires an account,
so until the site has signed-in readers, the weights move on my thumbs
alone.
