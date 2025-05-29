export default {
  slots: {
    root: 'space-x-1 flex items-center',
    icon: 'data-[state=active]:text-yellow-500'
  },

  variants: {
    orientation: {
      horizontal: {
        root: ''
      },
      vertical: {
        root: 'flex-col'
      }
    }
  },

  defaultVariants: {
    orientation: 'horizontal'
  }
}
