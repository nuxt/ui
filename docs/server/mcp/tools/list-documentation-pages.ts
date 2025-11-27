export default defineMcpTool({
  description: 'Lists all documentation pages',
  handler: async () => {
    const result = await $fetch('/api/mcp/list-documentation-pages')
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
