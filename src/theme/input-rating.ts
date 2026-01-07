import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    star: 'relative inline-block cursor-pointer transition-colors select-none focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900 rounded-sm',
    starFilled: 'absolute inset-0 pointer-events-none',
    starHalf: 'absolute inset-0 pointer-events-none overflow-hidden [clip-path:polygon(0_0,50%_0,50%_100%,0_100%)] [-webkit-clip-path:polygon(0_0,50%_0,50%_100%,0_100%)]',
    icon: 'w-full h-full'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'inline-flex items-center gap-0.5'
      },
      vertical: {
        root: 'inline-flex flex-col items-center gap-0.5'
      }
    },
    size: {
      xs: {
        star: 'size-3'
      },
      sm: {
        star: 'size-4'
      },
      md: {
        star: 'size-5'
      },
      lg: {
        star: 'size-6'
      },
      xl: {
        star: 'size-7'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        starFilled: `text-${color}-500 dark:text-${color}-400`,
        starHalf: `text-${color}-500 dark:text-${color}-400`,
        star: `focus-within:ring-${color}-500 dark:focus-within:ring-${color}-400`
      }])),
      neutral: {
        starFilled: 'text-gray-500 dark:text-gray-400',
        starHalf: 'text-gray-500 dark:text-gray-400',
        star: 'focus-within:ring-gray-500 dark:focus-within:ring-gray-400'
      }
    },
    readonly: {
      true: {
        root: 'cursor-default',
        star: 'cursor-default'
      },
      false: {}
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed',
        star: 'cursor-not-allowed pointer-events-none'
      },
      false: {
        star: 'hover:scale-110'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    orientation: 'horizontal'
  }
})
