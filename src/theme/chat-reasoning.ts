import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    trigger: ['group flex w-full items-center gap-1.5 text-muted text-sm disabled:cursor-default disabled:hover:text-muted hover:text-default rounded-sm outline-primary/25 focus-visible:outline-3 min-w-0', options.theme.transitions && 'transition-colors'],
    leading: 'relative size-4 shrink-0',
    leadingIcon: 'size-4 shrink-0',
    chevronIcon: 'size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
    label: 'truncate',
    trailingIcon: 'size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
    content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] rounded-sm outline-primary/25 has-focus-visible:outline-3',
    body: 'max-h-[200px] pt-2 overflow-y-auto text-sm text-dimmed whitespace-pre-wrap focus:outline-none'
  },
  variants: {
    chevron: {
      leading: {
        leadingIcon: 'group-hover:opacity-0'
      },
      trailing: ''
    },
    alone: {
      false: {
        leadingIcon: ['absolute inset-0 group-data-[state=open]:opacity-0', options.theme.transitions && 'transition-opacity duration-200'],
        chevronIcon: ['absolute inset-0 opacity-0 group-hover:opacity-100 group-data-[state=open]:opacity-100', options.theme.transitions && 'transition-[rotate,opacity] duration-200']
      }
    }
  }
})
