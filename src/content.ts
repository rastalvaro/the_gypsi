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
    "Vegan & cruelty-free",
    "Recyclable glass",
    "Dermatologist-tested",
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
    lede: "Twenty-one botanicals suspended in cold-pressed marula. It firms, brightens and floods skin with weightless moisture — the glow people mistake for a filter.",
    bullets: [
      "Visibly firmer in 21 days",
      "Plant bio-retinol, zero irritation",
      "Absorbs in seconds, no residue",
    ],
    rating: "4.9 · 2,400+ reviews",
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
      "Clean, botanical skincare for the beautifully unbothered. Made in small batches, never tested on anyone but us.",
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
        // TODO(owner): add a contact email (mailto:) and real policy/FAQ/tracking pages.
        links: [
          { label: "Contact", href: "#newsletter" },
          { label: "Shipping & returns", href: "#" },
          { label: "FAQ", href: "#" },
          { label: "Track order", href: "#" },
        ],
      },
    ],
    // TODO(owner): replace with real profile URLs and a Privacy page.
    social: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "Privacy", href: "#" },
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
    { name: "Sea Fennel", role: "Bio-retinol", note: "Smooths & firms without irritation." },
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
    { q: "Three weeks in and strangers ask what I'm doing differently. It's this.", a: "Maya R.", loc: "Lisbon", r: 5 },
    { q: "The only serum that never made my sensitive skin flare. It just glows.", a: "Teagan W.", loc: "Byron Bay", r: 5 },
    { q: "Smells like a holiday and absorbs in seconds. I'm on my fourth bottle.", a: "Noor A.", loc: "Marseille", r: 5 },
  ],
};
