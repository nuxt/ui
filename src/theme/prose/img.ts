export default {
  slots: {
    base: 'rounded-md',
    overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
    content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none',
    zoomedImage: 'w-full h-auto max-w-[95vw] max-h-[95vh] object-contain rounded-md'
  },
  variants: {
    zoom: {
      true: 'will-change-transform'
    },
    open: {
      true: ''
    },
    width: {
      false: 'w-full'
    }
  },
  compoundVariants: [{
    zoom: true,
    open: false,
    class: 'cursor-zoom-in'
  }]
}
