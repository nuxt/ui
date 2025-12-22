export default {
  slots: {
    root: 'focus:outline-none',
    base: 'flex items-stretch gap-1.5',
    group: 'flex items-center gap-0.5',
    separator: 'w-px self-stretch bg-border'
  },
  variants: {
    layout: {
      bubble: {
        base: 'bg-default border border-default rounded-lg p-1'
      },
      floating: {
        base: 'bg-default border border-default rounded-lg p-1'
      },
      fixed: {
        base: ''
      }
    }
  }
}
