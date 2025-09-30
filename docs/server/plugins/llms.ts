import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (_: H3Event, doc: PageCollectionItemBase) => {
    transformMDC(doc as any)
  })

  nitroApp.hooks.hook('llms:generate', (_, { sections }) => {
    // Transform links except for "Documentation Sets"
    sections.forEach((section) => {
      if (section.title !== 'Documentation Sets') {
        section.links = section.links.map(link => ({
          ...link,
          href: transformRawLink(link.href)
        }))
      }
    })

    // Move "Documentation Sets" to the end
    const docSetIdx = sections.findIndex(s => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      sections.push(docSet)
    }
  })
})

function transformRawLink(href: string) {
  return `${href.replace(/^https:\/\/ui.nuxt.com/, 'https://ui.nuxt.com/raw')}.md`
}
