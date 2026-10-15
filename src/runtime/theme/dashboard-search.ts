import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    modal: '',
    // The search keeps the larger text of a field on every breakpoint
    filter: '[--ui-control-text-step:0.125rem]'
  },
  variants: {
    fullscreen: {
      false: {
        modal: 'sm:max-w-3xl h-full sm:h-112'
      }
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {}
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
