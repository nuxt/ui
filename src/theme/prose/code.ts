import { colorVariant } from '../color'

export default {
  slots: {
    base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border'
  },
  variants: {
    color: {
      ...colorVariant({ base: 'border-accent-border-soft bg-accent-soft text-accent-soft-foreground' }),
      // Neutral is the plain inline code, not a variant of the colored one.
      neutral: { base: 'border-muted text-highlighted bg-muted' }
    }
  },
  defaultVariants: {
    color: 'neutral'
  }
}
