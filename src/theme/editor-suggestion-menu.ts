import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    content: 'min-w-48 max-w-60 max-h-96 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-highlighted',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0 flex items-center justify-center',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemLabelExternalIcon: 'inline-block size-3 align-top text-dimmed'
  },
  variants: {
    size: {
      xs: {
        label: 'p-1 text-[10px]/3 gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4 text-sm',
        itemLeadingAvatarSize: '3xs'
      },
      sm: {
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4 text-sm',
        itemLeadingAvatarSize: '3xs'
      },
      md: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5 text-base',
        itemLeadingAvatarSize: '2xs'
      },
      lg: {
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5 text-base',
        itemLeadingAvatarSize: '2xs'
      },
      xl: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6 text-xl',
        itemLeadingAvatarSize: 'xs'
      }
    },
    active: {
      true: {
        item: 'text-highlighted before:bg-elevated/75',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: ['text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
        itemLeadingIcon: ['text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors']
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
