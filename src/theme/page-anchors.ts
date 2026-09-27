export default {
  slots: {
    // No `color` prop: the links take primary through the accent roles
    root: '[--ui-accent:var(--ui-primary)]',
    list: '',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 py-1 rounded-sm outline-accent-focus focus-visible:outline-3',
    linkLeading: 'rounded-md p-1 inline-flex ring-inset ring',
    linkLeadingIcon: 'size-4 shrink-0',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 absolute top-0 text-dimmed'
  },
  variants: {
    active: {
      true: {
        link: 'text-accent font-semibold',
        linkLeading: 'bg-accent ring-accent text-accent-foreground'
      },
      false: {
        link: 'text-muted hover:text-default font-medium transition-colors',
        linkLeading: 'bg-elevated/50 ring-accented text-dimmed group-hover:bg-accent group-hover:ring-accent group-hover:text-accent-foreground transition'
      }
    }
  }
}
