import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: ['relative text-2xl text-highlighted font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))] [&>a]:rounded-sm [&>a]:outline-primary/25 [&>a]:focus-visible:outline-3 [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-xl/7 [&>a>code]:font-bold', options.theme.transitions && '[&>a>code]:transition-colors'],
    leading: ['absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated group-hover:text-primary group-focus:text-primary rounded-md hidden lg:flex text-muted', options.theme.transitions && 'transition'],
    leadingIcon: 'size-4 shrink-0',
    link: 'group lg:after:absolute lg:after:inset-y-0 lg:after:-inset-s-2 lg:after:w-2'
  }
})
