export default defineMcpTool({
  description: 'Lists all available Nuxt UI composables with their categories and basic information',
  handler: async () => {
    const result = await $fetch('/api/mcp/list-composables')
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
