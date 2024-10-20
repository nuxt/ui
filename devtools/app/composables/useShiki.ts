import { createHighlighterCore } from 'shiki/core'
import type { BuiltinLanguage, HighlighterCore } from 'shiki'
import loadWasm from 'shiki/wasm'
import MaterialThemeLighter from 'shiki/themes/material-theme-lighter.mjs'
import MaterialThemePalenight from 'shiki/themes/material-theme-palenight.mjs'
import VueLang from 'shiki/langs/vue.mjs'
import MarkdownLang from 'shiki/langs/markdown.mjs'

export const highlighter = shallowRef<HighlighterCore>()

// A custom composable for syntax highlighting with Shiki since `@nuxt/mdc` relies on
// a server endpoint to highlight code.
export function useShiki() {
  async function codeToHtml(code: string, lang: BuiltinLanguage | 'text' = 'text') {
    if (!highlighter.value) {
      highlighter.value = await createHighlighterCore({
        themes: [MaterialThemeLighter, MaterialThemePalenight],
        langs: [VueLang, MarkdownLang],
        loadWasm
      })
    }

    return highlighter.value.codeToHtml(code, {
      lang,
      themes: {
        dark: 'material-theme-palenight',
        default: 'material-theme-lighter',
        light: 'material-theme-lighter'
      }
    })
  }

  return { codeToHtml }
}
