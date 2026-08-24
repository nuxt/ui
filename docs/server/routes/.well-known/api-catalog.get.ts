const DOMAIN = SITE_URL

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
        // The OpenAPI document describes the whole site (`servers` is the
        // origin), so it is anchored at the origin rather than at `/api`.
        'anchor': `${DOMAIN}/`,
        'service-desc': [
          {
            href: `${DOMAIN}/openapi.json`,
            type: 'application/vnd.oai.openapi+json'
          }
        ],
        'service-doc': [
          {
            href: `${DOMAIN}/docs`,
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
