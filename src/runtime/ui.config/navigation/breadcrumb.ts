export default {
  wrapper: 'relative min-w-0',
  ol: 'flex items-center gap-x-1.5',
  li: 'flex items-center gap-x-1.5 text-gray-500 dark:text-gray-400 text-sm leading-6 min-w-0',
  base: 'flex items-center gap-x-1.5 group font-semibold min-w-0',
  label: 'block truncate',
  icon: {
    base: 'flex-shrink-0 w-5 h-5',
    active: '',
    inactive: ''
  },
  divider: {
    base: 'flex-shrink-0 w-5 h-5 rtl:rotate-180'
  },
  active: 'text-primary-500 dark:text-primary-400',
  inactive: ' hover:text-gray-700 dark:hover:text-gray-200',
  default: {
    divider: 'i-heroicons-chevron-right-20-solid'
  }
}
