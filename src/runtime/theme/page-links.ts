import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex flex-col gap-3',
    title: 'text-sm font-semibold flex items-center gap-1.5',
    list: 'flex flex-col gap-2',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 rounded-sm outline-focus focus-visible:outline-3',
    linkLeadingIcon: 'size-5 shrink-0',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 absolute top-0 text-faint'
  },
  variants: {
    active: {
      true: {
        link: 'text-primary-strong font-medium'
      },
      false: {
        link: 'text-muted hover:text-default transition-colors'
      }
    }
  }
})
