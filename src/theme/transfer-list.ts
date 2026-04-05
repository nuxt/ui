import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-stretch gap-4',
    sourceList: 'flex flex-col min-h-0 min-w-0 flex-1 border border-default rounded-lg overflow-hidden',
    targetList: 'flex flex-col min-h-0 min-w-0 flex-1 border border-default rounded-lg overflow-hidden',
    listHeader: 'flex items-center justify-between border-b border-default bg-elevated/50 font-medium text-highlighted',
    listTitle: 'truncate',
    listCount: 'text-muted',
    listSearch: '',
    listContent: 'relative overflow-y-auto flex-1 max-h-96 p-1 focus:outline-none',
    listEmpty: 'text-center text-muted',
    listLoading: 'flex items-center justify-center text-muted',
    listLoadingIcon: 'animate-spin shrink-0',
    controls: 'flex flex-col items-center justify-center gap-1',
    controlButton: '',
    item: ['group relative w-full flex items-center select-none outline-none data-disabled:cursor-not-allowed data-disabled:opacity-75 before:absolute before:z-[-1] before:inset-px before:rounded-md', 'text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
    itemLeadingIcon: ['shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors'],
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemLeadingChip: 'shrink-0',
    itemLeadingChipSize: '',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate text-highlighted',
    itemDescription: 'truncate text-muted'
  },
  variants: {
    size: {
      xs: {
        listHeader: 'px-2 py-1 text-xs',
        listSearch: '[&>input]:h-8',
        listEmpty: 'py-3 text-xs',
        listLoading: 'py-3',
        listLoadingIcon: 'size-4',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemWrapper: 'gap-1'
      },
      sm: {
        listHeader: 'px-2.5 py-1.5 text-xs',
        listSearch: '[&>input]:h-9',
        listEmpty: 'py-4 text-xs',
        listLoading: 'py-4',
        listLoadingIcon: 'size-4',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemWrapper: 'gap-1'
      },
      md: {
        listHeader: 'px-3 py-2 text-sm',
        listSearch: '[&>input]:h-10',
        listEmpty: 'py-6 text-sm',
        listLoading: 'py-6',
        listLoadingIcon: 'size-5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md'
      },
      lg: {
        listHeader: 'px-3.5 py-2.5 text-sm',
        listSearch: '[&>input]:h-11',
        listEmpty: 'py-7 text-sm',
        listLoading: 'py-7',
        listLoadingIcon: 'size-5',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md'
      },
      xl: {
        listHeader: 'px-4 py-3 text-base',
        listSearch: '[&>input]:h-12',
        listEmpty: 'py-8 text-base',
        listLoading: 'py-8',
        listLoadingIcon: 'size-6',
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
