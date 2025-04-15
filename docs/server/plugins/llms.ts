import json5 from 'json5'
import { camelCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import * as theme from '../../.nuxt/ui'
import * as themePro from '../../.nuxt/ui-pro'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import components from '#component-example/nitro'

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

function getComponentMeta(componentName: string) {
  const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
  const metaComponentName = `U${pascalCaseName}`
  return {
    pascalCaseName,
    metaComponentName,
    componentMeta: (meta as Record<string, any>)[metaComponentName]?.meta
  }
}

function replaceNodeWithPre(node: any[], language: string, code: string, filename?: string) {
  node[0] = 'pre'
  node[1] = { language, code }
  if (filename) node[1].filename = filename
}

function visitAndReplace(doc: Document, type: string, handler: (node: any[]) => void) {
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === type) {
      handler(node)
    }
    return true
  }, node => node)
}

function generateTSInterface(
  name: string,
  items: any[],
  itemHandler: (item: any) => string,
  description: string
) {
  let code = `/**\n * ${description}\n */\ninterface ${name} {\n`
  for (const item of items) {
    code += itemHandler(item)
  }
  code += `}`
  return code
}

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
    if (imports) scriptSetup += `\n${imports}`
    if (imports && itemsCode) scriptSetup += '\n'
    if (itemsCode) scriptSetup += `\n${itemsCode}`
    scriptSetup += '\n</script>\n\n'
  }

  return `${scriptSetup}<template>
  <U${componentName.charAt(0).toUpperCase() + componentName.slice(1)}${formattedProps}/>
</template>`
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document' as any, async (doc: Document) => {
    const componentName = camelCase(doc.title)

    visitAndReplace(doc, 'component-theme', (node) => {
      const attributes = node[1] as ComponentAttributes
      const pro = parseBoolean(attributes[':pro'])
      const prose = parseBoolean(attributes[':prose'])
      const appConfig = generateThemeConfig({ pro, prose, componentName })

      replaceNodeWithPre(
        node,
        'ts',
        `export default defineAppConfig(${json5.stringify(appConfig, null, 2)?.replace(/,([ |\t\n]+[}|\])])/g, '$1')})`,
        'app.config.ts'
      )
    })

    visitAndReplace(doc, 'component-code', (node) => {
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

      replaceNodeWithPre(node, 'vue', code, `${componentName}.vue`)
    })

    visitAndReplace(doc, 'component-props', (node) => {
      const { pascalCaseName, componentMeta } = getComponentMeta(componentName)
      if (!componentMeta?.props) return

      const interfaceCode = generateTSInterface(
        `${pascalCaseName}Props`,
        Object.values(componentMeta.props),
        (propValue: any) => {
          if (!propValue?.name) return ''
          const propName = propValue.name
          const propType = propValue.type
            ? Array.isArray(propValue.type)
              ? propValue.type.map((t: any) => t.name || t).join(' | ')
              : propValue.type.name || propValue.type
            : 'any'
          const isRequired = propValue.required || false
          const hasDescription = propValue.description && propValue.description.trim().length > 0
          const hasDefault = propValue.default !== undefined
          let result = ''
          if (hasDescription || hasDefault) {
            result += `  /**\n`
            if (hasDescription) {
              const descLines = propValue.description.split(/\r?\n/)
              descLines.forEach((line: string) => {
                result += `   * ${line}\n`
              })
            }
            if (hasDefault) {
              let defaultValue = propValue.default
              if (typeof defaultValue === 'string') {
                defaultValue = `"${defaultValue.replace(/"/g, '\\"')}"`
              } else {
                defaultValue = JSON.stringify(defaultValue)
              }
              result += `   * @default ${defaultValue}\n`
            }
            result += `   */\n`
          }
          result += `  ${propName}${isRequired ? '' : '?'}: ${propType};\n`
          return result
        },
        `Props for the ${pascalCaseName} component`
      )
      replaceNodeWithPre(node, 'ts', interfaceCode)
    })

    visitAndReplace(doc, 'component-slots', (node) => {
      const { pascalCaseName, componentMeta } = getComponentMeta(componentName)
      if (!componentMeta?.slots) return

      const interfaceCode = generateTSInterface(
        `${pascalCaseName}Slots`,
        Object.values(componentMeta.slots),
        (slotValue: any) => {
          if (!slotValue?.name) return ''
          const slotName = slotValue.name
          const hasDescription = slotValue.description && slotValue.description.trim().length > 0
          let result = ''
          if (hasDescription) {
            result += `  /**\n`
            const descLines = slotValue.description.split(/\r?\n/)
            descLines.forEach((line: string) => {
              result += `   * ${line}\n`
            })
            result += `   */\n`
          }
          if (slotValue.bindings && Object.keys(slotValue.bindings).length > 0) {
            let bindingsType = '{\n'
            Object.entries(slotValue.bindings).forEach(([bindingName, bindingValue]: [string, any]) => {
              const bindingType = bindingValue.type || 'any'
              bindingsType += `    ${bindingName}: ${bindingType};\n`
            })
            bindingsType += '  }'
            result += `  ${slotName}(bindings: ${bindingsType}): any;\n`
          } else {
            result += `  ${slotName}(): any;\n`
          }
          return result
        },
        `Slots for the ${pascalCaseName} component`
      )
      replaceNodeWithPre(node, 'ts', interfaceCode)
    })

    visitAndReplace(doc, 'component-emits', (node) => {
      const { componentMeta } = getComponentMeta(componentName)
      const hasEvents = componentMeta?.events && Object.keys(componentMeta.events).length > 0

      if (hasEvents) {
        let markdownTable = `| Event | Payload |\n| ----- | ------- |\n`
        Object.values(componentMeta.events).forEach((eventValue: any) => {
          if (eventValue && eventValue.name) {
            const eventName = eventValue.name
            let payloadType = 'None'
            if (eventValue.type) {
              payloadType = Array.isArray(eventValue.type)
                ? eventValue.type.map((t: any) => t.name || t).join(' | ')
                : eventValue.type.name || eventValue.type
            }
            markdownTable += `| \`${eventName}\` | \`${payloadType}\` |\n`
          }
        })
        replaceNodeWithPre(node, 'mdc', markdownTable)
      } else {
        node[0] = 'p'
        node[1] = {}
        node[2] = 'No events available for this component.'
      }
    })

    visitAndReplace(doc, 'component-example', (node) => {
      const camelName = camelCase(node[1]['name'])
      const name = camelName.charAt(0).toUpperCase() + camelName.slice(1)
      const code = components[name].code
      replaceNodeWithPre(node, 'vue', code, `${name}.vue`)
    })
  })
})
