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
        base: 'size-[calc(var(--ui-control-py-xs)*2+var(--ui-control-text-xs--line-height))] text-[calc(var(--ui-control-text-xs)+var(--ui-control-text-step,0px))]/(--ui-control-text-xs--line-height)'
      },
      sm: {
        base: 'size-[calc(var(--ui-control-py-sm)*2+var(--ui-control-text-sm--line-height))] text-[calc(var(--ui-control-text-sm)+var(--ui-control-text-step,0px))]/(--ui-control-text-sm--line-height)'
      },
      md: {
        base: 'size-[calc(var(--ui-control-py-md)*2+var(--ui-control-text-md--line-height))] text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/(--ui-control-text-md--line-height)'
      },
      lg: {
        base: 'size-[calc(var(--ui-control-py-lg)*2+var(--ui-control-text-lg--line-height))] text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/(--ui-control-text-lg--line-height)'
      },
      xl: {
        base: 'size-[calc(var(--ui-control-py-xl)*2+var(--ui-control-text-xl--line-height))] text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)'
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
