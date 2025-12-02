import { z } from 'zod'
import { kebabCase, camelCase, upperFirst } from 'scule'
import { queryCollection } from '@nuxt/content/server'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'

export default defineMcpPrompt({
  description: 'Generate complete component implementation with proper props and styling',
  inputSchema: {
    componentName: z.string().describe('The Nuxt UI component name (PascalCase)'),
    requirements: z.string().optional().describe('Specific requirements or customizations needed')
  },
  async handler({ componentName, requirements }) {
    const event = useEvent()

    // Normalize component name by removing "U" or "u-" prefix if present
    const normalizedName = normalizeComponentName(componentName)

    // Convert to kebab-case for path lookup
    const kebabName = kebabCase(normalizedName)

    // Get component documentation
    const page = await queryCollection(event, 'docs')
      .where('path', 'LIKE', `%/components/${kebabName}`)
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'category', 'links')
      .first()

    if (!page) {
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Component '${componentName}' not found in documentation. Please use a valid Nuxt UI component name.`
            }
          }
        ]
      }
    }

    // Get component metadata
    const camelName = camelCase(normalizedName)
    const componentMetaName = `U${upperFirst(camelName)}`

    let metadata = null
    try {
      metadata = await $fetch<any>(`/api/component-meta/${componentMetaName}.json`)
    } catch {
      // Metadata not available
    }

    const component = {
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation_url: `https://ui.nuxt.com${page.path}`,
      metadata: metadata
        ? {
            pascalName: metadata.pascalName,
            kebabName: metadata.kebabName,
            props: metadata.meta.props,
            slots: metadata.meta.slots,
            emits: metadata.meta.emits
          }
        : null
    }

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Generate a complete implementation of the ${componentName} component with proper props and styling. ${requirements ? `Requirements: ${requirements}` : ''}\n\nComponent details: ${JSON.stringify(component, null, 2)}`
          }
        }
      ]
    }
  }
})
