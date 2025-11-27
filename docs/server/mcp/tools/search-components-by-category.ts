import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Searches components by category or text filter',
  inputSchema: {
    category: z.string().optional().describe('Filter components by category'),
    search: z.string().optional().describe('Search term to filter components by name or description')
  },
  handler: async ({ category, search }) => {
    const result = await $fetch('/api/mcp/search-components-by-category', { query: { category, search } })
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
