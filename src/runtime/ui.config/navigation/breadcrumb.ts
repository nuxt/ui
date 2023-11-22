export default {
  wrapper: 'relative',
  ol: 'flex items-center gap-x-1.5',
  li: 'flex items-center gap-x-1.5 text-gray-500 dark:text-gray-400 text-sm',
  base: 'flex items-center gap-x-1.5 group font-semibold',
  icon: {
    base: 'flex-shrink-0 w-4 h-4',
    active: '',
    inactive: ''
  },
  divider: {
    base: 'flex-shrink-0 w-5 h-5'
  },
  active: 'text-primary-500 dark:text-primary-400',
  inactive: ' hover:text-gray-700 dark:hover:text-gray-200',
  default: {
    divider: 'i-heroicons-chevron-right-20-solid'
  }
}
