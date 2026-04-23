import { eventHandler, setHeader } from 'h3'

const DOMAIN = 'https://ui.nuxt.com'

export default eventHandler((event) => {
  const linkset = {
    linkset: [
      {
        'anchor': `${DOMAIN}/mcp`,
        'service-desc': [
          {
            href: `${DOMAIN}/.well-known/mcp/server-card.json`,
            type: 'application/json'
          }
        ],
        'service-doc': [
          {
            href: `${DOMAIN}/docs/getting-started/ai/mcp`,
            type: 'text/html'
          }
        ]
      },
      {
        'anchor': `${DOMAIN}/docs`,
        'service-desc': [
          {
            href: `${DOMAIN}/llms.txt`,
            type: 'text/plain'
          }
        ],
        'service-doc': [
          {
            href: `${DOMAIN}/docs`,
            type: 'text/html'
          }
        ]
      }
    ]
  }

  setHeader(event, 'Content-Type', 'application/linkset+json; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return linkset
})
