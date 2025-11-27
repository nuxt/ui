import { z } from 'zod/v3'

export default defineMcpPrompt({
  description: 'Guide through setting up a new project with a Nuxt UI template',
  inputSchema: {
    projectType: z.string().describe('Type of project (dashboard, landing page, admin panel, etc.)')
  },
  handler: async ({ projectType }) => {
    const templates = await $fetch('/api/mcp/list-templates')
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Guide me through setting up a new ${projectType} project with Nuxt UI. Here are available templates: ${JSON.stringify(templates, null, 2)}`
          }
        }
      ]
    }
  }
})
