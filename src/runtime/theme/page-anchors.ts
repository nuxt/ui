import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    // No `color` prop: the links take primary through the accent roles
    root: '[--ui-accent:var(--ui-primary)]',
    list: '',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 py-1 rounded-sm outline-accent-focus focus-visible:outline-3',
    linkLeading: 'rounded-md p-1 inline-flex ring-inset ring',
    linkLeadingIcon: 'size-4 shrink-0',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 absolute top-0 text-faint'
  },
  variants: {
    active: {
      true: {
        link: 'text-accent-default font-semibold',
        linkLeading: 'bg-accent ring-accent text-accent-contrast'
      },
      false: {
        link: 'text-muted hover:text-default font-medium transition-colors',
        linkLeading: 'bg-tint ring-strong text-faint group-hover:bg-accent group-hover:ring-accent group-hover:text-accent-contrast transition'
      }
    }
  }
})
