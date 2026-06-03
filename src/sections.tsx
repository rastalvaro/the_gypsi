import { useEffect, useState } from "react";
import { content } from "./content";
import { Reveal, Button, Ring, Wordmark } from "./components/ui";
import { ICON } from "./components/icons";
import { snip } from "./lib/snipcart";

const money = (n: number) => "$" + n.toFixed(0);

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
        <nav className="hidden md:flex flex-1" style={{ gap: 30 }}>
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
            className="snipcart-checkout inline-flex items-center"
            aria-label="Cart"
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
            <span style={{ width: 22, display: "inline-block" }}>{ICON.cart}</span>
            <span>
              (<span className="snipcart-items-count">0</span>)
            </span>
          </button>
          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            style={{ background: "none", border: 0, color: "inherit", width: 24 }}
          >
            {open ? ICON.close : ICON.menu}
          </button>
        </div>
      </div>
      {open && (
        <div className="wrap flex flex-col md:hidden" style={{ paddingBottom: 22, gap: 16 }}>
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
      <img
        src={h.image}
        alt="The Gypsi hero"
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
          <p className="eyebrow" style={{ color: "rgba(243,239,230,.85)", marginBottom: 22 }}>
            {h.eyebrow}
          </p>
        </Reveal>
        <h1 className="display h1" style={{ maxWidth: "14ch" }}>
          {lines.map((l, i) => (
            <Reveal as="span" key={i} delay={120 + i * 110} style={{ display: "block" }}>
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
        <span key={i} className="inline-flex items-center" style={{ gap: "3rem" }}>
          <span>{t}</span>
          <span style={{ opacity: 0.4 }}>✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" style={{ borderTop: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)", padding: "20px 0", background: "var(--color-sand-deep)" }}>
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
          <img src={p.img} alt={p.name} style={{ aspectRatio: "4/5", width: "100%", objectFit: "cover", borderRadius: 2, display: "block" }} />
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
                  <span style={{ color: "var(--color-moss)", width: 16, flex: "0 0 16px" }}>{ICON.arrowR}</span>
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
                <span style={{ color: "var(--color-tan)", display: "inline-flex", width: 15 }}>{ICON.star}</span>
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
    <section className="section" style={{ background: "var(--color-forest)", color: "#eef1e4" }}>
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 items-end" style={{ gap: 40, marginBottom: 56 }}>
          <Reveal>
            <p className="eyebrow" style={{ color: "rgba(238,241,228,.7)", marginBottom: 16 }}>
              {s.eyebrow}
            </p>
            <h2 className="display h2" style={{ color: "#eef1e4" }}>
              {s.headingLead}
              <br />
              {s.headingHighlight}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede" style={{ color: "rgba(238,241,228,.82)", margin: 0 }}>
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
                style={{ height: 64, width: 64, borderRadius: "50%", alignSelf: "flex-start", border: "1px solid rgba(238,241,228,.4)", display: "grid", placeItems: "center", color: "var(--color-tan)" }}
              >
                <span style={{ width: 26, display: "inline-flex" }}>{ICON.leaf}</span>
              </span>
              <div>
                <p className="tracked" style={{ color: "var(--color-tan)", marginBottom: 8 }}>
                  {g.role}
                </p>
                <h3 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.5rem", margin: "0 0 8px" }}>{g.name}</h3>
                <p style={{ color: "rgba(238,241,228,.72)", fontSize: ".9rem", margin: 0 }}>{g.note}</p>
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
            <a href="#" className="link-underline">
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
  const [hover, setHover] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex flex-col" style={{ gap: 14 }}>
        <div className="relative">
          <img src={p.img} alt={p.name} style={{ aspectRatio: "3/4", width: "100%", objectFit: "cover", borderRadius: 2, display: "block" }} />
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
            className={`snipcart-add-item absolute`}
            style={{
              left: 12,
              right: 12,
              bottom: 12,
              padding: "13px",
              background: "var(--color-ink)",
              color: "var(--color-sand)",
              border: 0,
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontSize: ".66rem",
              letterSpacing: ".24em",
              textTransform: "uppercase",
              opacity: hover ? 1 : 0,
              transform: hover ? "none" : "translateY(8px)",
              transition: "opacity .35s, transform .35s",
            }}
          >
            Add — {money(p.price)}
          </button>
        </div>
        <div className="flex justify-between items-baseline" style={{ gap: 12 }}>
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: ".06em", fontSize: "1rem", lineHeight: 1.25, margin: "0 0 4px" }}>{p.name}</h3>
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
            <img src={s.image} alt="The Gypsi — founder's journey" style={{ width: "100%", display: "block" }} />
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
            <p className="lede" style={{ marginBottom: 26 }}>
              {s.body}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <Button variant="ghost" href="#" arrow>
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
          <p className="eyebrow" style={{ textAlign: "center", marginBottom: 46 }}>
            Loved in 40+ countries
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "clamp(20px,3vw,40px)" }}>
          {content.reviews.map((r, i) => (
            <Reveal
              key={i}
              delay={i * 110}
              style={{ background: "var(--color-card)", border: "1px solid var(--color-line)", padding: "34px 30px", display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div className="flex" style={{ gap: 4, color: "var(--color-tan)" }}>
                {Array.from({ length: r.r }).map((_, k) => (
                  <span key={k} style={{ width: 14, display: "inline-flex" }}>
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

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(val)) return;
    const body = new URLSearchParams({ "form-name": "newsletter", email: val });
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() })
      .then(() => setDone(true))
      .catch(() => setDone(true));
  };

  return (
    <section className="section" style={{ background: "var(--color-forest)", color: "#eef1e4" }}>
      <div className="wrap" style={{ textAlign: "center", maxWidth: 760, marginInline: "auto" }}>
        <Reveal>
          <p className="eyebrow" style={{ color: "rgba(238,241,228,.7)", marginBottom: 18 }}>
            {n.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="serif-quote" style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", marginBottom: 18 }}>
            {n.heading}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="lede" style={{ color: "rgba(238,241,228,.82)", marginInline: "auto", marginBottom: 30 }}>
            {n.body}
          </p>
        </Reveal>
        <Reveal delay={200}>
          {done ? (
            <p className="display" style={{ letterSpacing: ".16em", fontSize: "1rem" }}>
              Welcome to The Gypsi ✦ check your inbox
            </p>
          ) : (
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={submit}
              className="flex flex-wrap justify-center"
              style={{ gap: 12, maxWidth: 480, marginInline: "auto" }}
            >
              <input type="hidden" name="form-name" value="newsletter" />
              <p hidden>
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                style={{ flex: "1 1 240px", background: "transparent", border: "1px solid rgba(238,241,228,.4)", color: "#eef1e4", padding: "15px 18px", borderRadius: 999, fontFamily: "var(--font-display)", letterSpacing: ".08em", fontSize: ".9rem", outline: "none" }}
              />
              <Button variant="light" arrow>
                Subscribe
              </Button>
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
                  <li key={it}>
                    <a href="#" style={{ color: "var(--color-ink-soft)", fontSize: ".9rem" }} className="link-underline">
                      {it}
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
              <a key={sLink} href="#" className="link-underline">
                {sLink}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
