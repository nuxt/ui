import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans uppercase'
  },
  variants: {
    color: colorVariant({ base: '' }),
    variant: {
      solid: {
        base: 'text-accent-contrast bg-accent'
      },
      outline: {
        base: 'ring ring-inset ring-accent-strong text-accent-default bg-default'
      },
      soft: {
        base: 'text-accent-default bg-accent-soft'
      },
      subtle: {
        base: 'text-accent-default ring ring-inset ring-accent-strong bg-accent-soft'
      }
    },
    size: {
      sm: { base: 'h-4 min-w-4 text-[0.625rem]' },
      md: { base: 'h-5 min-w-5 text-[0.6875rem]' },
      lg: { base: 'h-6 min-w-6 text-[0.75rem]' }
    }
  },
  defaultVariants: {
    variant: 'outline',
    color: 'neutral',
    size: 'md'
  }
})
