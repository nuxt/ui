export default {
  slots: {
    root: 'relative bg-muted [&_pre]:max-h-[80vh] [&_pre]:pb-12',
    footer: 'h-16 absolute inset-x-px bottom-px rounded-b-md flex items-center justify-center',
    trigger: 'group',
    triggerIcon: 'group-data-[state=open]:rotate-180'
  },
  variants: {
    open: {
      false: {
        root: 'max-h-[200px] overflow-clip rounded-b-md border-b border-muted [&_pre]:overflow-hidden',
        footer: 'bg-linear-to-t from-muted'
      }
    }
  }
}
