import { z } from 'zod/v3'

export default defineMcpPrompt({
  description: 'Generate complete component implementation with proper props and styling',
  inputSchema: {
    componentName: z.string().describe('The Nuxt UI component name (PascalCase)'),
    requirements: z.string().optional().describe('Specific requirements or customizations needed')
  },
  handler: async ({ componentName, requirements }) => {
    const component = await $fetch('/api/mcp/get-component', {
      query: { componentName, includeMetadata: true }
    })
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Generate a complete implementation of the ${componentName} component with proper props and styling. ${requirements ? `Requirements: ${requirements}` : ''}\n\nComponent details: ${JSON.stringify(component, null, 2)}`
          }
        }
      ]
    }
  }
})
