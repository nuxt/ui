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
      sm: { base: '[--ui-control-size:--spacing(4)] h-(--ui-control-size) min-w-[16px] text-[10px]' },
      md: { base: '[--ui-control-size:--spacing(5)] h-(--ui-control-size) min-w-[20px] text-[11px]' },
      lg: { base: '[--ui-control-size:--spacing(6)] h-(--ui-control-size) min-w-[24px] text-[12px]' }
    }
  },
  defaultVariants: {
    variant: 'outline',
    color: 'neutral',
    size: 'md'
  }
})
