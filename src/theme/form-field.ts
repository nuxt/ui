export default {
  slots: {
    root: '',
    wrapper: '',
    labelWrapper: 'flex content-center items-center justify-between',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    container: 'mt-1 relative',
    description: 'text-gray-500 dark:text-gray-400',
    error: 'mt-2 text-red-500 dark:text-red-400',
    hint: 'text-gray-500 dark:text-gray-400',
    help: 'mt-2 text-gray-500 dark:text-gray-400'
  },
  variants: {
    size: {
      '2xs': { root: 'text-xs' },
      'xs': { root: 'text-xs' },
      'sm': { root: 'text-sm' },
      'md': { root: 'text-sm' },
      'lg': { root: 'text-base' },
      'xl': { root: 'text-base' }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-red-500 dark:after:text-red-400`
      }
    }
  },
  defaultVariants: {
    size: 'sm'
  }
}
