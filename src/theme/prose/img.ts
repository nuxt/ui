export default {
  slots: {
    base: 'rounded-md w-full',
    overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
    content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none p-4 sm:p-8'
  },
  variants: {
    zoom: {
      true: 'will-change-transform'
    },
    open: {
      true: ''
    }
  },
  compoundVariants: [{
    zoom: true,
    open: false,
    class: 'cursor-zoom-in'
  }]
}
