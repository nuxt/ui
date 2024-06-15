import { alert } from '../ui.config'
import type { NestedKeyOf, ExtractDeepKey, ExtractDeepObject } from '.'
import type { Button } from './button'
import colors from '#ui-colors'
import type { AppConfig } from 'nuxt/schema'

export type AlertColor = keyof typeof alert.color | ExtractDeepKey<AppConfig, ['ui', 'alert', 'color']> | typeof colors[number]
export type AlertVariant = keyof typeof alert.variant | ExtractDeepKey<AppConfig, ['ui', 'alert', 'variant']> | NestedKeyOf<typeof alert.color> | NestedKeyOf<ExtractDeepObject<AppConfig, ['ui', 'alert', 'color']>>

export interface AlertAction extends Button {
  click?: Function
}
