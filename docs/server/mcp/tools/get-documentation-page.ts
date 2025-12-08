import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path',
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/button)')
  },
  cache: '30m',
  async handler({ path }) {
    try {
      const result = await $fetch<string>(`/raw${path}.md`)
      return {
        content: [{ type: 'text' as const, text: result }]
      }
    } catch (error) {
      return errorResult(`Failed to fetch documentation page: ${error}`)
    }
  }
})
