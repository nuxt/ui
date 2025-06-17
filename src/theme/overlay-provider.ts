export default {
  slots: {
    base: ''
  },
  variants: {
    stacked: {
      true: {
        base: 'origin-top transition-transform duration-200 [--overlay-value:calc(var(--overlay-count)-var(--overlay-index)-1)] scale-[calc(1-0.05*var(--overlay-value))] transform-[translateY(calc(-1.25rem*var(--overlay-value)))]'
      }
    }
  }
}
