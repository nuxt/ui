import type { H3Event } from 'h3'
import type { PageCollectionItemBase } from '@nuxt/content'
import { rawUrl } from '#agent-discovery'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (event: H3Event, doc: PageCollectionItemBase) => {
    await transformMDC(event, doc as any)
  })

  // `nuxt-llms` unshifts its "Documentation Sets" section, which is a single
  // link to `llms-full.txt`. The documentation itself is more useful first.
  //
  // The documentation links are rewritten to their `/raw/**.md` twins by
  // `nuxt-agent-discovery`, from the same route config the negotiation uses.
  nitroApp.hooks.hook('llms:generate', (_, { sections }) => {
    const docSetIdx = sections.findIndex(s => s.title === 'Documentation Sets')
    if (docSetIdx !== -1) {
      const [docSet] = sections.splice(docSetIdx, 1)
      sections.push(docSet)
    }
  })

  // `llms-full.txt` is built from the documentation pages alone, so the
  // when-to-use guidance has to be prepended here to reach agents that only
  // read the full document.
  nitroApp.hooks.hook('llms:generate:full', (event, _options, contents) => {
    contents.unshift(renderLlmsSection(WHEN_TO_USE_SECTION, href => rawUrl(event, href)))
  })
})
