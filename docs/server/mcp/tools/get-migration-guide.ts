import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves version-specific migration guides and upgrade instructions',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    version: z.enum(['v3', 'v4']).describe('The migration version (e.g., v4, v3)')
  },
  inputExamples: [
    { version: 'v4' }
  ],
  cache: '30m',
  async handler({ version }) {
    const event = useEvent()

    const page = await queryCollection(event, 'docs')
      .where('path', 'LIKE', `%/migration/${version}`)
      .where('extension', '=', 'md')
      .select('title', 'description', 'path')
      .first()

    if (!page) {
      throw createError({ statusCode: 404, message: `Migration guide for '${version}' not found` })
    }

    const documentation = await $fetch<string>(`/raw${page.path}.md`)

    return {
      version,
      title: page.title,
      description: page.description,
      path: page.path,
      documentation,
      url: `https://ui.nuxt.com${page.path}`
    }
  }
})
