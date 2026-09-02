import { SITE_URL } from './site'

/**
 * Markdown builders for what `minimark/stringify` cannot express in its
 * `markdown/html` format: it has no pipe-table handler, so a `table` node
 * comes out as HTML, and its `pre` handler always opens a three-backtick
 * fence, which code carrying fences of its own breaks out of. Both return a
 * string to drop into the tree as a paragraph, which the stringifier passes
 * through untouched.
 */

type Node = string | [string, Record<string, any>, ...Node[]]

function textContent(node: Node): string {
  if (typeof node === 'string') return node
  return node.slice(2).map(child => textContent(child as Node)).join('')
}

// The tree is absolutized by `nuxt-agent-discovery` after the hook, which a
// pre-rendered string escapes, so links are resolved here the same way.
function absolutize(url: unknown): string {
  const value = String(url ?? '')
  return value.startsWith('/') && !value.startsWith('//') ? `${SITE_URL}${value}` : value
}

/** Renders the inline nodes a table cell can hold to markdown. */
export function inlineMarkdown(node: Node): string {
  if (typeof node === 'string') return node
  const [tag, attrs = {}, ...children] = node
  const inner = () => children.map(child => inlineMarkdown(child as Node)).join('')

  switch (tag) {
    case 'code': return `\`${textContent(node)}\``
    case 'a': return `[${inner()}](${absolutize(attrs.href)})`
    case 'strong':
    case 'b': return `**${inner()}**`
    case 'em':
    case 'i': return `*${inner()}*`
    case 'del': return `~~${inner()}~~`
    case 'img': return `![${attrs.alt || ''}](${absolutize(attrs.src)})`
    case 'br': return ' '
    default: return inner()
  }
}

function cell(node: Node): string {
  const content = typeof node === 'string' ? node : node.slice(2).map(child => inlineMarkdown(child as Node)).join('')
  return content.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
}

/** A `table` node as a GFM pipe table, the first row serving as header. */
export function pipeTable(table: Node): string {
  const rows: string[][] = []
  const collect = (nodes: Node[]) => {
    for (const node of nodes) {
      if (!Array.isArray(node)) continue
      if (node[0] === 'tr') {
        rows.push(node.slice(2).filter(child => Array.isArray(child)).map(child => cell(child as Node)))
      } else {
        collect(node.slice(2) as Node[])
      }
    }
  }
  collect(typeof table === 'string' ? [] : table.slice(2) as Node[])

  const [header, ...body] = rows
  if (!header?.length) return ''

  const width = header.length
  const line = (cells: string[]) => `| ${Array.from({ length: width }, (_, i) => cells[i] ?? '').join(' | ')} |`

  return [line(header), line(header.map(() => '---')), ...body.map(line)].join('\n')
}

/** A fenced code block whose fence is longer than any backtick run inside. */
export function fencedBlock(code: string, language = '', filename?: string, meta?: string): string {
  const longest = Math.max(2, ...Array.from(code.matchAll(/`{3,}/g), match => match[0].length))
  const fence = '`'.repeat(longest + 1)
  return `${fence}${language}${filename ? ` [${filename}]` : ''}${meta || ''}\n${code.trim()}\n${fence}`
}
