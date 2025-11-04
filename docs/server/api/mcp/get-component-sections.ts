import { z } from 'zod'
import { kebabCase } from 'scule'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'
import { parseMarkdownSections, getAvailableSections } from '~~/server/utils/parseMarkdownSections'
import { queryCollection } from '@nuxt/content/server'

const querySchema = z.object({
  componentName: z.string(),
  sections: z.string().optional().transform((val) => {
    // Parse comma-separated sections or return all common sections
    if (!val) return ['props', 'slots', 'emits', 'theme']
    return val.split(',').map(s => s.trim().toLowerCase())
  })
})

export default defineCachedEventHandler(async (event) => {
  const { componentName, sections } = await getValidatedQuery(event, querySchema.parse)

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

  // Parse and extract only the requested sections
  const extractedSections = parseMarkdownSections(documentation, sections)

  // Get list of available sections for reference
  const availableSections = getAvailableSections(documentation)

  return {
    name: normalizedName,
    title: page.title,
    description: page.description,
    category: page.category,
    documentation_url: `https://ui.nuxt.com${page.path}`,
    requested_sections: sections,
    available_sections: availableSections,
    sections: extractedSections,
    // Provide a hint if requested sections weren't found
    missing_sections: sections.filter(s => !Object.keys(extractedSections).some(k => k.includes(s)))
  }
}, {
  name: 'mcp-get-component-sections',
  maxAge: 1800 // 30 minutes
})
