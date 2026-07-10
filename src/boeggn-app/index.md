---
title: "Built in a Day: The Complete Story of Boeggn, the Booklog's Mobile Companion App"
heading: "Built in a day"
navLabel: "Introduction"
section: 1
status: draft
---

# Built in a day

*Rome wasn't built in a day. This app was.*

<div class="author-note">
<p>I left my <a href="/boeggn">booklog</a>'s source data in Markdown files, thinking I'd use Claude or (later) my OpenClaw assistant to edit the contents. It didn't take me more than two books to realise this was actually a horrible editing experience. 😕</p>
<p>So I just gave the reigns to the AI, gave it <a id="brief-link" href="#brief-modal">this brief</a>, and let it do its thing practically on its own. I thought it'd turn out something funnily weird and wrong — it didn't. I didn't count on it having access to its memory of the things we'd been building together. Ah well.</p>
<p>My petty revenge was to have AI create this write up and have it behave like a proper AI should.</p>
</div>

## 👋 Introduction

In today's fast-paced digital world, we expect to manage everything from our
phones — our photos, our finances, our front doors. Everything, that is,
except a twenty-four-year-old booklog running as a static Hugo site.

Until now.

**TL;DR:** On 9 July 2026 — two days after the booklog's dramatic rescue
from a hosting placeholder, a story this site has already told in [Your
website is almost here!](/boeggn/) — a proposal was written for a small,
mobile-first companion app. Two hours later that same day, the app had been
designed, built through four phases, deployed to production, and refined
through three rounds of real-world feedback. Read that sentence again. Two hours. It has a name: **boeggn**. It has a home:
[boeggn.yusupov.cloud](https://boeggn.yusupov.cloud). And it has a mission:
to make managing a booklog from a phone not just possible, but genuinely
delightful.

This wasn't just a productivity tool. It was a test of a philosophy — the
bold idea that a static site doesn't need to become dynamic to become
manageable. In this comprehensive multi-part deep dive, we'll delve into
every layer of that journey: the architecture, the build, the AI, the
polish, and the lessons. By the end, you'll understand not just *what* was
built, but *why it matters*. Whether you're a seasoned developer, a
WordPress refugee, or simply someone who has ever sighed at their own
content workflow, this story has something for you.

Let's dive in. 🚀

<figure class="fig">
<img src="/boeggn-app/images/fig1.jpg" alt="An ornate illustration of a marble hand holding a brass, gear-encrusted smartphone whose neon screen reads 'Neon Academy Book Catalog', surrounded by golden acanthus scrolls, classical statue heads with glowing laser eyes, pressure gauges and a vaporwave sunset grid." loading="lazy">
<figcaption><span class="fig-n">Figure 1</span> A visual representation of the boeggn vision: the entire library, right in the palm of your hand.</figcaption>
</figure>

## 🖥️ The Problem: A Site You Can Only Feed from a Desk

Here's the thing about static sites: they are wonderful to serve and
wonderful to own, but every change is, by definition, a file edit. After the
migration, adding a book or updating reading progress meant a laptop, a git
repository, and a working session. In 2026, that's not a workflow. That's a
chore. The verdict from daily use was as honest as it was concise: managing
the content by hand "is not the best experience."

The brief that followed was refreshingly clear. It asked for a lean,
mobile-first web app with a standard login and exactly three tasks —
no more, no less:

1. **Add to read.** One free-form textarea. Type anything — an author and a
   title, a pasted blurb, an ISBN — and let AI propose one or more complete
   book entries, every field editable, checked against the site's existing
   authors, categories, tags and series before anything is accepted.
2. **Update reading.** A list of the books currently being read. Tap one,
   enter how far along you are — hours and minutes for an audiobook, pages or
   a percentage for print — and submit.
3. **Edit content.** Search across all books, open one, edit everything —
   metadata, rating, status, review text — and publish.

And one hard constraint, stated in no uncertain terms: do **not** make the
site dynamic. The site stays a static Hugo build. The app must consume the
site's data and publish through the site's existing pipeline. The site's
architecture was the prize of the migration, and no convenience feature was
going to be allowed to erode it. Non-negotiable? Non-negotiable.

<figure class="fig">
<img src="/boeggn-app/images/fig2.jpg" alt="Three towering gilded baroque panels on a purple laser grid, labelled 'Phase 1: Ingest' (a brass quill writing glowing pink runes onto a ribbon of tape), 'Phase 2: Progress' (a mass of interlocking clockwork gears), and 'Phase 3: Edit' (a golden wrench crossed with a neon-magenta stylus amid sparks)." loading="lazy">
<figcaption><span class="fig-n">Figure 2</span> The three core flows at a glance — ingest, progress, edit. Simple. Powerful. Seamless.</figcaption>
</figure>

## 💡 The Answer in One Sentence

The solution is so simple it fits in a single sentence: **the app is a git
client with forms.**

Boom. That's it. That's the architecture.

Of course, that sentence is doing a lot of heavy lifting, and unpacking it
is the subject of [the next section](/boeggn-app/architecture/). From
there, we follow [the build itself — four phases in one
day](/boeggn-app/build/), take a closer look at [the AI intake
flow](/boeggn-app/ai/), tour [the polish that makes it feel like an
app](/boeggn-app/polish/), and close with [the lessons learned along the
way](/boeggn-app/lessons/) — plus a handy FAQ.

One number before we go deeper, because it frames everything that follows:
the amount of book content stored in the app's database is **zero**. Not a
cache. Not a copy. Zero. Let that sink in. The stack is Django 5 with HTMX
and plain mobile-first CSS, and its SQLite database holds authentication
and sessions — nothing else. The roughly nine hundred Markdown files in the
site's git repository remain the single source of truth, exactly as they
were the day before the app existed.

That's not a limitation. That's the entire point — and honestly? That's
beautiful.

<dialog id="brief-modal" aria-label="The original brief">
<div class="bm-head">
<p class="bm-label">The original brief · 9 July 2026</p>
<button class="bm-close" aria-label="Close">× close</button>
</div>
<div class="bm-body">
<p>This book log works as intended, but managing the content is not the best experience.</p>
<p>I want a lean, web-based application that does exactly the right amount of targeted AI-assisted work in a mobile-first interface:</p>
<ul>
<li>standard login</li>
<li>main tasks are "add to read", "update reading", "edit content"</li>
<li>add to read:
<ul>
<li>textarea where I can enter one free form text</li>
<li>when I submit, AI analyses and proposes one or more books:
<ul>
<li>author, title, publication, publisher, year, pages, 1..n categories, 1..n tags</li>
<li>if applicable: series, series #</li>
<li>I must be able to edit each of these</li>
<li>author, categories, tags: first look up whether they already exist on the site. Authors that do not exist can be added without questions; only add categories if there is a real need to do so; the limitation on adding tags are less strict</li>
</ul>
</li>
<li>when I accept the proposals (possibly after changing some values, in which case they need to be rechecked or confirmed), the necessary content is created on the website</li>
</ul>
</li>
<li>update reading:
<ul>
<li>a list of books I am currently reading</li>
<li>clicking on a book shows me details and how far along I am, and allows me to edit how far along I am (in hours/minutes listened/left for an audiobook, pages or percentage read/left for a book)</li>
<li>submitting this changes the necessary content on the site</li>
</ul>
</li>
<li>edit content:
<ul>
<li>a search box that gives me a list of books across all categories</li>
<li>clicking a book allows me to edit the actual content</li>
<li>submitting publishes</li>
</ul>
</li>
</ul>
<p>Think about this, produce a plan, and execute it. I do NOT want to make the current boeken.tsuk.org site a dynamic website; this is a separate application that consumes data from the site and uses the site's existing pipeline to publish. Put it in m:\dev\boeggn, deploy to boeggn-yusupov on my vps.</p>
</div>
</dialog>

<script>
(() => {
  const dlg = document.getElementById("brief-modal");
  document.getElementById("brief-link").addEventListener("click", (e) => {
    e.preventDefault();
    dlg.showModal();
  });
  dlg.querySelector(".bm-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
})();
</script>
