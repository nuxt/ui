import {
  createMarkdownParser,
  rehypeHighlight,
  createShikiHighlighter
} from '@nuxtjs/mdc/runtime'

import MaterialThemePalenight from 'shiki/themes/material-theme-palenight.mjs'
import HtmlLang from 'shiki/langs/html.mjs'
import MdcLang from 'shiki/langs/mdc.mjs'
import TsLang from 'shiki/langs/typescript.mjs'
import VueLang from 'shiki/langs/vue.mjs'

export default function useMarkdownParser() {
  let parser: Awaited<ReturnType<typeof createMarkdownParser>>

  const parseMarkdown = async (markdown: string) => {
    if (!parser) {
      parser = await createMarkdownParser({
        rehype: {
          plugins: {
            highlight: {
              instance: rehypeHighlight,
              options: {
                // Pass in your desired theme(s)
                theme: 'material-theme-palenight',
                // Create the Shiki highlighter
                highlighter: createShikiHighlighter({
                  bundledThemes: {
                    'material-theme-palenight': MaterialThemePalenight
                  },
                  // Configure the bundled languages
                  bundledLangs: {
                    html: HtmlLang,
                    mdc: MdcLang,
                    vue: VueLang,
                    ts: TsLang,
                    typescript: TsLang
                  }
                })
              }
            }
          }
        }
      })
    }
    return parser(markdown)
  }

  return { parseMarkdown }
}
