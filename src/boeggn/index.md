---
title: "Your Website Is Almost Here! Dragging a Twenty-Four-Year-Old Booklog away from WordPress"
heading: "Your website is almost here!"
navLabel: "Oh no!"
section: 1
status: draft
---

# Your website is almost here!

*Ditching WordPress during a two-hour meeting*

## Oh no!

A few minutes before a two-hour meeting I wanted to
look something up on my booklog, [boeken.tsuk.org](https://boeken.tsuk.org), a site I have been keeping (on and off)
since 2002. What I got instead was a cheerful Dreamhost placeholder page —
*boeken.tsuk.org is almost here!* — and, underneath, helpfully: *Upload your
website to get started.*

The website had been there for close to twenty years.

<figure class="fig">
<img class="theme-light" src="/boeggn/images/ohno-light.jpg" alt="A browser showing boeken.tsuk.org serving a Dreamhost placeholder page: 'boeken.tsuk.org is almost here! Upload your website to get started.'" loading="lazy">
<img class="theme-dark" src="/boeggn/images/ohno-dark.jpg" alt="A browser showing boeken.tsuk.org serving a Dreamhost placeholder page: 'boeken.tsuk.org is almost here! Upload your website to get started.'" loading="lazy">
<figcaption><span class="fig-n">Figure 1</span> The crime scene, a few minutes before a two-hour meeting: the Dreamhost placeholder where the booklog used to be, inviting me to get started.</figcaption>
</figure>

Some digging in my spam folder later I discovered Dreamhost's
security systems had decided the site was hacked and being used for phishing,
and had responded the way you'd child-proof a house you never intend to enter
again: by spraying `.htaccess` files into literally every folder, locking
visitors out of all of it. Eh.

<figure class="fig">
<img class="theme-light" src="/boeggn/images/abuse-light.jpg" alt="DreamHost's abuse notification email, redacted: the site has been disabled for suspected phishing, citing a file from 2018." loading="lazy">
<img class="theme-dark" src="/boeggn/images/abuse-dark.jpg" alt="DreamHost's abuse notification email, redacted: the site has been disabled for suspected phishing, citing a file from 2018." loading="lazy">
<figcaption><span class="fig-n">Figure 2</span> The abuse notification, fished out of the spam folder (redacted where needed)..</figcaption>
</figure>

I was a little worried at first, but that quickly gave way to "I'm not angry I'm just *disappointed*", and once the initial *oh come on* subsided, I was actually mostly relieved: this was the eviction notice the site had been waiting years for.

## The patient

Boeggn — tagline: *Altijd al een boeklog willen bijhouden*, "always wanted to
keep a booklog" — is a book log in Dutch. A page per book read (if I finish the book, if I find the time to write a short review, if the site isn't dying on me, if I don't forget it, if I can actually be bothered): a cover, a rating, a paragraph or three or ten
of what I thought of it. The first entry is dated 21 August 2002; the most
recent, when the lights went out, late May 2026. In between: **889** published
books, **567** approved comments, **1,367** uploaded images, and 2,764 post
revisions.

<figure class="fig">
<div class="fig-row">
<img src="/boeggn/images/desktop--home-before.jpg" alt="The old Boeggn home page: a reverse-chronological list of book reviews in the custom WordPress theme." loading="lazy">
<img src="/boeggn/images/desktop--detail-before.jpg" alt="An old Boeggn book page: cover, rating, free-text publication line and review in the custom WordPress theme." loading="lazy">
</div>
<figcaption><span class="fig-n">Figure 3</span> The site as it was some time before that Tuesday morning, as recovered from the archive.org: the home page and a book page, in the custom WordPress theme I built somewhere around 2011 and had been carefully not touching since.</figcaption>
</figure>

The "on and off" was often more *off* than *on*. Plot the entries per year and you get
less a publishing schedule than a polygraph readout of two and a half
decades: one book in 2002, silence, a trickle in 2009, then 138 in 2011 and an
almost implausible **248 in 2012**, tapering through the twenty-teens to
exactly **one book in 2023**, then back up to 86 in 2024. 

(Rest assured that my OCD did not allow me to *not* keep [a list of books read](https://moosedept.org/gelezen/).)

<figure class="fig fig-diagram">
<img class="svg-adapt" src="/boeggn/images/fig4-years.svg" alt="Bar chart of booklog entries per year, 2002 to 2026: single entries in 2002 and 2004, 21 in 2009, a towering 138 and 248 in 2011 and 2012, a long taper to 3 in 2018, nothing at all in 2019 and 2020, 58 in 2021, exactly one book in 2023, back up to 86 in 2024.">
<figcaption><span class="fig-n">Figure 4</span> Entries per year, 2002–2026. The gaps are the point: the chart doubles as an autobiography of the book log.</figcaption>
</figure>

Technically, the site was a custom WordPress theme I built myself, with lots
of gaffer tape and chewing gum keeping the parts somewhat connected, running
on a shared Dreamhost server that had felt, for years on end, like a mosquito
swimming in honey (hence the drop-offs when WordPress became unmanageably slow and the spurts when it mysteriously became a little faster again). The site was still there because Dreamhost was cheap,
because moving it was hassle, and because I certainly didn't feel like
digging into that theme again and making it work in some more elegant way
than it did. Inertia is a perfectly serviceable hosting strategy, and in my experience most problems tend to go away when you ignore them long enough, ahem.

This is a quick write-up about the work I/we did today. A lighter story than [the one about
my father's thesis](/raimbaut/): nothing here needed a vision model or an
editorial conscience, just a spine, a database dump, and some free time during a meeting. In order: [strangler-fig rebuild ftw](/boeggn/rescue/); [stuff I found in the database](/boeggn/archaeology/); [the redesign I had been
putting off for years](/boeggn/redesign/); [the author data, which turned
out to be the actual rabbit hole](/boeggn/authors/); and [what the site is
like to live with now](/boeggn/afterlife/) (but actually not — [see the update](/boeggn-app)).
