export default {
  slots: {
    modal: '',
    input: ''
  },
  variants: {
    fullscreen: {
      sm: {
        modal: 'sm:max-w-3xl h-full sm:h-[28rem]'
      },
      md: {
        modal: 'md:max-w-3xl h-full md:h-[28rem]'
      },
      lg: {
        modal: 'lg:max-w-3xl h-full lg:h-[28rem]'
      },
      false: {
        modal: 'sm:max-w-3xl h-full sm:h-[28rem]'
      }
    },
    size: {
      xs: {},
      sm: {},
      md: {},
      lg: {},
      xl: {}
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
