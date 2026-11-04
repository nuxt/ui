import type { AvatarProps, ChipProps, KbdProps } from '../types'

const avatarSizes = { xs: '3xs', sm: '3xs', md: '3xs', lg: '3xs', xl: '2xs' } as const
const itemSizes = { xs: 'sm', sm: 'sm', md: 'sm', lg: 'sm', xl: 'md' } as const

/**
 * The size of the avatar a component renders next to its label, for the
 * component's own size. As tall as the line of the size, so it doesn't grow the control. `avatar.size` on the component overrides it.
 * @internal
 */
export function getAvatarSize(size?: string): AvatarProps['size'] {
  return avatarSizes[size as keyof typeof avatarSizes] ?? avatarSizes.md
}

/**
 * The size of the chips and kbds a component renders in its items, for the
 * component's own size. A kbd is as tall as the line of the size. `chip.size` or a kbd's `size` on the item overrides it.
 * @internal
 */
export function getItemSize(size?: string): ChipProps['size'] & KbdProps['size'] {
  return itemSizes[size as keyof typeof itemSizes] ?? itemSizes.md
}
