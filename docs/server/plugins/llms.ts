import json5 from 'json5'
import { camelCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import components from '#component-example/nitro'
import * as theme from '../../.nuxt/ui'
import * as themePro from '../../.nuxt/ui-pro'

/*
 * TODO:
 *  - component-theme
 *  - component-code
 *  - component-props
 *  - component-slots
 *  - component-emits
 *  - component-example
 */
export default defineNitroPlugin((nitroApp) => {
  // @ts-expect-error - no types available
  nitroApp.hooks.hook('content:llms:generate:document', async (doc) => {
    const componentName = camelCase(doc.title)
    console.log('componentName:', componentName)
    visit(doc.body, node => node[0] === 'component-theme', (node) => {
      const pro = node[1][':pro'] === 'true'
      const prose = node[1][':prose'] === 'true'

      const computedTheme = pro ? prose ? themePro.prose : themePro : theme
      const componentTheme = computedTheme[componentName]

      const appConfig = {
        [pro ? 'uiPro' : 'ui']: prose
          ? { prose: { [componentName]: componentTheme } }
          : { [componentName]: componentTheme }
      }

      return ['pre', {
        language: 'ts',
        filename: 'app.config.ts',
        code: `export default defineAppConfig(${json5.stringify(appConfig, null, 2)?.replace(/,([ |\t\n]+[}|\])])/g, '$1')})`
      }]
    })
  })
})
