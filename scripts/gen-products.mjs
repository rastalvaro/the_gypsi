// Generates public/products.html from src/content.ts.
// Snipcart's price-validation crawler reads it (plain HTML, no JS), so it must be
// regenerated whenever products change. Runs automatically before `vite build`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Lightweight extract of the `line` array from the TS content module without a TS loader.
// Anchor to the top-level `line:` key (newline + indent), not a substring of "headline:".
const src = readFileSync(resolve(root, "src/content.ts"), "utf8");
const keyMatch = src.match(/\n\s*line\s*:\s*\[/);
if (!keyMatch) throw new Error("Could not find the `line` array in src/content.ts");
const open = keyMatch.index + keyMatch[0].length - 1; // index of the opening "["
// find matching closing bracket
let depth = 0,
  end = open;
for (let i = open; i < src.length; i++) {
  if (src[i] === "[") depth++;
  else if (src[i] === "]") {
    depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}
const arrText = src.slice(open, end + 1);

// Pull each product object's fields with regexes (robust enough for this controlled file).
const products = [];
const objRe = /\{[^}]*\}/g;
let m;
while ((m = objRe.exec(arrText))) {
  const o = m[0];
  const get = (k) => {
    const r = new RegExp(k + '\\s*:\\s*"([^"]*)"');
    const mm = o.match(r);
    return mm ? mm[1] : "";
  };
  const getNum = (k) => {
    const r = new RegExp(k + "\\s*:\\s*([0-9.]+)");
    const mm = o.match(r);
    return mm ? Number(mm[1]) : 0;
  };
  products.push({
    id: get("id"),
    name: get("name"),
    type: get("type"),
    price: getNum("price"),
    img: get("img"),
  });
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const items = products
  .map(
    (p) =>
      `  <div class="snipcart-add-item"\n` +
      `       data-item-id="${esc(p.id)}"\n` +
      `       data-item-name="${esc(p.name)}"\n` +
      `       data-item-price="${Number(p.price).toFixed(2)}"\n` +
      `       data-item-url="/products.html"\n` +
      `       data-item-image="${esc(p.img)}"\n` +
      `       data-item-description="${esc(p.type)}"></div>`
  )
  .join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <title>The Gypsi — product definitions</title>
</head>
<body>
  <!-- AUTO-GENERATED from src/content.ts by scripts/gen-products.mjs. Do not edit by hand.
       Snipcart reads this page to validate product prices at checkout. -->
  <div hidden>
${items}
  </div>
</body>
</html>
`;

mkdirSync(resolve(root, "public"), { recursive: true });
writeFileSync(resolve(root, "public/products.html"), html);
console.log(`Wrote public/products.html with ${products.length} products.`);
