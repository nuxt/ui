export default (config: { colors: string[] }) => ({
  slots: {
    root: 'peer inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-75 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700',
    thumb: 'group pointer-events-none block rounded-full bg-white dark:bg-gray-900 shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 flex items-center justify-center',
    icon: 'absolute shrink-0 group-data-[state=unchecked]:text-gray-400 dark:group-data-[state=unchecked]:text-gray-500 transition-[color,opacity] duration-200 opacity-0'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [color, {
      root: `data-[state=checked]:bg-${color}-500 dark:data-[state=checked]:bg-${color}-400 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`,
      icon: `group-data-[state=checked]:text-${color}-500 dark:group-data-[state=checked]:text-${color}-400`
    }])),
    size: {
      '2xs': {
        root: 'h-3 w-5',
        thumb: 'size-2 data-[state=checked]:translate-x-2',
        icon: 'size-1'
      },
      'xs': {
        root: 'h-4 w-7',
        thumb: 'size-3 data-[state=checked]:translate-x-3',
        icon: 'size-2'
      },
      'sm': {
        root: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4',
        icon: 'size-3'
      },
      'md': {
        root: 'h-6 w-11',
        thumb: 'size-5 data-[state=checked]:translate-x-5',
        icon: 'size-4'
      },
      'lg': {
        root: 'h-7 w-[52px]',
        thumb: 'size-6 data-[state=checked]:translate-x-6',
        icon: 'size-5'
      },
      'xl': {
        root: 'h-8 w-[60px]',
        thumb: 'size-7 data-[state=checked]:translate-x-7',
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
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm'
  }
})
