import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex flex-col gap-y-8'
  },
  variants: {
    orientation: {
      horizontal: { root: 'lg:grid lg:grid-cols-[repeat(var(--count),minmax(0,1fr))]' },
      vertical: ''
    },
    compact: {
      false: { root: 'gap-x-8' }
    },
    scale: {
      true: ''
    }
  },
  compoundVariants: [{
    compact: false,
    scale: true,
    class: { root: 'lg:gap-x-13' }
  }]
})
