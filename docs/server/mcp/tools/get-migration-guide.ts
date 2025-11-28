import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves version-specific migration guides and upgrade instructions',
  inputSchema: {
    version: z.enum(['v3', 'v4']).describe('The migration version (e.g., v4, v3)')
  },
  cache: '30m',
  async handler({ version }) {
    const event = useEvent()

    const page = await queryCollection(event, 'docs')
      .where('path', 'LIKE', `%/migration/${version}`)
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'body')
      .first()

    if (!page) {
      return errorResult(`Migration guide for '${version}' not found`)
    }

    const documentation = await $fetch<string>(`/raw${page.path}.md`)

    return jsonResult({
      version,
      title: page.title,
      description: page.description,
      path: page.path,
      documentation,
      url: `https://ui.nuxt.com${page.path}`
    })
  }
})
