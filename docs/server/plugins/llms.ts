import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (_: H3Event, doc: PageCollectionItemBase) => {
    transformMDC(doc as any)
  })

  nitroApp.hooks.hook('llms:generate', (_, { sections }) => {
    sections.map((section) => {
      if (section.title === 'Documentation Sets') return section
      return {
        ...section,
        links: section.links.map(link => ({
          ...link,
          href: transformRawLink(link.href)
        }))
      }
    })
  })
})

function transformRawLink(href: string) {
  return `${href.replace(/^https:\/\/ui.nuxt.com/, 'https://ui.nuxt.com/raw')}.md`
}
