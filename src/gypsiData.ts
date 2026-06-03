export const GYPSI = {
  benefits: [
    { icon: 'noNeedle', title: 'No Needles', note: 'Glow without the clinic' },
    { icon: 'noBotox', title: 'No Botox', note: 'Movement is beauty' },
    { icon: 'noHarsh', title: 'No Harsh Treatments', note: 'Kind to your barrier' },
    { icon: 'leaf', title: 'Nourish Your Skin', note: 'Botanicals, not band-aids' },
  ],
  ingredients: [
    { name: 'Sea Fennel', role: 'Bio-retinol', note: 'Smooths & firms without irritation.' },
    { name: 'Marula Oil', role: 'Omega-rich', note: 'Deep, weightless nourishment.' },
    { name: 'Kakadu Plum', role: 'Vitamin C', note: 'Brightens & evens tone.' },
    { name: 'Blue Tansy', role: 'Calming', note: 'Soothes redness overnight.' },
  ],
  ritual: [
    { n: '01', t: 'Cleanse', d: 'Begin with bare, damp skin — the canvas.' },
    { n: '02', t: 'Drop', d: 'Press 3–4 drops between warm palms.' },
    { n: '03', t: 'Melt', d: 'Sweep upward, breathe, let it absorb.' },
    { n: '04', t: 'Seal', d: 'Layer your moisturizer to lock the dew.' },
  ],
  line: [
    { id: 'serum', name: 'The Miracle Serum', type: 'Face Serum · 30ml', price: 68, img: '/img/product-serum.jpeg', hero: true, tag: 'Bestseller' },
    { id: 'cleanser', name: 'Verdant Mask', type: 'Botanical Mask · 100ml', price: 42, img: '/img/product-cleanser.jpeg', hero: false, tag: undefined },
    { id: 'oil', name: "Wanderer's Oil", type: 'Face Oil · 30ml', price: 54, img: '/img/product-oil.jpeg', hero: false, tag: undefined },
    { id: 'cream', name: 'Moonlit Balm', type: 'Night Balm · 50ml', price: 48, img: '/img/product-cream.jpeg', hero: false, tag: undefined },
  ],
  reviews: [
    { q: "Three weeks in and strangers ask what I'm doing differently. It's this.", a: 'Maya R.', loc: 'Lisbon', r: 5 },
    { q: "The only serum that never made my sensitive skin flare. It just glows.", a: 'Teagan W.', loc: 'Byron Bay', r: 5 },
    { q: "Smells like a holiday and absorbs in seconds. I'm on my fourth bottle.", a: 'Noor A.', loc: 'Marseille', r: 5 },
  ],
}
