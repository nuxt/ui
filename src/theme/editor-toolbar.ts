export default {
  slots: {
    root: 'flex items-stretch gap-1.5',
    menu: 'focus:outline-none',
    group: 'flex items-center gap-0.5',
    separator: 'w-px self-stretch bg-border'
  },
  variants: {
    layout: {
      bubble: {
        root: 'bg-default border border-default rounded-lg p-1'
      },
      floating: {
        root: 'bg-default border border-default rounded-lg p-1'
      },
      fixed: {
        root: ''
      }
    }
  }
}
