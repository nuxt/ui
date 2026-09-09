import { createMarkdownParser } from '@comark/vue/parse'
import shiki from '@comark/vue/plugins/shiki'
import css from 'shiki/dist/langs/css.mjs'
import type { ShikiTransformer } from '@shikijs/types'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

// Comark's shiki is the chat's highlighter too, so the site loads one shiki.
// css is the one language the plugin's default set lacks; copied, the plugin
// appends its defaults to the array it is given.
const parse = createMarkdownParser({
  plugins: [shiki({
    languages: [...css],
    // the pair the content pipeline uses (mdc.config.ts), both of which the
    // exports earn: a swatch on the ramp values, the glyph on the icon names
    transformers: [
      transformerColorHighlight() as ShikiTransformer,
      transformerIconHighlight()
    ]
  })]
})

export type CodeDocument = Awaited<ReturnType<typeof parse>>

/** A generated file as a highlighted document, rendered by CodePane. */
export function parseCode(code: string, lang: 'css' | 'ts'): Promise<CodeDocument> {
  return parse(`\`\`\`${lang}\n${code}\n\`\`\``)
}
