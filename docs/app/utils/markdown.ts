import { createMarkdownParser, defineComarkPlugin } from '@comark/vue/parse'
import shiki, { getHighlighter } from '@comark/vue/plugins/shiki'
import { codeToTokens, getTokenStyleObject, stringifyTokenStyle } from 'shiki/core'
import type { ComarkParsePostState } from '@comark/vue'
import toc from '@comark/vue/plugins/toc'
import emoji from '@comark/vue/plugins/emoji'
import css from 'shiki/dist/langs/css.mjs'
import diff from 'shiki/dist/langs/diff.mjs'
import html from 'shiki/dist/langs/html.mjs'
import type { ShikiTransformer } from '@shikijs/types'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

/** A rendered element as Comark writes it: its tag, its props, then its children. */
type MarkdownElement = [string, Record<string, unknown>, ...unknown[]]
type MarkdownNode = string | MarkdownElement

const THEMES = { light: 'material-theme-lighter', dark: 'material-theme-palenight' } as const

/**
 * The pseudo languages the docs write inline, as `@nuxtjs/mdc` resolved them:
 * a bare type expression and a template fragment, each highlighted in the
 * context that makes its grammar apply.
 */
const CONTEXTS: Record<string, { lang: string, grammarContextCode: string }> = {
  'ts-type': { lang: 'typescript', grammarContextCode: 'let a:' },
  'typescript-type': { lang: 'typescript', grammarContextCode: 'let a:' },
  'vue-html': { lang: 'vue', grammarContextCode: '<template>' },
  'vue-template': { lang: 'vue', grammarContextCode: '<template>' }
}

/**
 * Inline code carrying a language, which the shiki plugin leaves alone: it only
 * walks fenced blocks, and the props tables are written as `` `type`{lang="ts-type"} ``.
 */
const inlineShiki = defineComarkPlugin(() => ({
  name: 'inline-shiki',
  async post(state: ComarkParsePostState) {
    const pending: Array<[MarkdownElement, string, string]> = []

    const walk = (node: MarkdownNode, parent?: string) => {
      if (!Array.isArray(node)) return

      const [tag, props] = node
      const lang = typeof props?.lang === 'string' ? props.lang : undefined
      const code = node[2]
      if (tag === 'code' && parent !== 'pre' && lang && node.length === 3 && typeof code === 'string') {
        pending.push([node, lang, code])
        return
      }

      for (let i = 2; i < node.length; i++) walk(node[i] as MarkdownNode, tag)
    }

    // the document's own node type is only exported as a value by `@comark/vue`
    for (const node of state.tree.nodes as MarkdownNode[]) walk(node)
    if (!pending.length) return

    // the instance the shiki plugin built, which runs before this one
    const highlighter = await getHighlighter()

    for (const [node, lang, code] of pending) {
      const context = CONTEXTS[lang]
      try {
        const { tokens } = codeToTokens(highlighter, code, { themes: THEMES, ...context ?? { lang } })
        const props = node[1]
        props.class = [props.class, 'shiki'].filter(Boolean).join(' ')
        node.length = 2
        for (const [index, line] of tokens.entries()) {
          if (index) node.push('\n')
          for (const token of line) {
            const style = stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))
            node.push(style ? ['span', { style }, token.content] : token.content)
          }
        }
      } catch {
        // an unknown language stays as it was written
      }
    }
  }
}))

/**
 * The docs' own markdown: everything the content pipeline doesn't parse at
 * build time (a prop description, a generated config, release notes) goes
 * through here, so the site holds one parser and one highlighter.
 */
export const markdownPlugins = [
  shiki({
    // on top of the plugin's defaults, which the array is appended to
    languages: [...css, ...diff, ...html],
    // the pair the content pipeline uses (mdc.config.ts): a swatch on colour
    // values, the glyph on icon names
    transformers: [
      transformerColorHighlight() as ShikiTransformer,
      transformerIconHighlight()
    ]
  }),
  // the release notes carry their own table of contents
  toc({ depth: 3, searchDepth: 3 }),
  // GitHub writes its release headings with shortcodes, and `:sparkles:` reads
  // as an inline component without this. The seven the changelog uses that the
  // plugin's own table misses are added here.
  emoji({
    extend: {
      books: '\u{1F4DA}',
      compass: '\u{1F9ED}',
      globe_with_meridians: '\u{1F310}',
      no_entry_sign: '\u{1F6AB}',
      recycle: '\u{267B}\u{FE0F}',
      robot: '\u{1F916}',
      rotating_light: '\u{1F6A8}'
    }
  }),
  inlineShiki()
]

const parse = createMarkdownParser({ plugins: markdownPlugins })

export type MarkdownDoc = Awaited<ReturnType<typeof parse>>

export function parseMarkdown(markdown: string): Promise<MarkdownDoc> {
  return parse(markdown)
}

/** A generated file as a highlighted document, rendered by CodePane. */
export function parseCode(code: string, lang: 'css' | 'ts'): Promise<MarkdownDoc> {
  return parse(`\`\`\`${lang}\n${code}\n\`\`\``)
}
