import { z } from 'zod'
import { kebabCase } from 'scule'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'
import { queryCollection } from '@nuxt/content/server'

const querySchema = z.object({
  componentName: z.string()
})

export default defineCachedEventHandler(async (event) => {
  const { componentName } = await getValidatedQuery(event, querySchema.parse)

  // Normalize component name by removing "U" or "u-" prefix if present
  const normalizedName = normalizeComponentName(componentName)

  // Convert to kebab-case for path lookup
  const kebabName = kebabCase(normalizedName)

  // Get component documentation using queryCollection like in pages/components.vue
  const page = await queryCollection(event, 'docs')
    .where('path', 'LIKE', `%/components/${kebabName}`)
    .where('extension', '=', 'md')
    .select('id', 'title', 'description', 'path', 'category', 'links')
    .first()

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: `Component '${componentName}' not found in documentation`
    })
  }

  const documentation = await $fetch<string>(`/raw${page.path}.md`)

  return {
    name: normalizedName,
    title: page.title,
    description: page.description,
    category: page.category,
    documentation,
    documentation_url: `https://ui.nuxt.com${page.path}`
  }
}, {
  name: 'mcp-get-component',
  maxAge: 1800 // 30 minutes
})
