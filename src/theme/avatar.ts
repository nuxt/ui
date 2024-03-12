export default {
  slots: {
    root: 'inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full align-middle bg-gray-50 dark:bg-gray-800',
    image: 'h-full w-full rounded-[inherit] object-cover',
    fallback: 'font-medium leading-none text-gray-500 dark:text-gray-400 truncate',
    icon: 'text-gray-500 dark:text-gray-400 shrink-0'
  },
  variants: {
    size: {
      '3xs': {
        root: 'size-4 text-[8px]',
        icon: 'size-2'
      },
      '2xs': {
        root: 'size-5 text-[10px]',
        icon: 'size-2.5'
      },
      xs: {
        root: 'size-6 text-xs',
        icon: 'size-3'
      },
      sm: {
        root: 'size-8 text-sm',
        icon: 'size-4'
      },
      md: {
        root: 'size-10 text-base',
        icon: 'size-5'
      },
      lg: {
        root: 'size-12 text-lg',
        icon: 'size-6'
      },
      xl: {
        root: 'size-14 text-xl',
        icon: 'size-7'
      },
      '2xl': {
        root: 'size-16 text-2xl',
        icon: 'size-8'
      },
      '3xl': {
        root: 'size-20 text-3xl',
        icon: 'size-10'
      }
    }
  },
  defaultVariants: {
    size: 'sm'
  }
}