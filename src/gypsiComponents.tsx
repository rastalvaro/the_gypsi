import { useState, useEffect, useRef } from 'react'

/* ---------- Scroll reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  as?: React.ElementType
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < (window.innerHeight || 800) * 1.05) { setShown(true); return }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    io.observe(el)
    const t = setTimeout(() => setShown(true), 1600)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}

/* ---------- Button ---------- */
export function Btn({
  children,
  variant = 'solid',
  onClick,
  href,
  arrow = false,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  variant?: 'solid' | 'ghost' | 'light'
  onClick?: () => void
  href?: string
  arrow?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const cls =
    'btn ' +
    (variant === 'ghost' ? 'btn--ghost ' : variant === 'light' ? 'btn--light ' : '') +
    className
  const inner = (
    <>
      {children}
      {arrow && (
        <svg className="arr" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M11 1l4 4-4 4M0 5h15" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
    </>
  )
  if (href) return <a className={cls} href={href} style={style}>{inner}</a>
  return <button className={cls} onClick={onClick} style={style}>{inner}</button>
}

/* ---------- Icons ---------- */
export const ICON: Record<string, React.ReactNode> = {
  noNeedle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10.5" />
      <path d="M16 6.5l-7.5 7.5M14 5l3.5 3.5M11.5 11l1.6 1.6M8.5 13.8l-1.4 1.4 1.7 1.7" />
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  ),
  noBotox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10.5" />
      <path d="M9 9.5h.01M15 9.5h.01M9.4 15c1.6 1 3.6 1 5.2 0" />
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  ),
  noHarsh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10.5" />
      <path d="M12 5.5c1.6 2.4 3 4.4 3 6.4a3 3 0 11-6 0c0-2 1.4-4 3-6.4z" />
      <line x1="5" y1="19" x2="19" y2="5" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10.5" />
      <path d="M12 17.5c0-3.4 2.4-6.2 5.4-6.6-.2 3.4-2.6 6.2-5.4 6.6zM12 17.5c0-3.4-2.4-6.2-5.4-6.6.2 3.4 2.6 6.2 5.4 6.6zM12 17.5V8" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l1.5 11.5a1.5 1.5 0 001.5 1.3h8.2a1.5 1.5 0 001.5-1.2L20 8H6" />
      <circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.9 6.2 20.4l1.6-6.6L2.6 9.4l6.8-.5z" /></svg>
  ),
  arrowR: (
    <svg viewBox="0 0 16 10" fill="none"><path d="M11 1l4 4-4 4M0 5h15" stroke="currentColor" strokeWidth="1.2" /></svg>
  ),
}

export function Ring({ name, size = 58 }: { name: string; size?: number }) {
  return (
    <span className="ring" style={{ width: size, height: size, flexBasis: size }}>
      {ICON[name]}
    </span>
  )
}

export function Wordmark({ size = '1.05rem', tag = true }: { size?: string; tag?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '.5em', fontFamily: 'var(--display)', letterSpacing: '0.34em', fontWeight: 400, textTransform: 'uppercase', fontSize: size }}>
      {tag && <span style={{ fontSize: '0.52em', letterSpacing: '0.34em', opacity: 0.7 }}>THE</span>}
      <span>GYPSI</span>
    </span>
  )
}
