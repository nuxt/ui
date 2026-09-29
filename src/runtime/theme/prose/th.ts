import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'py-3 px-4 font-semibold text-sm border-e border-b first:border-s border-t border-muted'
  },
  variants: {
    align: {
      left: { base: 'text-start' },
      center: { base: 'text-center' },
      right: { base: 'text-end' }
    }
  },
  defaultVariants: {
    align: 'left'
  }
})
