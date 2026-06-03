import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../gypsi.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'The Gypsi — Clean Botanical Skincare' },
      { name: 'description', content: 'A single golden drop of cold-pressed botanicals. Real, visible glow — no needles, no compromise.' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Questrial&family=Josefin+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
