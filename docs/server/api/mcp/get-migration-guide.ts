import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

const querySchema = z.object({
  version: z.string().describe('The migration version (e.g., v4, v3)')
})

export default defineCachedEventHandler(async (event) => {
  const { version } = await getValidatedQuery(event, querySchema.parse)

  const page = await queryCollection(event, 'docs')
    .where('path', 'LIKE', `%/migration/${version}`)
    .where('extension', '=', 'md')
    .select('id', 'title', 'description', 'path', 'body')
    .first()

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: `Migration guide for '${version}' not found`
    })
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
}, {
  name: 'mcp-get-migration-guide',
  maxAge: 1800 // 30 minutes
})
