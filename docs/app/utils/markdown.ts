import { createMarkdownParser, defineComarkPlugin } from '@comark/vue/parse'
import shiki, { getHighlighter } from '@comark/vue/plugins/shiki'
import type { ShikiOptions } from '@comark/vue/plugins/shiki'
import { codeToTokens, getTokenStyleObject, stringifyTokenStyle } from 'shiki/core'
import type { ComarkParsePostState } from '@comark/vue'
import toc from '@comark/vue/plugins/toc'
import emoji from '@comark/vue/plugins/emoji'
import bash from 'shiki/dist/langs/bash.mjs'
import css from 'shiki/dist/langs/css.mjs'
import diff from 'shiki/dist/langs/diff.mjs'
import html from 'shiki/dist/langs/html.mjs'
import javascript from 'shiki/dist/langs/javascript.mjs'
import json from 'shiki/dist/langs/json.mjs'
import typescript from 'shiki/dist/langs/typescript.mjs'
import vue from 'shiki/dist/langs/vue.mjs'
import yaml from 'shiki/dist/langs/yaml.mjs'
import { shikiTransformers } from './shiki'

/** A rendered element as Comark writes it: its tag, its props, then its children. */
type MarkdownElement = [string, Record<string, unknown>, ...unknown[]]
type MarkdownNode = string | MarkdownElement

const THEMES = { light: 'material-theme-lighter', dark: 'material-theme-palenight' } as const

/**
 * The highlighter is a singleton, built by whichever of the two plugins reaches
 * it first, so both pass the same options: a document holding only inline code
 * never enters the shiki plugin and would otherwise build it with the defaults.
 * Those defaults also carry tsx, svelte and astro that nothing here writes, so
 * the grammars are listed instead, html and the scripts before vue embeds them.
 */
const SHIKI_OPTIONS: ShikiOptions = {
  registerDefaultLanguages: false,
  languages: [...html, ...css, ...javascript, ...typescript, ...vue, ...bash, ...json, ...yaml, ...diff],
  transformers: shikiTransformers()
}

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
    const highlighter = await getHighlighter(SHIKI_OPTIONS)

    for (const [node, lang, code] of pending) {
      const context = CONTEXTS[lang]
      try {
        const { tokens } = codeToTokens(highlighter, code, { themes: THEMES, ...context ?? { lang } })
        // built aside so a throw halfway through leaves the node untouched
        const children: MarkdownNode[] = []
        for (const [index, line] of tokens.entries()) {
          if (index) children.push('\n')
          for (const token of line) {
            const style = stringifyTokenStyle(token.htmlStyle || getTokenStyleObject(token))
            children.push(style ? ['span', { style }, token.content] : token.content)
          }
        }
        const props = node[1]
        props.class = [props.class, 'shiki'].filter(Boolean).join(' ')
        node.length = 2
        node.push(...children)
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
const markdownPlugins = [
  shiki(SHIKI_OPTIONS),
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

/**
 * Documents by source. Every runtime caller comes through here, and the same
 * string is rendered over and over (a prop description repeated across pages,
 * a type in two tables), so the parse happens once. The promise is cached, so
 * two callers racing on one string share the work, and the oldest entry goes
 * once the map is full: this module outlives a request on the server.
 */
const DOCUMENT_LIMIT = 500
const documents = new Map<string, Promise<MarkdownDoc>>()

// not `parseMarkdown`, which `@nuxtjs/mdc` already auto-imports under that name
export function parseMarkdownDoc(markdown: string): Promise<MarkdownDoc> {
  const cached = documents.get(markdown)
  if (cached) {
    return cached
  }

  const doc = parse(markdown)

  if (documents.size >= DOCUMENT_LIMIT) {
    documents.delete(documents.keys().next().value!)
  }
  documents.set(markdown, doc)

  // a transient failure would otherwise replay for every later caller
  doc.catch(() => documents.delete(markdown))

  return doc
}

/** A generated file as a highlighted document, rendered by CodePane. */
export function parseCode(code: string, lang: 'css' | 'ts'): Promise<MarkdownDoc> {
  return parse(`\`\`\`${lang}\n${code}\n\`\`\``)
}
