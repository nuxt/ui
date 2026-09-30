import type { ShikiTransformer } from '@shikijs/types'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

// The content pipeline turns a swatch's inline style into a generated class,
// so this names it for the dark mode rule in main.css to skip
const transformerColorHighlightClass = (): ShikiTransformer => ({
  name: 'color-highlight-class',
  span(hast, _line, _col, _lineElement, token) {
    if (token.bgColor) {
      this.addClassToHast(hast, 'shiki-color-highlight')
    }
  }
})

/**
 * A swatch on colour values, the glyph on icon names. Read by the content
 * pipeline (mdc.config.ts) and by the runtime parser (utils/markdown.ts), so
 * a code block is marked up the same wherever it was parsed.
 */
export const shikiTransformers = (): ShikiTransformer[] => [
  transformerColorHighlight() as ShikiTransformer,
  transformerIconHighlight(),
  transformerColorHighlightClass()
]
