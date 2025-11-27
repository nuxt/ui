import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Retrieves Nuxt UI component documentation and details',
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)')
  },
  handler: async ({ componentName }) => {
    const result = await $fetch('/api/mcp/get-component', { query: { componentName } })
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
    }
  }
})
