import { colorVariant } from '../color'
import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block border border-accent-default bg-accent-tint text-accent-strong'
  },
  variants: {
    color: colorVariant({ base: '' })
  },
  defaultVariants: {
    color: 'neutral'
  }
})
