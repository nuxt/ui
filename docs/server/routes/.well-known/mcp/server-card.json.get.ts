import { listMcpDefinitions } from '@nuxtjs/mcp-toolkit/server'

const DOMAIN = 'https://ui.nuxt.com'

export default defineCachedEventHandler(async (event) => {
  const { version } = useRuntimeConfig(event).public
  const { tools, resources, prompts } = await listMcpDefinitions({ event })

  const serverCard = {
    $schema: 'https://modelcontextprotocol.io/schema/server-card/v1',
    serverInfo: {
      name: 'Nuxt UI',
      version,
      title: 'Nuxt UI MCP Server',
      description: 'MCP server providing tools, resources and prompts to help AI agents build with Nuxt UI — search components and composables, retrieve documentation, fetch component metadata, and list starter templates.',
      homepage: DOMAIN,
      documentation: `${DOMAIN}/docs/getting-started/ai/mcp`,
      license: 'MIT',
      repository: 'https://github.com/nuxt/ui'
    },
    endpoints: [
      {
        type: 'streamable-http',
        url: `${DOMAIN}/mcp`
      }
    ],
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
      logging: {}
    },
    tools: tools.map(t => ({ name: t.name, description: t.description })),
    resources: resources.map(r => ({ name: r.name, uri: r.uri, description: r.description })),
    prompts: prompts.map(p => ({ name: p.name, description: p.description })),
    authentication: {
      required: false
    }
  }

  setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8')
  return serverCard
}, {
  swr: true,
  maxAge: 60 * 60
})
