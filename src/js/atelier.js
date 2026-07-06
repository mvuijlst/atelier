// Comfort only: lightbox + floating table of contents. Everything reads
// fine without JS — h2 anchors are baked in at build time.

const tt = document.getElementById("theme-toggle");
if (tt) {
  tt.addEventListener("click", () => {
    const explicit = document.documentElement.dataset.theme;
    const dark = explicit
      ? explicit === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

// Lightbox as a small gallery: clicking a figure image opens it enlarged;
// when the figure holds several images they become one set you can page
// through with the arrows, the keyboard, or a swipe.
const lb = document.getElementById("lightbox");
if (lb) {
  const img = lb.querySelector("img");
  const prevBtn = lb.querySelector(".lb-prev");
  const nextBtn = lb.querySelector(".lb-next");
  const count = lb.querySelector(".lb-count");
  let gallery = [];
  let idx = 0;

  const render = () => {
    const it = gallery[idx];
    if (!it) return;
    img.src = it.src;
    img.alt = it.alt || "";
    const multi = gallery.length > 1;
    prevBtn.hidden = nextBtn.hidden = count.hidden = !multi;
    if (multi) count.textContent = `${idx + 1} / ${gallery.length}`;
  };
  const go = (d) => {
    if (gallery.length < 2) return;
    idx = (idx + d + gallery.length) % gallery.length;
    render();
  };

  document.querySelectorAll(".prose figure img").forEach((el) => {
    el.addEventListener("click", () => {
      const imgs = [...el.closest("figure").querySelectorAll("img")]
        .filter((n) => n === el || n.offsetParent !== null); // skip hidden theme variants
      gallery = imgs.map((n) => ({ src: n.currentSrc || n.src, alt: n.alt }));
      idx = Math.max(0, imgs.indexOf(el));
      render();
      lb.showModal();
    });
  });

  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  document.getElementById("lb-close")?.addEventListener("click", () => lb.close());
  document.addEventListener("keydown", (e) => {
    if (!lb.open) return;
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
  });

  // Touch swipe: a mostly-horizontal drag pages the gallery.
  let sx = 0, sy = 0;
  lb.addEventListener("touchstart", (e) => {
    const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY;
  }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  }, { passive: true });
}

// Left/right arrows page through the sections of the current story, in the
// order of the masthead nav (which the annexes are part of) — so it stays
// within the piece and runs 1 ↔ … ↔ Annex B ↔ Annex C. The lightbox owns the
// arrows while it's open; otherwise only act when the user isn't typing.
const storyNav = document.querySelector(".topnav");
if (storyNav) {
  const links = [...storyNav.querySelectorAll("a")];
  const here = links.findIndex((a) => a.getAttribute("aria-current") === "page");
  if (here !== -1) {
    document.addEventListener("keydown", (e) => {
      if ((lb && lb.open) || e.defaultPrevented) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const to = e.key === "ArrowLeft" ? here - 1 : e.key === "ArrowRight" ? here + 1 : -1;
      if (to >= 0 && to < links.length) { e.preventDefault(); location.href = links[to].href; }
    });
  }
}

const toc = document.querySelector(".toc");
const tocList = document.querySelector("[data-toc]");
if (toc && tocList) {
  const heads = [...document.querySelectorAll(".prose h2[id]")];
  if (heads.length >= 2) {
    toc.hidden = false;
    const links = new Map();
    for (const h of heads) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
      links.set(h.id, a);
    }
    let activeId = null;
    const setActive = (id) => {
      if (id === activeId) return;
      links.get(activeId)?.classList.remove("active");
      links.get(id)?.classList.add("active");
      activeId = id;
    };
    // The active section is the last heading above the top third of the
    // viewport; recompute on scroll (cheap: a handful of headings).
    const pick = () => {
      const line = window.innerHeight / 3;
      let current = heads[0].id;
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    document.addEventListener("scroll", pick, { passive: true });
    pick();
  }
}
