import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Catches render errors in any section so a single failure can't blank the
 * whole storefront. Shows a brand-styled fallback instead of a white screen.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for debugging; wire to real logging (Sentry, etc.) if desired.
    console.error("[Gypsi] Render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: "60svh",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--color-ink)",
          }}
        >
          <div>
            <p
              className="display"
              style={{ fontSize: "1.4rem", letterSpacing: ".18em", marginBottom: 12 }}
            >
              Something went wrong
            </p>
            <p style={{ color: "var(--color-ink-soft)" }}>
              Please refresh the page. If it keeps happening, reach out and we'll help.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
