import type { H3Event } from 'h3'
import json5 from 'json5'
import { camelCase, kebabCase } from 'scule'
import { visit } from '@nuxt/content/runtime'
import { queryCollection } from '@nuxt/content/server'
import * as theme from '../../.nuxt/ui'
import meta from '#nuxt-component-meta'
// @ts-expect-error - no types available
import { getComponentExample } from '#component-example/nitro'

type ComponentAttributes = {
  'slug'?: string
  'prose'?: string
  ':prose'?: string
  ':props'?: string
  ':external'?: string
  ':externalTypes'?: string
  ':ignore'?: string
  ':hide'?: string
  ':slots'?: string
  ':model'?: string
  ':cast'?: string
}

type ThemeConfig = {
  prose: boolean
  componentName: string
}

type CodeConfig = {
  props: Record<string, any>
  external: string[]
  externalTypes: string[]
  ignore: string[]
  hide: string[]
  componentName: string
  slots?: Record<string, string>
  model?: string[]
  cast?: Record<string, string>
  prose?: boolean
}

const CAST_TEMPLATES: Record<string, (raw: any) => string> = {
  'DateValue': (raw) => {
    if (!raw || !Array.isArray(raw)) return 'null'
    const [y, m, d] = raw
    return `new CalendarDate(${y}, ${m}, ${d})`
  },
  'DateValue[]': (raw) => {
    if (!Array.isArray(raw)) return '[]'
    return `[${raw.map(([y, m, d]: number[]) => `new CalendarDate(${y}, ${m}, ${d})`).join(', ')}]`
  },
  'DateRange': (raw) => {
    if (!raw?.start || !raw?.end) return '{ start: null, end: null }'
    const [sy, sm, sd] = raw.start
    const [ey, em, ed] = raw.end
    return `{ start: new CalendarDate(${sy}, ${sm}, ${sd}), end: new CalendarDate(${ey}, ${em}, ${ed}) }`
  },
  'TimeValue': (raw) => {
    if (!raw || !Array.isArray(raw)) return 'null'
    const [h, m, s] = raw
    return `new Time(${h}, ${m}, ${s})`
  },
  'TimeRangeValue': (raw) => {
    if (!raw?.start || !raw?.end) return 'null'
    const [sh, sm, ss] = raw.start
    const [eh, em, es] = raw.end
    return `{ start: new Time(${sh}, ${sm}, ${ss}), end: new Time(${eh}, ${em}, ${es}) }`
  }
}

const CAST_IMPORTS: Record<string, { name: string, from: string }> = {
  'DateValue': { name: 'CalendarDate', from: '@internationalized/date' },
  'DateValue[]': { name: 'CalendarDate', from: '@internationalized/date' },
  'DateRange': { name: 'CalendarDate', from: '@internationalized/date' },
  'TimeValue': { name: 'Time', from: '@internationalized/date' },
  'TimeRangeValue': { name: 'Time', from: '@internationalized/date' }
}

function stringifyValue(value: any, quote: string = '"'): string {
  return json5.stringify(value, { quote, space: 2 })?.replace(/,([ |\t\n]+[}|\]])/g, '$1') ?? ''
}

type Document = {
  title: string
  body: any
}

const parseBoolean = (value?: string): boolean => value === 'true'

function getComponentMeta(componentName: string) {
  const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  const strategies = [
    `U${pascalCaseName}`,
    `Prose${pascalCaseName}`,
    pascalCaseName
  ]

  let componentMeta: any
  let finalMetaComponentName: string = pascalCaseName

  for (const nameToTry of strategies) {
    finalMetaComponentName = nameToTry
    const metaAttempt = (meta as Record<string, any>)[nameToTry]?.meta
    if (metaAttempt) {
      componentMeta = metaAttempt
      break
    }
  }

  if (!componentMeta) {
    console.warn(`[getComponentMeta] Metadata not found for ${pascalCaseName} using strategies: U, Prose, or no prefix. Last tried: ${finalMetaComponentName}`)
  }

  return {
    pascalCaseName,
    metaComponentName: finalMetaComponentName,
    componentMeta
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

const BLOCK_ELEMENTS = new Set([
  'pre', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'table', 'hr'
])

function collectBlockChildren(nodes: any[]): any[] {
  const result: any[] = []
  for (const child of nodes) {
    if (typeof child === 'string') {
      if (child.trim()) {
        result.push(['p', {}, child])
      }
    } else if (Array.isArray(child)) {
      if (BLOCK_ELEMENTS.has(child[0])) {
        result.push(child)
      } else {
        result.push(...collectBlockChildren(child.slice(2)))
      }
    }
  }
  return result
}

function replaceWithChildren(node: any[], newChildren: any[]) {
  const collected = collectBlockChildren(newChildren)
  node[0] = '__flatten'
  node[1] = {}
  node.length = 2
  for (const child of collected) {
    node.push(child)
  }
}

function flattenMarkers(node: any): void {
  if (!Array.isArray(node)) return
  let i = 2
  while (i < node.length) {
    const child = node[i]
    if (Array.isArray(child) && (child[0] === '__flatten' || child[0] === 'div')) {
      const innerChildren = child.slice(2)
      node.splice(i, 1, ...innerChildren)
    } else {
      flattenMarkers(child)
      i++
    }
  }
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

function propItemHandler(propValue: any): string {
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
}

function slotItemHandler(slotValue: any): string {
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
}

function emitItemHandler(event: any): string {
  if (!event?.name) return ''
  let payloadType = 'void'
  if (event.type) {
    payloadType = Array.isArray(event.type)
      ? event.type.map((t: any) => t.name || t).join(' | ')
      : event.type.name || event.type
  }
  let result = ''
  if (event.description && event.description.trim().length > 0) {
    result += `  /**\n`
    event.description.split(/\r?\n/).forEach((line: string) => {
      result += `   * ${line}\n`
    })
    result += `   */\n`
  }
  result += `  ${event.name}: (payload: ${payloadType}) => void;\n`
  return result
}

const generateThemeConfig = ({ prose, componentName }: ThemeConfig) => {
  const computedTheme = prose ? theme.prose : theme
  const componentTheme = computedTheme[componentName as keyof typeof computedTheme]

  return {
    ui: prose
      ? { prose: { [componentName]: componentTheme } }
      : { [componentName]: componentTheme }
  }
}

const generateComponentCode = ({
  props,
  external,
  externalTypes,
  hide,
  componentName,
  slots,
  model,
  cast,
  prose
}: CodeConfig) => {
  const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  if (prose) {
    const proseProps = Object.entries(props)
      .filter(([key, value]) => !hide.includes(key) && value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    const defaultSlot = slots?.default?.trim() ?? ''
    return `::${componentName}${proseProps ? `{${proseProps}}` : ''}\n${defaultSlot}\n::`
  }

  const externalSet = new Set(external)
  const modelSet = new Set(model || [])

  const propAttributes: string[] = []

  for (const [key, value] of Object.entries(props)) {
    if (hide.includes(key)) continue
    if (value === undefined || value === null || value === '') continue

    if (key === 'modelValue') {
      propAttributes.push(`v-model="value"`)
      continue
    }

    if (modelSet.has(key)) {
      propAttributes.push(`v-model:${kebabCase(key)}="${key}"`)
      continue
    }

    const name = kebabCase(key)

    if (typeof value === 'boolean') {
      propAttributes.push(value ? name : `:${name}="false"`)
      continue
    }

    if (typeof value === 'object') {
      if (externalSet.has(key)) {
        propAttributes.push(`:${name}="${key}"`)
      } else {
        propAttributes.push(`:${name}="${stringifyValue(value, '\'')}"`)
      }
      continue
    }

    if (typeof value === 'number') {
      propAttributes.push(`:${name}="${value}"`)
      continue
    }

    propAttributes.push(`${name}="${value}"`)
  }

  // Build <script setup>
  const importsBySource = new Map<string, Set<string>>()
  const refDeclarations: string[] = []

  if (cast) {
    for (const key of external) {
      const castType = cast[key]
      if (castType && CAST_IMPORTS[castType]) {
        const imp = CAST_IMPORTS[castType]
        if (!importsBySource.has(imp.from)) importsBySource.set(imp.from, new Set())
        importsBySource.get(imp.from)!.add(imp.name)
      }
    }
  }

  const typeImports: string[] = []
  if (externalTypes?.length) {
    const removeBrackets = (t: string): string => t.endsWith('[]') ? removeBrackets(t.slice(0, -2)) : t
    const types = externalTypes
      .filter(t => t && t !== 'undefined')
      .map(removeBrackets)
    if (types.length) {
      typeImports.push(`import type { ${types.join(', ')} } from '@nuxt/ui'`)
    }
  }

  for (const [i, key] of external.entries()) {
    if (!(key in props)) continue
    const castType = cast?.[key]
    const refType = castType ? 'shallowRef' : 'ref'
    const typeAnnotation = externalTypes?.[i] && externalTypes[i] !== 'undefined' ? `<${externalTypes[i]}>` : ''
    const value = castType && CAST_TEMPLATES[castType]
      ? CAST_TEMPLATES[castType](props[key])
      : stringifyValue(props[key])
    const varName = key === 'modelValue' ? 'value' : key
    refDeclarations.push(`const ${varName} = ${refType}${typeAnnotation}(${value})`)
  }

  let scriptSetup = ''
  const hasScript = importsBySource.size > 0 || typeImports.length > 0 || refDeclarations.length > 0
  if (hasScript) {
    scriptSetup = '<script setup lang="ts">\n'
    for (const [source, names] of importsBySource) {
      scriptSetup += `import { ${Array.from(names).join(', ')} } from '${source}'\n`
    }
    for (const line of typeImports) {
      scriptSetup += `${line}\n`
    }
    if ((importsBySource.size > 0 || typeImports.length > 0) && refDeclarations.length > 0) {
      scriptSetup += '\n'
    }
    for (const line of refDeclarations) {
      scriptSetup += `${line}\n`
    }
    scriptSetup += '</script>\n\n'
  }

  // Slots
  let componentContent = ''
  let slotContent = ''

  if (slots && Object.keys(slots).length > 0) {
    const defaultSlot = slots.default?.trim()
    if (defaultSlot) {
      const indentedContent = defaultSlot
        .split('\n')
        .map(line => line.trim() ? `    ${line}` : line)
        .join('\n')
      componentContent = `\n${indentedContent}\n  `
    }

    Object.entries(slots).forEach(([slotName, content]) => {
      if (slotName !== 'default' && content?.trim()) {
        const indentedSlotContent = content.trim()
          .split('\n')
          .map(line => line.trim() ? `      ${line}` : line)
          .join('\n')
        slotContent += `\n    <template #${slotName}>\n${indentedSlotContent}\n    </template>`
      }
    })
  }

  const formattedProps = propAttributes.length ? ` ${propAttributes.join(' ')}` : ''

  const componentTemplate = (componentContent || slotContent)
    ? `<U${pascalCaseName}${formattedProps}>${componentContent}${slotContent}</U${pascalCaseName}>`
    : `<U${pascalCaseName}${formattedProps} />`

  return `${scriptSetup}<template>
  ${componentTemplate}
</template>`
}

export async function transformMDC(event: H3Event, doc: Document): Promise<Document> {
  const componentName = camelCase(doc.title)

  visitAndReplace(doc, 'component-theme', (node) => {
    const attributes = node[1] as Record<string, string>
    const mdcSpecificName = attributes?.slug

    const finalComponentName = mdcSpecificName ? camelCase(mdcSpecificName) : componentName

    const prose = parseBoolean(attributes[':prose'])
    const appConfig = generateThemeConfig({ prose, componentName: finalComponentName })

    replaceNodeWithPre(
      node,
      'ts',
      `export default defineAppConfig(${json5.stringify(appConfig, null, 2)?.replace(/,([ |\t\n]+[}|\])])/g, '$1')})`,
      'app.config.ts'
    )
  })

  visitAndReplace(doc, 'component-code', (node) => {
    const attributes = node[1] as ComponentAttributes
    const props = attributes[':props'] ? json5.parse(attributes[':props']) : {}
    const external = attributes[':external'] ? json5.parse(attributes[':external']) : []
    const externalTypes = attributes[':externalTypes'] ? json5.parse(attributes[':externalTypes']) : []
    const ignore = attributes[':ignore'] ? json5.parse(attributes[':ignore']) : []
    const hide = attributes[':hide'] ? json5.parse(attributes[':hide']) : []
    const slots = attributes[':slots'] ? json5.parse(attributes[':slots']) : {}
    const model = attributes[':model'] ? json5.parse(attributes[':model']) : []
    const cast = attributes[':cast'] ? json5.parse(attributes[':cast']) : {}
    const slug = attributes.slug
    const prose = attributes.prose !== undefined || parseBoolean(attributes[':prose'])
    const effectiveName = slug ? camelCase(slug) : componentName

    const code = generateComponentCode({
      props,
      external,
      externalTypes,
      ignore,
      hide,
      componentName: effectiveName,
      slots,
      model,
      cast,
      prose
    })

    replaceNodeWithPre(node, prose ? 'mdc' : 'vue', code)
  })

  visitAndReplace(doc, 'component-props', (node) => {
    const attributes = node[1] as Record<string, string>
    const mdcSpecificName = attributes?.name
    const isProse = parseBoolean(attributes[':prose'])

    const finalComponentName = mdcSpecificName ? camelCase(mdcSpecificName) : componentName

    const { pascalCaseName, componentMeta } = getComponentMeta(finalComponentName)

    if (!componentMeta?.props) return

    const interfaceName = isProse ? `Prose${pascalCaseName}Props` : `${pascalCaseName}Props`

    const interfaceCode = generateTSInterface(
      interfaceName,
      Object.values(componentMeta.props),
      propItemHandler,
      `Props for the ${isProse ? 'Prose' : ''}${pascalCaseName} component`
    )
    replaceNodeWithPre(node, 'ts', interfaceCode)
  })

  visitAndReplace(doc, 'component-slots', (node) => {
    const { pascalCaseName, componentMeta } = getComponentMeta(componentName)
    if (!componentMeta?.slots) return

    const interfaceCode = generateTSInterface(
      `${pascalCaseName}Slots`,
      Object.values(componentMeta.slots),
      slotItemHandler,
      `Slots for the ${pascalCaseName} component`
    )
    replaceNodeWithPre(node, 'ts', interfaceCode)
  })

  visitAndReplace(doc, 'component-emits', (node) => {
    const { pascalCaseName, componentMeta } = getComponentMeta(componentName)
    const hasEvents = componentMeta?.events && Object.keys(componentMeta.events).length > 0

    if (hasEvents) {
      const interfaceCode = generateTSInterface(
        `${pascalCaseName}Emits`,
        Object.values(componentMeta.events),
        emitItemHandler,
        `Emitted events for the ${pascalCaseName} component`
      )
      replaceNodeWithPre(node, 'ts', interfaceCode)
    } else {
      node[0] = 'p'
      node[1] = {}
      node[2] = 'No events available for this component.'
    }
  })

  visitAndReplace(doc, 'component-example', (node) => {
    const camelName = camelCase(node[1]['name'])
    const name = camelName.charAt(0).toUpperCase() + camelName.slice(1)
    const component = getComponentExample(name)
    if (component) {
      replaceNodeWithPre(node, 'vue', component.code, `${name}.vue`)
    }
  })

  visitAndReplace(doc, 'component-changelog', (node) => {
    const prefix = (node[1] as Record<string, string>)?.prefix
    const pascalName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
    const kebabName = kebabCase(componentName)
    const componentPath = `src/runtime/components/${prefix ? `${prefix}/` : ''}${pascalName}.vue`
    const themePath = `src/theme/${prefix ? `${prefix}/` : ''}${kebabName}.ts`

    node[0] = 'p'
    node[1] = {}
    node[2] = 'See commit history for '
    node[3] = ['a', { href: `https://github.com/nuxt/ui/commits/v4/${componentPath}` }, 'component']
    node[4] = ' and '
    node[5] = ['a', { href: `https://github.com/nuxt/ui/commits/v4/${themePath}` }, 'theme']
    node[6] = '.'
    node.length = 7
  })

  // Transform callout components (tip, note, warning, caution, callout) to blockquotes
  const calloutTypes = ['tip', 'note', 'warning', 'caution', 'callout']
  const calloutLabels: Record<string, string> = {
    tip: 'TIP',
    note: 'NOTE',
    warning: 'WARNING',
    caution: 'CAUTION',
    callout: 'NOTE'
  }

  for (const calloutType of calloutTypes) {
    visitAndReplace(doc, calloutType, (node) => {
      const attrs = node[1] || {}
      const content = node.slice(2)
      const label = calloutLabels[calloutType]

      const blockquoteChildren: any[] = []

      let firstLine = `[!${label}]`
      if (attrs.to) {
        firstLine += `\nSee: ${attrs.to}`
      }
      blockquoteChildren.push(['p', {}, firstLine])

      blockquoteChildren.push(...collectBlockChildren(content))

      node[0] = 'blockquote'
      node[1] = {}
      node.length = 2
      for (const child of blockquoteChildren) {
        node.push(child)
      }
    })
  }

  // Transform framework-only - extract content from both slots and label them
  visitAndReplace(doc, 'framework-only', (node) => {
    const children = node.slice(2)
    const allChildren: any[] = []

    for (const child of children) {
      if (Array.isArray(child) && child[0] === 'template') {
        const slotAttr = child[1]?.['v-slot:nuxt'] !== undefined
          ? 'nuxt'
          : child[1]?.['v-slot:vue'] !== undefined ? 'vue' : null
        if (slotAttr === 'nuxt') {
          allChildren.push(['p', {}, ['strong', {}, 'Nuxt:']])
          allChildren.push(...collectBlockChildren(child.slice(2)))
        } else if (slotAttr === 'vue') {
          allChildren.push(['p', {}, ['strong', {}, 'Vue:']])
          allChildren.push(...collectBlockChildren(child.slice(2)))
        }
      }
    }

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
  })

  // Transform badge to inline text
  visitAndReplace(doc, 'badge', (node) => {
    const attrs = node[1] || {}
    const label = attrs.label || ''
    node[0] = 'code'
    node[1] = {}
    node[2] = label
    node.length = 3
  })

  // Transform card components to markdown sections
  visitAndReplace(doc, 'card', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const title = attrs.title || ''

    const allChildren: any[] = []
    if (title) {
      allChildren.push(['p', {}, ['strong', {}, title]])
    }
    allChildren.push(...collectBlockChildren(content))

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
  })

  // Transform accordion-item to Q&A format
  visitAndReplace(doc, 'accordion-item', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const label = attrs.label || ''

    const allChildren: any[] = []
    if (label) {
      allChildren.push(['p', {}, ['strong', {}, `Q: ${label}`]])
    }
    allChildren.push(...collectBlockChildren(content))

    node[0] = '__flatten'
    node[1] = {}
    node.length = 2
    for (const child of allChildren) {
      node.push(child)
    }
  })

  const componentsListNodes: any[] = []
  visit(doc.body, (node) => {
    if (Array.isArray(node) && node[0] === 'components-list') {
      componentsListNodes.push(node)
    }
    return true
  }, node => node)

  for (const node of componentsListNodes) {
    const category = node[1]?.category
    if (!category) continue

    const components = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/components/%')
      .where('extension', '=', 'md')
      .where('index', 'IS NULL')
      .where('category', '=', category)
      .select('path', 'title')
      .all()

    const listItems = components.map((c: any) =>
      ['li', {}, ['a', { href: `https://ui.nuxt.com/raw${c.path}.md` }, c.title]]
    )

    node[0] = 'ul'
    node[1] = {}
    node.length = 2
    for (const item of listItems) {
      node.push(item)
    }
  }

  // Remove wrapper elements by extracting children content
  const wrapperTypes = ['card-group', 'accordion', 'steps', 'code-group', 'code-collapse', 'tabs', 'div']
  for (const wrapperType of wrapperTypes) {
    visitAndReplace(doc, wrapperType, (node) => {
      replaceWithChildren(node, node.slice(2))
    })
  }

  // Transform field to a definition format (before field-group unwrapping so attrs are intact)
  visitAndReplace(doc, 'field', (node) => {
    const attrs = node[1] || {}
    const content = node.slice(2)
    const name = attrs.name || ''
    const type = attrs.type || ''
    const required = attrs.required === 'true' || attrs[':required'] === 'true'

    const extractText = (nodes: any[]): string => {
      return nodes.map((child: any) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const innerContent = child.slice(2)
          return extractText(innerContent)
        }
        return ''
      }).join('')
    }

    const parts: any[] = [['strong', {}, name]]
    if (type) {
      parts.push(' (', ['code', {}, type], ')')
    }
    if (required) {
      parts.push(' ', ['em', {}, 'required'])
    }
    const desc = extractText(content).trim()
    if (desc) {
      parts.push(`: ${desc}`)
    }

    node[0] = 'p'
    node[1] = {}
    node.length = 2
    for (const part of parts) {
      node.push(part)
    }
  })

  // Remove field-group / collapsible wrappers (after fields are transformed to <p>)
  const fieldWrappers = ['field-group', 'collapsible']
  for (const wrapperType of fieldWrappers) {
    visitAndReplace(doc, wrapperType, (node) => {
      replaceWithChildren(node, node.slice(2))
    })
  }

  // Transform code-preview to extract the Vue code as a code block
  visitAndReplace(doc, 'code-preview', (node) => {
    const children = node.slice(2)

    const extractVueCode = (nodes: any[]): string => {
      return nodes.map((child: any) => {
        if (typeof child === 'string') return child
        if (Array.isArray(child)) {
          const tag = child[0]
          const attrs = child[1] || {}
          const content = child.slice(2)
          // Build the opening tag
          let tagStr = `<${tag}`
          for (const [key, val] of Object.entries(attrs)) {
            if (key.startsWith(':') || key.startsWith('v-')) {
              tagStr += ` ${key}=${val}`
            } else if (typeof val === 'string') {
              tagStr += ` ${key}=${val}`
            }
          }
          const innerContent = extractVueCode(content)
          if (innerContent.trim()) {
            tagStr += `>\n${innerContent}</${tag}>`
          } else {
            tagStr += ' />'
          }
          return tagStr
        }
        return ''
      }).join('\n')
    }

    const vueCode = extractVueCode(children).trim()
    node[0] = 'pre'
    node[1] = { language: 'vue', code: `<template>\n  ${vueCode.split('\n').join('\n  ')}\n</template>` }
    node.length = 2
  })

  // Transform icons-theme and icons-theme-select to placeholder
  visitAndReplace(doc, 'icons-theme', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = ['em', {}, 'See the interactive theme picker on the documentation website.']
    node.length = 3
  })

  visitAndReplace(doc, 'icons-theme-select', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = ''
    node.length = 3
  })

  // Transform supported-languages to placeholder
  visitAndReplace(doc, 'supported-languages', (node) => {
    node[0] = 'p'
    node[1] = {}
    node[2] = ['em', {}, 'See the full list of supported languages on the documentation website.']
    node.length = 3
  })

  // Transform u-button to markdown link
  visitAndReplace(doc, 'u-button', (node) => {
    const attrs = node[1] || {}
    const label = attrs.label || ''
    const to = attrs.to || ''
    if (to) {
      node[0] = 'p'
      node[1] = {}
      node[2] = ['a', { href: to }, label]
      node.length = 3
    } else {
      node[0] = 'p'
      node[1] = {}
      node[2] = label
      node.length = 3
    }
  })

  // Flatten __flatten markers by splicing their children into parents
  if (Array.isArray(doc.body)) {
    flattenMarkers(doc.body)
  } else if (doc.body?.value && Array.isArray(doc.body.value)) {
    flattenMarkers(doc.body.value)
  }

  return doc
}
