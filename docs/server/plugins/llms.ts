import json5 from 'json5'
import { camelCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import components from '#component-example/nitro'
import * as theme from '../../.nuxt/ui'
import * as themePro from '../../.nuxt/ui-pro'

type ComponentCodeNode = [
  string,
  {
    ':pro'?: string
    ':props'?: string
    ':external'?: string
    ':externalTypes'?: string
    ':ignore'?: string
    ':hide'?: string
  }
]

/*
 * TODO:
 *  [x] component-theme
 *  [] component-code
 *  [] component-props
 *  [] component-slots
 *  [] component-emits
 *  [] component-example
 */
export default defineNitroPlugin((nitroApp) => {
  // @ts-expect-error - no types available
  nitroApp.hooks.hook('content:llms:generate:document', async (doc) => {
    const componentName = camelCase(doc.title)

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

    visit(doc.body, node => node[0] === 'component-code', (node: ComponentCodeNode) => {
      const pro = node[1][':pro'] === 'true'
      const props = node[1][':props'] ? json5.parse(node[1][':props']) : {}
      const external = node[1][':external'] ? json5.parse(node[1][':external']) : []
      const externalTypes = node[1][':externalTypes'] ? json5.parse(node[1][':externalTypes']) : []
      const ignore = node[1][':ignore'] ? json5.parse(node[1][':ignore']) : []
      const hide = node[1][':hide'] ? json5.parse(node[1][':hide']) : []

      const filteredProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !ignore.includes(key) && !hide.includes(key))
      )

      const imports = external.map((ext: string, index: number) => {
        const type = externalTypes[index]?.replace(/[[\]]/g, '')
        return `import type { ${type} } from '@nuxt/${pro ? 'ui-pro' : 'ui'}'`
      }).join('\n')

      let itemsCode = ''
      if (props.items) {
        itemsCode = `\nconst items = ref<${externalTypes[0]}>(${json5.stringify(props.items, null, 2)})`
        delete filteredProps.items
      }

      const scriptSetup = `<script setup lang="ts">
${imports}
${itemsCode}
</script>

<template>
  <U${componentName.charAt(0).toUpperCase() + componentName.slice(1)} ${Object.keys(filteredProps).map((key) => {
    const value = filteredProps[key]
    if (typeof value === 'string') {
      return `:${key}="${value}"`
    } else if (typeof value === 'boolean') {
      return `${key}`
    } else if (typeof value === 'number') {
      return `:${key}="${value}"`
    }
  }).join(' ')} ${props.items ? ':items="items"' : ''}/>
</template>`

      return ['pre', {
        language: 'vue',
        filename: `${componentName}.vue`, // TODO: Remove later
        code: scriptSetup
      }]
    })
  })
})
