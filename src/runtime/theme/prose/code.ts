import { colorVariant } from '../color'
import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border'
  },
  variants: {
    color: {
      ...colorVariant({ base: 'border-accent-soft bg-accent-tint text-accent' }),
      // Neutral sets no `--ui-accent` scope, so inline code inside a colored
      // Callout keeps the Callout's color through its `[&_code]` classes.
      neutral: { base: 'border-default dark:border-strong text-strong bg-tint' }
    }
  },
  defaultVariants: {
    color: 'neutral'
  }
})
