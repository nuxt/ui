import { z } from 'zod'
import { kebabCase } from 'scule'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'
import { getAvailableSections } from '~~/server/utils/parseMarkdownSections'
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

  // Get component documentation using queryCollection
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

  // Fetch the raw markdown documentation
  const documentation = await $fetch<string>(`/raw${page.path}.md`)

  // Get list of available sections
  const availableSections = getAvailableSections(documentation)

  // Group sections by common categories for easier understanding
  const categorizedSections = {
    api: availableSections.filter(s => ['props', 'slots', 'emits'].some(term => s.includes(term))),
    configuration: availableSections.filter(s => s.includes('theme')),
    documentation: availableSections.filter(s => ['usage', 'examples'].some(term => s.includes(term))),
    meta: availableSections.filter(s => ['changelog', 'intellisense', 'api'].includes(s)),
    other: [] as string[]
  }

  // Collect sections that don't fit in any category
  const categorized = new Set([
    ...categorizedSections.api,
    ...categorizedSections.configuration,
    ...categorizedSections.documentation,
    ...categorizedSections.meta
  ])
  categorizedSections.other = availableSections.filter(s => !categorized.has(s))

  // Common sections that are typically useful
  const commonSections = ['props', 'slots', 'emits', 'theme', 'usage', 'examples']
  const recommendedSections = availableSections.filter(s =>
    commonSections.some(common => s.includes(common))
  )

  return {
    name: normalizedName,
    title: page.title,
    description: page.description,
    category: page.category,
    documentation_url: `https://ui.nuxt.com${page.path}`,
    available_sections: availableSections,
    recommended_sections: recommendedSections,
    categorized_sections: categorizedSections,
    total_sections: availableSections.length
  }
}, {
  name: 'mcp-list-component-sections',
  maxAge: 1800 // 30 minutes
})
