export default {
  base: 'focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400',
  variants: {
    active: {
      true: 'text-primary-500 dark:text-primary-400',
      false: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75'
    }
  }
}
