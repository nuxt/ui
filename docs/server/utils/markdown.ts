import { textContent } from 'minimark'

/**
 * Markdown builders for what `minimark/stringify` cannot express in its
 * `markdown/html` format: it has no pipe-table handler, so a `table` node
 * comes out as HTML, and its `pre` handler always opens a three-backtick
 * fence, which code carrying fences of its own breaks out of. Both return a
 * string to drop into the tree as a paragraph, which the stringifier passes
 * through untouched. Links stay as written: `nuxt-agent-discovery` absolutizes
 * the stringified document afterwards, table rows included.
 */

/**
 * A backtick run that cannot be closed early by the text: one longer than
 * any run of `minimum` or more backticks inside it, and at least `minimum`.
 */
function backticks(text: string, minimum: number): string {
  const runs = Array.from(text.matchAll(new RegExp(`\`{${minimum},}`, 'g')), match => match[0].length)
  return '`'.repeat(Math.max(minimum - 1, ...runs) + 1)
}

// GFM reads `\|` as a pipe anywhere in a cell, code spans included, while
// every other backslash inside a code span stays literal. So plain text gets
// both characters escaped and a code span only its pipes, joined rather than
// replaced so a literal backslash is never doubled there.
function escapeText(text: string): string {
  return text.replace(/[\\|]/g, '\\$&')
}

function escapePipes(text: string): string {
  return text.split('|').join('\\|')
}

/** Renders the inline nodes a table cell can hold to markdown. */
function inlineMarkdown(node: any): string {
  if (typeof node === 'string') return escapeText(node)
  const [tag, attrs = {}, ...children] = node
  const inner = () => children.map(inlineMarkdown).join('')

  switch (tag) {
    case 'code': {
      const text = escapePipes(textContent(node))
      const fence = backticks(text, 1)
      // A space keeps a leading or trailing backtick apart from the fence.
      return /^`|`$/.test(text) ? `${fence} ${text} ${fence}` : `${fence}${text}${fence}`
    }
    case 'a': return `[${inner()}](${escapePipes(String(attrs.href ?? ''))})`
    case 'strong':
    case 'b': return `**${inner()}**`
    case 'em':
    case 'i': return `*${inner()}*`
    case 'del': return `~~${inner()}~~`
    case 'img': return `![${escapeText(String(attrs.alt ?? ''))}](${escapePipes(String(attrs.src ?? ''))})`
    // The one line break a pipe cell can hold.
    case 'br': return '<br>'
    default: return inner()
  }
}

function cell(node: any): string {
  return inlineMarkdown(node).replace(/\s+/g, ' ').trim()
}

/** A `table` node as a GFM pipe table, the first row serving as header. */
export function pipeTable(table: any[]): string {
  const rows: string[][] = []
  for (const section of table.slice(2)) {
    if (!Array.isArray(section)) continue
    // Rows sit under `thead` and `tbody`; a bare `tr` is tolerated too.
    for (const row of section[0] === 'tr' ? [section] : section.slice(2)) {
      if (Array.isArray(row) && row[0] === 'tr') {
        rows.push(row.slice(2).filter(child => Array.isArray(child)).map(cell))
      }
    }
  }

  const [header, ...body] = rows
  if (!header?.length) return ''

  const width = header.length
  const line = (cells: string[]) => `| ${Array.from({ length: width }, (_, i) => cells[i] ?? '').join(' | ')} |`

  return [line(header), line(header.map(() => '---')), ...body.map(line)].join('\n')
}

/** A fenced code block whose fence is longer than any fence-like run inside. */
export function fencedBlock(code: string, language = '', filename?: string, meta?: string): string {
  const fence = backticks(code, 3)
  return `${fence}${language}${filename ? ` [${filename}]` : ''}${meta || ''}\n${code.trim()}\n${fence}`
}
