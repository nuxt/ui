import { z } from 'zod'
import { getAgentDocument } from '#agent-discovery'

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
    const event = useEvent()

    // Resolved in-process by the same adapter `/raw/**.md` uses, so the tool
    // returns the bytes the URL does without a second request out of the
    // function. A path naming a section resolves to its first document, which
    // is what following the raw route's redirect used to do.
    let document = await getAgentDocument(event, path, { sections: headings })
    if (document && 'redirect' in document) {
      document = await getAgentDocument(event, document.redirect, { sections: headings })
    }

    if (!document || 'redirect' in document) {
      throw createError({ statusCode: 404, message: `Documentation page not found at path: ${path}` })
    }

    return document.markdown
  }
})
