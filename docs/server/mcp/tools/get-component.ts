import { z } from 'zod'
import { kebabCase } from 'scule'
import { queryCollection } from '@nuxt/content/server'
import { normalizeComponentName } from '~~/server/utils/normalizeComponentName'

const sectionEnum = z.enum(['usage', 'examples', 'api', 'theme', 'changelog'])

export default defineMcpTool({
  description: 'Retrieves Nuxt UI component documentation and details. Use the `sections` parameter to fetch only specific parts of the documentation to reduce response size.',
  inputSchema: {
    componentName: z.string().describe('The name of the component (PascalCase)'),
    sections: z.array(sectionEnum).optional().describe('Specific sections to return: usage, examples, api, theme, changelog. If omitted, returns full documentation.')
  },
  cache: '30m',
  async handler({ componentName, sections }) {
    const event = useEvent()

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
      return errorResult(`Component '${componentName}' not found in documentation`)
    }

    const fullDocumentation = await $fetch<string>(`/raw${page.path}.md`)

    let documentation = fullDocumentation

    // If sections are specified, extract only those sections
    if (sections && sections.length > 0) {
      documentation = extractSections(fullDocumentation, sections)
    }

    return jsonResult({
      name: normalizedName,
      title: page.title,
      description: page.description,
      category: page.category,
      documentation,
      documentation_url: `https://ui.nuxt.com${page.path}`,
      sections_returned: sections || ['full']
    })
  }
})

/**
 * Extract specific sections from markdown content based on h2 headings
 */
function extractSections(markdown: string, sections: string[]): string {
  const lines = markdown.split('\n')
  const result: string[] = []

  // Section mapping from parameter names to heading patterns
  const sectionHeadings: Record<string, string[]> = {
    usage: ['## Usage'],
    examples: ['## Examples'],
    api: ['## API'],
    theme: ['## Theme'],
    changelog: ['## Changelog']
  }

  // Always include title (h1) and description (first blockquote)
  let inHeader = true
  for (const line of lines) {
    if (inHeader) {
      result.push(line)
      // Stop after the description blockquote
      if (line.startsWith('>') && result.length > 1) {
        result.push('')
        inHeader = false
      }
      continue
    }
    break
  }

  // Find and extract requested sections
  for (const section of sections) {
    const headings = sectionHeadings[section]
    if (!headings) continue

    let inSection = false
    const sectionContent: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check if we're entering a requested section
      if (!inSection && headings.some(h => line.startsWith(h))) {
        inSection = true
        sectionContent.push(line)
        continue
      }

      // Check if we're leaving the section (next h2)
      if (inSection && line.startsWith('## ') && !headings.some(h => line.startsWith(h))) {
        break
      }

      if (inSection) {
        sectionContent.push(line)
      }
    }

    if (sectionContent.length > 0) {
      result.push(...sectionContent)
      result.push('')
    }
  }

  return result.join('\n').trim()
}
