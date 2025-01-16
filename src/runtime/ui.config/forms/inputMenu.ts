import type { AvatarSize } from '../../types'
import { arrow } from '../popper'

export default {
  container: 'z-20 group',
  trigger: 'flex items-center w-full',
  width: 'w-full',
  height: 'max-h-60',
  base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
  background: 'bg-white dark:bg-gray-800',
  shadow: 'shadow-lg',
  rounded: 'rounded-md',
  padding: 'p-1',
  ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
  empty: 'text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5',
  option: {
    base: 'cursor-default select-none relative flex items-center justify-between gap-1',
    rounded: 'rounded-md',
    padding: 'px-1.5 py-1.5',
    size: 'text-sm',
    color: 'text-gray-900 dark:text-white',
    container: 'flex items-center gap-1.5 min-w-0',
    active: 'bg-gray-100 dark:bg-gray-900',
    inactive: '',
    selected: 'pe-7',
    disabled: 'cursor-not-allowed opacity-50',
    empty: 'text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5',
    icon: {
      base: 'flex-shrink-0 h-5 w-5',
      active: 'text-gray-900 dark:text-white',
      inactive: 'text-gray-400 dark:text-gray-500'
    },
    selectedIcon: {
      wrapper: 'absolute inset-y-0 end-0 flex items-center',
      padding: 'pe-2',
      base: 'h-5 w-5 text-gray-900 dark:text-white flex-shrink-0'
    },
    avatar: {
      base: 'flex-shrink-0',
      size: '2xs' as AvatarSize
    },
    chip: {
      base: 'flex-shrink-0 w-2 h-2 mx-1 rounded-full'
    }
  },
  // Syntax for `<Transition>` component https://vuejs.org/guide/built-ins/transition.html#css-based-transitions
  transition: {
    leaveActiveClass: 'transition ease-in duration-100',
    leaveFromClass: 'opacity-100',
    leaveToClass: 'opacity-0'
  },
  popper: {
    placement: 'bottom-end'
  },
  default: {
    selectedIcon: 'i-heroicons-check-20-solid',
    trailingIcon: 'i-heroicons-chevron-down-20-solid',
    empty: {
      label: 'No options.'
    },
    optionEmpty: {
      label: 'No results for "{query}".'
    }
  },
  arrow: {
    ...arrow,
    ring: 'before:ring-1 before:ring-gray-200 dark:before:ring-gray-700',
    background: 'before:bg-white dark:before:bg-gray-700'
  }
}
