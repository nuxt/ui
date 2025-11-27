import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path',
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/button)')
  },
  handler: async ({ path }) => {
    const result = await $fetch<string>(`/raw${path}.md`)
    return {
      content: [{ type: 'text' as const, text: result }]
    }
  }
})
