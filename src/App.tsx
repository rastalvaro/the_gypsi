import {
  Nav,
  Hero,
  Marquee,
  Ritual,
  ProductFeature,
  Ingredients,
  Line,
  Story,
  Reviews,
  Newsletter,
  Footer,
} from "./sections";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero />
        <Marquee />
        <ProductFeature />
        <Ritual />
        <Ingredients />
        <Line />
        <Story />
        <Reviews />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
