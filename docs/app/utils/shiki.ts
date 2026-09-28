import type { ShikiTransformer } from '@shikijs/types'
import { defaultGetForegroundColor, transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

/**
 * A swatch on colour values, the glyph on icon names. Read by the content
 * pipeline (mdc.config.ts) and by the runtime parser (utils/markdown.ts), so
 * a code block is marked up the same wherever it was parsed.
 */
export const shikiTransformers = (): ShikiTransformer[] => [
  // A bare name is a Tailwind palette here (`primary: violet`), which the CSS
  // keyword of the same name doesn't match, so only literal values get a swatch
  transformerColorHighlight({ getForegroundColor: color => /^[a-z]+$/i.test(color) ? null : defaultGetForegroundColor(color) }) as ShikiTransformer,
  transformerIconHighlight()
]
