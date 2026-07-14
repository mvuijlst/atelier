---
title: "Annex: prompts"
heading: "Annex: prompts"
navLabel: "Annex: prompts"
section: 5
status: draft
---

# Annex: prompts

This annex is an overview of every model prompt in the pipeline — what each
call is told, what data is interpolated into it, and what it must return.
The living originals are the prompt builders in `openai_recipes.py`,
`fetch_nyt_inspiration.py` and `food_photo_prompts.py`; if this page and
the code disagree, trust the code.

## The chef system prompt

Five of the seven text calls — concept, main generation, review, fix, and
inspiration rewrite — share one system prompt: a chef persona, "a seasoned
chef and food editor with 20 years of Michelin-starred and home-cooking
experience", producing strict JSON. Its rules are specific rather than
adjectival:

> Quantities must be precise and tested-feeling (e.g., 325g not 300g;
> 1½ tbsp not 2 tbsp).

> Season assertively: include salt quantities (e.g., '4g fine sea salt')
> rather than 'salt to taste' where possible.

> Food safety: poultry must reach 74°C internal (or state an explicit hold
> time if lower); ground meat 71°C; reheated leftovers 74°C.

The title rules get their own block — "Maximum 8 words, in Title Case",
"Never combine a format word with its own technique (e.g., not 'One-Pan
Pan-Seared')" — and the tragedy ban is unconditional:

> Never reference death, disaster, war, or human suffering in the title,
> even obliquely.

## The text calls

All text goes through the Responses API with JSON output (gpt-4o-mini by
default, GPT-5 in my configuration). Each call has its own temperature — a
deliberate gradient from 0.0 for classification up to 0.9 for
brainstorming.

| Call | Temp. | The model is told | Interpolated into the prompt | Returns |
|---|---|---|---|---|
| **Sensitivity gate** | 0.0 | "You are a careful news-content classifier." Decide whether each item "centers on tragedy or human suffering: death, disaster, war, violent conflict, serious accidents, disease outbreaks, or grief"; "Political controversy, sports, culture, business, and science are NOT sensitive by themselves." | Each candidate story's title, description (first 400 characters) and categories | `{results: [{sensitive, reason}]}`, one per item, in order |
| **Front-page vision call** | — | "This is today's New York Times front page. Which of the following headlines matches the most prominent story on this page?" and "Describe the overall mood of the front page in one short phrase (e.g. 'celebratory', 'tense and stormy', 'quietly hopeful')." | The scanned front page as an image; the numbered candidate headlines | `{lead_index, mood}` |
| **Concept brainstorm** | 0.9 | "Brainstorm THREE genuinely different dish concepts for the brief below. The three must differ in flavour direction, sauce/component structure, and format - not three variations of one idea." Pick the most distinct. | The full news brief; the last ten recipe names ("Recent recipes on the site (do NOT resemble these)"); the banned archetypes | Three concepts plus `chosen_index` and `why_distinct` |
| **Main generation** | 0.5 | The chef persona plus the assembled brief; "invent ONE delicious, realistic recipe that a home cook can make today using common, widely available ingredients"; "Total time ≤ 75 minutes (prep + cook)." | Target servings; the two articles; the rotation draw with its connection-style guidance; the mood; the menu slot; the ingredient and archetype bans; the scraped inspiration; the pinned concept; the schema instructions | The full recipe JSON: name, intro, inspiration, visual_description, times, ingredient groups, instruction groups, types, pairing, cook's note, nutrition |
| **Review pass** | 0.2 | "Review this recipe JSON for culinary realism and report problems." A seven-point checklist: "Do quantities make sense for the number of servings? (e.g., not 500g garlic for 4 servings)", safe poultry temperatures, and so on. "Return ONLY a JSON object: {\"issues\": [...]}. Empty array if the recipe is fine." | The generated recipe JSON | An issues list; if empty, the fix pass is skipped |
| **Fix pass** | 0.2 | "The recipe JSON below has these specific problems: […] Return the FULL corrected JSON object with exactly these problems fixed and nothing else changed." | The recipe JSON; the bulleted issues from the review pass | The corrected recipe JSON |
| **Inspiration rewrite** | 0.3 | "Rewrite ONLY the 'inspiration' field to be 120–200 words, vivid and specific, weaving concrete ideas from BOTH sources"; "Do not use the words 'article' or 'news' in the body text"; end with the exact Markdown-linked "Inspired by" sentence | Both articles; the rotation draw; the current recipe | The recipe with only `inspiration` changed; only runs when the code checks fail |

The schema instructions appended to the generation prompt also carry two
smaller editorial rules verbatim: "For pairing: one sentence suggesting a
drink to serve alongside; prefer a specific Belgian beer style or an
accessible wine", and "For visual_description: one vivid sentence (max 30
words) describing the plated dish as a food photographer would see it" —
the sentence the photo step will later build on.

## The photograph

The image prompt itself is composed in code, not written by a model. A
composition is drawn from the five controlled vocabularies — angles
("overhead flat lay", "45° oblique", "macro detail", "handheld
documentary"…), framings ("wide w/ negative space", "tight crop",
"partial out-of-frame", "action/utensil-in-motion"…), settings ("white
studio", "stainless pro kitchen", "dark restaurant table", "vintage
tile"…), lighting ("soft window", "dramatic low-key", "backlit steam",
"golden hour"…), and moods ("meal-prep clean", "modern editorial",
"rustic farmhouse", "moody atmospheric"…) — and written around the dish
name and the recipe's own `visual_description`. The style block:

> Style: High-end editorial food photography for a cookbook or food
> magazine. The food must look freshly prepared, with natural imperfections
> — slight char marks, a drip of sauce, steam rising, herbs slightly wilted
> from heat. No artificial-looking garnishes or unnaturally perfect
> arrangements.

followed by the hard constraints: "Photorealistic only — no illustrations,
no watercolors, no cartoon style", "No text, watermarks, or logos in the
image", "No human faces or hands visible", "Avoid rustic wood unless
specified in setting above", and — when the previous image was centered —
"No centered plating (last image was centered)". The finished prompt goes
to the Images API (gpt-image-1.5) and is stored on the recipe alongside
the composition that produced it.
