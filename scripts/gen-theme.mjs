// Build-time generator (runs before `vite build` and `vite dev`). Reads the brand
// palette from content/theme.json and writes the Tailwind v4 @theme color tokens into
// src/index.css between the THEME-COLORS markers. Tailwind then compiles them into both
// utilities (bg-sand, text-ink, …) and CSS vars (var(--color-ink), …), so a color edit
// in the CMS flows everywhere at build — no runtime injection, no hydration mismatch.
//
// The CMS only commits content/theme.json; this script re-derives the CSS at build, so a
// committed src/index.css can lag theme.json until the next build/dev run (self-healing,
// same model as gen-products mutating index.html). Never hand-edit between the markers.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// JSON key → [CSS custom property, trailing comment]. Order = output order.
const TOKENS = [
  ["sand", "--color-sand", "page background"],
  ["sandDeep", "--color-sand-deep", "alt background"],
  ["sandDeeper", "--color-sand-deeper", "deep background"],
  ["card", "--color-card", ""],
  ["ink", "--color-ink", "deep forest near-black"],
  ["inkSoft", "--color-ink-soft", ""],
  ["inkMute", "--color-ink-mute", "darkened to pass WCAG AA on sand backgrounds"],
  ["line", "--color-line", "hairlines"],
  ["forest", "--color-forest", ""],
  ["sage", "--color-sage", ""],
  ["moss", "--color-moss", "accent"],
  ["tan", "--color-tan", ""],
];

const HEX = /^#[0-9a-fA-F]{3,8}$/;

const theme = JSON.parse(readFileSync(resolve(root, "content/theme.json"), "utf8"));

const lines = TOKENS.map(([key, prop, comment]) => {
  const val = theme[key];
  if (typeof val !== "string" || !HEX.test(val.trim())) {
    throw new Error(`gen-theme: content/theme.json "${key}" is not a valid hex color: ${JSON.stringify(val)}`);
  }
  const c = comment ? ` /* ${comment} */` : "";
  return `  ${prop}: ${val.trim()};${c}`;
});

const BEGIN = "/* THEME-COLORS-BEGIN — generated from content/theme.json by scripts/gen-theme.mjs */";
const END = "/* THEME-COLORS-END */";
const block = `${BEGIN}\n${lines.join("\n")}\n  ${END}`;

const cssPath = resolve(root, "src/index.css");
let css = readFileSync(cssPath, "utf8");
const re = new RegExp(`${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
if (!re.test(css)) {
  throw new Error("gen-theme: THEME-COLORS markers not found in src/index.css — cannot inject palette.");
}
css = css.replace(re, block);
writeFileSync(cssPath, css);

console.log(`gen-theme: wrote ${TOKENS.length} color tokens from content/theme.json → src/index.css`);
