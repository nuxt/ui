import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    base: ['relative text-2xl text-highlighted font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-xl/7 [&>a>code]:font-bold', options.theme.transitions && '[&>a>code]:transition-colors'],
    leading: ['absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted', options.theme.transitions && 'transition'],
    leadingIcon: 'size-4 shrink-0',
    link: 'group lg:ps-2 lg:-ms-2'
  }
})
