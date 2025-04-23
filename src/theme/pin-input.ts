import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center gap-1.5',
    base: ['rounded-md border-0 placeholder:text-dimmed text-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors']
  },
  variants: {
    size: {
      xs: {
        base: 'size-6 text-xs'
      },
      sm: {
        base: 'size-7 text-xs'
      },
      md: {
        base: 'size-8 text-sm'
      },
      lg: {
        base: 'size-9 text-sm'
      },
      xl: {
        base: 'size-10 text-base'
      }
    },
    variant: {
      outline: 'text-highlighted bg-default ring ring-inset ring-accented',
      soft: 'text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50',
      subtle: 'text-highlighted bg-elevated ring ring-inset ring-accented',
      ghost: 'text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent',
      none: 'text-highlighted bg-transparent'
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    highlight: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted'
  }, {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-inverted'
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
