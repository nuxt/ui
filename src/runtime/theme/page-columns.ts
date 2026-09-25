import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative column-1 md:columns-2 lg:columns-3 gap-8 space-y-8 *:break-inside-avoid-column *:will-change-transform'
  }
})
