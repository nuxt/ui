import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'inline-flex items-center gap-0.5',
    star: 'relative inline-block cursor-pointer transition-colors select-none',
    starFilled: 'absolute inset-0 pointer-events-none',
    starHalf: 'absolute inset-0 pointer-events-none overflow-hidden'
  },
  variants: {
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
        starHalf: `text-${color}-500 dark:text-${color}-400`
      }])),
      neutral: {
        starFilled: 'text-gray-500 dark:text-gray-400',
        starHalf: 'text-gray-500 dark:text-gray-400'
      }
    },
    readonly: {
      true: {
        root: 'cursor-default',
        star: 'cursor-default'
      },
      false: {
        star: 'hover:scale-110'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed',
        star: 'cursor-not-allowed'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
