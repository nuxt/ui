import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves template details and setup instructions',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    templateName: z.string().describe('The name of the template')
  },
  inputExamples: [
    { templateName: 'Dashboard' },
    { templateName: 'Landing' }
  ],
  cache: '30m',
  async handler({ templateName }) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()
    const templateListing = templatesCollectionItems?.items || []

    const template = templateListing.find((t: Record<string, any>) =>
      t.title.toLowerCase() === templateName.toLowerCase()
    )

    if (!template) {
      throw createError({ statusCode: 404, message: `Template "${templateName}" not found. Use the list_templates tool to see all available templates.` })
    }

    return template
  }
})
