import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    star: 'relative inline-block cursor-pointer transition-colors select-none focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900 rounded-sm',
    indicator: 'absolute inset-0 overflow-hidden w-[var(--reka-rating-item-step-width)] opacity-[var(--reka-rating-item-step-opacity)] z-[var(--reka-rating-item-step-z-index)]',
    icon: 'block',
    emptyIcon: 'w-full h-full text-muted pointer-events-none'
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
        star: 'size-3',
        icon: 'size-3'
      },
      sm: {
        star: 'size-4',
        icon: 'size-4'
      },
      md: {
        star: 'size-5',
        icon: 'size-5'
      },
      lg: {
        star: 'size-6',
        icon: 'size-6'
      },
      xl: {
        star: 'size-7',
        icon: 'size-7'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `data-[state=active]:text-${color}-500 dark:data-[state=active]:text-${color}-400`,
        star: `focus-within:ring-${color}-500 dark:focus-within:ring-${color}-400`
      }])),
      neutral: {
        indicator: 'data-[state=active]:text-gray-500 dark:data-[state=active]:text-gray-400',
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
