import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpPrompt({
  description: 'Guide through setting up a new project with a Nuxt UI template',
  inputSchema: {
    projectType: z.string().describe('Type of project (dashboard, landing page, admin panel, etc.)')
  },
  async handler({ projectType }) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()

    const templates = templatesCollectionItems?.items || []

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Guide me through setting up a new ${projectType} project with Nuxt UI. Here are available templates: ${JSON.stringify(templates, null, 2)}`
          }
        }
      ]
    }
  }
})
