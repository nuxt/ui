export default {
  slots: {
    root: 'bg-default p-1 flex items-center gap-1.5 min-h-0',
    group: 'flex items-stretch gap-0.5 min-h-0',
    separator: 'w-px h-full bg-border'
  },
  variants: {
    variant: {
      bubble: {
        root: 'border border-default rounded-lg z-100'
      },
      floating: {
        root: 'border border-default rounded-lg z-100'
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
