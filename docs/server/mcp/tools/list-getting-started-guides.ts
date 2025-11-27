export default defineMcpTool({
  description: 'Lists all getting started guides and installation instructions',
  handler: async () => {
    const result = await $fetch('/api/mcp/list-getting-started-guides')
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
