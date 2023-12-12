import inputMenu from './inputMenu'

export default {
  ...inputMenu,
  select: 'inline-flex items-center text-left cursor-default',
  input: 'block w-[calc(100%+0.5rem)] focus:ring-transparent text-sm px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-0 border-b border-gray-200 dark:border-gray-700 focus:border-inherit sticky -top-1 -mt-1 mb-1 -mx-1 z-10 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none',
  required: 'absolute inset-0 w-px opacity-0 cursor-default',
  label: 'block truncate',
  option: {
    ...inputMenu.option,
    create: 'block truncate'
  },
  default: {
    selectedIcon: 'i-heroicons-check-20-solid',
    clearOnClose: false
  }
}
