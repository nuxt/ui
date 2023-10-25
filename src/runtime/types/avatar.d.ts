import { avatar } from '../ui.config'
import colors from '#ui-colors'

export type AvatarSize = keyof typeof avatar.size
export type AvatarChipColor = 'gray' | typeof colors[number]
export type AvatarChipPosition = keyof typeof avatar.chip.position

export interface Avatar {
  src?: string | boolean
  alt?: string
  text?: string
  size?: AvatarSize
  chipColor?: AvatarChipColor
  chipPosition?: AvatarChipPosition
}
