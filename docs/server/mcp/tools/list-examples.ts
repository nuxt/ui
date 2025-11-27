export default defineMcpTool({
  description: 'Lists all available UI examples and code demonstrations',
  handler: async () => {
    const result = await $fetch('/api/mcp/list-examples')
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
