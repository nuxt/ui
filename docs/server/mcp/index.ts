import { defineMcpHandler, getMcpTools } from '@nuxtjs/mcp-toolkit/server'

export default defineMcpHandler({
  async tools(event) {
    const tools = await getMcpTools({ event })
    const requestedTools = getHeader(event, 'x-mcp-tools')

    if (requestedTools === undefined) {
      return tools
    }

    const requestedToolNames = getRequestedToolNames(requestedTools)
    const availableToolNames = getAvailableToolNames(tools)

    const unknownNames = requestedToolNames.filter(requestedToolName => !availableToolNames.has(requestedToolName))
    if (unknownNames.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unknown MCP tool${unknownNames.length > 1 ? 's' : ''}: ${unknownNames.join(', ')}`
      })
    }

    return tools.filter(tool => requestedToolNames.includes(getToolName(tool) || ''))
  }
})

function getAvailableToolNames(tools: Awaited<ReturnType<typeof getMcpTools>>) {
  const names = new Set<string>()

  for (const tool of tools) {
    const name = getToolName(tool)
    if (name) {
      names.add(name)
    }
  }

  return names
}

function getToolName(tool: Awaited<ReturnType<typeof getMcpTools>>[number]) {
  if (tool.name) {
    return tool.name
  }

  const filename = tool._meta?.filename

  if (typeof filename !== 'string') {
    return
  }

  return filename.replace('.ts', '').toLowerCase()
}

function getRequestedToolNames(requestedTools: string) {
  return Array.from(
    new Set<string>(requestedTools.split(',').map((name: string) => name.trim()).filter((name: string) => Boolean(name)))
  )
}
