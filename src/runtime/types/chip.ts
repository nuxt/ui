import { chip } from '../ui.config'
import colors from '#ui-colors'

export type ChipSize = keyof typeof chip.size
export type ChipColor = 'gray' | typeof colors[number]
export type ChipPosition = keyof typeof chip.position

export interface Chip {
  size?: ChipSize
  color?: ChipColor
  position?: ChipPosition
  text?: string
  inset?: boolean
  show?: boolean
}
