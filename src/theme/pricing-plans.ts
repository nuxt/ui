export default {
  slots: {
    base: 'flex flex-col gap-y-8'
  },
  variants: {
    orientation: {
      horizontal: { base: 'lg:grid lg:grid-cols-[repeat(var(--count),minmax(0,1fr))]' },
      vertical: ''
    },
    compact: {
      false: { base: 'gap-x-8' }
    },
    scale: {
      true: ''
    }
  },
  compoundVariants: [{
    compact: false,
    scale: true,
    class: { base: 'lg:gap-x-13' }
  }]
}
