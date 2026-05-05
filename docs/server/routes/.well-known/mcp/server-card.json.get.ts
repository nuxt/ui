const DOMAIN = 'https://ui.nuxt.com'

export default defineCachedEventHandler((event) => {
  const { version } = useRuntimeConfig(event).public

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
    tools: [
      // TODO: import tool definitions from MCP toolkit instead of duplicating
      { name: 'search-components', description: 'Search Nuxt UI components by name, description, or category.' },
      { name: 'get-component', description: 'Get the full documentation for a Nuxt UI component.' },
      { name: 'get-component-metadata', description: 'Get the metadata (props, slots, events) for a Nuxt UI component.' },
      { name: 'list-examples', description: 'List component examples.' },
      { name: 'get-example', description: 'Get the source code for a component example.' },
      { name: 'search-composables', description: 'Search Nuxt UI composables.' },
      { name: 'search-documentation', description: 'Search the full Nuxt UI documentation.' },
      { name: 'get-documentation-page', description: 'Get the markdown content of a documentation page.' },
      { name: 'search-icons', description: 'Search icons from the default icon collections.' },
      { name: 'list-templates', description: 'List official Nuxt UI starter templates.' },
      { name: 'get-template', description: 'Get details of a Nuxt UI starter template.' },
      { name: 'get-migration-guide', description: 'Get the Nuxt UI migration guide between major versions.' }
    ],
    resources: [
      { name: 'components', description: 'Catalog of all Nuxt UI components.' },
      { name: 'composables', description: 'Catalog of all Nuxt UI composables.' },
      { name: 'documentation-pages', description: 'Catalog of all Nuxt UI documentation pages.' },
      { name: 'examples', description: 'Catalog of all component examples.' },
      { name: 'templates', description: 'Catalog of official Nuxt UI starter templates.' }
    ],
    prompts: [
      { name: 'find-component-for-usecase', description: 'Find the best Nuxt UI component for a specific use case.' },
      { name: 'implement-component-with-props', description: 'Implement a Nuxt UI component with the right props and slots.' },
      { name: 'setup-project-with-template', description: 'Bootstrap a new project from a Nuxt UI starter template.' }
    ],
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
