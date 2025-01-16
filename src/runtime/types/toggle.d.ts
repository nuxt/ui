import type { AppConfig } from 'nuxt/schema'
import type { toggle } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type colors from '#ui-colors'

export type ToggleSize = keyof typeof toggle.size | ExtractDeepKey<AppConfig, ['ui', 'toggle', 'size']>
export type ToggleColor = typeof colors[number]
