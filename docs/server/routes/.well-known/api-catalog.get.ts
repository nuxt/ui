const DOMAIN = 'https://ui.nuxt.com'

export default defineCachedEventHandler((event) => {
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
          },
          {
            href: `${DOMAIN}/llms-full.txt`,
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

  setResponseHeader(event, 'Content-Type', 'application/linkset+json; charset=utf-8')
  return linkset
}, {
  swr: true,
  maxAge: 60 * 60
})
