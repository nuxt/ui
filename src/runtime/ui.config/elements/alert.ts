import type { AvatarSize, ButtonColor, ButtonSize, ButtonVariant } from '../../types'

export default {
  wrapper: 'w-full relative overflow-hidden',
  inner: 'w-0 flex-1',
  title: 'text-sm font-medium',
  description: 'mt-1 text-sm leading-4 opacity-90',
  actions: 'flex items-center gap-2 mt-3 flex-shrink-0',
  shadow: '',
  rounded: 'rounded-lg',
  padding: 'p-4',
  gap: 'gap-3',
  icon: {
    base: 'flex-shrink-0 w-5 h-5'
  },
  avatar: {
    base: 'flex-shrink-0 self-center',
    size: 'md' as AvatarSize
  },
  color: {
    white: {
      solid: 'text-gray-900 dark:text-white bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-800'
    }
  },
  variant: {
    solid: 'bg-{color}-500 dark:bg-{color}-400 text-white dark:text-gray-900',
    outline: 'text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400',
    soft: 'bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400',
    subtle: 'bg-{color}-50 dark:bg-{color}-400 dark:bg-opacity-10 text-{color}-500 dark:text-{color}-400 ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 ring-opacity-25 dark:ring-opacity-25'
  },
  default: {
    color: 'white',
    variant: 'solid',
    icon: null,
    closeButton: null,
    actionButton: {
      size: 'xs' as ButtonSize,
      color: 'primary' as ButtonColor,
      variant: 'link' as ButtonVariant
    }
  }
}
