import { isEqual } from 'ohash/utils'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import type { GetItemKeys } from '../types/utils'

export function pick<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>

  for (const key of keys) {
    result[key] = data[key]
  }

  return result
}

export function omit<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Omit<Data, Keys> {
  const result = { ...data }

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key]
  }

  return result as Omit<Data, Keys>
}

export function get(object: Record<string, any> | undefined, path: (string | number)[] | string, defaultValue?: any): any {
  const keys = typeof path === 'string' ? path.split('.') : path

  let result: any = object

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue
    }

    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

export function set(object: Record<string, any>, path: (string | number)[] | string, value: any): void {
  const keys: string[] = []

  for (const segment of typeof path === 'string' ? path.split('.') : path) {
    const key = String(segment)
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return
    }

    keys.push(key)
  }

  let current = object

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!

    if (i === keys.length - 1) {
      current[key] = value
      return
    }

    if (current[key] === null || (typeof current[key] !== 'object' && typeof current[key] !== 'function')) {
      current[key] = /^(?:0|[1-9]\d*)$/.test(keys[i + 1]!) ? [] : {}
    }

    current = current[key]
  }
}

export function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}

export function compare<T>(value?: T, currentValue?: T, comparator?: string | ((a: T, b: T) => boolean)) {
  if (value === undefined || currentValue === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value === currentValue
  }

  if (typeof comparator === 'function') {
    return comparator(value, currentValue)
  }

  if (typeof comparator === 'string') {
    return get(value!, comparator) === get(currentValue!, comparator)
  }

  return isEqual(value, currentValue)
}

export function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (value instanceof Date || value instanceof RegExp || typeof value === 'function') {
    return false
  }

  if (typeof value === 'object') {
    for (const _ in value as object) {
      if (Object.prototype.hasOwnProperty.call(value, _)) {
        return false
      }
    }
    return true
  }

  return false
}

export function getDisplayValue<T extends Array<any>, V>(
  items: T,
  value: V | undefined | null,
  options: {
    valueKey?: GetItemKeys<T>
    labelKey?: GetItemKeys<T>
    by?: string | ((a: any, b: any) => boolean)
  } = {}
): string | undefined {
  const { valueKey, labelKey, by } = options

  const foundItem = items.find((item) => {
    const itemValue = (typeof item === 'object' && item !== null && valueKey)
      ? get(item, valueKey as string)
      : item
    return compare(itemValue, value, by)
  })

  if (isEmpty(value) && foundItem) {
    return labelKey ? get(foundItem as Record<string, any>, labelKey as string) : undefined
  }

  if (isEmpty(value)) {
    return undefined
  }

  const source = foundItem ?? value

  if (source === null || source === undefined) {
    return undefined
  }

  if (typeof source === 'object') {
    return labelKey ? get(source as Record<string, any>, labelKey as string) : undefined
  }

  return String(source)
}

export function isArrayOfArray<
  A extends any[] | any[][]
>(item: A): item is A extends Array<infer T>
  ? T extends any[]
    ? T[]
    : never
  : never {
  return Array.isArray(item[0])
}

export function mergeClasses(appConfigClass?: string | string[], propClass?: string) {
  if (!appConfigClass && !propClass) {
    return ''
  }

  return [
    ...(Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass]),
    propClass
  ].filter(Boolean)
}

export function getSlotChildrenText(children: any) {
  return children.map((node: any) => {
    if (!node.children || typeof node.children === 'string') return node.children || ''
    else if (Array.isArray(node.children)) return getSlotChildrenText(node.children)
    else if (node.children.default) return getSlotChildrenText(node.children.default())
  }).join('')
}

// A code delimiter has to be longer than any run of backticks in the code.
function getBackticks(code: string, min: number) {
  return '`'.repeat(Math.max(min, ...(code.match(/`+/g) || []).map(run => run.length + 1)))
}

// A native element has its tag as `type`, a prose component rendered by MDC carries it as `type.tag`.
function getNodeTag(node: any): string | undefined {
  return typeof node.type === 'string' ? node.type : node.type?.tag
}

// The text of a node without any formatting, for code.
function getNodeText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (typeof node.children === 'string') return node.children
  if (Array.isArray(node.children)) return node.children.map(getNodeText).join('')
  if (typeof node.children?.default === 'function') return node.children.default().map(getNodeText).join('')
  return ''
}

function getNodeBlocks(node: any): string[] {
  if (typeof node.children === 'string') return [node.children]
  if (Array.isArray(node.children)) return getMarkdownBlocks(node.children)
  if (typeof node.children?.default === 'function') return getMarkdownBlocks(node.children.default())
  return []
}

function getListMarkdown(node: any, ordered: boolean) {
  const start = Number(node.props?.start) || 1
  // Each `li` is one block.
  return getNodeBlocks(node).map((item, index) => {
    const marker = ordered ? `${start + index}. ` : '- '
    return marker + item.replace(/\n(?!\n)/g, `\n${' '.repeat(marker.length)}`)
  }).join('\n')
}

function getMarkdownBlocks(children: any[]): string[] {
  const blocks: string[] = []
  let inline = ''

  function flush() {
    if (inline.trim()) blocks.push(inline.trim())
    inline = ''
  }

  function push(block: string) {
    flush()
    if (block) blocks.push(block)
  }

  for (const node of children) {
    if (!node) continue
    if (typeof node === 'string') {
      inline += node
      continue
    }

    const tag = getNodeTag(node)
    const content = () => getNodeBlocks(node)

    switch (tag) {
      case 'p':
        push(content().join('\n\n'))
        break
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        push(`${'#'.repeat(Number(tag[1]))} ${content().join(' ')}`)
        break
      case 'ul':
      case 'ol':
        push(getListMarkdown(node, tag === 'ol'))
        break
      case 'li':
        // A nested list follows its item without a blank line.
        push(content().reduce((item, block) => item + (/^(?:-|\d+\.) /.test(block) ? '\n' : '\n\n') + block, '').trim())
        break
      case 'blockquote':
        push(content().join('\n\n').replace(/^/gm, '> '))
        break
      case 'pre': {
        const code = String(node.props?.code ?? getNodeText(node)).replace(/\n$/, '')
        const fence = getBackticks(code, 3)
        push(`${fence}${node.props?.language ?? ''}\n${code}\n${fence}`)
        break
      }
      case 'code': {
        const code = getNodeText(node)
        const delimiter = getBackticks(code, 1)
        // A space keeps a leading or trailing backtick apart from the delimiter.
        const space = code.startsWith('`') || code.endsWith('`') ? ' ' : ''
        inline += `${delimiter}${space}${code}${space}${delimiter}`
        break
      }
      case 'a':
        inline += node.props?.href ? `[${content().join('')}](${node.props.href})` : content().join('')
        break
      case 'strong':
      case 'b':
        inline += `**${content().join('')}**`
        break
      case 'em':
      case 'i':
        inline += `*${content().join('')}*`
        break
      case 'br':
        inline += '\n'
        break
      default: {
        const [first = '', ...rest] = content()
        inline += first
        rest.forEach(push)
      }
    }
  }

  flush()

  return blocks
}

/**
 * Serializes the vnodes of a slot back to Markdown: paragraphs, headings, lists, blockquotes, code blocks, inline code, links and emphasis.
 */
export function getSlotChildrenMarkdown(children: any[]) {
  return getMarkdownBlocks(children).join('\n\n')
}

export function transformUI(ui: any, uiProp?: any) {
  return Object.entries(ui).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'function' ? value({ class: uiProp?.[key] }) : value
    return acc
  }, { ...(uiProp || {}) })
}

export function resolveBaseURL(path?: string, baseURL?: string): string | undefined {
  if (path?.startsWith('/') && !path.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(baseURL || '/'))
    if (_base !== '/' && !path.startsWith(_base)) {
      return joinURL(_base, path)
    }
  }
  return path
}

export * from './content'
