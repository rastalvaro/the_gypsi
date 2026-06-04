# CLAUDE.md — The Gypsi (Vite build)

Context for Claude Code. This is the **production codebase** for The Gypsi storefront:
**Vite + React 18 + TypeScript + Tailwind CSS 4**, deployed static to Netlify at
`thegypsi.com`. Read fully before changing things.

## What this is

A single-page botanical-skincare marketing/storefront site. No backend. Content lives in
**`content/*.json` files** (edited via the Sveltia CMS at `/admin/` or directly); the store
is **Snipcart** (activated via env key); the newsletter is **Netlify Forms**. A build step
also generates **per-product SEO pages** and a **sitemap**.

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

`index.html` → `src/main.tsx` imports `index.css`, calls `initSnipcart()`, then **hydrates**
`<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>` into `#root` — `hydrateRoot` when
`#root` already has the prerendered markup (production build), `createRoot` when it's empty (`npm
run dev`, no prerender step). The homepage HTML is **prerendered at build** (see below) so content
ships in the HTML; `src/entry-server.tsx` is the server-render entry. `App.tsx` puts a **skip link**
first, then `<Nav/>`, wraps the page sections in `<main id="main" tabIndex={-1}>`, and `<Footer/>`
outside `main`. All sections read from the `content` object exported by `src/content.ts`, which imports
from `content/*.json`.

**Hydration rule:** `App` and everything it renders must produce **identical, deterministic output
on server and client first render** — all `window`/`document`/`IntersectionObserver`/scroll/locale
access stays inside `useEffect`/handlers (never in module scope or the render body), and initial
`useState` values are browser-independent constants. Breaking this causes a hydration mismatch.

## Content model

- **`content/*.json`** is the single source of truth for all copy/products/prices/photos.
  `src/content.ts` is a thin re-export that imports from these files — it is typed by
  **`src/types.ts`** but is not the file to edit for content changes.
  The JSON files are edited either via the **Sveltia CMS at `/admin/`** (owner) or directly
  (developer). The 13 files map one-to-one to content sections:
  `products.json`, `hero.json`, `marquee.json`, `nav.json`, `feature.json`, `sections.json`
  (the three section headings), `story.json`, `newsletter.json`, `footer.json`, `benefits.json`,
  `ingredients.json`, `ritual.json`, `reviews.json`.
- **Price/CTA coupling:** `hero.json`'s `ctaPrimary` field contains the serum price as plain
  text (e.g. `"Shop the Serum — $68"`). It is **not** derived from `products.json`. If the
  serum price changes, update both files.
- Footer `columns[].links` and `social` are `{ label, href }[]` (so links have real targets).
- Images live in `public/img/` as **JPEG masters** (`/img/<name>.jpeg`, the `<img>` fallback +
  OG/Snipcart image). `scripts/gen-images.mjs` generates **responsive AVIF + WebP width variants**
  (`/img/<name>-<w>.{avif,webp}`, latin width ladders) — all **committed** (run `npm run gen:images`
  after changing a photo; needs `magick` + `avifenc`). Photos render via the shared **`<Picture>`**
  helper (`src/components/Picture.tsx` for React; an inline equivalent in `gen-products.mjs` for the
  SEO pages) → `<picture>` AVIF→WebP→JPEG with `srcset`/`sizes`. See the "Images pipeline" section.
  **Images added via the CMS** will display as JPEG only until `npm run gen:images` is run locally.
- Exactly one product in `content.line` should have `featured: true` (fills the large serum
  block). Product `id` must be unique, lowercase, no spaces (React key + Snipcart id + page URL).

## Build pipeline

`build` is a four-stage chain:

```
node scripts/gen-products.mjs        # 1. generate product pages/sitemap + inject homepage JSON-LD
&& vite build                        # 2. client bundle → dist/ (incl. dist/index.html, empty #root)
&& vite build --ssr src/entry-server.tsx --outDir dist-ssr   # 3. compile the server-render entry
&& node scripts/prerender.mjs        # 4. render <App/> → inject into dist/index.html's #root
```

Order is load-bearing: gen-products **mutates the source `index.html`** (JSON-LD) so it must run
before `vite build` copies it to `dist/`; prerender needs **both** `dist/index.html` (target) and
`dist-ssr/entry-server.js` (renderer) to exist. `dist-ssr/` is **gitignored build scratch outside
the published `dist/`** — never deployed. Each `&&` halts the deploy on a non-zero exit.

### `scripts/prerender.mjs` (stage 4)

Imports the compiled `dist-ssr/entry-server.js`, calls `render()` (= `renderToString(<App/>)`),
and **string-injects** the result into the empty `<div id="root"></div>` in `dist/index.html` (via a
function-replacement so prices like `$68` aren't mangled by `$`-patterns). Fails the build loudly if:
the root marker is missing, the render is suspiciously small, expected copy markers are absent, or
`VITE_SITE_URL` (resolved via Vite's `loadEnv`, so it matches what `vite build` inlined — **not**
bare `process.env`, which `.env` doesn't populate) is set yet `data-item-image` URLs are relative.
That last check is an env-parity guard: both vite builds share one `npm run build` env, so the
prerendered Snipcart attrs match the client bundle.
`src/entry-server.tsx` renders **bare `<App/>`** (no StrictMode/ErrorBoundary — both emit zero DOM,
so output matches the client and a render error fails the build instead of silently shipping the
fallback), and must **not** import `index.css` or call `initSnipcart()` (it'd touch `document`).

### `scripts/gen-products.mjs` (stage 1)

It reads the `items` array from **`content/products.json`** and **validates** (price > 0,
unique non-empty ids) — failing loudly rather than shipping `$0.00`. From that it generates:

1. `public/products.html` — legacy combined Snipcart validation page (noindex; back-compat).
2. **`public/products/<id>.html`** — one per product: branded SEO landing page with canonical,
   OG, Product JSON-LD, and a hidden `snipcart-add-item` div for per-page price validation.
   **Keyless** (no Snipcart key) so they're safe to commit.
3. **`public/sitemap.xml`** — home + product pages (legal pages excluded while they're drafts;
   see `LEGAL_PAGES` in the script).
4. Injects homepage Product JSON-LD into `index.html` between the
   `<!-- LD-PRODUCTS-BEGIN/END -->` markers (idempotent — safe to re-run).

**Never hand-edit** `public/products.html`, `public/products/*.html`, or `public/sitemap.xml`
— edit `content/products.json` (or the script). If you restructure the product shape, update
both the script and `src/types.ts`.

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

- `index.html` head: canonical, full OG/Twitter, Organization + WebSite JSON-LD,
  `apple-touch-icon.png`, `site.webmanifest`, hero `<link rel=preload>`.
- **No-JS:** the homepage is prerendered, so no-JS visitors and crawlers get the full DOM. Since
  `.reveal` starts at `opacity:0` (JS fades it in), a `<noscript><style>.reveal{opacity:1…}</style>`
  block in `<head>` forces that content visible when JS is off (inert when JS runs, so the
  scroll-reveal animation is unchanged). This replaced the old `<noscript>` marketing text block.
  Note: for **JS users** the prerendered text still sits at `opacity:0` until hydration runs the
  reveal effects (the hero *image* and layout paint immediately — it's outside `.reveal`). So the
  prerender's wins are SEO + no-JS + image-LCP; instant text paint for JS users would require
  changing the reveal animation (a visual decision — measure with Lighthouse first).
- A11y baked into `src/index.css` + components: `--color-ink-mute` is darkened to pass **WCAG AA**
  contrast; global `:focus-visible` ring; `.skip-link` + `.sr-only` + focusable `<main>`;
  `.icon-btn` 44px targets; ARIA on the mobile menu (`aria-expanded`/`aria-controls`), cart,
  and star ratings (`role="img"`); decorative icons `aria-hidden`. Don't regress these.

## Security headers (`netlify.toml`)

- CSP, HSTS, Permissions-Policy, and an image cache header. The **CSP must stay
  Snipcart-compatible**: it includes `'unsafe-eval'` (Snipcart compiles validators via
  `new Function`) and `fonts.bunny.net` (Snipcart's cart fonts). **When you add any external
  resource** (analytics, a payment provider, etc.) you must allowlist its domains here.
- `/admin/*` has its own more-permissive CSP block (allows `unpkg.com` for the Sveltia bundle
  and `api.github.com` / `raw.githubusercontent.com` for the GitHub backend). The GitHub OAuth
  popup is top-level navigation, so it needs no CSP entry. The more-specific rule wins over `/*`.

## Styling

- `src/index.css`: Tailwind 4 `@theme` defines brand tokens → utilities (`bg-sand`, `text-ink`,
  `font-display`, …) **and** CSS vars (`var(--color-ink)`, …). Same file holds brand classes
  (`.eyebrow`, `.display/.h1-3`, `.serif-quote`, `.lede`, `.btn`, `.link-underline`, `.reveal`,
  `.ring`, `.marquee`) and the a11y utilities above.
- Sections use Tailwind utilities for layout/responsive and inline styles + CSS vars for brand
  colors/gradients (preserves exact visual fidelity). Keep `color-scheme: only light` in `:root`.

## Fonts (self-hosted)

- **Jost** + **Cormorant Garamond** are self-hosted (no render-blocking Google Fonts request).
  Both are **variable fonts**, so `fetch-fonts.mjs` dedupes by source URL → **6 woff2** in
  `public/fonts/` (one per family×style×subset, latin + latin-ext; each shared across weights, e.g.
  `jost-normal-latin.woff2` serves 300/400/500). It generates the `@font-face` rules (one per
  weight/style/subset, all pointing at the deduped files) into two places: the React app's
  `src/index.css` (between `/* FONTS-BEGIN/END */`, bundled — no extra request on the homepage)
  **and** `public/fonts/fonts.css` (linked by the static product & legal pages). The script asserts
  full coverage and fails loudly if Google's css2 output drifts.
- The above-the-fold **`jost-normal-latin.woff2`** is `<link rel=preload as=font crossorigin>`'d in
  `index.html`, the product-page template (`gen-products.mjs`), and the legal pages (one preload —
  the variable file covers every Jost weight). All faces use `font-display: swap`. **Never hand-edit**
  the woff2 set or the generated `@font-face` blocks — re-run `fetch-fonts.mjs` (re-downloads from
  Google, clears stale woff2, rewrites both targets).
- CSP (`netlify.toml`) no longer allows `fonts.googleapis.com`/`fonts.gstatic.com` — `'self'`
  covers `/fonts/`. The only external font/style host left is Snipcart's (`fonts.bunny.net` +
  `cdn.snipcart.com`). woff2 are cached 1yr; `fonts.css` gets a short cache (it's the regenerable
  index). If you add a font, keep all pages in sync (app CSS + `fonts.css`).

## Images pipeline

- **Masters:** one optimized JPEG per photo in `public/img/<name>.jpeg` (committed). These are the
  `<img>` fallback for the ~3% of browsers without AVIF/WebP, plus the OG/Snipcart `data-item-image`.
- **Variants:** `scripts/gen-images.mjs` (run manually via `npm run gen:images`, **not** in the build
  — Netlify's image isn't guaranteed to have `avifenc`) emits AVIF (`avifenc`, cq-tuned: dark hero 37,
  products 32) + WebP (`magick`, `webp:method=6`) at per-image width ladders (shrink-only, never
  upscale), to `/img/<name>-<w>.{avif,webp}`, **committed** like the old webp siblings. It clears stale
  variants, fails loudly on a missing master, and warns if AVIF > WebP or if a photo referenced
  in `content/` has no ladder. Ladders are uniform per role: hero `[360,480,660]`, products `[320,512,768,1000]`,
  campaign/story `[400,640,1000]`.
- **Render:** the pure, SSR-safe `<Picture>` helper (`src/components/Picture.tsx`) emits
  `<picture>` AVIF→WebP→JPEG with `srcset`+`sizes`; the JPEG master is the `<img src>`. Pass
  `width`/`height` for uncropped images (hero, story) and rely on CSS `aspect-ratio` (no width/height)
  for the cropped card/feature images — both keep CLS at 0. `gen-products.mjs` emits the same markup
  (string form) for the per-product SEO pages.
- **The `widths` passed to `<Picture>`/`gen-products` MUST match a ladder `gen-images` produced**, or
  the largest `srcset` entries 404 (the `<img>` JPEG still renders). The hero LCP preload in
  `index.html` is a responsive AVIF `imagesrcset`/`imagesizes` mirroring the hero `<picture>` —
  keep its widths in sync too.

## Deploy

- `netlify.toml`: `command = "npm run build"`, `publish = "dist"`, SPA redirect + headers.
- Cloudflare DNS → Netlify. Set `VITE_SNIPCART_KEY` and `VITE_SITE_URL` in **Netlify env vars**.

## Conventions & gotchas

- **No typecheck/lint in `vite build`** — run `npm run typecheck && npm run lint` before
  committing; CI also enforces them.
- **Prerender/hydration:** keep the render path deterministic & SSR-safe (see "How it boots"). After
  changing `App`/sections, `npm run build` and confirm `prerender:` injects (it asserts loudly), and
  watch the browser console for hydration warnings. Keep `src/entry-server.tsx` minimal (bare
  `<App/>`, no CSS import, no `initSnipcart`). The empty `<div id="root"></div>` in `index.html` is
  the prerender injection target — don't pre-fill it.
- **Tailwind 4 = no JS config**; add/rename tokens in `@theme` in `src/index.css`.
- **Generated, never hand-edited:** `public/products.html`, `public/products/*.html`,
  `public/sitemap.xml`, and the JSON-LD between the `index.html` LD markers.
- **One featured product; unique lowercase ids** (also the per-product page filename).
- **Images:** edit photos = replace the JPEG master in `public/img/` then run `npm run gen:images`
  (regenerates + commits the AVIF/WebP width variants); render only via the `<Picture>` helper. Keep
  the per-role `widths`/`sizes` in `sections.tsx` + `gen-products.mjs` in sync with the `gen-images`
  ladders, and the hero preload (`index.html` `imagesrcset`) in sync with the hero widths. Hero is
  capped at its 660px source (no upscaling) — a higher-res hero master is an owner TODO.
- **Keep `color-scheme: only light`** and the a11y utilities.
- **No router yet** (single page + static product/legal pages). For real client routes add
  `react-router-dom` and keep the `netlify.toml` SPA redirect.

## CMS

- **Sveltia CMS** runs at `thegypsi.com/admin`. Backend: **`github`** (Sveltia dropped
  git-gateway / Netlify Identity support — do not use it). Login is GitHub OAuth; the editor
  needs a GitHub account with write access to `rastalvaro/the_gypsi`. Edits commit to `main`
  and trigger a Netlify rebuild.
- **OAuth:** authentication goes through the **Sveltia CMS Authenticator worker**, self-hosted
  on the owner's own Cloudflare account at `https://sveltia-cms-auth.ingdimas.workers.dev`
  (`base_url` in `config.yml`). (Netlify's built-in OAuth provider 404'd for the custom domain;
  Netlify Identity / Git Gateway are unused — safe to disable in the Netlify dashboard.) Setup:
  1. GitHub OAuth App (Settings → Developer settings → OAuth Apps): callback URL
     `https://sveltia-cms-auth.ingdimas.workers.dev/callback`.
  2. Cloudflare worker env vars: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (encrypted),
     `ALLOWED_DOMAINS=thegypsi.com`.
- **Security notes (auth):**
  - The worker is deployed from `github.com/sveltia/sveltia-cms-auth` (same author as the CMS
    bundle, already trusted via unpkg). It holds the GitHub OAuth **client secret** — rotate it
    if the worker operator ever changes, and keep the worker on the official source.
  - The repo is **private**, so the OAuth token carries GitHub's broad **`repo`** scope, which
    grants access to **all** of the logged-in account's private repos (GitHub OAuth apps can't
    scope to a single repo). **Log in with an account whose private-repo exposure is acceptable**
    — ideally a dedicated editor account, not a personal one holding unrelated private work.
  - Hardening TODO: bind the worker to a project-controlled custom domain (`auth.thegypsi.com`)
    instead of the `workers.dev` URL, then update `base_url` + the `/admin/*` CSP `connect-src`.
- **Config:** `public/admin/config.yml` defines all editable collections + the `backend` block
  (`repo` is hardcoded — update it if the repo moves). `public/admin/index.html` loads Sveltia
  from unpkg, pinned to a specific version with an SRI hash — update both when upgrading.
- **Not exposed in CMS** (edit JSON directly): `nav.json`, `sections.json`, `benefits.json` —
  these contain structural or code-coupled values unlikely to need owner editing.

## Common tasks

- **Edit content/products/prices:** edit `content/*.json` directly, or use the CMS at `/admin/`.
  A rebuild regenerates product pages, sitemap, products.html, and the JSON-LD.
- **New section:** add a component in `src/sections.tsx`, place it inside `<main>` in `App.tsx`.
  If it needs editable content, add a new JSON file in `content/` and a collection entry in
  `public/admin/config.yml`.
- **Restyle/theme:** tokens at the top of `src/index.css` (`@theme`).
- **Finalize a legal page:** edit `public/<page>.html`, remove `noindex`, add to `LEGAL_PAGES`.

## Owner TODO (handoff items — content/config, not code)

- **CMS activation:** create a GitHub OAuth app (callback `https://api.netlify.com/auth/done`)
  and register its Client ID/Secret under Netlify → Access control → OAuth. See the CMS section.
- **Socials:** real Instagram/TikTok URLs (currently `#` placeholders in `content/footer.json`,
  editable via CMS → Footer → Social & legal links). *(not available yet.)*
- **Contact:** a real email for `mailto:` (footer Contact link in `content/footer.json` +
  the legal pages' `[TODO]`s) and a Track-order link (Snipcart customer portal).
- **Legal/FAQ:** finalize `public/{privacy,shipping-returns,faq}.html`, then index + add to sitemap.
- **Discount:** create the `WELCOME15` discount in Snipcart.
- **Products:** per-product INCI ingredient lists.
- **Payments/analytics:** choose a payment provider (+ add its domains to the CSP); add analytics
  + cookie consent if used (also CSP).
