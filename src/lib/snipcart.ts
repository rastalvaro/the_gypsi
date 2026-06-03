import type { Product } from "../types";

/**
 * Snipcart "add to cart" attributes for a product button.
 * Price is validated by Snipcart against each product's page,
 * /products/<id>.html (generated from content.ts at build time).
 */
export function snip(p: Product): Record<string, string> {
  return {
    className: "snipcart-add-item",
    "data-item-id": p.id,
    "data-item-name": p.name,
    "data-item-price": Number(p.price).toFixed(2),
    "data-item-url": `/products/${p.id}.html`,
    "data-item-image": (import.meta.env.VITE_SITE_URL ?? "") + p.img,
    "data-item-description": p.type,
  };
}

/**
 * Loads Snipcart only when a public API key is provided via VITE_SNIPCART_KEY.
 * Until then the store stays dormant (buy buttons are inert) and nothing loads.
 */
export function initSnipcart(): void {
  const key = import.meta.env.VITE_SNIPCART_KEY as string | undefined;
  const VER = "3.7.1";
  if (!key) {
    console.info("[Gypsi] Store dormant — set VITE_SNIPCART_KEY in .env to enable checkout.");
    return;
  }
  const node = document.getElementById("snipcart");
  if (node) node.setAttribute("data-api-key", key);

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `https://cdn.snipcart.com/themes/v${VER}/default/snipcart.css`;
  document.head.appendChild(css);

  const js = document.createElement("script");
  js.async = true;
  js.src = `https://cdn.snipcart.com/themes/v${VER}/default/snipcart.js`;
  document.body.appendChild(js);
}
