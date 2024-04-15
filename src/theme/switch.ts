export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative flex items-start',
    base: 'peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700',
    container: 'flex items-center',
    thumb: 'group pointer-events-none block rounded-full bg-white dark:bg-gray-900 shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 flex items-center justify-center',
    icon: 'absolute shrink-0 group-data-[state=unchecked]:text-gray-400 dark:group-data-[state=unchecked]:text-gray-500 transition-[color,opacity] duration-200 opacity-0',
    wrapper: 'ms-2',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    description: 'text-gray-500 dark:text-gray-400'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [color, {
      base: `data-[state=checked]:bg-${color}-500 dark:data-[state=checked]:bg-${color}-400 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`,
      icon: `group-data-[state=checked]:text-${color}-500 dark:group-data-[state=checked]:text-${color}-400`
    }])),
    size: {
      '2xs': {
        base: 'h-3 w-5',
        container: 'h-4',
        thumb: 'size-2 data-[state=checked]:translate-x-2',
        wrapper: 'text-xs',
        icon: 'size-1'
      },
      'xs': {
        base: 'h-4 w-7',
        container: 'h-4',
        thumb: 'size-3 data-[state=checked]:translate-x-3',
        wrapper: 'text-xs',
        icon: 'size-2'
      },
      'sm': {
        base: 'h-5 w-9',
        container: 'h-5',
        thumb: 'size-4 data-[state=checked]:translate-x-4',
        wrapper: 'text-sm',
        icon: 'size-3'
      },
      'md': {
        base: 'h-6 w-11',
        container: 'h-5',
        thumb: 'size-5 data-[state=checked]:translate-x-5',
        wrapper: 'text-sm',
        icon: 'size-4'
      },
      'lg': {
        base: 'h-7 w-[52px]',
        container: 'h-6',
        thumb: 'size-6 data-[state=checked]:translate-x-6',
        wrapper: 'text-base',
        icon: 'size-5'
      },
      'xl': {
        base: 'h-8 w-[60px]',
        container: 'h-6',
        thumb: 'size-7 data-[state=checked]:translate-x-7',
        wrapper: 'text-base',
        icon: 'size-6'
      }
    },
    checked: {
      true: {
        icon: 'group-data-[state=checked]:opacity-100'
      }
    },
    unchecked: {
      true: {
        icon: 'group-data-[state=unchecked]:opacity-100'
      }
    },
    loading: {
      true: {
        icon: 'animate-spin'
      }
    },
    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-red-500 dark:after:text-red-400'
      }
    },
    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75',
        label: 'cursor-not-allowed opacity-75',
        description: 'cursor-not-allowed opacity-75'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm'
  }
})
