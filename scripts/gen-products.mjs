// Generates public/products.html (Snipcart price-validation page) AND injects
// Product JSON-LD into index.html, both from src/content.ts.
// Snipcart's crawler reads products.html (plain HTML, no JS), so it must be
// regenerated whenever products change. Runs automatically before `vite build`.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SITE = (process.env.VITE_SITE_URL || "https://thegypsi.com").replace(/\/$/, "");

// --- Extract the top-level `line: [ ... ]` array from the TS content module ---
// Anchor to the top-level `line:` key (newline + indent), not a substring of "headline:".
const src = readFileSync(resolve(root, "src/content.ts"), "utf8");
const keyMatch = src.match(/\n\s*line\s*:\s*\[/);
if (!keyMatch) throw new Error("gen-products: could not find the `line` array in src/content.ts");
const open = keyMatch.index + keyMatch[0].length - 1; // index of the opening "["
let depth = 0;
let end = open;
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
if (depth !== 0) throw new Error("gen-products: unbalanced brackets in the `line` array");
const arrText = src.slice(open, end + 1);

// --- Split the array into top-level {...} objects (string- and nesting-aware,
//     so a future nested sub-object won't be mistaken for a product) ---
function splitTopLevelObjects(text) {
  const objs = [];
  let depth = 0;
  let start = -1;
  let inStr = false;
  let strCh = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (c === "\\") i++; // skip escaped char
      else if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = true;
      strCh = c;
    } else if (c === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        objs.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return objs;
}

// --- Parse each product object. Keys are anchored to an object-key boundary
//     ({ or ,) so a field like `uid` cannot shadow `id`. ---
const products = splitTopLevelObjects(arrText).map((o) => {
  const getStr = (k) => {
    const mm = o.match(new RegExp('[{,]\\s*' + k + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"'));
    return mm ? mm[1].replace(/\\"/g, '"') : null;
  };
  const getNum = (k) => {
    const mm = o.match(new RegExp("[{,]\\s*" + k + "\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)"));
    return mm ? Number(mm[1]) : null;
  };
  return {
    id: getStr("id"),
    name: getStr("name"),
    type: getStr("type"),
    price: getNum("price"),
    img: getStr("img"),
  };
});

// --- Validate: fail loudly rather than ship $0.00 / broken Snipcart items ---
if (products.length === 0) throw new Error("gen-products: parsed 0 products from src/content.ts");
const ids = new Set();
for (const p of products) {
  if (!p.id || !p.name || !p.img) {
    throw new Error(`gen-products: product is missing id/name/img: ${JSON.stringify(p)}`);
  }
  if (!(typeof p.price === "number") || !Number.isFinite(p.price) || p.price <= 0) {
    throw new Error(`gen-products: product "${p.id}" has an invalid price (${p.price}). Refusing to emit $0.00.`);
  }
  if (ids.has(p.id)) throw new Error(`gen-products: duplicate product id "${p.id}"`);
  ids.add(p.id);
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const absImg = (img) => (/^https?:\/\//.test(img) ? img : SITE + img);

// --- products.html (Snipcart price validation; absolute image URLs) ---
const items = products
  .map(
    (p) =>
      `  <div class="snipcart-add-item"\n` +
      `       data-item-id="${esc(p.id)}"\n` +
      `       data-item-name="${esc(p.name)}"\n` +
      `       data-item-price="${p.price.toFixed(2)}"\n` +
      `       data-item-url="/products.html"\n` +
      `       data-item-image="${esc(absImg(p.img))}"\n` +
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

// --- Product JSON-LD injected into index.html between markers ---
// Note: no aggregateRating (review counts/ratings are not yet substantiated).
const graph = products.map((p) => ({
  "@type": "Product",
  name: p.name,
  image: absImg(p.img),
  description: p.type,
  brand: { "@type": "Brand", name: "The Gypsi" },
  offers: {
    "@type": "Offer",
    price: p.price.toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: SITE + "/",
  },
}));
const ld =
  `<script type="application/ld+json">\n` +
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c") +
  `\n    </script>`;

const indexPath = resolve(root, "index.html");
let indexHtml = readFileSync(indexPath, "utf8");
const begin = "<!-- LD-PRODUCTS-BEGIN -->";
const stop = "<!-- LD-PRODUCTS-END -->";
if (indexHtml.includes(begin) && indexHtml.includes(stop)) {
  indexHtml = indexHtml.replace(
    new RegExp(`${begin}[\\s\\S]*?${stop}`),
    `${begin}\n    ${ld}\n    ${stop}`
  );
  writeFileSync(indexPath, indexHtml);
} else {
  console.warn("gen-products: LD-PRODUCTS markers not found in index.html — skipped JSON-LD injection.");
}

console.log(`Wrote public/products.html and injected Product JSON-LD for ${products.length} products.`);
