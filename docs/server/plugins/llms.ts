import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (_: H3Event, doc: PageCollectionItemBase) => {
    transformMDC(doc as any)
  })
})
