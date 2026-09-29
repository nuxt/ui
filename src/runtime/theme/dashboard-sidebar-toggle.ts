import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'lg:hidden'
  },
  variants: {
    side: {
      left: '',
      right: ''
    }
  }
})
