import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: '',
    label: '',
    trailing: 'hidden lg:flex items-center gap-0.5 ms-auto'
  },
  variants: {
    collapsed: {
      true: {
        label: 'hidden',
        trailing: 'lg:hidden'
      }
    }
  }
})
