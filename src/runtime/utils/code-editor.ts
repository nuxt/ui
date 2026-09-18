import type { Extension, Range } from '@codemirror/state'
import { StateEffect } from '@codemirror/state'
import type { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view'
import { Decoration, ViewPlugin } from '@codemirror/view'
import type { GrammarState, HighlighterGeneric } from 'shiki'
import { createHighlighter, createJavaScriptRegexEngine, isSpecialLang, stringifyTokenStyle } from 'shiki'

export type CodeEditorHighlighter = HighlighterGeneric<any, any>

export interface CodeEditorThemes {
  light: string
  dark: string
}

export interface CodeEditorHighlightOptions {
  highlighter: CodeEditorHighlighter
  lang: string
  themes: CodeEditorThemes
}

let highlighter: Promise<CodeEditorHighlighter> | undefined

/**
 * The highlighter shared by every CodeEditor that does not receive its own.
 * Created on first use with the JavaScript RegExp engine, so no WebAssembly
 * is fetched, and loaded with grammars and themes on demand.
 */
export function getCodeEditorHighlighter(): Promise<CodeEditorHighlighter> {
  highlighter ??= createHighlighter({
    langs: [],
    themes: [],
    engine: createJavaScriptRegexEngine({ forgiving: true })
  }) as Promise<CodeEditorHighlighter>

  return highlighter
}

export function resolveCodeEditorThemes(theme: string | CodeEditorThemes): CodeEditorThemes {
  return typeof theme === 'string' ? { light: theme, dark: theme } : theme
}

/**
 * Load the grammar and themes the editor needs, skipping the ones the
 * highlighter already knows and the plain-text languages that need none.
 */
export async function prepareCodeEditorHighlighter(highlighter: CodeEditorHighlighter, lang: string, themes: CodeEditorThemes): Promise<void> {
  const tasks: Promise<void>[] = []

  if (!isSpecialLang(lang) && !highlighter.getLoadedLanguages().includes(lang)) {
    tasks.push(highlighter.loadLanguage(lang))
  }

  const loadedThemes = highlighter.getLoadedThemes()
  for (const theme of new Set([themes.light, themes.dark])) {
    if (!loadedThemes.includes(theme)) {
      tasks.push(highlighter.loadTheme(theme))
    }
  }

  await Promise.all(tasks)
}

// Lines are tokenized in chunks and the grammar state is cached at each chunk
// boundary, so an edit only re-tokenizes from the start of its chunk.
const CHUNK_LINES = 64
// Lines tokenized per pass, the rest is scheduled so a large document never blocks the UI.
const PASS_LINES = 1024
// Guards against minified lines, Shiki then emits them as a single token.
const MAX_LINE_LENGTH = 20_000

const continueHighlight = StateEffect.define<null>()

/**
 * A CodeMirror extension that highlights the document with Shiki.
 *
 * Only the lines up to the end of the viewport are tokenized, and the grammar
 * state is carried across chunks so scrolling and edits stay incremental.
 * Tokens are decorated with a `cm-shiki` class and the colors of both themes as
 * `--shiki-light` / `--shiki-dark` CSS variables (font style and weight follow
 * the same convention), so the theme can switch between them without re-tokenizing.
 */
export function shikiHighlight({ highlighter, lang, themes }: CodeEditorHighlightOptions): Extension {
  const marks = new Map<string, Decoration>()

  function mark(style: string): Decoration {
    let decoration = marks.get(style)
    if (!decoration) {
      decoration = Decoration.mark({ class: 'cm-shiki', attributes: { style } })
      marks.set(style, decoration)
    }

    return decoration
  }

  return ViewPlugin.fromClass(class {
    decorations: DecorationSet = Decoration.none
    // Grammar state before a chunk, keyed by the number of its first line.
    states = new Map<number, GrammarState>()
    // Number of the last line tokenized so far.
    tokenized = 0
    timeout: ReturnType<typeof setTimeout> | undefined

    constructor(readonly view: EditorView) {
      this.highlight()
    }

    update(update: ViewUpdate) {
      if (update.docChanged) {
        let changed = update.state.doc.length
        update.changes.iterChangedRanges((_fromA, _toA, fromB) => {
          changed = Math.min(changed, fromB)
        })

        const line = update.state.doc.lineAt(changed)
        for (const key of this.states.keys()) {
          if (key > line.number) {
            this.states.delete(key)
          }
        }

        this.tokenized = Math.min(this.tokenized, line.number - 1)
        this.decorations = this.decorations.map(update.changes).update({ filter: () => false, filterFrom: line.from })
        this.highlight()
      } else if (update.viewportChanged || update.transactions.some(transaction => transaction.effects.some(effect => effect.is(continueHighlight)))) {
        this.highlight()
      }
    }

    highlight() {
      clearTimeout(this.timeout)

      const { doc } = this.view.state
      const target = doc.lineAt(this.view.viewport.to).number
      if (this.tokenized >= target) {
        return
      }

      const from = Math.floor(this.tokenized / CHUNK_LINES) * CHUNK_LINES + 1
      let grammarState = from === 1 ? undefined : this.states.get(from)
      if (from !== 1 && !grammarState) {
        this.states.clear()
        this.tokenized = 0
        this.highlight()
        return
      }

      const ranges: Range<Decoration>[] = []
      const limit = Math.min(doc.lines, from + PASS_LINES - 1)
      const before = this.tokenized
      let chunkFrom = from

      while (chunkFrom <= target && chunkFrom <= limit) {
        const chunkTo = Math.min(chunkFrom + CHUNK_LINES - 1, doc.lines)
        const start = doc.line(chunkFrom).from
        // Keep the line break after the chunk so the grammar sees the end of its last line.
        const code = doc.sliceString(start, Math.min(doc.line(chunkTo).to + 1, doc.length))

        let result
        try {
          result = highlighter.codeToTokens(code, { lang, themes, defaultColor: false, tokenizeMaxLineLength: MAX_LINE_LENGTH, grammarState })
        } catch {
          break
        }

        for (const line of result.tokens) {
          for (const token of line) {
            if (token.content.length && token.htmlStyle) {
              ranges.push(mark(stringifyTokenStyle(token.htmlStyle)).range(start + token.offset, start + token.offset + token.content.length))
            }
          }
        }

        grammarState = result.grammarState
        if (grammarState) {
          this.states.set(chunkTo + 1, grammarState)
        }

        this.tokenized = chunkTo
        chunkFrom = chunkTo + 1
      }

      this.decorations = this.decorations.update({
        filter: () => false,
        filterFrom: doc.line(from).from,
        filterTo: doc.line(Math.max(this.tokenized, from)).to,
        add: ranges
      })

      // Continue in a later task only when this pass made progress, so a failing grammar cannot loop.
      if (this.tokenized < target && this.tokenized > before) {
        this.timeout = setTimeout(() => this.view.dispatch({ effects: continueHighlight.of(null) }), 0)
      }
    }

    destroy() {
      clearTimeout(this.timeout)
    }
  }, {
    decorations: plugin => plugin.decorations
  })
}
