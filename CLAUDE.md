# CLAUDE.md — The Gypsi (Vite build)

Context for Claude Code. This is the **production codebase** for The Gypsi storefront:
**Vite + React 18 + TypeScript + Tailwind CSS 4**, deployed static to Netlify at
`thegypsi.com`. Read fully before changing things.

## What this is

A single-page botanical-skincare marketing/storefront site. No backend. Content is a typed
TS module; the store is **Snipcart** (activated via env key); the newsletter is **Netlify
Forms**. A build step also generates **per-product SEO pages** and a **sitemap**.

## Stack & scripts

- **Vite 7** dev/build. Scripts: `npm run dev` · `build` · `preview` · `typecheck` · `lint`
  · `format` / `format:check`.
- **React 18**, automatic JSX runtime (`jsx: react-jsx`) — no `import React` needed.
- **TypeScript**, but **`vite build` does NOT typecheck** (it strips types). Run
  `npm run typecheck` (`tsc --noEmit`) and `npm run lint` separately. Intentional so a stray
  type nit never blocks a deploy — but keep types/lint clean (CI enforces them, see below).
- **Tailwind 4** via `@tailwindcss/vite` (no `tailwind.config.js`; tokens live in CSS `@theme`).
- **ESLint** (flat config `eslint.config.js`) + **Prettier** (`.prettierrc.json`).
- **CI**: `.github/workflows/ci.yml` runs `npm ci → typecheck → lint → build` on push/PR.

## How it boots

`index.html` → `src/main.tsx` imports `index.css`, calls `initSnipcart()`, renders
`<ErrorBoundary><App/></ErrorBoundary>` in `<StrictMode>`. `App.tsx` puts a **skip link** first,
then `<Nav/>`, wraps the page sections in `<main id="main" tabIndex={-1}>`, and `<Footer/>`
outside `main`. All sections read from the single `content` object in `src/content.ts`.

## Content model

- **`src/content.ts`** is the single source of truth for all copy/products/prices/photos,
  typed by **`src/types.ts`**. This is the file to edit for content changes.
- Footer `columns[].links` and `social` are `{ label, href }[]` (so links have real targets).
- Images live in `public/img/`, referenced as `/img/<file>`. **Every photo has a `.jpeg` +
  a `.webp` sibling**; components render `<picture><source webp/><img jpeg/></picture>`.
- Exactly one product in `content.line` should have `featured: true` (fills the large serum
  block). Product `id` must be unique, lowercase, no spaces (React key + Snipcart id + page URL).

## Build pipeline — `scripts/gen-products.mjs`

Runs **before** `vite build` (the `build` script is `node scripts/gen-products.mjs && vite build`).
It parses the `line` array out of `content.ts` textually (nesting/string-aware splitter +
key-boundary-anchored field matching) and **validates** (price > 0, unique non-empty ids) —
failing loudly rather than shipping `$0.00`. From that it generates:

1. `public/products.html` — legacy combined Snipcart validation page (noindex; back-compat).
2. **`public/products/<id>.html`** — one per product: branded SEO landing page with canonical,
   OG, Product JSON-LD, and a hidden `snipcart-add-item` div for per-page price validation.
   **Keyless** (no Snipcart key) so they're safe to commit.
3. **`public/sitemap.xml`** — home + product pages (legal pages excluded while they're drafts;
   see `LEGAL_PAGES` in the script).
4. Injects homepage Product JSON-LD into `index.html` between the
   `<!-- LD-PRODUCTS-BEGIN/END -->` markers (idempotent — safe to re-run).

**Never hand-edit** `public/products.html`, `public/products/*.html`, or `public/sitemap.xml`
— edit `content.ts` (or the script). If you restructure the `line` shape, update the script.

## Store (Snipcart)

- `src/lib/snipcart.ts`: `initSnipcart()` loads Snipcart **only if `VITE_SNIPCART_KEY` is set**
  (else dormant, console-clean). `snip(product)` returns the `snipcart-add-item` data-attrs;
  **`data-item-url` is `/products/<id>.html`** (per-product price validation) and
  `data-item-image` is absolutized via `VITE_SITE_URL`. Nav cart button:
  `class="snipcart-checkout"` with `snipcart-items-count`.
- **Activation:** set `VITE_SNIPCART_KEY` in **Netlify env vars** (and `.env` locally). The key
  is inlined at build, so it only reaches prod through Netlify env — `.env` is gitignored and
  never committed. The CSP already allows Snipcart.
- ProductCard "Add to Bag" reveal is CSS-driven (`.card-media` / `.card-add`): **always visible
  on touch, hover/keyboard-focus reveal on desktop** — keep this (it was a mobile conversion bug).

## Newsletter (Netlify Forms)

- Hidden static `<form name="newsletter" data-netlify="true">` in `index.html` registers the
  form at build. The React `Newsletter` POSTs url-encoded data (incl. `form-name=newsletter`)
  to `/` and **only shows success on `res.ok`** (no false success). Success shows a `WELCOME15`
  code — **create the matching discount in the Snipcart dashboard**.
- Only works on Netlify. Locally the POST 404s and shows the error state — that's expected.

## Static pages (hand-authored — NOT generated)

- `public/{privacy,shipping-returns,faq}.html` — branded **`noindex` DRAFTS** with `[TODO]`
  placeholders, wired into the footer. Owner edits the copy; then remove `noindex` and add them
  to `LEGAL_PAGES` in `gen-products.mjs` so they enter the sitemap. Do not let the generator
  overwrite these.

## SEO & accessibility (keep these)

- `index.html` head: canonical, full OG/Twitter, Organization + WebSite JSON-LD, `<noscript>`
  fallback, `apple-touch-icon.png`, `site.webmanifest`, hero `<link rel=preload>`.
- A11y baked into `src/index.css` + components: `--color-ink-mute` is darkened to pass **WCAG AA**
  contrast; global `:focus-visible` ring; `.skip-link` + `.sr-only` + focusable `<main>`;
  `.icon-btn` 44px targets; ARIA on the mobile menu (`aria-expanded`/`aria-controls`), cart,
  and star ratings (`role="img"`); decorative icons `aria-hidden`. Don't regress these.

## Security headers (`netlify.toml`)

- CSP, HSTS, Permissions-Policy, and an image cache header. The **CSP must stay
  Snipcart-compatible**: it includes `'unsafe-eval'` (Snipcart compiles validators via
  `new Function`) and `fonts.bunny.net` (Snipcart's cart fonts). **When you add any external
  resource** (analytics, a payment provider, etc.) you must allowlist its domains here.

## Styling

- `src/index.css`: Tailwind 4 `@theme` defines brand tokens → utilities (`bg-sand`, `text-ink`,
  `font-display`, …) **and** CSS vars (`var(--color-ink)`, …). Same file holds brand classes
  (`.eyebrow`, `.display/.h1-3`, `.serif-quote`, `.lede`, `.btn`, `.link-underline`, `.reveal`,
  `.ring`, `.marquee`) and the a11y utilities above.
- Sections use Tailwind utilities for layout/responsive and inline styles + CSS vars for brand
  colors/gradients (preserves exact visual fidelity). Keep `color-scheme: only light` in `:root`.

## Deploy

- `netlify.toml`: `command = "npm run build"`, `publish = "dist"`, SPA redirect + headers.
- Cloudflare DNS → Netlify. Set `VITE_SNIPCART_KEY` and `VITE_SITE_URL` in **Netlify env vars**.

## Conventions & gotchas

- **No typecheck/lint in `vite build`** — run `npm run typecheck && npm run lint` before
  committing; CI also enforces them.
- **Tailwind 4 = no JS config**; add/rename tokens in `@theme` in `src/index.css`.
- **Generated, never hand-edited:** `public/products.html`, `public/products/*.html`,
  `public/sitemap.xml`, and the JSON-LD between the `index.html` LD markers.
- **One featured product; unique lowercase ids** (also the per-product page filename).
- **Images:** keep a `.webp` sibling per photo; keep hero/og as real optimized JPEG (not PNG).
  Re-encode with ImageMagick (`magick`) / `avifenc` (both available locally).
- **Keep `color-scheme: only light`** and the a11y utilities.
- **No router yet** (single page + static product/legal pages). For real client routes add
  `react-router-dom` and keep the `netlify.toml` SPA redirect.

## Common tasks

- **Edit content/products/prices:** `src/content.ts` (a rebuild regenerates product pages,
  sitemap, products.html, and the JSON-LD).
- **New section:** add a component in `src/sections.tsx`, place it inside `<main>` in `App.tsx`.
- **Restyle/theme:** tokens at the top of `src/index.css` (`@theme`).
- **Finalize a legal page:** edit `public/<page>.html`, remove `noindex`, add to `LEGAL_PAGES`.

## Owner TODO (handoff items — content/config, not code)

- **Socials:** real Instagram/TikTok URLs (currently `#` placeholders in `content.ts`). *(not
  available yet.)*
- **Contact:** a real email for `mailto:` (footer Contact + the legal pages' `[TODO]`s) and a
  Track-order link (Snipcart customer portal).
- **Legal/FAQ:** finalize `public/{privacy,shipping-returns,faq}.html`, then index + add to sitemap.
- **Discount:** create the `WELCOME15` discount in Snipcart.
- **Products:** per-product INCI ingredient lists.
- **Payments/analytics:** choose a payment provider (+ add its domains to the CSP); add analytics
  + cookie consent if used (also CSP).
