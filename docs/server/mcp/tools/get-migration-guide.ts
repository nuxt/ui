import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Retrieves version-specific migration guides and upgrade instructions',
  inputSchema: {
    version: z.enum(['v3', 'v4']).describe('The migration version (e.g., v4, v3)')
  },
  handler: async ({ version }) => {
    const result = await $fetch('/api/mcp/get-migration-guide', { query: { version } })
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
