import { dualRange } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'

export type DualRangeSize = keyof typeof dualRange.size | ExtractDeepKey<AppConfig, ['ui', 'dualRange', 'size']>
