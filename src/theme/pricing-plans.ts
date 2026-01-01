export default {
  base: 'flex flex-col gap-y-8',
  variants: {
    orientation: {
      horizontal: 'lg:grid lg:grid-cols-[repeat(var(--count),minmax(0,1fr))]',
      vertical: ''
    },
    compact: {
      false: 'gap-x-8'
    },
    scale: {
      true: ''
    }
  },
  compoundVariants: [{
    compact: false,
    scale: true,
    class: 'lg:gap-x-13'
  }]
}
