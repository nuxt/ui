import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col gap-3',
    title: 'text-sm font-semibold flex items-center gap-1.5',
    list: 'flex flex-col gap-2',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 outline-transparent focus-visible:outline-2 focus-visible:outline-primary/25 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary/50',
    linkLeadingIcon: 'size-5 shrink-0',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 absolute top-0 text-dimmed'
  },
  variants: {
    active: {
      true: {
        link: 'text-primary font-medium'
      },
      false: {
        link: ['text-muted hover:text-default', options.theme.transitions && 'transition-colors']
      }
    }
  }
})
