import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: '',
    list: '',
    item: 'relative',
    link: 'group text-sm flex items-center gap-1.5 py-1 focus-visible:outline-primary',
    linkLeading: 'rounded-md p-1 inline-flex ring-inset ring',
    linkLeadingIcon: 'size-4 shrink-0',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 absolute top-0 text-dimmed'
  },
  variants: {
    active: {
      true: {
        link: 'text-primary font-semibold',
        linkLeading: 'bg-primary ring-primary text-inverted'
      },
      false: {
        link: ['text-muted hover:text-default font-medium', options.theme.transitions && 'transition-colors'],
        linkLeading: ['bg-elevated/50 ring-accented text-dimmed group-hover:bg-primary group-hover:ring-primary group-hover:text-inverted', options.theme.transitions && 'transition']
      }
    }
  }
})
