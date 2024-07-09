export default {
  base: 'inline-flex items-center justify-center px-1 rounded font-medium font-sans',
  variants: {
    variant: {
      solid: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
      outline: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring ring-inset ring-gray-300 dark:ring-gray-700',
      subtle: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 ring ring-inset ring-gray-300 dark:ring-gray-700'
    },
    size: {
      sm: 'h-4 min-w-[16px] text-[10px]',
      md: 'h-5 min-w-[20px] text-[11px]',
      lg: 'h-6 min-w-[24px] text-[12px]'
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md'
  }
}
