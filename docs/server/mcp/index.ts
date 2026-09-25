import { defineMcpHandler, getMcpTools, listMcpTools } from '@nuxtjs/mcp-toolkit/server'

export default defineMcpHandler({
  async tools(event) {
    const tools = await getMcpTools({ event, orphansOnly: true })
    const requestedTools = getHeader(event, 'x-mcp-tools')

    if (requestedTools === undefined) {
      return tools
    }

    // `listMcpTools` resolves the names clients see in `tools/list`, index-aligned with `getMcpTools`
    const toolNames = (await listMcpTools({ event, orphansOnly: true })).map(tool => tool.name)
    const requestedToolNames = new Set(requestedTools.split(',').map(name => name.trim()).filter(Boolean))

    const unknownNames = [...requestedToolNames].filter(name => !toolNames.includes(name))
    if (unknownNames.length) {
      throw createError({
        statusCode: 400,
        message: `Unknown MCP tool${unknownNames.length > 1 ? 's' : ''}: ${unknownNames.join(', ')}`
      })
    }

    return tools.filter((_, index) => {
      const name = toolNames[index]
      return name !== undefined && requestedToolNames.has(name)
    })
  }
})
