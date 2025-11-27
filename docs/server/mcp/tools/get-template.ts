import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Retrieves template details and setup instructions',
  inputSchema: {
    templateName: z.string().describe('The name of the template')
  },
  handler: async ({ templateName }) => {
    const result = await $fetch('/api/mcp/get-template', { query: { templateName } })
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      structuredContent: result as any
    }
  }
})
