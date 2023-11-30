export default {
  wrapper: {
    base: 'flex items-center align-center text-center w-full',
    horizontal: 'flex-row',
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
      horizontal: 'border-t',
      vertical: 'border-s'
    }
  },
  icon: {
    base: 'flex-shrink-0 w-5 h-5'
  },
  avatar: {
    base: 'flex-shrink-0',
    size: '2xs' as const
  },
  label: 'text-sm'
}
