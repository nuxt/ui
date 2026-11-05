export default {
  slots: {
    root: 'relative',
    item: ''
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'inline-flex items-center gap-1'
      },
      vertical: {
        root: 'flex flex-col gap-1'
      }
    }
  }
}
