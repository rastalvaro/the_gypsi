import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { ICON } from "./icons";

/* ---------- Scroll reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style = {},
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) * 1.05) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    const t = window.setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Button ---------- */
type ButtonProps = {
  children: ReactNode;
  variant?: "solid" | "ghost" | "light";
  onClick?: () => void;
  href?: string;
  arrow?: boolean;
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>;

export function Button({
  children,
  variant = "solid",
  onClick,
  href,
  arrow = false,
  className = "",
  style = {},
  ...rest
}: ButtonProps) {
  const cls =
    "btn " +
    (variant === "ghost" ? "btn--ghost " : variant === "light" ? "btn--light " : "") +
    className;
  const inner = (
    <>
      {children}
      {arrow && (
        <svg className="arr" width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M11 1l4 4-4 4M0 5h15" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} style={style} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} style={style} {...rest}>
      {inner}
    </button>
  );
}

/* ---------- Icon ring ---------- */
export function Ring({ name, size = 58 }: { name: string; size?: number }) {
  return (
    <span className="ring" style={{ width: size, height: size, flexBasis: size }}>
      {ICON[name]}
    </span>
  );
}

/* ---------- Wordmark ---------- */
export function Wordmark({ size = "1.05rem", tag = true }: { size?: string; tag?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: ".5em",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.34em",
        fontWeight: 400,
        textTransform: "uppercase",
        fontSize: size,
      }}
    >
      {tag && <span style={{ fontSize: "0.52em", letterSpacing: "0.34em", opacity: 0.7 }}>THE</span>}
      <span>GYPSI</span>
    </span>
  );
}
