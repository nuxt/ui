import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    base: ['inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700', options.transitions && 'transition-colors duration-200'],
    container: 'flex items-center',
    thumb: 'group pointer-events-none block rounded-full bg-white dark:bg-gray-900 shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 flex items-center justify-center',
    icon: ['absolute shrink-0 group-data-[state=unchecked]:text-gray-400 dark:group-data-[state=unchecked]:text-gray-500 opacity-0 size-10/12', options.transitions && 'transition-[color,opacity] duration-200'],
    wrapper: 'ms-2',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    description: 'text-gray-500 dark:text-gray-400'
  },
  variants: {
    color: {
      ...Object.fromEntries(options.colors.map((color: string) => [color, {
        base: `data-[state=checked]:bg-${color}-500 dark:data-[state=checked]:bg-${color}-400 focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`,
        icon: `group-data-[state=checked]:text-${color}-500 dark:group-data-[state=checked]:text-${color}-400`
      }])),
      gray: {
        base: 'data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white focus-visible:ring-gray-900 dark:focus-visible:ring-white',
        icon: 'group-data-[state=checked]:text-gray-900 dark:group-data-[state=checked]:text-white'
      }
    },
    size: {
      xs: {
        base: 'w-7',
        container: 'h-4',
        thumb: 'size-3 data-[state=checked]:translate-x-3',
        wrapper: 'text-xs'
      },
      sm: {
        base: 'w-8',
        container: 'h-4',
        thumb: 'size-3.5 data-[state=checked]:translate-x-3.5',
        wrapper: 'text-xs'
      },
      md: {
        base: 'w-9',
        container: 'h-5',
        thumb: 'size-4 data-[state=checked]:translate-x-4',
        wrapper: 'text-sm'
      },
      lg: {
        base: 'w-10',
        container: 'h-5',
        thumb: 'size-4.5 data-[state=checked]:translate-x-4.5',
        wrapper: 'text-sm'
      },
      xl: {
        base: 'w-11',
        container: 'h-6',
        thumb: 'size-5 data-[state=checked]:translate-x-5',
        wrapper: 'text-base'
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
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-error-500 dark:after:text-error-400'
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
    size: 'md'
  }
})
