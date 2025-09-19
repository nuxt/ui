import { z } from 'zod'
import { camelCase, upperFirst, kebabCase } from 'scule'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'

const querySchema = z.object({
  componentName: z.string()
})

export default defineCachedEventHandler(async (event) => {
  const { componentName } = await getValidatedQuery(event, querySchema.parse)

  // Normalize component name by removing "U" or "u-" prefix if present
  const normalizedName = normalizeComponentName(componentName)

  // Convert to kebab-case for path lookup
  const kebabName = kebabCase(normalizedName)

  // Get basic component info without documentation content
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const page = await queryCollection(event, 'docs')
    .where('path', 'LIKE', `%/components/${kebabName}`)
    .where('extension', '=', 'md')
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    .select('id', 'title', 'description', 'path', 'category', 'links')
    .first()

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: `Component '${componentName}' not found in documentation`
    })
  }

  // Use the same approach as the docs components for metadata
  const camelName = camelCase(normalizedName)
  const componentMetaName = `U${upperFirst(camelName)}`

  const metadata = await $fetch(`/api/component-meta/${componentMetaName}.json`)

  return {
    name: normalizedName,
    title: page.title,
    description: page.description,
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    category: page.category,
    documentation_url: `https://ui.nuxt.com${page.path}`,
    metadata: {
      pascalName: metadata.pascalName,
      kebabName: metadata.kebabName,
      props: metadata.meta.props,
      slots: metadata.meta.slots,
      emits: metadata.meta.emits
    }
  }
}, {
  name: 'mcp-get-component-metadata-only',
  maxAge: 1800 // 30 minutes
})
