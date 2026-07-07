import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8")
);

// Read real build facts from git so the footer is honest rather than hand-set.
// Each falls back gracefully when git isn't available (e.g. a bare tarball).
const git = (cmd, fallback) => {
  try {
    return execSync(`git ${cmd}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return fallback;
  }
};

const commit = git("rev-parse --short HEAD", null);
const built = new Date();

export default {
  name: "Atelier",
  url: "https://atelier.yusupov.cloud",
  author: "Michel Vuijlsteke",
  built,
  // e.g. "v0.1.0 · 98c4def"; drops the hash if git isn't reachable.
  version: commit ? `v${pkg.version} · ${commit}` : `v${pkg.version}`,
  pkgVersion: pkg.version,
  commit,
  licenceProse: "CC BY 4.0",
  licenceCode: "MIT",
  edition: "https://raimbaut.yusupov.cloud",
  repo: "https://github.com/mvuijlst/raimbaut",
};
