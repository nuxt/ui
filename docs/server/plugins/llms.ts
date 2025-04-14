import json5 from 'json5'
import { camelCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import * as theme from '../../.nuxt/ui'
import * as themePro from '../../.nuxt/ui-pro'
import meta from '#nuxt-component-meta'
// import components from '#component-example/nitro'

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
  body: any
}

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
  hide,
  componentName
}: CodeConfig) => {
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !hide.includes(key))
  )

  const imports = pro
    ? ''
    : external.map((ext, index) => {
        const type = externalTypes[index]?.replace(/[[\]]/g, '')
        return `import type { ${type} } from '@nuxt/${pro ? 'ui-pro' : 'ui'}'`
      }).join('\n')

  let itemsCode = ''
  if (props.items) {
    itemsCode = pro
      ? `const items = ref(${json5.stringify(props.items, null, 2)})`
      : `const items = ref<${externalTypes[0]}>(${json5.stringify(props.items, null, 2)})`
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

  let scriptSetup = ''
  if (imports || itemsCode) {
    scriptSetup = '<script setup lang="ts">'

    if (imports)
      scriptSetup += `\n${imports}`

    if (imports && itemsCode)
      scriptSetup += '\n'

    if (itemsCode)
      scriptSetup += `\n${itemsCode}`

    scriptSetup += '\n</script>\n\n'
  }

  return `${scriptSetup}<template>
  <U${componentName.charAt(0).toUpperCase() + componentName.slice(1)}${formattedProps}/>
</template>`
}

/*
 * TODO:
 *  [x] component-theme
 *  [x] component-code
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
          filename: `${componentName}.vue`, // TODO: remove later
          code
        }
      }
      return true
    }, node => node)

    // Handle component props
    visit(doc.body, (node) => {
      if (Array.isArray(node) && node[0] === 'component-props') {
        const metaComponentName = `U${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`
        const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
        const componentMeta = meta[metaComponentName]?.meta

        let interfaceCode = `/**\n * Props for the ${pascalCaseName} component\n */\ninterface ${pascalCaseName}Props {\n`

        if (componentMeta && componentMeta.props) {
          Object.values(componentMeta.props).forEach((propValue: any) => {
            if (propValue && propValue.name) {
              const propName = propValue.name
              const propType = propValue.type
                ? Array.isArray(propValue.type)
                  ? propValue.type.map((t: any) => t.name || t).join(' | ')
                  : propValue.type.name || propValue.type
                : 'any'

              const isRequired = propValue.required || false

              const hasDescription = propValue.description && propValue.description.trim().length > 0
              const hasDefault = propValue.default !== undefined

              if (hasDescription || hasDefault) {
                interfaceCode += `  /**\n`

                if (hasDescription) {
                  const descLines = propValue.description.split(/\r?\n/)
                  descLines.forEach((line: string) => {
                    interfaceCode += `   * ${line}\n`
                  })
                }

                if (hasDefault) {
                  let defaultValue = propValue.default
                  if (typeof defaultValue === 'string') {
                    defaultValue = `"${defaultValue.replace(/"/g, '\\"')}"`
                  } else {
                    defaultValue = JSON.stringify(defaultValue)
                  }
                  interfaceCode += `   * @default ${defaultValue}\n`
                }

                interfaceCode += `   */\n`
              }

              interfaceCode += `  ${propName}${isRequired ? '' : '?'}: ${propType};\n`
            }
          })
        }

        interfaceCode += `}`

        node[0] = 'pre'
        node[1] = {
          language: 'ts',
          code: interfaceCode
        }
      }
      return true
    }, node => node)
  })
})
