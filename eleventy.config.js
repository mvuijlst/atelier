import fs from "node:fs";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "src/css": "css",
    "src/fonts": "fonts",
    "src/js": "js",
    "src/images": "images",
    "src/raimbaut/images": "raimbaut/images",
    "src/echoes/images": "echoes/images",
    "src/digest/images": "digest/images",
    "src/quidlibet/images": "quidlibet/images",
  });

  // SVG figures are inlined at build time so they inherit the page's CSS
  // variables and can recolor for light/dark (see .svg-adapt rules in the
  // CSS). Authors write <img class="svg-adapt" src="…svg" alt="…"> in the
  // Markdown; this swaps it for the file's <svg>, carrying the alt across as
  // an aria-label and dropping the fixed width/height so CSS controls size.
  const svgCache = new Map();
  eleventyConfig.addTransform("inline-svg", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    if (!content.includes("svg-adapt")) return content;
    return content.replace(
      /<img\b[^>]*\bclass="[^"]*\bsvg-adapt\b[^"]*"[^>]*>/g,
      (tag) => {
        const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
        const alt = (tag.match(/\balt="([^"]*)"/) || [])[1] || "";
        if (!src) return tag;
        const file = "src" + src; // /raimbaut/images/x.svg → src/raimbaut/images/x.svg
        if (!svgCache.has(file)) {
          try { svgCache.set(file, fs.readFileSync(file, "utf8")); }
          catch { svgCache.set(file, null); }
        }
        const svg = svgCache.get(file);
        if (!svg) return tag;
        const label = alt.replace(/"/g, "&quot;");
        return svg.trim().replace(/<svg\b([^>]*)>/, (m, attrs) => {
          const kept = attrs.replace(/\s(?:width|height)="[^"]*"/g, "");
          return `<svg${kept} class="svg-adapt" role="img" aria-label="${label}">`;
        });
      }
    );
  });

  // The draft figure placeholders are Markdown blockquotes beginning with
  // "[Figure …]"; give them a class so the CSS can render them as figure
  // slots without touching real blockquotes (e.g. the thesis reference).
  eleventyConfig.addTransform("figure-slots", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replaceAll(
      "<blockquote>\n<p><strong>[Figure",
      '<blockquote class="figure-slot">\n<p><strong>[Figure'
    );
  });

  // Anchor ids on h2s so deep links work without JS; the floating table of
  // contents (js/atelier.js) is built from these ids as an enhancement.
  const slug = (s) =>
    s
      .replace(/&[a-z]+;|<[^>]*>/g, " ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  eleventyConfig.addTransform("h2-anchors", (content, outputPath) => {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    return content.replace(/<h2>([^]*?)<\/h2>/g, (m, inner) => {
      const id = slug(inner);
      return id ? `<h2 id="${id}">${inner}</h2>` : m;
    });
  });

  // Each piece is a tag-based collection (tags set in its directory data);
  // templates sort by the `section` front-matter number.
  eleventyConfig.addFilter("bySection", (arr) =>
    [...(arr || [])].sort((a, b) => (a.data.section ?? 99) - (b.data.section ?? 99))
  );

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
