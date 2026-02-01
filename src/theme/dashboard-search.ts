export default {
  slots: {
    modal: '',
    input: ''
  },
  variants: {
    fullscreen: {
      false: {
        modal: 'sm:max-w-3xl h-full sm:h-[28rem]'
      }
    },
    size: {
      xs: {
        input: '[&>input]:text-sm'
      },
      sm: {
        input: '[&>input]:text-sm'
      },
      md: {
        input: '[&>input]:text-base/5'
      },
      lg: {
        input: '[&>input]:text-base/5'
      },
      xl: {
        input: '[&>input]:text-lg'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
