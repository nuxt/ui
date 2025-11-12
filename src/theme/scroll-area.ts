export default {
  slots: {
    root: 'relative',
    viewport: 'relative gap-3 p-3',
    item: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden',
        viewport: 'columns-xs',
        item: 'mb-3'
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden',
        viewport: 'flex-row',
        item: 'w-max'
      }
    }
  }
}
