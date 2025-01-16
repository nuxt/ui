import type { AppConfig } from 'nuxt/schema'
import type { formGroup } from '../ui.config'
import type { ExtractDeepKey } from '.'

export type FormGroupSize = keyof typeof formGroup.size | ExtractDeepKey<AppConfig, ['ui', 'formGroup', 'size']>
