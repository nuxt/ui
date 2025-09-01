import { z } from 'zod'
import { camelCase, upperFirst, kebabCase } from 'scule'

const querySchema = z.object({
  componentName: z.string(),
  includeMetadata: z.coerce.boolean().optional()
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { componentName, includeMetadata } = querySchema.parse(rawQuery)

  // Convert PascalCase to kebab-case for path lookup
  const kebabName = kebabCase(componentName)

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

  const data: any = {
    name: componentName,
    title: page.title,
    description: page.description,
    category: page.category,
    documentation,
    documentation_url: `https://ui4.nuxt.com${page.path}`
  }

  if (includeMetadata) {
    // Use the same approach as the docs components
    const camelName = camelCase(componentName)
    const componentMetaName = `U${upperFirst(camelName)}`

    const metadata = await $fetch(`/api/component-meta/${componentMetaName}.json`)

    data.metadata = {
      pascalName: metadata.pascalName,
      kebabName: metadata.kebabName,
      props: metadata.meta.props,
      slots: metadata.meta.slots,
      emits: metadata.meta.emits
    }
  }

  return data
}, {
  name: 'mcp-get-component',
  maxAge: 1800 // 30 minutes
})
