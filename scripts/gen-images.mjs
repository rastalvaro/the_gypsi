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

// Per-role responsive width ladders — these MUST match the widths the <Picture> call
// sites (and the hero preload in gen-products) request, or those srcset entries 404.
const PRODUCT_WIDTHS = [320, 512, 768, 1000];
const HERO_WIDTHS = [360, 480, 660];
const STORY_WIDTHS = [400, 640, 1000];
const ALL_WIDTHS = [...new Set([...HERO_WIDTHS, ...PRODUCT_WIDTHS, ...STORY_WIDTHS])];

const intrinsicWidth = (file) =>
  parseInt(execFileSync("magick", ["identify", "-format", "%w", `${file}[0]`], { encoding: "utf8" }), 10);

// Resolve the master file for an image stem: prefer .jpeg, fall back to .webp.
const masterExt = (name) => {
  if (existsSync(resolve(imgDir, `${name}.jpeg`))) return "jpeg";
  if (existsSync(resolve(imgDir, `${name}.webp`))) return "webp";
  return null;
};

// AUTO-DISCOVER which images the site uses, and at which widths, straight from the
// content — so any new CMS upload gets variants with NO code change here. Each image is
// generated at the union of the widths of every slot it appears in (a photo used as both
// hero and a product gets hero + product widths). This replaces the old hand-maintained
// allowlist, which silently skipped every newly-named upload.
const readJSON = (rel) => JSON.parse(readFileSync(resolve(root, rel), "utf8"));
const stemOf = (ref) => {
  const m = /^\/img\/(.+)\.[^.]+$/.exec(ref || "");
  return m ? m[1] : null;
};
const widthsByName = new Map();
const addUsage = (ref, widths) => {
  const name = stemOf(ref);
  if (!name) return;
  if (!widthsByName.has(name)) widthsByName.set(name, new Set());
  for (const w of widths) widthsByName.get(name).add(w);
};

addUsage(readJSON("content/hero.json").image, HERO_WIDTHS);
addUsage(readJSON("content/story.json").image, STORY_WIDTHS);
for (const p of readJSON("content/products.json").items) addUsage(p.img, PRODUCT_WIDTHS);
// gen-products can substitute the placeholder into ANY slot, so give it every width.
widthsByName.set("placeholder", new Set(ALL_WIDTHS));

const warnings = [];
const IMAGES = [];
for (const [name, set] of widthsByName) {
  const ext = masterExt(name);
  if (!ext) {
    if (name !== "placeholder")
      warnings.push(`/img/${name} is referenced but has no master — gen-products will use its .jpeg twin or the placeholder.`);
    continue;
  }
  if (statSync(resolve(imgDir, `${name}.${ext}`)).size === 0)
    throw new Error(`gen-images: master public/img/${name}.${ext} is empty.`);
  IMAGES.push({ name, widths: [...set].sort((a, b) => a - b), webpQ: 80, avifCq: name === "placeholder" ? 40 : 32 });
}

const tmp = mkdtempSync(join(tmpdir(), "gypsi-img-"));
let made = 0;

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
