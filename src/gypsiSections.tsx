import { useState, useEffect } from 'react'
import { Reveal, Btn, Ring, Wordmark, ICON } from './gypsiComponents'
import { GYPSI } from './gypsiData'

const money = (n: number) => '$' + n.toFixed(0)

/* ===================== NAV ===================== */
export function Nav({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links: [string, string][] = [['Serum', '#serum'], ['Ritual', '#ritual'], ['The Line', '#line'], ['Story', '#story']]
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
      transition: 'background .5s, border-color .5s, color .5s',
      background: solid ? 'color-mix(in oklab, var(--bg) 88%, transparent)' : 'transparent',
      backdropFilter: solid ? 'blur(10px)' : 'none',
      borderBottom: `1px solid ${solid ? 'var(--line)' : 'transparent'}`,
      color: solid ? 'var(--ink)' : '#f3efe6',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 78 }}>
        <nav style={{ display: 'flex', gap: 30, flex: 1 }} className="nav-links">
          {links.map(([l, h]) => <a key={l} href={h} className="link-underline">{l}</a>)}
        </nav>
        <a href="#top" style={{ flex: '0 0 auto' }}><Wordmark size="1.15rem" /></a>
        <div style={{ display: 'flex', gap: 22, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <a href="#line" className="link-underline nav-links">Shop</a>
          <button onClick={onCart} aria-label="Cart" style={{ background: 'none', border: 0, color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 7, letterSpacing: '.2em', fontFamily: 'var(--display)', fontSize: '.72rem', textTransform: 'uppercase' }}>
            <span style={{ width: 22, display: 'inline-block' }}>{ICON.cart}</span>
            <span>({cartCount})</span>
          </button>
          <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu" style={{ background: 'none', border: 0, color: 'inherit', width: 24, display: 'none' }}>
            {open ? ICON.close : ICON.menu}
          </button>
        </div>
      </div>
      {open && (
        <div className="wrap" style={{ paddingBottom: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[...links, ['Shop', '#line'] as [string, string]].map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} style={{ fontFamily: 'var(--display)', letterSpacing: '.2em', textTransform: 'uppercase', fontSize: '.82rem' }}>{l}</a>
          ))}
        </div>
      )}
    </header>
  )
}

/* ===================== HERO ===================== */
export function Hero({ headline }: { headline: string }) {
  const lines = headline.split('\n')
  return (
    <section id="top" style={{ position: 'relative', minHeight: '100svh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', color: '#f3efe6', background: '#1a2114' }}>
      <img src="/img/hero-photo.jpeg" alt="A woman holding The Gypsi miracle serum among palm fronds"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 45%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,24,14,.55) 0%, rgba(18,24,14,.05) 28%, rgba(18,24,14,.12) 55%, rgba(15,20,11,.82) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,20,11,.45) 0%, transparent 45%)' }} />

      <div className="wrap" style={{ position: 'relative', width: '100%', paddingBottom: 'clamp(40px, 7vh, 84px)', paddingTop: 120 }}>
        <Reveal>
          <p className="eyebrow" style={{ color: 'rgba(243,239,230,.85)', marginBottom: 22 }}>Clean beauty · wild at heart</p>
        </Reveal>
        <h1 className="display h1" style={{ maxWidth: '14ch' }}>
          {lines.map((l, i) => (
            <Reveal as="span" key={i} delay={120 + i * 110} style={{ display: 'block' }}>{l}</Reveal>
          ))}
        </h1>
        <Reveal delay={420}>
          <p className="lede" style={{ color: 'rgba(243,239,230,.9)', marginTop: 26 }}>
            A single golden drop of cold-pressed botanicals. Real, visible glow — no needles, no compromise.
          </p>
        </Reveal>
        <Reveal delay={520}>
          <div style={{ display: 'flex', gap: 16, marginTop: 34, flexWrap: 'wrap' }}>
            <Btn variant="light" href="#serum" arrow>Shop the Serum — $68</Btn>
            <Btn variant="ghost" href="#ritual">The Ritual</Btn>
          </div>
        </Reveal>
        <Reveal delay={640}>
          <div className="hero-benefits" style={{ display: 'flex', gap: 38, marginTop: 56, flexWrap: 'wrap', borderTop: '1px solid rgba(243,239,230,.28)', paddingTop: 26 }}>
            {GYPSI.benefits.map((b) => (
              <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Ring name={b.icon} size={46} />
                <span style={{ fontFamily: 'var(--display)', letterSpacing: '.18em', textTransform: 'uppercase', fontSize: '.72rem', lineHeight: 1.5 }}>{b.title}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="scroll-cue" style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.8 }}>
        <span style={{ fontFamily: 'var(--display)', fontSize: '.6rem', letterSpacing: '.3em', textTransform: 'uppercase' }}>Scroll</span>
        <span style={{ width: 1, height: 38, background: 'linear-gradient(#f3efe6, transparent)' }} />
      </div>
    </section>
  )
}

/* ===================== MARQUEE ===================== */
export function MarqueeBand() {
  const items = ['Cold-pressed botanicals', 'Vegan & cruelty-free', 'Recyclable glass', 'Dermatologist-tested', 'Made in small batches']
  const row = (
    <span className="marquee__item">
      {items.map((t, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3rem' }}>
          <span>{t}</span><span style={{ opacity: 0.4 }}>✦</span>
        </span>
      ))}
    </span>
  )
  return (
    <div className="marquee" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '20px 0', background: 'var(--bg-alt)' }}>
      <div className="marquee__track">{row}{row}</div>
    </div>
  )
}

/* ===================== RITUAL ===================== */
export function Ritual() {
  return (
    <section id="ritual" className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 54, maxWidth: 720 }}>
          <Reveal><p className="eyebrow">The ritual · four breaths</p></Reveal>
          <Reveal delay={80}>
            <h2 className="serif-quote" style={{ fontSize: 'clamp(2rem,4.4vw,3.4rem)', color: 'var(--ink)' }}>
              A minute for yourself,<br /><span style={{ color: 'var(--moss)' }}>morning and night.</span>
            </h2>
          </Reveal>
        </div>
        <div className="ritual-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid var(--line)' }}>
          {GYPSI.ritual.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="ritual-cell" style={{ padding: '32px 26px 32px 0', borderRight: i < 3 ? '1px solid var(--line)' : 'none', paddingLeft: i ? 26 : 0 }}>
              <div className="display" style={{ fontSize: '2.4rem', color: 'var(--sand)', marginBottom: 18, letterSpacing: '.1em' }}>{s.n}</div>
              <h3 className="h3" style={{ fontSize: '1.05rem', marginBottom: 10 }}>{s.t}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '.96rem', margin: 0 }}>{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================== PRODUCT FEATURE ===================== */
export function ProductFeature({ onAdd }: { onAdd: (p: typeof GYPSI.line[number]) => void }) {
  const p = GYPSI.line[0]
  const [added, setAdded] = useState(false)
  const add = () => { onAdd(p); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  return (
    <section id="serum" className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="wrap feat-section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'center' }}>
        <Reveal className="feat-img">
          <img src={p.img} alt={p.name} style={{ aspectRatio: '4/5', width: '100%', objectFit: 'cover', borderRadius: 2, display: 'block' }} />
        </Reveal>
        <div className="feat-copy">
          <Reveal><p className="eyebrow" style={{ marginBottom: 18 }}>{p.tag} · {p.type}</p></Reveal>
          <Reveal delay={80}><h2 className="display h2" style={{ marginBottom: 22 }}>The Miracle<br />Serum</h2></Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginBottom: 26 }}>
              Twenty-one botanicals suspended in cold-pressed marula. It firms, brightens and floods skin with weightless moisture — the glow people mistake for a filter.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'grid', gap: 12 }}>
              {['Visibly firmer in 21 days', 'Plant bio-retinol, zero irritation', 'Absorbs in seconds, no residue'].map((t) => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--moss)', width: 16, flex: '0 0 16px' }}>{ICON.arrowR}</span>{t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={260}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              <span className="display" style={{ fontSize: '1.7rem', letterSpacing: '.06em' }}>{money(p.price)}</span>
              <Btn onClick={add} arrow={!added}>{added ? 'Added ✦' : 'Add to Bag'}</Btn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-mute)', fontSize: '.82rem' }}>
                <span style={{ color: 'var(--sand)', display: 'inline-flex', width: 15 }}>{ICON.star}</span>
                4.9 · 2,400+ reviews
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ===================== INGREDIENTS ===================== */
export function Ingredients() {
  return (
    <section className="section" style={{ background: 'var(--forest)', color: '#eef1e4' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 56 }} className="ing-head">
          <Reveal>
            <p className="eyebrow" style={{ color: 'rgba(238,241,228,.7)', marginBottom: 16 }}>Sourced, not synthesized</p>
            <h2 className="display h2" style={{ color: '#eef1e4' }}>From the<br />wild places</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede" style={{ color: 'rgba(238,241,228,.82)', margin: 0 }}>
              We travel for our ingredients — coastal cliffs, river deltas, sun-drenched groves. Every drop is traceable to the soil it grew in.
            </p>
          </Reveal>
        </div>
        <div className="ing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(238,241,228,.16)', border: '1px solid rgba(238,241,228,.16)' }}>
          {GYPSI.ingredients.map((g, i) => (
            <Reveal key={g.name} delay={i * 90} style={{ background: 'var(--forest)', padding: '30px 24px', minHeight: 230, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(238,241,228,.08)', border: '1px solid rgba(238,241,228,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '.8rem', color: 'rgba(238,241,228,.7)' }}>{g.name[0]}</span>
              </div>
              <div>
                <p className="tracked" style={{ color: 'var(--sand)', marginBottom: 8 }}>{g.role}</p>
                <h3 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.5rem', margin: '0 0 8px' }}>{g.name}</h3>
                <p style={{ color: 'rgba(238,241,228,.72)', fontSize: '.9rem', margin: 0 }}>{g.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================== THE LINE ===================== */
type Product = typeof GYPSI.line[number]

function ProductCard({ p, delay, onAdd }: { p: Product; delay: number; onAdd: (p: Product) => void }) {
  const [hover, setHover] = useState(false)
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <img src={p.img} alt={p.name} style={{ aspectRatio: '3/4', width: '100%', objectFit: 'cover', borderRadius: 2, display: 'block' }} />
          {p.tag && <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--bg)', border: '1px solid var(--line)', padding: '5px 11px', fontFamily: 'var(--display)', fontSize: '.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--moss)' }}>{p.tag}</span>}
          <button onClick={() => onAdd(p)} style={{
            position: 'absolute', left: 12, right: 12, bottom: 12, padding: '13px',
            background: 'var(--ink)', color: 'var(--bg)', border: 0, borderRadius: 999,
            fontFamily: 'var(--display)', fontSize: '.66rem', letterSpacing: '.24em', textTransform: 'uppercase',
            opacity: hover ? 1 : 0, transform: hover ? 'none' : 'translateY(8px)', transition: 'opacity .35s, transform .35s',
          }}>Add — {money(p.price)}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--display)', fontWeight: 400, letterSpacing: '.06em', fontSize: '1rem', lineHeight: 1.25, margin: '0 0 4px' }}>{p.name}</h3>
            <p style={{ color: 'var(--ink-mute)', fontSize: '.8rem', margin: 0 }}>{p.type}</p>
          </div>
          <span className="display" style={{ fontSize: '1rem', letterSpacing: '.04em', flex: '0 0 auto' }}>{money(p.price)}</span>
        </div>
      </div>
    </Reveal>
  )
}

export function Line({ onAdd }: { onAdd: (p: Product) => void }) {
  return (
    <section id="line" className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 46 }}>
          <Reveal>
            <p className="eyebrow" style={{ marginBottom: 14 }}>The collection</p>
            <h2 className="display h2">The whole<br />ritual</h2>
          </Reveal>
          <Reveal delay={100}><a href="#" className="link-underline">View all products</a></Reveal>
        </div>
        <div className="line-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(16px,2vw,30px)' }}>
          {GYPSI.line.map((p, i) => <ProductCard key={p.id} p={p} delay={i * 80} onAdd={onAdd} />)}
        </div>
      </div>
    </section>
  )
}

/* ===================== CAMPAIGN / STORY ===================== */
export function Campaign() {
  return (
    <section id="story" className="section" style={{ background: 'var(--bg-deep)' }}>
      <div className="wrap story-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 'clamp(30px,5vw,70px)', alignItems: 'center' }}>
        <Reveal className="camp-poster">
          <div style={{ boxShadow: '0 30px 70px -30px rgba(20,28,14,.55)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--line)' }}>
            <img src="/img/campaign-miracle-serum.jpeg" alt="The Gypsi — The Miracle Serum campaign" style={{ width: '100%', display: 'block' }} />
          </div>
        </Reveal>
        <div>
          <Reveal><p className="eyebrow" style={{ marginBottom: 18 }}>Our story · the founder</p></Reveal>
          <Reveal delay={90}>
            <blockquote className="serif-quote" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.7rem)', margin: '0 0 24px', color: 'var(--ink)' }}>
              "At the heart of this brand is a passion for discovering the world's <span style={{ color: 'var(--moss)' }}>finest skincare ingredients</span>."
            </blockquote>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede" style={{ marginBottom: 26 }}>
              Through years of travel across different countries and cultures, I've explored local beauty rituals, sourced ingredients from trusted suppliers, and carefully selected formulations known for their purity and effectiveness. Every product is inspired by this journey — blending nature, tradition, and luxury to bring you skincare that feels as beautiful as it is nourishing.
            </p>
          </Reveal>
          <Reveal delay={220}><Btn variant="ghost" href="#" arrow>Read the journey</Btn></Reveal>
        </div>
      </div>
    </section>
  )
}

/* ===================== REVIEWS ===================== */
export function Reviews() {
  return (
    <section className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="wrap">
        <Reveal><p className="eyebrow" style={{ textAlign: 'center', marginBottom: 46 }}>Loved in 40+ countries</p></Reveal>
        <div className="rev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(20px,3vw,40px)' }}>
          {GYPSI.reviews.map((r, i) => (
            <Reveal key={i} delay={i * 110} style={{ background: 'var(--card)', border: '1px solid var(--line)', padding: '34px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 4, color: 'var(--sand)' }}>
                {Array.from({ length: r.r }).map((_, k) => <span key={k} style={{ width: 14, display: 'inline-flex' }}>{ICON.star}</span>)}
              </div>
              <p className="serif-quote" style={{ fontSize: '1.3rem', color: 'var(--ink)', margin: 0, flex: 1 }}>"{r.q}"</p>
              <p style={{ margin: 0, fontFamily: 'var(--display)', letterSpacing: '.14em', textTransform: 'uppercase', fontSize: '.72rem', color: 'var(--ink-mute)' }}>{r.a} · {r.loc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================== NEWSLETTER ===================== */
export function Newsletter() {
  const [val, setVal] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (/.+@.+\..+/.test(val)) setDone(true) }
  return (
    <section className="section" style={{ background: 'var(--forest)', color: '#eef1e4' }}>
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 760, marginInline: 'auto' }}>
        <Reveal><p className="eyebrow" style={{ color: 'rgba(238,241,228,.7)', marginBottom: 18 }}>Join the wander</p></Reveal>
        <Reveal delay={80}><h2 className="serif-quote" style={{ fontSize: 'clamp(2rem,4.4vw,3.2rem)', marginBottom: 18 }}>15% off your first ritual.</h2></Reveal>
        <Reveal delay={140}><p className="lede" style={{ color: 'rgba(238,241,228,.82)', marginInline: 'auto', marginBottom: 30 }}>
          Slow beauty notes, early drops, and the occasional postcard from wherever we're sourcing next.
        </p></Reveal>
        <Reveal delay={200}>
          {done ? (
            <p className="display" style={{ letterSpacing: '.16em', fontSize: '1rem' }}>Welcome to The Gypsi ✦ check your inbox</p>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', gap: 12, maxWidth: 480, marginInline: 'auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input value={val} onChange={(e) => setVal(e.target.value)} type="email" required placeholder="your@email.com"
                style={{ flex: '1 1 240px', background: 'transparent', border: '1px solid rgba(238,241,228,.4)', color: '#eef1e4', padding: '15px 18px', borderRadius: 999, fontFamily: 'var(--display)', letterSpacing: '.08em', fontSize: '.9rem', outline: 'none' }} />
              <Btn variant="light" arrow>Subscribe</Btn>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ===================== FOOTER ===================== */
export function Footer() {
  const cols: [string, string[]][] = [
    ['Shop', ['The Miracle Serum', 'Verdant Mask', "Wanderer's Oil", 'Moonlit Balm', 'Gift sets']],
    ['About', ['Our story', 'Ingredients', 'Sustainability', 'Journal']],
    ['Care', ['Contact', 'Shipping & returns', 'FAQ', 'Track order']],
  ]
  return (
    <footer style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--line)' }}>
      <div className="wrap" style={{ paddingBlock: 64 }}>
        <div className="foot-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid var(--line)' }}>
          <div>
            <Wordmark size="1.5rem" />
            <p style={{ color: 'var(--ink-mute)', maxWidth: '30ch', marginTop: 18, fontSize: '.92rem' }}>Clean, botanical skincare for the beautifully unbothered. Made in small batches, never tested on anyone but us.</p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <p className="tracked" style={{ color: 'var(--ink)', marginBottom: 16 }}>{h}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {items.map((it) => <li key={it}><a href="#" style={{ color: 'var(--ink-soft)', fontSize: '.9rem' }} className="link-underline">{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, paddingTop: 26, color: 'var(--ink-mute)', fontSize: '.76rem', letterSpacing: '.06em' }}>
          <span>© 2026 The Gypsi. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 22 }}>
            <a href="#" className="link-underline">Instagram</a>
            <a href="#" className="link-underline">TikTok</a>
            <a href="#" className="link-underline">Privacy</a>
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ===================== CART DRAWER ===================== */
type CartItem = Product & { qty: number }

const qbtn: React.CSSProperties = { background: 'none', border: 0, width: 32, height: 32, color: 'var(--ink)', fontSize: '1rem', lineHeight: '1', cursor: 'pointer' }

export function CartDrawer({ open, items, onClose, onQty }: {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onQty: (id: string, d: number) => void
}) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  return (
    <>
      <div className={`drawer-scrim ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 26px', borderBottom: '1px solid var(--line)' }}>
          <span className="tracked" style={{ color: 'var(--ink)' }}>Your Bag ({count})</span>
          <button onClick={onClose} style={{ background: 'none', border: 0, width: 22, color: 'var(--ink)', cursor: 'pointer' }}>{ICON.close}</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 26px' }}>
          {items.length === 0 && (
            <p style={{ color: 'var(--ink-mute)', marginTop: 40, textAlign: 'center' }}>Your bag is empty.<br />The glow awaits.</p>
          )}
          {items.map((it) => (
            <div key={it.id} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
              <img src={it.img} alt={it.name} style={{ width: 64, height: 80, flex: '0 0 64px', objectFit: 'cover', borderRadius: 2, display: 'block' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--display)', fontWeight: 400, letterSpacing: '.04em', fontSize: '.95rem' }}>{it.name}</h4>
                  <span className="display" style={{ fontSize: '.95rem' }}>{money(it.price * it.qty)}</span>
                </div>
                <p style={{ color: 'var(--ink-mute)', fontSize: '.78rem', margin: '3px 0 10px' }}>{it.type}</p>
                <div style={{ display: 'inline-flex', border: '1px solid var(--line)', borderRadius: 999 }}>
                  <button onClick={() => onQty(it.id, -1)} style={qbtn}>–</button>
                  <span style={{ minWidth: 30, display: 'grid', placeItems: 'center', fontSize: '.85rem' }}>{it.qty}</span>
                  <button onClick={() => onQty(it.id, 1)} style={qbtn}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '22px 26px', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="tracked" style={{ color: 'var(--ink)' }}>Subtotal</span>
            <span className="display" style={{ fontSize: '1.2rem' }}>{money(total)}</span>
          </div>
          <Btn style={{ width: '100%', justifyContent: 'center' }} arrow>Checkout</Btn>
          <p style={{ textAlign: 'center', color: 'var(--ink-mute)', fontSize: '.74rem', marginTop: 14 }}>Free shipping over $60 · 30-day glow guarantee</p>
        </div>
      </aside>
    </>
  )
}
