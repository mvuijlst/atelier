---
title: "Generation"
navLabel: "Generation"
section: 3
status: draft
---

# Generation

## Reading the newspaper

Each run starts with two downloads. The first is the day's front page as an
image — the NYT publishes a scan at a predictable URL — saved into the
static files so it can later be shown as provenance. The second is the
home-page RSS feed, from which six items are sampled with their titles,
links, descriptions and section categories. Links that inspired an earlier
recipe are filtered out first, so no story is used twice.

Before anything is picked, a sensitivity gate classifies the candidates: a
model call labels each story as centring on tragedy or human suffering or
not (political controversy, sports, culture, business and science are
explicitly not sensitive by themselves; if the call fails, everything passes
as non-sensitive so the run can proceed). The generator prefers to fill both
slots from the non-sensitive pool. When that isn't possible, the sensitive
story stays but is flagged, and the recipe prompt gains a hard instruction:
the inspiration text may acknowledge the subject soberly, but the title and
introduction must not reference or pun on it. The system prompt bans
death, disaster and war from titles unconditionally, flagged or not.

Then the front page picks the lead. A vision call receives the scanned page
and the candidate headlines and answers two questions: which of these
headlines is the most prominent story on the page, and what is the page's
overall mood, in one short phrase ("tense and stormy", "quietly hopeful").
The lead story becomes the first source article; the second is drawn at
random from the rest. The mood phrase goes into the prompt — the instruction
is to let it gently colour the dish and its framing — and onto the recipe
page. If the scan or the API is unavailable, both slots fall back to random
sampling and the run continues.

## Drawing the assignment

The shape of the dish is decided in code, before any model sees the
articles. Five weighted pools rotate day by day, with the state persisted
between runs so the same option cannot come up twice in a row: ten course
types (Main weighted heaviest, down to Dessert, Breakfast and Snack), twelve
techniques (roasting and pan-searing common, poaching and quick pickling
rare; sous-vide was removed as off-brand for a weeknight site), nine
proteins, eight bases, and ten "connection styles" that say *how* the dish
should relate to the news. The connection weights encode an editorial
position: geographical connections are weighted ten, wordplay one. Left to
itself the model reaches for the pun; the draw makes that rare.

Two mechanisms adjust the draw. A weekly menu skeleton assigns each weekday
a slot — Meatless Monday, Fish Tuesday, Weeknight Express (45 minutes,
minimal cleanup), Comfort Thursday, Casual Friday, Saturday Project, Sunday
Table — and where a slot names allowed proteins, it overrides the rotation's
pick. And reader votes feed back: each recipe stores which options produced
it, so thumbs up and down accumulate per option and nudge its weight,
clamped to ±2 so feedback can never dominate the base editorial weights.

The draw is followed by bans derived from recent output. Any ingredient
that appeared in three of the last seven recipes is forbidden by name —
pantry staples like salt, oil and garlic are exempt, but lemon and parsley
deliberately are not, because they were being used as headline flavours, not
staples. A second check works at the level of component *archetypes*: a
quick-pickled element, a yogurt-based sauce, citrus in the title, a
vinaigrette, a herb-flecked grain base. If an archetype shows up in two of
the last five recipes it is banned outright, even when the exact ingredients
differ — with one exception: if today's rotation deliberately drew "quick
pickling" as the technique, the pickle ban stands down rather than
contradicting it. Finally, exactly one scraped recipe reference is added as
loose inspiration, drawn from a pool that mixes NYT Cooking with
*Dagelijkse kost*, the Flemish weeknight cooking site, preferring the
Flemish source two to one.

## Generating the recipe

Generation is two-staged. First a concept call: given the full brief, the
names of the last ten published recipes, and the banned archetypes, the
model must propose three genuinely different dish concepts — different in
flavour direction, component structure and format, not three variations of
one idea — and pick the one most distinct from the recent recipes. Only the
chosen concept, a working title and a two-sentence summary, is carried
forward; the final prompt pins it with "execute THIS idea". This stage
exists because a single-pass generator, asked daily, converges on a house
formula; making it argue three options first is the structural fix.

The main call then produces the whole recipe against a fixed JSON schema.
The system prompt is a chef persona with specific rules rather than
adjectives: quantities precise ("325g not 300g"), heat levels and sensory
cues in the steps, metric units used consistently — grams for dry goods
*and* for salt, so "salt to taste" becomes "4g fine sea salt" — poultry
temperatures stated, at most three ingredient groups and eighteen
ingredients, no equipment beyond a normal home kitchen, tips routed to the
cook's note instead of the numbered steps. Title rules get their own block:
maximum eight words, name the dish without enumerating components, and never
combine a format word with its own technique ("One-Pan Pan-Seared" is the
canonical offence).

The draft is then reviewed twice — once by the model, once by code. The
model pass asks for a list of concrete issues (quantities that don't match
the servings, ingredients used in steps but missing from the list,
inconsistent units, unsafe poultry temperatures, overlong titles), and only
if issues come back does a second call fix exactly those and nothing else.
Asking for an issues list first matters: a blanket "return the corrected
JSON" request nearly always returns the input unchanged. The code pass then
checks what code can check: the inspiration text must be long enough,
contain working Markdown links to both source stories, and never use the
words "article" or "news" — if it fails, one targeted call rewrites that
field alone. The course type the model chose is discarded entirely and
overwritten with the rotation's canonical pick. And every text field is run
through a cleaner for a specific model artifact: GPT-5 sometimes emits raw
ASCII control characters where Unicode punctuation belongs, in a consistent
pattern, so the cleaner maps them back to apostrophes and hyphens and
normalises the rest.

On save, ingredient names are resolved by slug against the canonical master
list (so "red onion" is one entity site-wide), units are created with their
singular and plural forms, instruction groups are normalised so untitled
fragments merge into a single numbered list, and the provenance object —
source articles, the draw, the concept, the mood, the front-page image path,
the menu slot — is stored on the recipe for the "Why this dish?" panel.

## The photograph

The hero image gets the same treatment as the text: the parts that can be
decided in code are decided in code. A composition is drawn from five
controlled vocabularies — eight camera angles, eleven framings, eleven
settings, twelve lighting styles, twelve moods — under three rules: the
angle-plus-setting pair must not have been used in the last thirty days, the
composition must differ from each of the last five in at least three of the
five fields, and two centered compositions may not run back to back. The
chosen composition is written into a prompt around the dish name and a
one-sentence visual description the recipe model produced for exactly this
purpose ("Golden-crusted salmon fillet on a bed of bright-green pea
purée…"). The style block asks for editorial food photography with natural
imperfections — char marks, a drip of sauce, steam, herbs wilted from heat —
and bans the failure modes: no faces or hands, no text or logos, no
illustration styles, and no rustic wood unless the setting explicitly says
so. Prompt and composition are persisted per recipe; that history is what
future draws diversify against, and the exact prompt is visible on the
recipe page when I'm signed in.

Image generation is deliberately non-fatal: if the call fails, the recipe
publishes without a photo, and the front page simply features the most
recent recipe that has one. A manual path exists as backstop — an upload
page that recompresses images to JPEG, shows a ready-made Midjourney prompt,
and offers the next OpenAI composition as an editable preview.

## Seasonality and Belgium

I want to be precise about what happens here, because it is less than
"the system knows the season". The prompt states the month and the country —
"choose seasonally available ingredients for July in Belgium; favor fresh
produce, herbs, and proteins that are easy to find in supermarkets" — and
the model works within that instruction. There is no ingredient calendar in
the code and no check, after generation, that an ingredient is actually in
season; seasonality is a constraint the model is given, not a fact the
application verifies. What the application does enforce is adjacent:
the overuse bans rotate produce week to week, the pairing field asks
specifically for Belgian beer styles or accessible wine, and the scraped
inspiration pool leans Flemish. In practice the two mechanisms cover for
each other — the month in the prompt sets the palette, the bans stop the
palette from freezing.
