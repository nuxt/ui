export default {
  slots: {
    root: 'inline-flex flex-row-reverse justify-end',
    base: 'relative rounded-full ring-[var(--ui-bg)] first:me-0'
  },
  variants: {
    size: {
      '3xs': {
        base: 'ring -me-0.5'
      },
      '2xs': {
        base: 'ring -me-0.5'
      },
      'xs': {
        base: 'ring -me-0.5'
      },
      'sm': {
        base: 'ring-2 -me-1.5'
      },
      'md': {
        base: 'ring-2 -me-1.5'
      },
      'lg': {
        base: 'ring-2 -me-1.5'
      },
      'xl': {
        base: 'ring-3 -me-2'
      },
      '2xl': {
        base: 'ring-3 -me-2'
      },
      '3xl': {
        base: 'ring-3 -me-2'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
