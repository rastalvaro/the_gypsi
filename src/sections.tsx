import { useEffect, useState } from "react";
import { content } from "./content";
import { Reveal, Button, Ring, Wordmark } from "./components/ui";
import { Picture } from "./components/Picture";
import { Markdown } from "./components/Markdown";
import { ICON } from "./components/icons";
import { snip } from "./lib/snipcart";

const money = (n: number) => "$" + n.toFixed(0);
// Responsive image ladders/sizes (must match scripts/gen-images.mjs output).
const PRODUCT_WIDTHS = [320, 512, 768, 1000];
// sizes cap their top slice in px because .wrap maxes at 1280 — an unbounded vw would
// over-serve (download a too-large variant) on wide/4K screens. Caps are ≥ the true
// column width at the breakpoint, so they never under-serve (blur).
const CARD_SIZES = "(min-width: 1280px) 270px, (min-width: 1024px) 23vw, (min-width: 640px) 47vw, 92vw";
const FEATURE_SIZES = "(min-width: 1280px) 540px, (min-width: 768px) 45vw, 100vw";

/* ===================== NAV ===================== */
export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { links, shopLabel } = content.nav;

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-60"
      style={{
        zIndex: 60,
        transition: "background .5s, border-color .5s, color .5s",
        background: solid ? "color-mix(in oklab, var(--color-sand) 88%, transparent)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: `1px solid ${solid ? "var(--color-line)" : "transparent"}`,
        color: solid ? "var(--color-ink)" : "#f3efe6",
      }}
    >
      <div className="wrap flex items-center justify-between" style={{ height: 78 }}>
        <nav className="hidden md:flex flex-1" style={{ gap: 30 }} aria-label="Primary">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="link-underline">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="flex-none">
          <Wordmark size="1.15rem" />
        </a>
        <div className="flex flex-1 justify-end items-center" style={{ gap: 22 }}>
          <a href="#line" className="link-underline hidden md:inline">
            {shopLabel}
          </a>
          <button
            className="snipcart-checkout icon-btn inline-flex items-center"
            aria-label="Open cart"
            style={{
              background: "none",
              border: 0,
              color: "inherit",
              gap: 7,
              letterSpacing: ".2em",
              fontFamily: "var(--font-display)",
              fontSize: ".72rem",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true" style={{ width: 22, display: "inline-block" }}>
              {ICON.cart}
            </span>
            <span aria-hidden="true">
              (<span className="snipcart-items-count">0</span>)
            </span>
            <span className="sr-only">items in cart</span>
          </button>
          <button
            className="icon-btn md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
            style={{ background: "none", border: 0, color: "inherit" }}
          >
            <span aria-hidden="true" style={{ width: 24, display: "inline-flex" }}>
              {open ? ICON.close : ICON.menu}
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="wrap flex flex-col md:hidden" style={{ paddingBottom: 22, gap: 16 }}>
          {[...links, { label: shopLabel, href: "#line" }].map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ fontFamily: "var(--font-display)", letterSpacing: ".2em", textTransform: "uppercase", fontSize: ".82rem" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

/* ===================== HERO ===================== */
export function Hero() {
  const h = content.hero;
  const lines = h.headline.split("\n");
  return (
    <section
      id="top"
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "100svh", color: "#f3efe6", background: "#1a2114" }}
    >
      <Picture
        src={h.image}
        alt="A model with luminous, glowing skin — The Gypsi botanical skincare"
        widths={[360, 480, 660]}
        sizes="100vw"
        width={660}
        height={1537}
        eager
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "50% 45%" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(18,24,14,.55) 0%, rgba(18,24,14,.05) 28%, rgba(18,24,14,.12) 55%, rgba(15,20,11,.82) 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(15,20,11,.45) 0%, transparent 45%)" }}
      />

      <div className="wrap relative w-full" style={{ paddingBottom: "clamp(40px, 7vh, 84px)", paddingTop: 120 }}>
        <Reveal>
          <p className="eyebrow" style={{ color: "rgba(243,239,230,.92)", marginBottom: 22 }}>
            {h.eyebrow}
          </p>
        </Reveal>
        <h1 className="display h1" style={{ maxWidth: "14ch" }}>
          {lines.map((l, i) => (
            <Reveal as="span" key={l + i} delay={120 + i * 110} style={{ display: "block" }}>
              {l}
            </Reveal>
          ))}
        </h1>
        <Reveal delay={420}>
          <p className="lede" style={{ color: "rgba(243,239,230,.9)", marginTop: 26 }}>
            {h.lede}
          </p>
        </Reveal>
        <Reveal delay={520}>
          <div className="flex flex-wrap" style={{ gap: 16, marginTop: 34 }}>
            <Button variant="light" href="#serum" arrow>
              {h.ctaPrimary}
            </Button>
            <Button variant="ghost" href="#ritual" className="hero-ghost">
              {h.ctaSecondary}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={640}>
          <div
            className="flex flex-wrap"
            style={{ gap: 38, marginTop: 56, borderTop: "1px solid rgba(243,239,230,.28)", paddingTop: 26 }}
          >
            {content.benefits.map((b) => (
              <div key={b.title} className="flex items-center" style={{ gap: 14 }}>
                <Ring name={b.icon} size={46} />
                <span style={{ fontFamily: "var(--font-display)", letterSpacing: ".18em", textTransform: "uppercase", fontSize: ".72rem", lineHeight: 1.5 }}>
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== MARQUEE ===================== */
export function Marquee() {
  const items = content.marquee;
  const row = (
    <span className="marquee__item">
      {items.map((t, i) => (
        <span key={t + i} className="inline-flex items-center" style={{ gap: "3rem" }}>
          <span>{t}</span>
          <span style={{ opacity: 0.4 }}>✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div
      className="marquee"
      aria-hidden="true"
      style={{ borderTop: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)", padding: "20px 0", background: "var(--color-sand-deep)" }}
    >
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  );
}

/* ===================== RITUAL ===================== */
export function Ritual() {
  const s = content.ritualSection;
  return (
    <section id="ritual" className="section" style={{ background: "var(--color-sand)" }}>
      <div className="wrap">
        <div className="grid grid-cols-1" style={{ gap: 14, marginBottom: 54, maxWidth: 720 }}>
          <Reveal>
            <p className="eyebrow">{s.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="serif-quote" style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)", color: "var(--color-ink)" }}>
              {s.headingLead}
              <br />
              <span style={{ color: "var(--color-moss)" }}>{s.headingHighlight}</span>
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid var(--color-line)" }}>
          {content.ritual.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 90}
              style={{
                padding: "32px 26px 32px 0",
                borderRight: "1px solid var(--color-line)",
                paddingLeft: i ? 26 : 0,
              }}
            >
              <div className="display" style={{ fontSize: "2.4rem", color: "var(--color-tan)", marginBottom: 18, letterSpacing: ".1em" }}>
                {step.n}
              </div>
              <h3 className="h3" style={{ fontSize: "1.05rem", marginBottom: 10 }}>
                {step.t}
              </h3>
              <p style={{ color: "var(--color-ink-soft)", fontSize: ".96rem", margin: 0 }}>{step.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== PRODUCT FEATURE ===================== */
export function ProductFeature() {
  const p = content.line.find((x) => x.featured) ?? content.line[0];
  const f = content.feature;
  const [added, setAdded] = useState(false);
  const add = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  return (
    <section id="serum" className="section" style={{ background: "var(--color-sand-deep)" }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-2 items-center" style={{ gap: "clamp(32px, 6vw, 80px)" }}>
        <Reveal className="order-1 md:order-none">
          <Picture
            src={p.img}
            alt={p.name}
            widths={PRODUCT_WIDTHS}
            sizes={FEATURE_SIZES}
            style={{ aspectRatio: "4/5", width: "100%", objectFit: "cover", borderRadius: 2, display: "block" }}
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              {p.tag ? p.tag + " · " : ""}
              {p.type}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display h2" style={{ marginBottom: 22 }}>
              {p.name}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginBottom: 26 }}>
              {f.lede}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <ul className="grid" style={{ listStyle: "none", padding: 0, margin: "0 0 30px", gap: 12 }}>
              {f.bullets.map((t) => (
                <li key={t} className="flex items-center" style={{ gap: 12, color: "var(--color-ink-soft)" }}>
                  <span aria-hidden="true" style={{ color: "var(--color-moss)", width: 16, flex: "0 0 16px" }}>
                    {ICON.arrowR}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={260}>
            <div className="flex flex-wrap items-center" style={{ gap: 22 }}>
              <span className="display" style={{ fontSize: "1.7rem", letterSpacing: ".06em" }}>
                {money(p.price)}
              </span>
              <Button {...snip(p)} onClick={add} arrow={!added}>
                {added ? "Added ✦" : "Add to Bag"}
              </Button>
              <div className="flex items-center" style={{ gap: 8, color: "var(--color-ink-mute)", fontSize: ".82rem" }}>
                {f.rating}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===================== INGREDIENTS ===================== */
export function Ingredients() {
  const s = content.ingredientsSection;
  return (
    <section id="ingredients" className="section" style={{ background: "var(--color-forest)", color: "#eef1e4" }}>
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end" style={{ gap: 40, marginBottom: 56 }}>
          <Reveal>
            <p className="eyebrow" style={{ color: "rgba(238,241,228,.85)", marginBottom: 16 }}>
              {s.eyebrow}
            </p>
            <h2 className="display h2" style={{ color: "#eef1e4" }}>
              {s.headingLead}
              <br />
              {s.headingHighlight}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede" style={{ color: "rgba(238,241,228,.86)", margin: 0 }}>
              {s.body}
            </p>
          </Reveal>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          style={{ gap: 1, background: "rgba(238,241,228,.16)", border: "1px solid rgba(238,241,228,.16)" }}
        >
          {content.ingredients.map((g, i) => (
            <Reveal
              key={g.name}
              delay={i * 90}
              style={{ background: "var(--color-forest)", padding: "30px 24px", minHeight: 230, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <span
                aria-hidden="true"
                style={{ height: 64, width: 64, borderRadius: "50%", alignSelf: "flex-start", border: "1px solid rgba(238,241,228,.4)", display: "grid", placeItems: "center", color: "var(--color-tan)" }}
              >
                <span style={{ width: 26, display: "inline-flex" }}>{ICON.leaf}</span>
              </span>
              <div>
                <p className="tracked" style={{ color: "var(--color-tan)", marginBottom: 8 }}>
                  {g.role}
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.5rem", margin: "0 0 8px" }}>{g.name}</h3>
                <p style={{ color: "rgba(238,241,228,.78)", fontSize: ".9rem", margin: 0 }}>{g.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== THE LINE ===================== */
export function Line() {
  const s = content.lineSection;
  return (
    <section id="line" className="section" style={{ background: "var(--color-sand)" }}>
      <div className="wrap">
        <div className="flex justify-between items-end flex-wrap" style={{ gap: 20, marginBottom: 46 }}>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 14 }}>
              {s.eyebrow}
            </p>
            <h2 className="display h2">
              {s.headingLead}
              <br />
              {s.headingHighlight}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <a href="#line" className="link-underline">
              View all products
            </a>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "clamp(16px,2vw,30px)" }}>
          {content.line.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, delay }: { p: (typeof content.line)[number]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col" style={{ gap: 14 }}>
        <div className="card-media relative">
          <a href={`/products/${p.id}.html`} aria-label={`View ${p.name}`}>
            <Picture
              src={p.img}
              alt={p.name}
              widths={PRODUCT_WIDTHS}
              sizes={CARD_SIZES}
              style={{ aspectRatio: "3/4", width: "100%", objectFit: "cover", borderRadius: 2, display: "block" }}
            />
          </a>
          {p.tag && (
            <span
              className="absolute"
              style={{ top: 12, left: 12, background: "var(--color-sand)", border: "1px solid var(--color-line)", padding: "5px 11px", fontFamily: "var(--font-display)", fontSize: ".58rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--color-moss)" }}
            >
              {p.tag}
            </span>
          )}
          <button
            {...snip(p)}
            className="snipcart-add-item card-add absolute"
            style={{
              left: 12,
              right: 12,
              bottom: 12,
              minHeight: 44,
              padding: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-ink)",
              color: "var(--color-sand)",
              border: 0,
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontSize: ".66rem",
              letterSpacing: ".24em",
              textTransform: "uppercase",
            }}
          >
            Add — {money(p.price)}
          </button>
        </div>
        <div className="flex justify-between items-baseline" style={{ gap: 12 }}>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: ".06em", fontSize: "1rem", lineHeight: 1.25, margin: "0 0 4px" }}>
              <a href={`/products/${p.id}.html`} style={{ color: "inherit" }}>
                {p.name}
              </a>
            </h3>
            <p style={{ color: "var(--color-ink-mute)", fontSize: ".8rem", margin: 0 }}>{p.type}</p>
          </div>
          <span className="display" style={{ fontSize: "1rem", letterSpacing: ".04em", flex: "0 0 auto" }}>
            {money(p.price)}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

/* ===================== STORY ===================== */
export function Story() {
  const s = content.story;
  return (
    <section id="story" className="section" style={{ background: "var(--color-sand-deeper)" }}>
      <div className="wrap grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center" style={{ gap: "clamp(30px,5vw,70px)" }}>
        <Reveal>
          <div style={{ boxShadow: "0 30px 70px -30px rgba(20,28,14,.55)", borderRadius: 3, overflow: "hidden", border: "1px solid var(--color-line)" }}>
            <Picture
              src={s.image}
              alt="The Gypsi founder sourcing botanical ingredients on her travels"
              widths={[400, 640, 1000]}
              sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, 100vw"
              width={1023}
              height={1537}
              style={{ width: "100%", aspectRatio: "1023 / 1537", objectFit: "cover", display: "block" }}
            />

          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 18 }}>
              {s.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <blockquote className="serif-quote" style={{ fontSize: "clamp(1.7rem,3.2vw,2.7rem)", margin: "0 0 24px", color: "var(--color-ink)" }}>
              “{s.quoteLead}
              <span style={{ color: "var(--color-moss)" }}>{s.quoteHighlight}</span>
              {s.quoteTail}”
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <Markdown className="lede rich" style={{ marginBottom: 26 }} text={s.body} />
          </Reveal>
          <Reveal delay={220}>
            <Button variant="ghost" href="#story" arrow>
              Read the journey
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===================== REVIEWS ===================== */
export function Reviews() {
  return (
    <section className="section" style={{ background: "var(--color-sand-deep)" }}>
      <div className="wrap">
        <Reveal>
          <h2 className="eyebrow" style={{ textAlign: "center", margin: "0 0 46px" }}>
            From our community
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "clamp(20px,3vw,40px)" }}>
          {content.reviews.map((r) => (
            <Reveal
              key={`${r.a}-${r.loc}`}
              style={{ background: "var(--color-card)", border: "1px solid var(--color-line)", padding: "34px 30px", display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div className="flex" role="img" aria-label={`Rated ${r.r} out of 5 stars`} style={{ gap: 4, color: "var(--color-tan)" }}>
                {Array.from({ length: r.r }).map((_, k) => (
                  <span key={k} aria-hidden="true" style={{ width: 14, display: "inline-flex" }}>
                    {ICON.star}
                  </span>
                ))}
              </div>
              <p className="serif-quote" style={{ fontSize: "1.3rem", color: "var(--color-ink)", margin: 0, flex: 1 }}>
                “{r.q}”
              </p>
              <p style={{ margin: 0, fontFamily: "var(--font-display)", letterSpacing: ".14em", textTransform: "uppercase", fontSize: ".72rem", color: "var(--color-ink-mute)" }}>
                {r.a} · {r.loc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== NEWSLETTER (Netlify Forms) ===================== */
export function Newsletter() {
  const n = content.newsletter;
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(val)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    const body = new URLSearchParams({ "form-name": "newsletter", email: val });
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      .then((res) => {
        if (res.ok) setDone(true);
        else setError("Something went wrong — please try again.");
      })
      .catch(() => setError("Network error — please try again."));
  };

  return (
    <section id="newsletter" className="section" style={{ background: "var(--color-forest)", color: "#eef1e4" }}>
      <div className="wrap" style={{ textAlign: "center", maxWidth: 760, marginInline: "auto" }}>
        <Reveal>
          <p className="eyebrow" style={{ color: "rgba(238,241,228,.85)", marginBottom: 18 }}>
            {n.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="serif-quote" style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", marginBottom: 18 }}>
            {n.heading}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lede" style={{ color: "rgba(238,241,228,.86)", marginInline: "auto", marginBottom: 30 }}>
            {n.body}
          </p>
        </Reveal>
        <Reveal delay={200}>
          {done ? (
            <p role="status" aria-live="polite" className="display" style={{ letterSpacing: ".16em", fontSize: "1rem" }}>
              Welcome to The Gypsi ✦ use code WELCOME15 for 15% off your first order
            </p>
          ) : (
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={submit}
              className="newsletter-form flex flex-wrap justify-center"
              style={{ gap: 12, maxWidth: 480, marginInline: "auto" }}
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <p hidden>
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>
              <label htmlFor="nl-email" className="sr-only">
                Email address
              </label>
              <input
                id="nl-email"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "nl-error" : undefined}
                style={{ flex: "1 1 240px", background: "transparent", border: "1px solid rgba(238,241,228,.55)", color: "#eef1e4", padding: "15px 18px", borderRadius: 999, fontFamily: "var(--font-display)", letterSpacing: ".08em", fontSize: ".9rem" }}
              />
              <Button variant="light" arrow>
                Subscribe
              </Button>
              {error && (
                <p id="nl-error" role="alert" style={{ flexBasis: "100%", margin: "4px 0 0", color: "#f3efe6", fontSize: ".8rem", letterSpacing: ".04em" }}>
                  {error}
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
export function Footer() {
  const f = content.footer;
  return (
    <footer style={{ background: "var(--color-sand-deeper)", borderTop: "1px solid var(--color-line)" }}>
      <div className="wrap" style={{ paddingBlock: 64 }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr]" style={{ gap: 40, paddingBottom: 48, borderBottom: "1px solid var(--color-line)" }}>
          <div>
            <Wordmark size="1.5rem" />
            <p style={{ color: "var(--color-ink-mute)", maxWidth: "30ch", marginTop: 18, fontSize: ".92rem" }}>{f.tagline}</p>
          </div>
          {f.columns.map((col) => (
            <div key={col.heading}>
              <p className="tracked" style={{ color: "var(--color-ink)", marginBottom: 16 }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                {col.links.map((it) => (
                  <li key={it.label}>
                    <a href={it.href} style={{ color: "var(--color-ink-soft)", fontSize: ".9rem" }} className="link-underline">
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between flex-wrap" style={{ gap: 14, paddingTop: 26, color: "var(--color-ink-mute)", fontSize: ".76rem", letterSpacing: ".06em" }}>
          <span>{f.copyright}</span>
          <span className="flex" style={{ gap: 22 }}>
            {f.social.map((sLink) => (
              <a key={sLink.label} href={sLink.href} className="link-underline">
                {sLink.label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
