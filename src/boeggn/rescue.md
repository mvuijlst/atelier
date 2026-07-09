---
title: "Two hours during a meeting: the strangler-fig rescue"
heading: "Two hours during a meeting"
navLabel: "Anyway..."
section: 2
status: draft
---

# Two hours during a meeting

This happened past the halfway mark of 2026; we're not in the Middle Ages of 2025 anymore, and so the rescue happened in parallel
with the meeting. I would like to claim I gave the meeting my undivided
attention. The commit timestamps *may* say otherwise. I can neither confirm nor deny.

The moves, in order:

1. **Point the A records** at the Hetzner VPS I already had running for other
   things. DNS propagation takes a while anyway; you start that clock first.
2. **SSH into the Dreamhost server** — which was still perfectly happy to let
   *me* in, it was only visitors it had opinions about — and dump all 1.5 GB
   of files.
3. **Dump the MySQL database**: 18 MB of phpMyAdmin's finest.
4. Start the strangler fig.

<figure class="fig">
<pre><code>[pdx1-shared-a1-07]$ cd wp-content/themes/
[pdx1-shared-a1-07]$ tar czf ~/theme.tgz --exclude='.htaccess' boeggn/
[pdx1-shared-a1-07]$ cd ../uploads/
[pdx1-shared-a1-07]$ find . -type f ! -name '.htaccess' -regextype posix-extended \
      ! -regex '.*(-[0-9]+x[0-9]+|-scaled|@2x)\.[A-Za-z]+' -print0 \
      | tar --null --ignore-failed-read -czf ~/uploads-originals.tgz -T -</code></pre>
<figcaption><span class="fig-n">Figure 5</span> Getting the theme, getting the uploaded images (minus the .htaccess files, grr).</figcaption>
</figure>

## The strangler fig

A strangler fig is a tree that grows around a host tree, using it for
structure, until one day the host is no longer needed and quietly ceases to
be a load-bearing part of the arrangement. Applied to websites: you rebuild
the site *around* the old one — same URLs, same content, same everything the
visitor can see — and when the copy is indistinguishable from the original,
the original can die. Nobody outside notices anything, which is the entire
point. In this case the host tree had already been girdled by its own hosting
company, so the fig was less "patient strategy" and more "emergency
transplant", but the discipline is the same:
**first reproduce exactly, then improve.** Never both at once.

"Exactly" here means exactly *from the visitor's side*. I wasn't about to mourn wp-admin.
What the visitor's side amounts to is URLs: every address the old site served
for the however many years it existed — year/month permalinks, category and tag archives,
paginated everything, the feed — had to keep resolving. The generator is
[Hugo](https://gohugo.io/), one Go binary, chosen for speed and first-class taxonomies, and the
heart of the parity work fits in a screenful of its config:

```toml
[permalinks]
  # Single book posts: /YYYY/MM/slug/  (matches WP /%year%/%monthnum%/%postname%/)
  [permalinks.page]
    posts = "/:year/:month/:slug/"
  # Taxonomy term archives — WP used singular bases;
  # myauthor used a custom base 'aut'.
  [permalinks.term]
    categories = "/category/:slug/"
    tags = "/tag/:slug/"
    authors = "/aut/:slug/"
```

That innocent-looking `/aut/` line is doing more work than it appears to, and
[the next section](/boeggn/archaeology/) explains why.

Just two exceptions to "reproduce exactly". The first one makes my old school blogging heart bleed a little, but it is what it is: you can (for now) no longer comment on
posts. The 567 approved comments came along in the database dump and may
return as static HTML — they are part of the record — but new comments need a
comment *service*, and a self-hosted one (Isso) is on the to do list rather than on
the server. For a site whose comment section peaked somewhere around 2013, I
can live with the list.

The second exception is much smaller and more stupid. One post's URL contained an
actual zero-width space — an invisible Unicode character, faithfully served
by WordPress for years, presumably pasted in around 2011 along with the
title. After a long while of Claude insisting we really should do something
about redirecting it properly, I decided: stuff it, it's one file, and
retired the URL. Final score for URL parity: one hundred percent, minus one
invisible character.

## Exactly as it was

By the time the meeting reached its question and answer section (yep, I did ask questions), the fig had strangled.
The site was back: static HTML built by Hugo, served by nginx on the VPS over
HTTPS, deploying automatically — push Markdown to the git repository, GitHub
Actions builds the site and rsyncs it to the server. Search, which on
WordPress was handled by WordPress and used, let the record show, by nobody,
is now [Pagefind](https://pagefind.app/), also static.

Which means the security posture Dreamhost had hallucinated is now the actual
security posture: no PHP, no WordPress, no plugins, no admin panel facing the internet, not even a database. There is nothing left to hack but nginx and a
folder of HTML files; the attack surface didn't so much shrink as leave.

<figure class="fig">
<div class="fig-row">
<img src="/boeggn/images/desktop--detail-before.jpg" alt="A book page on the old WordPress site: light theme, cover left, review text and sidebar." loading="lazy">
<img src="/boeggn/images/desktop--detail-after.jpg" alt="The same book page on the Hugo rebuild, near-identical to the WordPress original." loading="lazy">
</div>
<figcaption><span class="fig-n">Figure 6</span> The same book page on WordPress (left) and on the Hugo rebuild (right), pixel-for-<em>almost</em>-pixel boring. The whole point is that there is nothing to see here.</figcaption>
</figure>

Put old and new next to each other and you could (almost) not tell. The cards on the homa page did not *quite* look exactly the same, the font was a bit funky, the main navigation (which I'd positioned *very* absolutely) peeked out of the header, some strings are in English instead of Dutch. But everything was substantially the same, and was available on exactly the same URLs as before. That was the
acceptance test, and it passed before dinner. What happened the same day in the evening (and night) is
[two](/boeggn/redesign/) [sections](/boeggn/authors/) further on — but first,
the [archaeology](/boeggn/archaeology), because you cannot faithfully reproduce a site until you
know what it actually is.
