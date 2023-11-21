import { toggle } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'

export type ToggleSize = keyof typeof toggle.size | ExtractDeepKey<AppConfig, ['ui', 'toggle', 'size']>
