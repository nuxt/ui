import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center gap-1.5',
    base: 'rounded-md border-0 text-strong placeholder:text-faint text-center disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    separator: 'text-faint flex items-center justify-center'
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
      outline: { base: 'bg-default ring ring-inset ring-strong' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent' },
      none: { base: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ root: '' }),
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    }
  },
  compoundVariants: [{
    variant: ['outline', 'subtle'],
    class: { base: 'outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' }
  }, {
    variant: ['soft', 'ghost'],
    class: { base: 'outline-accent-focus focus-visible:outline-3' }
  }, {
    fixed: false,
    size: 'xs',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'sm',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'md',
    class: { base: 'md:text-sm' }
  }, {
    fixed: false,
    size: 'lg',
    class: { base: 'md:text-sm' }
  }]
})
