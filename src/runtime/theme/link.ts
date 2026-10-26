import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'outline-focus focus-visible:outline-(length:--ui-focus-width) rounded-md'
  },
  variants: {
    active: {
      true: { base: 'text-primary' },
      false: { base: 'text-muted' }
    },
    disabled: {
      true: { base: 'cursor-not-allowed opacity-(--ui-disabled-opacity)' }
    }
  },
  compoundVariants: [{
    active: false,
    disabled: false,
    class: { base: 'hover:text-default transition-colors' }
  }]
})
