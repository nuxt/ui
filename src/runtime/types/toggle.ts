import { toggle } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'
import colors from '#ui-colors'

export type ToggleSize = keyof typeof toggle.size | ExtractDeepKey<AppConfig, ['ui', 'toggle', 'size']>
export type ToggleColor = typeof colors[number]
