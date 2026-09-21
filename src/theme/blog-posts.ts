export default {
  slots: {
    root: 'flex flex-col gap-8 lg:gap-y-16'
  },
  variants: {
    orientation: {
      horizontal: { root: 'sm:grid sm:grid-cols-2 lg:grid-cols-3' },
      vertical: ''
    }
  }
}
