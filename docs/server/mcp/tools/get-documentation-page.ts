import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves documentation page content by URL path. Use the `headings` parameter to fetch only specific h2 sections to reduce response size.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    path: z.string().describe('The path to the content page (e.g., /docs/components/button)'),
    headings: z.array(z.string()).optional().describe('Specific h2 heading titles to extract (e.g., ["Usage", "API"]). If omitted, returns full page.')
  },
  inputExamples: [
    { path: '/docs/components/button', headings: ['Usage', 'API'] },
    { path: '/docs/getting-started/installation' }
  ],
  cache: '30m',
  async handler({ path, headings }) {
    let content
    try {
      content = await $fetch<string>(`/raw${path}.md`)
    } catch {
      throw createError({ statusCode: 404, message: `Documentation page not found at path: ${path}` })
    }

    if (headings && headings.length > 0) {
      content = extractSections(content, headings)
    }

    return content
  }
})
