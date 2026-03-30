import { z } from 'zod'
import { camelCase, upperFirst, kebabCase } from 'scule'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves detailed metadata for a Nuxt UI component including props, slots, and events',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)')
  },
  inputExamples: [
    { componentName: 'Button' },
    { componentName: 'UTable' }
  ],
  cache: '30m',
  async handler({ componentName }) {
    const event = useEvent()

    // Normalize component name by removing "U" or "u-" prefix if present
    const normalizedName = normalizeComponentName(componentName)

    // Convert to kebab-case for path lookup
    const kebabName = kebabCase(normalizedName)

    // Get basic component info without documentation content
    const page = await queryCollection(event, 'docs')
      .where('path', 'LIKE', `%/components/${kebabName}`)
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'category', 'links')
      .first()

    if (!page) {
      throw createError({ statusCode: 404, message: `Component '${componentName}' not found in documentation` })
    }

    // Use the same approach as the docs components for metadata
    const camelName = camelCase(normalizedName)
    const componentMetaName = `U${upperFirst(camelName)}`

    let metadata
    try {
      metadata = await $fetch<Record<string, any>>(`/api/component-meta/${componentMetaName}.json`)
    } catch {
      throw createError({ statusCode: 404, message: `Metadata for component '${componentName}' not available` })
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
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
  }
})
