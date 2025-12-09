import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
    link: ['group block px-6 py-8 rounded-lg border border-default hover:bg-elevated/50 focus-visible:outline-primary', options.theme.transitions && 'transition-colors'],
    linkLeading: ['inline-flex items-center rounded-full p-1.5 bg-elevated group-hover:bg-primary/10 ring ring-accented mb-4 group-hover:ring-primary/50', options.theme.transitions && 'transition'],
    linkLeadingIcon: ['size-5 shrink-0 text-highlighted group-hover:text-primary', options.theme.transitions && 'transition-[color,translate]'],
    linkTitle: 'font-medium text-[15px] text-highlighted mb-1 truncate',
    linkDescription: 'text-sm text-muted line-clamp-2'
  },
  variants: {
    direction: {
      left: {
        linkLeadingIcon: [options.theme.transitions && 'group-active:-translate-x-0.5']
      },
      right: {
        link: 'text-right',
        linkLeadingIcon: [options.theme.transitions && 'group-active:translate-x-0.5']
      }
    }
  }
})
