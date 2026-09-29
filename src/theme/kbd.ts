import { colorVariant } from './color'

export default {
  slots: {
    base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase'
  },
  variants: {
    color: colorVariant({ base: '' }),
    variant: {
      solid: {
        base: 'text-accent-foreground bg-accent'
      },
      outline: {
        base: 'ring ring-inset ring-accent-border text-accent-soft-foreground bg-accent-surface'
      },
      soft: {
        base: 'text-accent-soft-foreground bg-accent-soft'
      },
      subtle: {
        base: 'text-accent-soft-foreground ring ring-inset ring-accent-border-soft bg-accent-soft'
      }
    },
    size: {
      sm: { base: 'h-4 min-w-[16px] text-[10px]' },
      md: { base: 'h-5 min-w-[20px] text-[11px]' },
      lg: { base: 'h-6 min-w-[24px] text-[12px]' }
    }
  },
  defaultVariants: {
    variant: 'outline',
    color: 'neutral',
    size: 'md'
  }
}
