import { z } from 'zod'
import { kebabCase } from 'scule'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Retrieves metadata for a Nuxt UI component including props, slots, and events. Props are compact by default, pass `full: true` to get the raw recursive prop schemas (very large)',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)'),
    full: z.boolean().optional().describe('Return raw metadata with recursive prop schemas (very large). Defaults to false (compact props)')
  },
  inputExamples: [
    { componentName: 'Button' },
    { componentName: 'UTable' },
    { componentName: 'Tabs', full: true }
  ],
  cache: '30m',
  async handler({ componentName, full }) {
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

    const metadata = await fetchComponentMetadata(normalizedName, { full })
    if (!metadata) {
      throw createError({ statusCode: 404, message: `Metadata for component '${componentName}' not available` })
    }

    return {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation_url: `https://ui.nuxt.com${page.path}`,
      metadata
    }
  }
})
