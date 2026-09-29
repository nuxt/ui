import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'min-h-[calc(100vh-var(--ui-header-height))]'
  }
})
