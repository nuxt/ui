import { range } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'

export type RangeSize = keyof typeof range.size | ExtractDeepKey<AppConfig, ['ui', 'range', 'size']>
