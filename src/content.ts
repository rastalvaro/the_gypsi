import type { SiteContent } from "./types";
import hero from "../content/hero.json";
import marqueeData from "../content/marquee.json";
import nav from "../content/nav.json";
import feature from "../content/feature.json";
import sectionsData from "../content/sections.json";
import story from "../content/story.json";
import newsletter from "../content/newsletter.json";
import footer from "../content/footer.json";
import benefitsData from "../content/benefits.json";
import ingredientsData from "../content/ingredients.json";
import ritualData from "../content/ritual.json";
import productsData from "../content/products.json";
import reviewsData from "../content/reviews.json";
import site from "../content/site.json";

export const content: SiteContent = {
  hero,
  marquee: marqueeData.items,
  nav,
  feature,
  ritualSection: sectionsData.ritualSection,
  ingredientsSection: sectionsData.ingredientsSection,
  lineSection: sectionsData.lineSection,
  story,
  newsletter,
  footer,
  benefits: benefitsData.items,
  ingredients: ingredientsData.items,
  ritual: ritualData.items,
  // `featured` is derived from feature.featuredId (the CMS picker) so there's one
  // source of truth; falls back to the first product if the id doesn't match.
  line: productsData.items.map((p) => ({
    ...p,
    featured: p.id === feature.featuredId,
  })),
  reviews: reviewsData.items,
  site,
};
