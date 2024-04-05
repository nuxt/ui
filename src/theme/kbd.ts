export default {
  base: 'inline-flex items-center justify-center px-1 rounded font-medium font-sans',
  variants: {
    color: {
      white: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700',
      gray: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 ring ring-inset ring-gray-300 dark:ring-gray-700',
      black: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
    },
    size: {
      xs: 'h-4 min-w-[16px] text-[10px]',
      sm: 'h-5 min-w-[20px] text-[11px]',
      md: 'h-6 min-w-[24px] text-[12px]'
    }
  },
  defaultVariants: {
    color: 'white',
    size: 'sm'
  }
}
