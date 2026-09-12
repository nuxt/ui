import type { ShikiTransformer } from '@shikijs/types'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

/**
 * A swatch on colour values, the glyph on icon names. Read by the content
 * pipeline (mdc.config.ts) and by the runtime parser (utils/markdown.ts), so
 * a code block is marked up the same wherever it was parsed.
 */
export const shikiTransformers = (): ShikiTransformer[] => [
  transformerColorHighlight() as ShikiTransformer,
  transformerIconHighlight()
]
