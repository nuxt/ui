import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Lists all available Nuxt UI templates with optional category filtering',
  inputSchema: {
    category: z.string().optional().describe('Filter templates by category')
  },
  handler: async ({ category }) => {
    const result = await $fetch('/api/mcp/list-templates', { query: { category } })
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      structuredContent: result as any
    }
  }
})
