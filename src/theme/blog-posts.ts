export default {
  base: '',
  variants: {
    orientation: {
      horizontal: '',
      vertical: ''
    },
    virtualize: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      virtualize: false,
      class: 'flex flex-col gap-8 lg:gap-y-16 sm:grid sm:grid-cols-2 lg:grid-cols-3'
    },
    {
      orientation: 'vertical',
      virtualize: false,
      class: 'flex flex-col gap-8 lg:gap-y-16'
    }
  ],
  defaultVariants: {
    virtualize: false
  }
}
