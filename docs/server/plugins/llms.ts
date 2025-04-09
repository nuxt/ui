import { visit, decompressTree } from '@nuxt/content/runtime'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import components from '#component-example/nitro'

/*
 * TODO:
 *  - component-theme
 *  - component-code
 *  - component-props
 *  - component-slots
 *  - component-example
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', async (doc) => {
    visit(doc.body, node => node[0] === 'component-theme', (node) => {
      console.log('node:', node)
      // return decompressTree({ type: 'minimal', value: [node] })
      return ['pre', { language: 'ts', filename: 'component-theme.json', code: JSON.stringify(node, null, 2) }]
    })
  })
})
