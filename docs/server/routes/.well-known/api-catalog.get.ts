export default defineCachedEventHandler((event) => {
  const linkset = {
    linkset: [
      {
        'anchor': `${SITE_URL}/mcp`,
        'service-desc': [
          {
            href: `${SITE_URL}/.well-known/mcp/server-card.json`,
            type: 'application/json'
          }
        ],
        'service-doc': [
          {
            href: `${SITE_URL}/docs/getting-started/ai/mcp`,
            type: 'text/html'
          }
        ]
      },
      {
        // The OpenAPI document describes the whole site (`servers` is the
        // origin), so it is anchored at the origin rather than at `/api`.
        'anchor': `${SITE_URL}/`,
        'service-desc': [
          {
            href: `${SITE_URL}/openapi.json`,
            type: 'application/vnd.oai.openapi+json'
          }
        ],
        'service-doc': [
          {
            href: `${SITE_URL}/docs`,
            type: 'text/html'
          }
        ]
      },
      {
        'anchor': `${SITE_URL}/docs`,
        'service-desc': [
          {
            href: `${SITE_URL}/llms.txt`,
            type: 'text/plain'
          },
          {
            href: `${SITE_URL}/llms-full.txt`,
            type: 'text/plain'
          }
        ],
        'service-doc': [
          {
            href: `${SITE_URL}/docs`,
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
