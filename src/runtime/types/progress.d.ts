import type { progress } from '../ui.config'
import type colors from '#ui-colors'

export type ProgressSize = keyof typeof progress.progress.size
export type ProgressAnimation = keyof typeof progress.animation
export type ProgressColor = typeof colors[number]
