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
    },
    fieldGroup: {
      horizontal: {
        root: 'gap-0 -space-x-px'
      },
      vertical: {
        root: 'gap-0 -space-y-px'
      }
    }
  }
}
