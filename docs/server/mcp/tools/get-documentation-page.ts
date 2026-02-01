import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path. Use the `sections` parameter to fetch only specific h2 sections to reduce response size.',
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/button)'),
    sections: z.array(z.string()).optional().describe('Specific h2 section titles to return (e.g., ["Usage", "API"]). If omitted, returns full documentation.')
  },
  cache: '30m',
  async handler({ path, sections }) {
    try {
      const fullContent = await $fetch<string>(`/raw${path}.md`)

      let content = fullContent

      // If sections are specified, extract only those sections
      if (sections && sections.length > 0) {
        content = extractSections(fullContent, sections)
      }

      return {
        content: [{ type: 'text' as const, text: content }]
      }
    } catch (error) {
      return errorResult(`Failed to fetch documentation page: ${error}`)
    }
  }
})

/**
 * Extract specific sections from markdown content based on h2 headings
 */
function extractSections(markdown: string, sectionTitles: string[]): string {
  const lines = markdown.split('\n')
  const result: string[] = []

  // Normalize section titles for matching
  const normalizedTitles = sectionTitles.map(t => t.toLowerCase().trim())

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
  let currentSection: string | null = null
  let sectionContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for h2 heading
    if (line.startsWith('## ')) {
      // Save previous section if it was requested
      if (currentSection && normalizedTitles.includes(currentSection.toLowerCase())) {
        result.push(...sectionContent)
        result.push('')
      }

      // Start new section
      currentSection = line.replace('## ', '').trim()
      sectionContent = [line]
      continue
    }

    // Add line to current section
    if (currentSection) {
      sectionContent.push(line)
    }
  }

  // Don't forget the last section
  if (currentSection && normalizedTitles.includes(currentSection.toLowerCase())) {
    result.push(...sectionContent)
  }

  return result.join('\n').trim()
}
