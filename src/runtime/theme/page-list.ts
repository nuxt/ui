import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-col'
  },
  variants: {
    divide: {
      true: { root: '*:not-last:after:absolute *:not-last:after:inset-x-1 *:not-last:after:bottom-0 *:not-last:after:bg-border *:not-last:after:h-px' }
    }
  }
})
