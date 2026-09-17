import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves the migration guide and upgrade instructions for this version of Nuxt UI',
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
