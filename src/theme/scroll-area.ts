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
        viewport: 'columns-xs inline-flex flex-col',
        item: ''
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden',
        viewport: 'inline-flex flex-row',
        item: 'w-max'
      }
    }
  }
}
