import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpPrompt({
  description: 'Find the best Nuxt UI component for a specific use case',
  inputSchema: {
    usecase: z.string().describe('Describe what you want to build (e.g., "user login form", "data table", "navigation menu")')
  },
  async handler({ usecase }) {
    const event = useEvent()

    const components = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '%/components/%')
      .where('extension', '=', 'md')
      .select('path', 'title', 'description', 'category')
      .all()

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Help me find the best Nuxt UI component for this use case: "${usecase}". Here are all available components: ${JSON.stringify(components, null, 2)}`
          }
        }
      ]
    }
  }
})
