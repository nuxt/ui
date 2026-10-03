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
      sm: { base: 'h-4 min-w-[16px] text-[10px]' },
      md: { base: 'h-5 min-w-[20px] text-[11px]' },
      lg: { base: 'h-6 min-w-[24px] text-[12px]' }
    }
  }
})
