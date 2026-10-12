import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { useEvent } from 'nitropack/runtime'
import { createError } from 'h3'
import { queryCollection } from '@nuxt/content/server'
import { SITE_URL } from '../../utils/site'

export default defineMcpTool({
  description: 'Returns the full guide for migrating an application from the previous major version of Nuxt UI to this one, as Markdown with its title, description and URL. Takes no parameters and covers that single upgrade only. The page is large. To read part of it, call `get-documentation-page` with `/docs/getting-started/migration` and a `headings` list.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  cache: '30m',
  async handler() {
    const event = useEvent()

    const page = await queryCollection(event, 'docs')
      .where('path', '=', '/docs/getting-started/migration')
      .where('extension', '=', 'md')
      .select('title', 'description', 'path')
      .first()

    if (!page) {
      throw createError({ statusCode: 404, message: 'Migration guide not found' })
    }

    const documentation = await $fetch<string>(`/raw${page.path}.md`)

    return {
      title: page.title,
      description: page.description,
      path: page.path,
      documentation,
      url: `${SITE_URL}${page.path}`
    }
  }
})
