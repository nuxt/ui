import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'outline-primary/25 focus-visible:outline-3 rounded-md'
  },
  variants: {
    active: {
      true: { base: 'text-primary' },
      false: { base: 'text-muted' }
    },
    disabled: {
      true: { base: 'cursor-not-allowed opacity-75' }
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: { base: 'hover:text-default transition-colors' }
  }]
})
