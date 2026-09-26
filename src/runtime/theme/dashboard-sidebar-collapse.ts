import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'hidden lg:flex'
  },
  variants: {
    side: {
      left: '',
      right: ''
    }
  }
})
