export default {
  slots: {
    base: 'relative flex flex-col'
  },
  variants: {
    divide: {
      true: { base: '*:not-last:after:absolute *:not-last:after:inset-x-1 *:not-last:after:bottom-0 *:not-last:after:bg-border *:not-last:after:h-px' }
    }
  }
}
