export default {
  slots: {
    root: 'relative',
    viewport: 'relative',
    item: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden'
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden grid grid-flow-col auto-cols-max',
        item: 'w-max'
      }
    }
  }
}
