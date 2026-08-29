import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TooltipProvider } from '../components/ui/tooltip'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        name: 'description',
        content:
          'Clipora is an open-source video creation platform for editable animated captions and short-form video.',
      },
      { title: 'Clipora — Animated captions for creators' },
      { name: 'theme-color', content: '#08090d' },
    ],
    links: [
      {
        rel: 'icon',
        href: `${import.meta.env.BASE_URL}favicon.ico`,
        type: 'image/x-icon',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Scripts />
      </body>
    </html>
  )
}
