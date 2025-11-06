export default {
  slots: {
    root: 'bg-default p-1 flex items-stretch gap-1.5',
    group: 'flex items-center gap-0.5',
    separator: 'w-px self-stretch bg-border'
  },
  variants: {
    variant: {
      bubble: {
        root: 'border border-default rounded-lg'
      },
      floating: {
        root: 'border border-default rounded-lg'
      },
      fixed: {
        root: ''
      }
    }
  },
  defaultVariants: {
    variant: 'fixed'
  }
}
