export default {
  base: 'grid gap-x-4',
  style: {
    'grid-template-columns': 'max-content max-content max-content',
    'grid-auto-rows': 'min-content min-content'
  },
  padding: 'pb-8',
  item: 'contents',
  indicator: {
    color: 'bg-{color}-200 dark:bg-{color}-700',
    large: {
      base: 'grid place-items-center transition-colors',
      size: 'h-8 w-8',
      ring: '',
      rounded: 'rounded-full'
    },
    small: {
      base: 'mt-2',
      size: 'h-2 w-2',
      ring: '',
      rounded: 'rounded-full'
    }
  },
  title: {
    base: 'h-full flex items-center truncate',
    align: '',
    size: 'text-md',
    color: 'text-gray-900 dark:text-gray-50'
  },
  trailing: {
    base: 'h-full flex items-center truncate',
    align: 'justify-end',
    size: 'text-xs',
    color: 'text-gray-500 dark:text-gray-500'
  },
  separator: {
    wrapper: 'h-full w-full flex',
    container: 'w-full flex justify-center py-1',
    size: 'w-px',
    background: 'bg-gray-200 dark:bg-gray-700',
    withoutIndicators: '-mt-3 -mb-2'
  },
  description: {
    base: '',
    align: '',
    size: 'text-sm',
    color: 'text-gray-500 dark:text-gray-400'
  },
  default: {
    color: 'gray'
  }
}
