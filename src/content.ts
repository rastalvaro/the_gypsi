import type { SiteContent } from "./types";

/**
 * THE GYPSI — site content.
 * This is the single file you edit to change copy, products, prices, and photos.
 * Images live in /public/img and are referenced as "/img/<file>".
 * After changing products/prices, the store stays in sync automatically
 * (npm run build regenerates the Snipcart price-validation page).
 */
export const content: SiteContent = {
  hero: {
    eyebrow: "Clean beauty · wild at heart",
    headline: "The\nMiracle\nSerum",
    lede: "A single golden drop of cold-pressed botanicals. Real, visible glow — no needles, no compromise.",
    ctaPrimary: "Shop the Serum — $68",
    ctaSecondary: "The Ritual",
    image: "/img/hero-photo.jpeg",
  },

  marquee: [
    "Cold-pressed botanicals",
    "Plant-based formulas",
    "Recyclable glass",
    "Kind to sensitive skin",
    "Made in small batches",
  ],

  nav: {
    links: [
      { label: "Serum", href: "#serum" },
      { label: "Ritual", href: "#ritual" },
      { label: "The Line", href: "#line" },
      { label: "Story", href: "#story" },
    ],
    shopLabel: "Shop",
  },

  feature: {
    lede: "Twenty-one botanicals suspended in cold-pressed marula. It helps skin look firmer and brighter while flooding it with weightless moisture — the glow people mistake for a filter.",
    bullets: [
      "Skin looks firmer and smoother",
      "Plant-derived bio-retinol, gentle on skin",
      "Absorbs in seconds, no residue",
    ],
    rating: "A community favorite",
  },

  ritualSection: {
    eyebrow: "The ritual · four breaths",
    headingLead: "A minute for yourself,",
    headingHighlight: "morning and night.",
  },

  ingredientsSection: {
    eyebrow: "Sourced, not synthesized",
    headingLead: "From the",
    headingHighlight: "wild places",
    body: "We travel for our ingredients — coastal cliffs, river deltas, sun-drenched groves. Every drop is traceable to the soil it grew in.",
  },

  lineSection: {
    eyebrow: "The collection",
    headingLead: "The whole",
    headingHighlight: "ritual",
  },

  story: {
    eyebrow: "Our story · the founder",
    quoteLead: "At the heart of this brand is a passion for discovering the world's ",
    quoteHighlight: "finest skincare ingredients",
    quoteTail: ".",
    body: "Through years of travel across different countries and cultures, I've explored local beauty rituals, sourced ingredients from trusted suppliers, and carefully selected formulations known for their purity and effectiveness. Every product is inspired by this journey — blending nature, tradition, and luxury to bring you skincare that feels as beautiful as it is nourishing.",
    image: "/img/campaign-miracle-serum.jpeg",
  },

  newsletter: {
    eyebrow: "Join the wander",
    heading: "15% off your first ritual.",
    body: "Slow beauty notes, early drops, and the occasional postcard from wherever we're sourcing next.",
  },

  footer: {
    tagline:
      "Clean, botanical skincare for the beautifully unbothered. Made in small batches, never tested on animals.",
    columns: [
      {
        heading: "Shop",
        links: [
          { label: "The Miracle Serum", href: "#serum" },
          { label: "Verdant Mask", href: "#line" },
          { label: "Wanderer's Oil", href: "#line" },
          { label: "Moonlit Balm", href: "#line" },
        ],
      },
      {
        heading: "About",
        // TODO(owner): point Sustainability/Journal at real pages once they exist.
        links: [
          { label: "Our story", href: "#story" },
          { label: "Ingredients", href: "#ingredients" },
          { label: "Sustainability", href: "#" },
          { label: "Journal", href: "#" },
        ],
      },
      {
        heading: "Care",
        // TODO(owner): add a contact email (mailto:) and a Track-order link (Snipcart customer portal).
        links: [
          { label: "Contact", href: "#newsletter" },
          { label: "Shipping & returns", href: "/shipping-returns.html" },
          { label: "FAQ", href: "/faq.html" },
          { label: "Track order", href: "#" },
        ],
      },
    ],
    // TODO(owner): replace Instagram/TikTok with real profile URLs.
    social: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "Privacy", href: "/privacy.html" },
    ],
    copyright: "© 2026 The Gypsi. All rights reserved.",
  },

  benefits: [
    { icon: "noNeedle", title: "No Needles", note: "Glow without the clinic" },
    { icon: "noBotox", title: "No Botox", note: "Movement is beauty" },
    { icon: "noHarsh", title: "No Harsh Treatments", note: "Kind to your barrier" },
    { icon: "leaf", title: "Nourish Your Skin", note: "Botanicals, not band-aids" },
  ],

  ingredients: [
    { name: "Sea Fennel", role: "Bio-retinol", note: "Smooths & firms, gentle on skin." },
    { name: "Marula Oil", role: "Omega-rich", note: "Deep, weightless nourishment." },
    { name: "Kakadu Plum", role: "Vitamin C", note: "Brightens & evens tone." },
    { name: "Blue Tansy", role: "Calming", note: "Soothes redness overnight." },
  ],

  ritual: [
    { n: "01", t: "Cleanse", d: "Begin with bare, damp skin — the canvas." },
    { n: "02", t: "Drop", d: "Press 3–4 drops between warm palms." },
    { n: "03", t: "Melt", d: "Sweep upward, breathe, let it absorb." },
    { n: "04", t: "Seal", d: "Layer your moisturizer to lock the dew." },
  ],

  line: [
    { id: "serum", name: "The Miracle Serum", type: "Face Serum · 30ml", price: 68, img: "/img/product-serum.jpeg", featured: true, tag: "Bestseller" },
    { id: "cleanser", name: "Verdant Mask", type: "Botanical Mask · 100ml", price: 42, img: "/img/product-cleanser.jpeg", featured: false, tag: "" },
    { id: "oil", name: "Wanderer's Oil", type: "Face Oil · 30ml", price: 54, img: "/img/product-oil.jpeg", featured: false, tag: "" },
    { id: "cream", name: "Moonlit Balm", type: "Night Balm · 50ml", price: 48, img: "/img/product-cream.jpeg", featured: false, tag: "" },
  ],

  reviews: [
    { q: "Strangers keep asking what I'm doing differently. It's this.", a: "Maya R.", loc: "Lisbon", r: 5 },
    { q: "So gentle on my sensitive skin — it just glows.", a: "Teagan W.", loc: "Byron Bay", r: 5 },
    { q: "Smells like a holiday and absorbs in seconds. I'm on my fourth bottle.", a: "Noor A.", loc: "Marseille", r: 5 },
  ],
};
