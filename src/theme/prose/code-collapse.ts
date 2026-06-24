export default {
  slots: {
    root: 'relative my-5 bg-muted [&>div]:my-0 [&_pre]:max-h-[80vh] [&_pre]:pb-12',
    footer: 'h-16 absolute inset-x-px bottom-px rounded-b-md flex items-center justify-center',
    trigger: 'group',
    triggerIcon: 'group-data-[state=open]:rotate-180'
  },
  variants: {
    open: {
      true: {
        root: 'rounded-md'
      },
      false: {
        root: 'max-h-[200px] overflow-hidden rounded-b-md [&_pre]:overflow-hidden',
        footer: 'inset-x-0 bottom-0 border border-t-0 border-muted bg-linear-to-t from-muted'
      }
    }
  }
}
