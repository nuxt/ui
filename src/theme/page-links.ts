import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'flex flex-col gap-3',
    title: 'text-sm font-semibold flex items-center gap-1.5',
    list: 'flex flex-col gap-2',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 focus-visible:outline-primary',
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
