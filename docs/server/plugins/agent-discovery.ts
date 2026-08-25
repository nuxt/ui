import { listMcpDefinitions } from '@nuxtjs/mcp-toolkit/server'

/**
 * What `nuxt-agent-discovery` cannot know on its own.
 *
 * `agent-discovery:document` turns the MDC components in a documentation page
 * into plain markdown before the minimark tree is stringified for `/raw/**.md`,
 * which is where the raw route used to call `transformMDC()` itself.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('agent-discovery:document', async (event, page) => {
    await transformMDC(event, page as any)
  })

  // The module serves the MCP server card from static config; only the site
  // knows what its MCP endpoint currently exposes.
  nitroApp.hooks.hook('agent-discovery:mcp-server-card', async (event, card) => {
    const { tools, resources, prompts } = await listMcpDefinitions({ event })

    card.capabilities = {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
      logging: {}
    }
    card.tools = tools.map(t => ({ name: t.name, description: t.description }))
    card.resources = resources.map(r => ({ name: r.name, uri: r.uri, description: r.description }))
    card.prompts = prompts.map(p => ({ name: p.name, description: p.description }))
  })
})
