export default {
  slots: {
    root: 'relative overflow-auto',
    viewport: 'relative',
    item: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden'
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden'
      }
    }
  }
}
