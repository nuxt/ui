export default {
  slots: {
    root: 'relative',
    viewport: 'relative flex gap-4 p-4',
    item: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden',
        viewport: 'columns-xs flex-col',
        item: ''
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden',
        viewport: 'flex-row',
        item: 'w-max'
      }
    }
  }
}
