import type { AvatarSize } from '../../types'

export default {
  wrapper: {
    base: 'flex items-center align-center text-center',
    horizontal: 'w-full flex-row',
    vertical: 'flex-col'
  },
  container: {
    base: 'font-medium text-gray-700 dark:text-gray-200 flex',
    horizontal: 'mx-3 whitespace-nowrap',
    vertical: 'my-2'
  },
  border: {
    base: 'flex border-gray-200 dark:border-gray-800',
    horizontal: 'w-full',
    vertical: 'h-full',
    size: {
      horizontal: {
        '2xs': 'border-t',
        'xs': 'border-t-[2px]',
        'sm': 'border-t-[3px]',
        'md': 'border-t-[4px]',
        'lg': 'border-t-[5px]',
        'xl': 'border-t-[6px]'
      },
      vertical: {
        '2xs': 'border-s',
        'xs': 'border-s-[2px]',
        'sm': 'border-s-[3px]',
        'md': 'border-s-[4px]',
        'lg': 'border-s-[5px]',
        'xl': 'border-s-[6px]'
      }
    },
    type: {
      solid: 'border-solid',
      dotted: 'border-dotted',
      dashed: 'border-dashed'
    }
  },
  icon: {
    base: 'flex-shrink-0 w-5 h-5'
  },
  avatar: {
    base: 'flex-shrink-0',
    size: '2xs' as AvatarSize
  },
  label: 'text-sm',
  default: {
    size: '2xs',
    type: 'solid'
  }
}
