import { avatar } from '../ui.config'

export type AvatarSize = keyof typeof avatar.size
export type AvatarChipPosition = keyof typeof config.chip.position

export interface Avatar {
  src?: string | boolean
  alt?: string
  text?: string
  size?: AvatarSize
  chipColor?: string
  chipVariant?: string
  chipPosition?: AvatarChipPosition
}
