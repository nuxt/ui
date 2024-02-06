import { createShikiHighlighter } from '@nuxtjs/mdc/runtime/highlighter/shiki'
import MaterialTheme from 'shiki/themes/material-theme.mjs'
import MaterialThemeLighter from 'shiki/themes/material-theme-lighter.mjs'
import MaterialThemePalenight from 'shiki/themes/material-theme-palenight.mjs'
import HtmlLang from 'shiki/langs/html.mjs'
import MdcLang from 'shiki/langs/mdc.mjs'
import VueLang from 'shiki/langs/vue.mjs'

let highlighter
export const useShikiHighlighter = () => {
  if (!highlighter) {
    highlighter = createShikiHighlighter({
      bundledThemes: {
        'material-theme': MaterialTheme,
        'material-theme-lighter': MaterialThemeLighter,
        'material-theme-palenight': MaterialThemePalenight
      },
      bundledLangs: {
        html: HtmlLang,
        mdc: MdcLang,
        vue: VueLang
      }
    })
  }

  return highlighter
}