import { kbd } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'

export type KbdSize = keyof typeof kbd.size | ExtractDeepKey<AppConfig, ['ui', 'kbd', 'size']>
