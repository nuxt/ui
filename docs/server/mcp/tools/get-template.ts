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

    const template = await queryCollection(event, 'templates')
      .where('title', '=', templateName)
      .first()

    if (!template) {
      return errorResult(`Template "${templateName}" not found. Use the list_templates tool to see all available templates.`)
    }

    return jsonResult(template)
  }
})
