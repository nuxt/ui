import { arrow } from '../popper'
import inputMenu from './inputMenu'

export default {
  ...inputMenu,
  select: 'inline-flex items-center text-left cursor-default',
  input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-0 border-b border-gray-200 dark:border-gray-700 sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none',
  required: 'absolute inset-0 w-px opacity-0 cursor-default',
  label: 'block truncate',
  option: {
    ...inputMenu.option,
    create: 'block truncate'
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
    clearSearchOnClose: false,
    showCreateOptionWhen: 'empty',
    searchablePlaceholder: {
      label: 'Search...'
    },
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
