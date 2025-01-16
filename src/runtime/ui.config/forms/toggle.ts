export default {
  base: 'relative inline-flex flex-shrink-0 border-2 border-transparent disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none',
  rounded: 'rounded-full',
  ring: 'focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
  active: 'bg-{color}-500 dark:bg-{color}-400',
  inactive: 'bg-gray-200 dark:bg-gray-700',
  size: {
    '2xs': 'h-3 w-5',
    'xs': 'h-3.5 w-6',
    'sm': 'h-4 w-7',
    'md': 'h-5 w-9',
    'lg': 'h-6 w-11',
    'xl': 'h-7 w-[3.25rem]',
    '2xl': 'h-8 w-[3.75rem]'
  },
  container: {
    base: 'pointer-events-none relative inline-block rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200',
    active: {
      '2xs': 'translate-x-2 rtl:-translate-x-2',
      'xs': 'translate-x-2.5 rtl:-translate-x-2.5',
      'sm': 'translate-x-3 rtl:-translate-x-3',
      'md': 'translate-x-4 rtl:-translate-x-4',
      'lg': 'translate-x-5 rtl:-translate-x-5',
      'xl': 'translate-x-6 rtl:-translate-x-6',
      '2xl': 'translate-x-7 rtl:-translate-x-7'
    },
    inactive: 'translate-x-0 rtl:-translate-x-0',
    size: {
      '2xs': 'h-2 w-2',
      'xs': 'h-2.5 w-2.5',
      'sm': 'h-3 w-3',
      'md': 'h-4 w-4',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
      '2xl': 'h-7 w-7'
    }
  },
  icon: {
    base: 'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
    active: 'opacity-100 ease-in duration-200',
    inactive: 'opacity-0 ease-out duration-100',
    size: {
      '2xs': 'h-2 w-2',
      'xs': 'h-2 w-2',
      'sm': 'h-2 w-2',
      'md': 'h-3 w-3',
      'lg': 'h-4 w-4',
      'xl': 'h-5 w-5',
      '2xl': 'h-6 w-6'
    },
    on: 'text-{color}-500 dark:text-{color}-400',
    off: 'text-gray-400 dark:text-gray-500',
    loading: 'animate-spin text-{color}-500 dark:text-{color}-400'
  },
  default: {
    onIcon: null,
    offIcon: null,
    loadingIcon: 'i-heroicons-arrow-path-20-solid',
    color: 'primary',
    size: 'md'
  }
}
