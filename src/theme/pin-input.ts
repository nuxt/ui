import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-center gap-1.5',
    base: ['rounded-md placeholder:text-dimmed text-center outline-transparent disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors']
  },
  variants: {
    size: {
      xs: {
        base: 'size-6 text-sm/4'
      },
      sm: {
        base: 'size-7 text-sm/4'
      },
      md: {
        base: 'size-8 text-base/5'
      },
      lg: {
        base: 'size-9 text-base/5'
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
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, `focus-visible:outline-2 focus-visible:outline-${color}/25`])),
      neutral: 'focus-visible:outline-2 focus-visible:outline-primary/25'
    },
    highlight: {
      true: ''
    },
    fixed: {
      false: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: `ring ring-inset ring-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: false,
    class: `focus-visible:ring focus-visible:ring-inset focus-visible:ring-${color}/50`
  })), {
    color: 'neutral',
    highlight: true,
    class: 'ring ring-inset ring-inverted'
  }, {
    color: 'neutral',
    highlight: false,
    class: 'focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary/50'
  }, {
    fixed: false,
    size: 'xs',
    class: 'md:text-xs'
  }, {
    fixed: false,
    size: 'sm',
    class: 'md:text-xs'
  }, {
    fixed: false,
    size: 'md',
    class: 'md:text-sm'
  }, {
    fixed: false,
    size: 'lg',
    class: 'md:text-sm'
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
