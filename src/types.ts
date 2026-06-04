// Content types for The Gypsi. Editing the data? See content.ts.

export interface Hero {
  eyebrow: string;
  /** Each line break (\n) becomes a new line in the big title. */
  headline: string;
  lede: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
}

export interface Feature {
  /** id of the product shown in the large feature block (the CMS "featured" picker). */
  featuredId?: string;
  lede: string;
  bullets: string[];
  rating: string;
}

export interface SectionHeading {
  eyebrow: string;
  headingLead: string;
  headingHighlight: string;
  /** Optional intro paragraph (used by the Ingredients section). */
  body?: string;
}

export interface Story {
  eyebrow: string;
  quoteLead: string;
  quoteHighlight: string;
  quoteTail: string;
  body: string;
  image: string;
}

export interface Newsletter {
  eyebrow: string;
  heading: string;
  body: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface Footer {
  tagline: string;
  columns: FooterColumn[];
  social: FooterLink[];
  copyright: string;
}

export interface Benefit {
  /** Key into the ICON map (see components/icons.tsx). */
  icon: string;
  title: string;
  note: string;
}

export interface Ingredient {
  name: string;
  role: string;
  note: string;
}

export interface RitualStep {
  n: string;
  t: string;
  d: string;
}

export interface Product {
  /** Unique, lowercase, no spaces. Used as React key + Snipcart item id. */
  id: string;
  name: string;
  type: string;
  price: number;
  img: string;
  /** Derived in content.ts from feature.featuredId — not stored per product. */
  featured: boolean;
  /** Badge text, e.g. "Bestseller". Empty string = no badge. */
  tag: string;
  description: string;
}

export interface Review {
  q: string;
  a: string;
  loc: string;
  /** Star count 1–5. */
  r: number;
}

export interface SiteGlobal {
  seoDescription: string;
  newsletterSuccess: string;
  newsletterError: string;
  reviewsHeading: string;
  storyCta: string;
  lineCta: string;
  productAdd: string;
  productShopCollection: string;
  productBack: string;
}

export interface SiteContent {
  hero: Hero;
  marquee: string[];
  nav: { links: { label: string; href: string }[]; shopLabel: string };
  feature: Feature;
  ritualSection: SectionHeading;
  ingredientsSection: SectionHeading;
  lineSection: SectionHeading;
  story: Story;
  newsletter: Newsletter;
  footer: Footer;
  benefits: Benefit[];
  ingredients: Ingredient[];
  ritual: RitualStep[];
  line: Product[];
  reviews: Review[];
  site: SiteGlobal;
}
