import json5 from 'json5'
import { camelCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import * as theme from '../../.nuxt/ui'
import * as themePro from '../../.nuxt/ui-pro'

type ComponentAttributes = {
  ':pro'?: string
  ':prose'?: string
  ':props'?: string
  ':external'?: string
  ':externalTypes'?: string
  ':ignore'?: string
  ':hide'?: string
}

type ThemeConfig = {
  pro: boolean
  prose: boolean
  componentName: string
}

type CodeConfig = {
  pro: boolean
  props: Record<string, unknown>
  external: string[]
  externalTypes: string[]
  ignore: string[]
  hide: string[]
  componentName: string
}

type Document = {
  title: string
  body: any // Using any here since we don't have access to MinimalTree type
}

// Helper functions
const parseBoolean = (value?: string): boolean => value === 'true'

const generateThemeConfig = ({ pro, prose, componentName }: ThemeConfig) => {
  const computedTheme = pro ? (prose ? themePro.prose : themePro) : theme
  const componentTheme = computedTheme[componentName as keyof typeof computedTheme]

  return {
    [pro ? 'uiPro' : 'ui']: prose
      ? { prose: { [componentName]: componentTheme } }
      : { [componentName]: componentTheme }
  }
}

const generateComponentCode = ({
  pro,
  props,
  external,
  externalTypes,
  ignore,
  hide,
  componentName
}: CodeConfig) => {
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !ignore.includes(key) && !hide.includes(key))
  )

  const imports = external.map((ext, index) => {
    const type = externalTypes[index]?.replace(/[[\]]/g, '')
    return `import type { ${type} } from '@nuxt/${pro ? 'ui-pro' : 'ui'}'`
  }).join('\n')

  let itemsCode = ''
  if (props.items) {
    itemsCode = `\nconst items = ref<${externalTypes[0]}>(${json5.stringify(props.items, null, 2)})`
    delete filteredProps.items
  }

  const propsString = Object.entries(filteredProps)
    .map(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return `:${key}="${value}"`
      } else if (typeof value === 'boolean') {
        return value ? key : ''
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')

  const itemsProp = props.items ? ':items="items"' : ''
  const allProps = [propsString, itemsProp].filter(Boolean).join(' ')
  const formattedProps = allProps ? ` ${allProps} ` : ' '

  return `<script setup lang="ts">
${imports}
${itemsCode}
</script>

<template>
  <U${componentName.charAt(0).toUpperCase() + componentName.slice(1)}${formattedProps}/>
</template>`
}

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
  nitroApp.hooks.hook('content:llms:generate:document' as any, async (doc: Document) => {
    const componentName = camelCase(doc.title)

    // Handle component theme
    visit(doc.body, (node) => {
      if (Array.isArray(node) && node[0] === 'component-theme') {
        const attributes = node[1] as ComponentAttributes
        const pro = parseBoolean(attributes[':pro'])
        const prose = parseBoolean(attributes[':prose'])

        const appConfig = generateThemeConfig({ pro, prose, componentName })

        node[0] = 'pre'
        node[1] = {
          language: 'ts',
          filename: 'app.config.ts',
          code: `export default defineAppConfig(${json5.stringify(appConfig, null, 2)?.replace(/,([ |\t\n]+[}|\])])/g, '$1')})`
        }
      }
      return true
    }, node => node)

    // Handle component code
    visit(doc.body, (node) => {
      if (Array.isArray(node) && node[0] === 'component-code') {
        const attributes = node[1] as ComponentAttributes
        const pro = parseBoolean(attributes[':pro'])
        const props = attributes[':props'] ? json5.parse(attributes[':props']) : {}
        const external = attributes[':external'] ? json5.parse(attributes[':external']) : []
        const externalTypes = attributes[':externalTypes'] ? json5.parse(attributes[':externalTypes']) : []
        const ignore = attributes[':ignore'] ? json5.parse(attributes[':ignore']) : []
        const hide = attributes[':hide'] ? json5.parse(attributes[':hide']) : []

        const code = generateComponentCode({
          pro,
          props,
          external,
          externalTypes,
          ignore,
          hide,
          componentName
        })

        node[0] = 'pre'
        node[1] = {
          language: 'vue',
          filename: `${componentName}.vue`,
          code
        }
      }
      return true
    }, node => node)
  })
})
