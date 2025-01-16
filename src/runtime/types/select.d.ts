import type { AppConfig } from 'nuxt/schema'
import type { select } from '../ui.config'
import type { NestedKeyOf, ExtractDeepKey, ExtractDeepObject } from '.'
import type colors from '#ui-colors'

export type SelectSize = keyof typeof select.size | ExtractDeepKey<AppConfig, ['ui', 'select', 'size']>
export type SelectColor = keyof typeof select.color | ExtractDeepKey<AppConfig, ['ui', 'select', 'color']> | typeof colors[number]
export type SelectVariant = keyof typeof select.variant | ExtractDeepKey<AppConfig, ['ui', 'select', 'variant']> | NestedKeyOf<typeof select.color> | NestedKeyOf<ExtractDeepObject<AppConfig, ['ui', 'select', 'color']>>
