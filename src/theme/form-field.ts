export default {
  slots: {
    root: '',
    wrapper: '',
    labelWrapper: 'flex content-center items-center justify-between',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    container: 'mt-1 relative',
    description: 'text-gray-500 dark:text-gray-400',
    error: 'mt-2 text-error-500 dark:text-error-400',
    hint: 'text-gray-500 dark:text-gray-400',
    help: 'mt-2 text-gray-500 dark:text-gray-400'
  },
  variants: {
    size: {
      xs: { root: 'text-xs' },
      sm: { root: 'text-xs' },
      md: { root: 'text-sm' },
      lg: { root: 'text-sm' },
      xl: { root: 'text-base' }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error-500 dark:after:text-error-400`
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
