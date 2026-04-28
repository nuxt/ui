export default {
  slots: {
    root: 'relative [&_pre]:h-[200px] bg-muted',
    footer: 'h-16 absolute inset-x-px bottom-px rounded-b-md flex items-center justify-center',
    trigger: 'group',
    triggerIcon: 'group-data-[state=open]:rotate-180'
  },
  variants: {
    open: {
      true: {
        root: '[&_pre]:h-auto [&_pre]:min-h-[200px] [&_pre]:max-h-[80vh] [&_pre]:pb-12'
      },
      false: {
        root: '[&_pre]:overflow-hidden',
        footer: 'bg-linear-to-t from-muted'
      }
    }
  }
}
