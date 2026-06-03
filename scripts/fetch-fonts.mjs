// Self-host the site's Google Fonts. Fetches the exact families/weights/styles the
// site uses (matching the retired index.html <link>), downloads the latin +
// latin-ext woff2 into public/fonts/, and regenerates the @font-face rules in BOTH
// src/index.css (between the /* FONTS-BEGIN/END */ markers, bundled for the React
// app) and public/fonts/fonts.css (linked by the static product & legal pages).
//
// Jost and Cormorant Garamond are VARIABLE fonts: Google serves ONE woff2 per
// (style, subset) shared across weights, so we dedupe by source URL — each unique
// file is downloaded once and every weight's @font-face points at it.
//
// Run manually to refresh fonts (needs network): `node scripts/fetch-fonts.mjs`.
// NOT part of the build — the woff2 + generated CSS are committed.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  unlinkSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const fontsDir = resolve(root, "public/fonts");
const cssPath = resolve(root, "src/index.css");

// Families + the css2 spec used today. weights/styles are listed so we can assert
// FULL coverage after parsing and fail loudly if Google's css2 output ever drifts.
const FAMILIES = [
  { name: "Jost", css2: "Jost:wght@300;400;500", weights: ["300", "400", "500"], styles: ["normal"] },
  {
    name: "Cormorant Garamond",
    css2: "Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500",
    weights: ["400", "500"],
    styles: ["normal", "italic"],
  },
];
const WANT_SUBSETS = ["latin", "latin-ext"];
// Modern Chrome UA so Google returns woff2 (not ttf).
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

async function fetchCss(css2) {
  const url = `https://fonts.googleapis.com/css2?family=${css2}&display=swap`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`fetch-fonts: ${url} → HTTP ${res.status}`);
  return res.text();
}

// Each subset is a `/* latin */` comment immediately followed by an @font-face block.
function parseFaces(css, familyName) {
  const faces = [];
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const subset = m[1];
    const body = m[2];
    if (!WANT_SUBSETS.includes(subset)) continue;
    const style = (body.match(/font-style:\s*([^;]+);/) || [])[1]?.trim();
    const weight = (body.match(/font-weight:\s*([^;]+);/) || [])[1]?.trim();
    const src = (body.match(/src:\s*url\(([^)]+)\)/) || [])[1]?.trim();
    const unicode = (body.match(/unicode-range:\s*([^;]+);/) || [])[1]?.trim();
    if (!style || !weight || !src) continue;
    faces.push({ familyName, subset, style, weight, src, unicode });
  }
  return faces;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`fetch-fonts: download ${url} → HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

if (!existsSync(fontsDir)) mkdirSync(fontsDir, { recursive: true });

// Parse every requested family and assert full weight×style×subset coverage.
const all = [];
for (const fam of FAMILIES) {
  const faces = parseFaces(await fetchCss(fam.css2), fam.name);
  for (const style of fam.styles)
    for (const weight of fam.weights)
      for (const subset of WANT_SUBSETS)
        if (!faces.some((f) => f.style === style && f.weight === weight && f.subset === subset))
          throw new Error(
            `fetch-fonts: ${fam.name} is missing the ${weight}/${style}/${subset} face — Google css2 output may have changed.`
          );
  all.push(...faces);
}

// Dedupe by source URL (variable fonts share one file per style+subset across weights).
const urlToFile = new Map();
const nameToUrl = new Map();
for (const f of all) {
  if (urlToFile.has(f.src)) continue;
  const file = `${slug(f.familyName)}-${f.style}-${f.subset}.woff2`;
  if (nameToUrl.has(file) && nameToUrl.get(file) !== f.src)
    throw new Error(
      `fetch-fonts: filename collision on ${file} (two different source URLs) — these may be static (non-variable) fonts; add weight to the filename.`
    );
  nameToUrl.set(file, f.src);
  urlToFile.set(f.src, file);
}

// Clear stale woff2 so a renamed/dropped face never lingers in public/fonts/.
for (const f of readdirSync(fontsDir)) if (f.endsWith(".woff2")) unlinkSync(resolve(fontsDir, f));

let total = 0;
for (const [url, file] of urlToFile) {
  const bytes = await download(url, resolve(fontsDir, file));
  total += bytes;
  console.log(`  ↓ ${file}  (${(bytes / 1024).toFixed(1)} KB)`);
}

// One @font-face per (weight, style, subset) as Google declares them, each pointing
// at the deduped shared file.
const rules = all.map(
  (f) =>
    `@font-face {\n` +
    `  font-family: "${f.familyName}";\n` +
    `  font-style: ${f.style};\n` +
    `  font-weight: ${f.weight};\n` +
    `  font-display: swap;\n` +
    `  src: url("/fonts/${urlToFile.get(f.src)}") format("woff2");\n` +
    (f.unicode ? `  unicode-range: ${f.unicode};\n` : "") +
    `}`
);
const block = rules.join("\n");

// 1) Bundled into the React app's CSS (no extra request on the homepage).
const css = readFileSync(cssPath, "utf8");
const BEGIN = "/* FONTS-BEGIN */";
const END = "/* FONTS-END */";
const start = css.indexOf(BEGIN);
const end = css.indexOf(END);
if (start === -1 || end === -1) throw new Error("fetch-fonts: FONTS-BEGIN/END markers not found in src/index.css");
writeFileSync(cssPath, css.slice(0, start + BEGIN.length) + "\n" + block + "\n" + css.slice(end));

// 2) Standalone stylesheet for the static (non-React) product & legal pages.
writeFileSync(
  resolve(fontsDir, "fonts.css"),
  "/* Self-hosted webfonts for the static (non-React) pages — product & legal.\n" +
    "   Generated by scripts/fetch-fonts.mjs (do not hand-edit). */\n" +
    block +
    "\n"
);

console.log(
  `fetch-fonts: ${all.length} @font-face rules → ${urlToFile.size} unique woff2 (${(total / 1024).toFixed(0)} KB) in public/fonts/; injected into src/index.css + public/fonts/fonts.css.`
);
