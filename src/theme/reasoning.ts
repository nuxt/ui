import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    trigger: ['flex w-full items-center gap-2 text-muted text-sm hover:text-default cursor-pointer disabled:cursor-default', options.theme.transitions && 'transition-colors'],
    triggerIcon: 'size-4 shrink-0',
    triggerChevron: ['size-4 shrink-0 data-[state=open]:rotate-180', options.theme.transitions && 'transition-transform duration-200'],
    content: '',
    body: 'mt-3 text-sm text-muted'
  }
})
