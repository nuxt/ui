import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    base: 'shrink-0 flex items-center justify-center rounded text-white dark:text-gray-900 ring ring-inset ring-gray-300 dark:ring-gray-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
    container: 'flex items-center',
    wrapper: 'ms-2',
    icon: 'shrink-0 size-full',
    label: 'block font-medium text-gray-700 dark:text-gray-200',
    description: 'text-gray-500 dark:text-gray-400'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, `focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`])),
      gray: 'focus-visible:outline-gray-900 dark:focus-visible:outline-white'
    },
    size: {
      xs: {
        base: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      sm: {
        base: 'size-3.5',
        container: 'h-4',
        wrapper: 'text-xs'
      },
      md: {
        base: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      lg: {
        base: 'size-4.5',
        container: 'h-5',
        wrapper: 'text-sm'
      },
      xl: {
        base: 'size-5',
        container: 'h-6',
        wrapper: 'text-base'
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
    },
    checked: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    checked: true,
    class: `ring-2 ring-${color}-500 dark:ring-${color}-400 bg-${color}-500 dark:bg-${color}-400`
  })), {
    color: 'gray',
    checked: true,
    class: 'ring-2 ring-gray-900 dark:ring-white bg-gray-900 dark:bg-white'
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
