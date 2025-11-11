export default {
  slots: {
    root: '',
    base: 'bg-default p-1 flex items-stretch gap-1.5',
    group: 'flex items-center gap-0.5',
    separator: 'w-px self-stretch bg-border'
  },
  variants: {
    layout: {
      bubble: {
        base: 'border border-default rounded-lg'
      },
      floating: {
        base: 'border border-default rounded-lg'
      },
      fixed: {
        base: ''
      }
    }
  }
}
