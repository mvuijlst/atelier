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
The living originals are `instructions.txt` and the prompt builders in
`_generate_article.py`; if this page and the code disagree, trust the code.

## The shared system prompt

Every text call uses the same system prompt (`instructions.txt`). It opens:

> You are the writing engine of an automated editorial pipeline that
> produces articles set inside alternate historical timelines.

and lays down seven absolute rules: strict in-world perspective; article
language follows the source event while image prompts are always English;
the typed-block vocabulary; the callout-versus-quote distinction; craft
rules; image realism; JSON only, no markdown. Two of the rules do most of
the work. The in-world vocabulary ban:

> Never compare it to real history; never write "instead of", "would have",
> "in our world", "earlier than expected"; never use the words "alternate
> history", "uchronie", "what if", "timeline", or "divergence" in any
> visible text.

and the machine-accent ban:

> Avoid the machine accents: "not X, but Y" constructions, rule-of-three
> cadences, epigram endings, thesis restatement, ornamental abstraction.

## The text calls

All six text calls go to the same model (GPT-5 by default, configurable by
environment variable), each with a strict JSON schema. A step gets three
attempts; the last attempt runs on the fallback model (gpt-4o by default)
and marks the article as degraded.

| Call | The model is told | Interpolated into the prompt | Returns |
|---|---|---|---|
| **News skeletons** | Reduce today's headlines to at most fifteen abstract "event skeletons" a writer could re-instantiate in any country and any decade; remove all proper nouns, keep the human specificity | The fetched RSS items (NYT, Guardian, BBC, Le Monde); the domain slug list | `{skeletons: [{skeleton, domains}]}` |
| **Step 1 — selection** | "You are an editorial planner for a features desk." Choose the single event best able to support this exact assignment; invent the divergence and publication framing | The fixed assignment; today's date; the five candidate events | Chosen event, divergence date, publication date, news hook, publication context, angle, visual potential |
| **Step 2 — world brief** | Build the internal dossier under the proportional divergence rule ("Change only what the divergence actually changes"), with mandatory friction: a contested question, at least two losers, current frictions; invent the writer persona with a visible bias ("Real journalists have one.") | The assignment; the step 1 selection | Timeline, canonical facts, traps, named entities, contested question, losers, frictions, article brief, visual brief |
| **Step 3 — draft** | Write the article: "Open from the news hook (the current in-world occurrence), not from the historical event." Structure rules per genre; "The final paragraph must end on a fact, a scene, or a quote — never an aphorism, epigram, or summary of the thesis." | The assignment; selection; world brief; the period style anchor; a digest of the last ten published articles; the banned-motifs list | The full article as typed blocks, plus one hero image concept |
| **Step 4a — critic** | "You are a ruthless outside line editor reviewing a draft before publication. You do not rewrite; you list defects." At most twelve, worst first, in six ranked defect classes | The assignment; the draft; the recent-articles digest; the banned motifs; the mechanical scanner's flags ("verify each — some may be false positives") | `{defects: [{quote, problem, fix_hint}], overall_note}` |
| **Step 4b — revision** | "You are the article's writer, revising after a hard edit. Fix exactly the listed defects; change nothing else of substance." "Where the editor quoted a sentence, that sentence must change." | Selection; world brief; the draft; the critique; the target word count | The full article again, same schema; only runs if defects were found |

Three prompt blocks are reused across these calls. The **assignment block**
renders the day's draw and insists on its fixity ("Today's assignment is
fixed. It was drawn in advance by the editor and must not be changed") and
on the quote casting ("These are casting axes, not characters. Give each
source a name, an age or generation, a specific workplace or street, and at
least one detail that cuts against type"). The **recent digest** carries the
titles, subtitles and final paragraphs of the last ten published articles.
The **banned-motifs list** names observed convergence, verbatim, among them:

> - a closing scene in which the writer walks along a waterfront, quay,
>   bridge, or harbour and reflects
> - an aphoristic final sentence of two short balanced clauses ("The
>   engines are new; the task is old.")
> - the quote-casting trio of one academic, one retired manual worker with
>   a tactile memory, and one operations manager

The **period style anchor** in the draft prompt comes from a table of
eighteen exemplars — three languages by six eras — each a list of stylistic
markers plus a short original pastiche the model must match in register but
not content. The English 1914–1945 sample, for flavour:

> The Ministry's statement, issued at noon, puts the best face on a bad
> month. Deliveries are down a third on last year. In the yards men say the
> figure is worse. The Minister will meet the district committees on
> Thursday, and is expected to promise a review. He promised one in March.

## The image calls

**Image concepts** is a seventh text call: a photo editor and visual
archivist inside the article's world proposes one hero and up to four
supporting concepts, each with an English generation prompt, aspect ratio,
alt text, caption and credit. The prompt carries the technology-by-era
table (pre-1840 oil or engraving through post-2000 digital), tells the
model to "prefer oblique, specific, story-bearing moments: a handover, a
corridor conversation, a damaged office, a harbor loading scene, a kitchen
table, a checkpoint, a printing room, a rail platform", and bans the
AI-art vocabulary: never "dramatic lighting" or "cinematic".

**Image generation** then renders each concept (gpt-image-2, three
retries, no fallback). Code wraps the model-written prompt before it is
sent. A common prefix applies to everything — "Use one clear subject or
action, not a staged tableau. […] Absolutely no text, labels, captions,
watermarks, or lettering in the image" — and one of three medium wrappers
is chosen by keyword:

- **Photographs** (the default): "Use candid documentary realism with
  natural optical imperfections: subtle grain, slight motion blur, uneven
  lighting, imperfect focus falloff, and authentic skin texture with pores,
  wrinkles, and blemishes." — "Style: candid press photo, not posed or
  staged."
- **Paintings and prints**: "Respect the requested non-photographic medium
  exactly. Use authentic period materials and handcrafted texture: visible
  brushwork, plate marks, paper grain, pigment aging, craquelure, or ink
  spread."
- **Objects and documents**: "Render this as an archival object study or
  reproduction, not a dramatic staged scene. Emphasize material truth:
  patina, edge wear, paper foxing, fabric texture, wood grain, tarnish,
  folds, scuffs."
