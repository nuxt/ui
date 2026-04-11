import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path. Use the `sections` parameter to fetch only specific h2 sections to reduce response size.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/button)'),
    sections: z.array(z.string()).optional().describe('Specific h2 section titles to return (e.g., ["Usage", "API"]). If omitted, returns full documentation.')
  },
  inputExamples: [
    { path: '/docs/components/button', sections: ['Usage', 'API'] },
    { path: '/docs/getting-started/installation' }
  ],
  cache: '30m',
  async handler({ path, sections }) {
    let content
    try {
      content = await $fetch<string>(`/raw${path}.md`)
    } catch {
      throw createError({ statusCode: 404, message: `Documentation page not found at path: ${path}` })
    }

    // If sections are specified, extract only those sections
    if (sections && sections.length > 0) {
      content = extractSections(content, sections)
    }

    return content
  }
})
