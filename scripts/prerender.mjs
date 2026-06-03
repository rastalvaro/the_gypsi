// Build-time prerender: render the homepage to static HTML and inject it into
// dist/index.html's #root, so the page ships real content (SEO + no-JS) and the
// client hydrates it. Runs LAST in the build chain, after both vite builds:
//   node scripts/gen-products.mjs   (injects JSON-LD into source index.html)
//   vite build                      (emits dist/index.html with hashed assets)
//   vite build --ssr src/entry-server.tsx --outDir dist-ssr
//   node scripts/prerender.mjs      (this file)
// dist-ssr/ is gitignored scratch and lives outside the published dist/.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { loadEnv } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Resolve VITE_SITE_URL exactly the way `vite build` did (.env files + matching
// process.env vars), NOT via bare process.env — Vite loads .env into
// import.meta.env only, so process.env.VITE_SITE_URL is unset in local/CI builds.
const siteUrl = loadEnv("production", root, "VITE_").VITE_SITE_URL;
const htmlPath = resolve(root, "dist/index.html");
const ssrEntry = resolve(root, "dist-ssr/entry-server.js");

if (!existsSync(htmlPath)) {
  throw new Error("prerender: dist/index.html not found — run `vite build` first.");
}
if (!existsSync(ssrEntry)) {
  throw new Error(
    "prerender: dist-ssr/entry-server.js not found — run `vite build --ssr src/entry-server.tsx --outDir dist-ssr` first."
  );
}

const { render } = await import(pathToFileURL(ssrEntry).href);
if (typeof render !== "function") {
  throw new Error("prerender: dist-ssr/entry-server.js does not export a render() function.");
}

const appHtml = render();
if (typeof appHtml !== "string" || appHtml.length < 500) {
  throw new Error(
    `prerender: render() returned suspiciously little HTML (${appHtml?.length ?? 0} chars) — refusing to ship a near-empty homepage.`
  );
}

// Known homepage copy must be present — catches a silently broken App tree or an
// ErrorBoundary fallback sneaking through instead of the real page.
for (const needle of ["GYPSI", "Add to Bag", "snipcart-add-item"]) {
  if (!appHtml.includes(needle)) {
    throw new Error(`prerender: rendered HTML is missing expected marker "${needle}" — App tree may be broken.`);
  }
}

// When a site URL is configured, every Snipcart image must be absolute. A relative
// data-item-image="/img/... means this SSR build didn't pick up VITE_SITE_URL, which
// would diverge from the client bundle and cause a hydration mismatch on the product
// buttons. Fail the build instead of shipping that.
if (siteUrl && appHtml.includes('data-item-image="/img/')) {
  throw new Error(
    "prerender: VITE_SITE_URL is set but rendered data-item-image URLs are relative — env mismatch between the client and SSR builds."
  );
}

let html = readFileSync(htmlPath, "utf8");
const MARKER = '<div id="root"></div>';
if (!html.includes(MARKER)) {
  throw new Error(
    `prerender: could not find empty ${MARKER} in dist/index.html (already prerendered, or the root element changed shape).`
  );
}

// Function replacement is deliberate: a string replacement would interpret `$`
// patterns ($&, $$, …) and the rendered HTML contains prices like "$68".
html = html.replace(MARKER, () => `<div id="root">${appHtml}</div>`);
writeFileSync(htmlPath, html);

console.log(`prerender: injected ${appHtml.length.toLocaleString()} chars of homepage HTML into dist/index.html`);
