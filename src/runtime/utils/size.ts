import type { AvatarProps, ChipProps, KbdProps } from '../types'

const avatarSizes = { xs: '3xs', sm: '3xs', md: '2xs', lg: '2xs', xl: 'xs' } as const
const itemSizes = { xs: 'sm', sm: 'sm', md: 'md', lg: 'md', xl: 'lg' } as const

/**
 * The size of the avatar a component renders next to its label, for the
 * component's own size. `avatar.size` on the component overrides it.
 */
export function getAvatarSize(size?: string): AvatarProps['size'] {
  return avatarSizes[size as keyof typeof avatarSizes] ?? avatarSizes.md
}

/**
 * The size of the chips and kbds a component renders in its items, for the
 * component's own size. `chip.size` or a kbd's `size` on the item overrides it.
 */
export function getItemSize(size?: string): ChipProps['size'] & KbdProps['size'] {
  return itemSizes[size as keyof typeof itemSizes] ?? itemSizes.md
}
