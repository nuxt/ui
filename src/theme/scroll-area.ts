export default {
  slots: {
    root: 'relative outline-primary/25 focus-visible:outline-3',
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
    }
  }
}
