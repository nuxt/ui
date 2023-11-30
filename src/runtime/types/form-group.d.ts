import { formGroup } from '../ui.config'
import type { ExtractDeepKey } from '.'
import type { AppConfig } from 'nuxt/schema'

export type FormGroupSize = keyof typeof formGroup.size | ExtractDeepKey<AppConfig, ['ui', 'formGroup', 'size']>
