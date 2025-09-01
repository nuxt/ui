import { z } from 'zod'
import { withLeadingSlash } from 'ufo'

const querySchema = z.object({
  path: z.string().describe('The path to the content page (e.g., /docs/components/button)')
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { path } = querySchema.parse(rawQuery)

  const normalizedPath = withLeadingSlash(path)
  const page = await queryCollection(event, 'docs').path(normalizedPath).first()

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: `Content page '${path}' not found`
    })
  }

  return await $fetch<string>(`/raw${page.path}.md`)
}, {
  name: 'mcp-get-content-page',
  maxAge: 1800 // 30 minutes
})
