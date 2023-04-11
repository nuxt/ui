export default defineAppConfig({
  ui: {
    button: {
      rounded: 'rounded-md'
    },
    container: {
      constrained: 'max-w-2xl'
    },
    verticalNavigation: {
      wrapper: 'border-l u-border-gray-200 space-y-2',
      spacing: 'pl-4',
      base: 'group text-sm block border-l -ml-px',
      active: 'text-primary-500 dark:text-primary-400 border-current font-semibold',
      inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
    }
  }
})
