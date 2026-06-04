import type { CSSProperties } from "react";
import { Marked } from "marked";

/**
 * Markdown → HTML for editor-authored copy (e.g. the founder story body).
 *
 * Pure + deterministic, so it's safe in the SSR/prerender path and hydrates without
 * mismatch. Hardened against HTML injection without pulling a DOM sanitizer (which would
 * need jsdom in the Node build): raw/inline HTML in the source is dropped, and link/image
 * URLs are restricted to safe protocols. So even though content is authored by a trusted
 * CMS editor, a stray `<script>` / `javascript:` link can't reach the page.
 * `breaks: true` turns single newlines into <br> (friendlier for non-technical editors).
 */
const SAFE_URL = /^(https?:|mailto:|tel:|#|\/)/i;
const safeUrl = (u: string | null | undefined) => (u && SAFE_URL.test(u.trim()) ? u.trim() : "#");
const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const md = new Marked({ breaks: true, gfm: true });
md.use({
  renderer: {
    // Drop raw block/inline HTML so the source can't smuggle in <script>, onerror, etc.
    html: () => "",
    link(token) {
      const inner = this.parser.parseInline(token.tokens);
      const title = token.title ? ` title="${escapeAttr(token.title)}"` : "";
      return `<a href="${escapeAttr(safeUrl(token.href))}"${title} rel="noopener noreferrer">${inner}</a>`;
    },
    image(token) {
      const title = token.title ? ` title="${escapeAttr(token.title)}"` : "";
      return `<img src="${escapeAttr(safeUrl(token.href))}" alt="${escapeAttr(token.text)}"${title} />`;
    },
  },
});

export function Markdown({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const html = md.parse(text, { async: false }) as string;
  return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
