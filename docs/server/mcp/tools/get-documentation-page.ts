import { z } from 'zod'
import { getAgentDocument } from '#agent-discovery'

export default defineMcpTool({
  description: 'Returns the Markdown content of one documentation page by its URL path, as found in the `path` field of `search-documentation`. Pass `headings` to return only the named h2 sections and reduce response size. The result is the Markdown string only, with no metadata. A path that names a section resolves to its first page. For a component, `get-component` returns the same content with metadata. Fails when no page exists at the path.',
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
