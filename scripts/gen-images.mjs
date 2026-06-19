// Generate responsive AVIF + WebP variants for every site photo, from the committed
// JPEG masters in public/img/. Variants are written next to the masters as
// <name>-<width>.avif / <name>-<width>.webp and COMMITTED (like the project's
// existing webp siblings) — NOT generated in the build, so the Netlify build image
// doesn't need avifenc/magick.
//
// Run manually after changing a photo: `npm run gen:images` (needs magick + avifenc).
// The <Picture> helper (src/components/Picture.tsx) and gen-products.mjs render these
// via <picture> AVIF→WebP→JPEG with srcset/sizes; the JPEG master is the <img> fallback.
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, unlinkSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const imgDir = resolve(root, "public/img");

// Per-image responsive width ladders (capped at the master's intrinsic width — never
// upscale) + per-image quality. The dark hero needs a higher cq / lower webp-q to stay
// smaller than its lighter siblings. Width math is justified in CLAUDE.md / the layout.
// Width ladders are uniform per role so the React call sites can pass one ladder for
// all products (serum's native 1013 and the others' 1024 both cover 1000). The dark
// hero needs a higher cq / lower webp-q to stay smaller than its lighter siblings.
const PRODUCT_WIDTHS = [320, 512, 768, 1000];
const IMAGES = [
  { name: "hero-photo", widths: [360, 480, 660], webpQ: 75, avifCq: 37 },
  { name: "campaign-miracle-serum", widths: [400, 640, 1000], webpQ: 80, avifCq: 32 },
  { name: "product-serum", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  { name: "product-cleanser", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  { name: "product-oil", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  { name: "product-cream", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  // product-mask doubles as the hero image, so include both hero + product widths.
  { name: "product-mask", widths: [320, 360, 480, 512, 660, 768, 1000], webpQ: 80, avifCq: 32 },
  { name: "product-lip-butter", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  // CMS-uploaded masters referenced from content/*.json (The Tea product + the story photo).
  { name: "herbaljarhighres", widths: PRODUCT_WIDTHS, webpQ: 80, avifCq: 32 },
  { name: "SkincareHighRes", widths: [400, 640, 1000], webpQ: 80, avifCq: 32 },
];

const intrinsicWidth = (file) =>
  parseInt(execFileSync("magick", ["identify", "-format", "%w", `${file}[0]`], { encoding: "utf8" }), 10);

const managed = new Set(IMAGES.map((i) => i.name));

// Resolve the master file for an image: prefer .jpeg, fall back to .webp.
// CMS uploads are auto-converted to WebP; JPEG is still preferred for manual masters.
const masterExt = (name) => {
  if (existsSync(resolve(imgDir, `${name}.jpeg`))) return "jpeg";
  if (existsSync(resolve(imgDir, `${name}.webp`))) return "webp";
  return null;
};

// Pre-flight (before mutating ANY files, so a later failure can't leave one image with
// its variants deleted-but-not-regenerated): every master must exist & be non-empty,
// and every photo referenced in content.ts must have a ladder here. A missing ladder
// would ship 404 srcset entries, so it's a hard error — not a warning.
for (const img of IMAGES) {
  const ext = masterExt(img.name);
  if (!ext) throw new Error(`gen-images: master public/img/${img.name}.jpeg (or .webp) is missing.`);
  const m = resolve(imgDir, `${img.name}.${ext}`);
  if (statSync(m).size === 0) throw new Error(`gen-images: master public/img/${img.name}.${ext} is empty.`);
}
// Scan all content JSON files (not content.ts, which has no hardcoded paths).
const contentDir = resolve(root, "content");
const contentText = readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => readFileSync(resolve(contentDir, f), "utf8"))
  .join("\n");
const referenced = [...contentText.matchAll(/\/img\/([a-z0-9-]+)\.(jpe?g|webp)/gi)].map((x) => x[1]);
const drift = [...new Set(referenced)].filter((name) => !managed.has(name));
if (drift.length)
  throw new Error(`gen-images: content JSON references ${drift.map((n) => "/img/" + n).join(", ")} with no IMAGES ladder — add one (its srcset entries would 404).`);

const tmp = mkdtempSync(join(tmpdir(), "gypsi-img-"));
let made = 0;
const warnings = [];

try {
  for (const img of IMAGES) {
    const master = resolve(imgDir, `${img.name}.${masterExt(img.name)}`);
    // Clear stale suffixed variants for this image so a dropped width never lingers.
    for (const f of readdirSync(imgDir))
      if (new RegExp(`^${img.name}-\\d+\\.(avif|webp)$`).test(f)) unlinkSync(resolve(imgDir, f));

    const native = intrinsicWidth(master);
    for (const w of img.widths) {
      if (w > native) {
        warnings.push(`${img.name}: skipped width ${w} > intrinsic ${native} (no upscaling).`);
        continue;
      }
      const webpOut = resolve(imgDir, `${img.name}-${w}.webp`);
      const avifOut = resolve(imgDir, `${img.name}-${w}.avif`);
      const png = join(tmp, `${img.name}-${w}.png`);

      execFileSync("magick", [master, "-resize", `${w}x`, "-strip", "-quality", String(img.webpQ), "-define", "webp:method=6", webpOut]);
      execFileSync("magick", [master, "-resize", `${w}x`, "-strip", png]);
      execFileSync("avifenc", ["-a", "end-usage=q", "-a", `cq-level=${img.avifCq}`, "-s", "6", "-j", "all", png, avifOut], { stdio: "ignore" });

      const aKB = (statSync(avifOut).size / 1024).toFixed(1);
      const wKB = (statSync(webpOut).size / 1024).toFixed(1);
      if (statSync(avifOut).size > statSync(webpOut).size)
        warnings.push(`${img.name}-${w}: AVIF (${aKB}KB) > WebP (${wKB}KB) — consider a higher avifCq.`);
      console.log(`  ${img.name}-${w}: avif ${aKB}KB · webp ${wKB}KB`);
      made += 2;
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

for (const w of warnings) console.warn(`  ⚠ ${w}`);
console.log(`gen-images: wrote ${made} variant files (avif + webp) into public/img/ for ${IMAGES.length} masters.`);
