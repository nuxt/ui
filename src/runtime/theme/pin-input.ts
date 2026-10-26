import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center gap-1.5',
    base: 'rounded-md border-0 text-strong placeholder:text-faint text-center disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity) transition-colors',
    separator: 'text-faint flex items-center justify-center'
  },
  variants: {
    size: {
      xs: {
        base: 'size-6 text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4'
      },
      sm: {
        base: 'size-7 text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4'
      },
      md: {
        base: 'size-8 text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5'
      },
      lg: {
        base: 'size-9 text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5'
      },
      xl: {
        base: 'size-10 text-base'
      }
    },
    variant: {
      outline: { base: 'bg-default ring ring-inset ring-strong outline-accent-focus focus-visible:outline-(length:--ui-focus-width) focus-visible:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint outline-accent-focus focus-visible:outline-(length:--ui-focus-width)' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong outline-accent-focus focus-visible:outline-(length:--ui-focus-width) focus-visible:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus focus-visible:outline-(length:--ui-focus-width)' },
      none: { base: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ root: '' }),
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
