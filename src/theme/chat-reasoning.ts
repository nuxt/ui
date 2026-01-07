import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    trigger: ['group flex w-full items-center gap-2 text-muted text-sm hover:text-default cursor-pointer disabled:cursor-default disabled:hover:text-muted', options.theme.transitions && 'transition-colors'],
    leadingIcon: 'size-4 shrink-0',
    trailingIcon: ['size-4 shrink-0 group-data-[state=open]:rotate-180', options.theme.transitions && 'transition-transform duration-200'],
    content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden',
    body: 'pt-2 text-sm text-muted'
  }
})
