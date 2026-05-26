/**
 * Extract specific h2 sections from markdown content.
 * Always includes the title (h1) and description blockquote.
 */
export function extractSections(markdown: string, sectionTitles: string[]): string {
  const lines = markdown.split('\n')
  const result: string[] = []

  // Normalize section titles for matching
  const normalizedTitles = sectionTitles.map(t => t.toLowerCase().trim())

  // Always include title (h1) and description (first blockquote)
  let inHeader = true
  for (const line of lines) {
    if (inHeader) {
      if (line.startsWith('## ')) {
        inHeader = false
        break
      }
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

  for (const line of lines) {
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
