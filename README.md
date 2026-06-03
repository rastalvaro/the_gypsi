# The Gypsi — Vite + React + TypeScript + Tailwind 4

Production build of the botanical skincare storefront. Static site (no server), modern
toolchain, content in one typed file, real Snipcart checkout, deploys to Netlify.

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:5173
npm run build      # generates products.html + builds to dist/
npm run preview    # preview the production build
npm run typecheck  # optional: tsc --noEmit
```

> Node 18+ recommended.

## Editing content

**All copy, products, prices, and photos live in `src/content.ts`** (typed against
`src/types.ts`). Edit that one file. Images go in `public/img/` and are referenced as
`/img/<file>`.

After changing products or prices, nothing else to do — `npm run build` regenerates the
Snipcart price-validation page (`public/products.html`) automatically.

## Turning on the store (Snipcart)

The cart/checkout stays **dormant** until a key is provided.

1. Create a Snipcart account, connect Stripe (or PayPal) for payouts.
2. Copy `.env.example` to `.env` and set `VITE_SNIPCART_KEY=your_public_key`.
3. `npm run dev` (or redeploy). Buy buttons now open a real, themed cart.

Set the same `VITE_SNIPCART_KEY` as a Netlify environment variable for production. Keep
Snipcart in **Test mode** until you've configured shipping + tax, then switch to Live.

## Deploy (Netlify)

- `netlify.toml` is included: build `npm run build`, publish `dist/`, SPA redirect, headers.
- Point `thegypsi.com` (Cloudflare DNS) at the Netlify site.
- Add the `VITE_SNIPCART_KEY` env var in Netlify when you're ready to enable the store.
- The newsletter uses **Netlify Forms** (a hidden static form in `index.html` lets Netlify
  detect it). Submissions appear in the Netlify dashboard → Forms.

## Project structure

```
index.html              Vite entry: meta tags, fonts, Snipcart node, hidden Netlify form
src/
  main.tsx              Boots React, inits Snipcart, imports CSS
  App.tsx               Section composition
  content.ts            ← EDIT THIS: all site content (typed)
  types.ts              Content types
  index.css            Tailwind 4 @theme tokens + brand CSS (typography, buttons, marquee…)
  components/
    ui.tsx             Reveal, Button, Ring, Wordmark
    icons.tsx          Line-icon set
  sections.tsx         Nav, Hero, Marquee, Ritual, ProductFeature, Ingredients, Line,
                       Story, Reviews, Newsletter, Footer
  lib/snipcart.ts      Snipcart loader (env-gated) + per-product `snip()` attributes
scripts/
  gen-products.mjs     Builds public/products.html from content.ts (runs before build)
public/                Static assets: img/, favicon.svg, og-image.jpg, robots.txt, sitemap.xml
```

See `CLAUDE.md` for architecture notes and gotchas.
