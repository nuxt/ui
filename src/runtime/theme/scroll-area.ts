import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative outline-focus focus-visible:outline-(length:--ui-focus-width)',
    viewport: 'relative flex',
    item: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden',
        viewport: 'flex-col',
        item: ''
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden',
        viewport: 'flex-row',
        item: ''
      }
    },
    externalScroll: {
      true: {
        root: 'overflow-visible'
      }
    }
  }
})
