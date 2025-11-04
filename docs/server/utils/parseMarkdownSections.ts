/**
 * Parses markdown content and extracts specific sections based on headings
 * @param markdown - The full markdown content
 * @param sections - Array of section names to extract (e.g., ['props', 'slots', 'emits', 'theme'])
 * @returns Object with extracted sections where keys are the normalized section names
 *
 * @example
 * ```ts
 * const markdown = `
 * ## API
 * ### Props
 * prop1: string
 * ### Slots
 * default slot
 * ## Theme
 * theme config
 * `
 * const result = parseMarkdownSections(markdown, ['props', 'theme'])
 * // result = { 'props': '### Props\nprop1: string', 'theme': '## Theme\ntheme config' }
 * ```
 */
export function parseMarkdownSections(markdown: string, sections: string[]): Record<string, string> {
  const result: Record<string, string> = {}

  // Normalize section names to lowercase for case-insensitive matching
  const normalizedSections = sections.map(s => s.toLowerCase())

  // Split markdown into lines for processing
  const lines = markdown.split('\n')

  let currentSectionKey: string | null = null
  let currentContent: string[] = []
  let currentDepth = 0
  let inTargetSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if this is a heading line
    const headingMatch = line.match(/^(#{1,6}) +(\S.*)$/)

    if (headingMatch) {
      const depth = headingMatch[1].length
      const title = headingMatch[2].trim()
      const normalizedTitle = title.toLowerCase()

      // Check if this heading matches one of our target sections
      const matchesSection = normalizedSections.some((section) => {
        return normalizedTitle === section
          || normalizedTitle.includes(section)
          || section.includes(normalizedTitle)
      })

      if (matchesSection) {
        // Save previous section if we were capturing one
        if (currentSectionKey && inTargetSection && currentContent.length > 0) {
          result[currentSectionKey] = currentContent.join('\n').trim()
        }

        // Start capturing this new section
        currentSectionKey = normalizedTitle
        currentDepth = depth
        inTargetSection = true
        currentContent = [line] // Include the heading itself
      } else if (inTargetSection) {
        // We're currently in a target section
        // Check if this new heading ends our section
        if (depth <= currentDepth) {
          // This is a heading at the same or higher level, so our section ends
          if (currentSectionKey && currentContent.length > 0) {
            result[currentSectionKey] = currentContent.join('\n').trim()
          }
          currentSectionKey = null
          currentContent = []
          inTargetSection = false
        } else {
          // This is a subsection within our target section, keep capturing
          currentContent.push(line)
        }
      }
    } else if (inTargetSection) {
      // We're in a target section, capture the line
      currentContent.push(line)
    }
  }

  // Don't forget the last section
  if (currentSectionKey && inTargetSection && currentContent.length > 0) {
    result[currentSectionKey] = currentContent.join('\n').trim()
  }

  return result
}

/**
 * Gets available sections from markdown content
 * @param markdown - The full markdown content
 * @returns Array of section names found in the document
 */
export function getAvailableSections(markdown: string): string[] {
  const sections: string[] = []
  const lines = markdown.split('\n')

  for (const line of lines) {
    const headingMatch = line.match(/^(#{2,3}) +(\S.*)$/)
    if (headingMatch) {
      const title = headingMatch[2].trim().toLowerCase()
      sections.push(title)
    }
  }

  return sections
}
