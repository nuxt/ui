import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (event: H3Event, doc: PageCollectionItemBase) => {
    await transformMDC(event, doc as any)
  })

  nitroApp.hooks.hook('llms:generate', (_, { sections }) => {
    sections.forEach((section) => {
      if (section.title !== 'Documentation Sets') {
        section.links = (section.links || []).map(link => ({
          ...link,
          // Only documentation links have a markdown representation, the MCP
          // endpoint and the `.well-known` resources have to stay as they are.
          href: toRawDocsLink(link.href)
        }))
      }
    })

    const docSetIdx = sections.findIndex(s => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      sections.push(docSet)
    }
  })

  // `llms-full.txt` is built from the documentation pages alone, so the
  // when-to-use guidance has to be prepended here to reach agents that only
  // read the full document.
  nitroApp.hooks.hook('llms:generate:full', (_event, _options, contents) => {
    contents.unshift(renderLlmsSection(WHEN_TO_USE_SECTION))
  })
})
