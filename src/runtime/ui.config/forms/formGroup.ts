export default {
  wrapper: '',
  inner: '',
  label: {
    wrapper: 'flex content-center items-center justify-between',
    base: 'block font-medium text-gray-700 dark:text-gray-200',
    required: `after:content-['*'] after:ms-0.5 after:text-red-500 dark:after:text-red-400`
  },
  size: {
    '2xs': 'text-xs',
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-sm',
    'lg': 'text-sm',
    'xl': 'text-base'
  },
  container: 'mt-1 relative',
  description: 'text-gray-500 dark:text-gray-400',
  hint: 'text-gray-500 dark:text-gray-400',
  help: 'mt-2 text-gray-500 dark:text-gray-400',
  error: 'mt-2 text-red-500 dark:text-red-400',
  default: {
    size: 'sm'
  }
}
