import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 border border-default rounded-lg overflow-hidden',
    search: '',
    content: 'relative overflow-y-auto flex-1 max-h-96 p-1 focus:outline-none',
    empty: 'text-center text-muted',
    loading: 'flex items-center justify-center text-muted',
    loadingIcon: 'animate-spin shrink-0',
    item: ['group relative w-full flex items-center select-none outline-none data-disabled:cursor-not-allowed data-disabled:opacity-75 before:absolute before:z-[-1] before:inset-px before:rounded-md', 'text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
    itemLeadingIcon: ['shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors'],
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemLeadingChip: 'shrink-0',
    itemLeadingChipSize: '',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate text-highlighted',
    itemDescription: 'truncate text-muted',
    itemSelectedIcon: ['shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors']
  },
  variants: {
    size: {
      xs: {
        search: '[&>input]:h-8',
        empty: 'py-3 text-xs',
        loading: 'py-3',
        loadingIcon: 'size-4',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemWrapper: 'gap-1'
      },
      sm: {
        search: '[&>input]:h-9',
        empty: 'py-4 text-xs',
        loading: 'py-4',
        loadingIcon: 'size-4',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemWrapper: 'gap-1'
      },
      md: {
        search: '[&>input]:h-10',
        empty: 'py-6 text-sm',
        loading: 'py-6',
        loadingIcon: 'size-5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md'
      },
      lg: {
        search: '[&>input]:h-11',
        empty: 'py-7 text-sm',
        loading: 'py-7',
        loadingIcon: 'size-5',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md'
      },
      xl: {
        search: '[&>input]:h-12',
        empty: 'py-8 text-base',
        loading: 'py-8',
        loadingIcon: 'size-6',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemLeadingChip: 'size-6',
        itemLeadingChipSize: 'lg',
        itemDescription: 'text-sm'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 pointer-events-none'
      }
    }
  },
  defaultVariants: {
    size: 'md' as const
  }
})
