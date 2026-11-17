import type { AvatarProps, BadgeProps, ChipProps, KbdProps } from '../types'

const avatarSizes = { xs: '4xs', sm: '4xs', md: '3xs', lg: '3xs', xl: '2xs' } as const
const itemSizes = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'md' } as const
const badgeSizes = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'sm' } as const

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

/**
 * The size of the badge a component renders next to its label, for the
 * component's own size. No taller than the line of the size, so it doesn't grow the control. A `size` on the badge overrides it.
 * @internal
 */
export function getBadgeSize(size?: string): BadgeProps['size'] {
  return badgeSizes[size as keyof typeof badgeSizes] ?? badgeSizes.md
}
