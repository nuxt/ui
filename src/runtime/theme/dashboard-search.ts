import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    modal: '',
    input: ''
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
