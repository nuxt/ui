import { z } from 'zod/v3'

export default defineMcpPrompt({
  description: 'Find the best Nuxt UI component for a specific use case',
  inputSchema: {
    usecase: z.string().describe('Describe what you want to build (e.g., "user login form", "data table", "navigation menu")')
  },
  handler: async ({ usecase }) => {
    const components = await $fetch('/api/mcp/list-components')
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Help me find the best Nuxt UI component for this use case: "${usecase}". Here are all available components: ${JSON.stringify(components, null, 2)}`
          }
        }
      ]
    }
  }
})
