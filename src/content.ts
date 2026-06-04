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
  line: productsData.items,
  reviews: reviewsData.items,
};
