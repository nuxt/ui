import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves template details and setup instructions',
  inputSchema: {
    templateName: z.string().describe('The name of the template')
  },
  cache: '30m',
  async handler({ templateName }) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()
    const templateListing = templatesCollectionItems?.items || []

    const template = templateListing.find((t: any) =>
      t.title.toLowerCase() === templateName.toLowerCase()
    )

    if (!template) {
      return errorResult(`Template "${templateName}" not found. Use the list_templates tool to see all available templates.`)
    }

    return jsonResult(template)
  }
})
