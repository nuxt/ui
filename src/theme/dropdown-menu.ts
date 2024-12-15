import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    content: 'min-w-32 bg-[var(--ui-bg)] shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-[var(--ui-border)] divide-y divide-[var(--ui-border)] overflow-y-auto scroll-py-1 data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    arrow: 'fill-[var(--ui-border)]',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-[var(--ui-text-highlighted)]',
    separator: '-mx-1 my-1 h-px bg-[var(--ui-border)]',
    item: 'group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-[calc(var(--ui-radius)*1.5)] data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemTrailingKbdsSize: '',
    itemLabel: 'truncate',
    itemLabelExternalIcon: 'inline-block size-3 align-top text-[var(--ui-text-dimmed)]'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    active: {
      true: {
        item: 'text-[var(--ui-text-highlighted)] before:bg-[var(--ui-bg-elevated)]',
        itemLeadingIcon: 'text-[var(--ui-text)]'
      },
      false: {
        item: ['text-[var(--ui-text)] data-highlighted:text-[var(--ui-text-highlighted)] data-[state=open]:text-[var(--ui-text-highlighted)] data-highlighted:before:bg-[var(--ui-bg-elevated)]/50 data-[state=open]:before:bg-[var(--ui-bg-elevated)]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
        itemLeadingIcon: ['text-[var(--ui-text-dimmed)] group-data-highlighted:text-[var(--ui-text)] group-data-[state=open]:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
      }
    },
    loading: {
      true: {
        itemLeadingIcon: 'animate-spin'
      }
    },
    size: {
      xs: {
        label: 'p-1 text-xs gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      sm: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      md: {
        label: 'p-1.5 text-sm gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'md'
      },
      lg: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-1',
        itemTrailingKbdsSize: 'md'
      },
      xl: {
        label: 'p-2 text-base gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemTrailingIcon: 'size-6',
        itemTrailingKbds: 'gap-1',
        itemTrailingKbdsSize: 'lg'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    active: false,
    class: {
      item: `text-[var(--ui-${color})] data-highlighted:text-[var(--ui-${color})] data-highlighted:before:bg-[var(--ui-${color})]/10 data-[state=open]:before:bg-[var(--ui-${color})]/10`,
      itemLeadingIcon: `text-[var(--ui-${color})]/75 group-data-highlighted:text-[var(--ui-${color})] group-data-[state=open]:text-[var(--ui-${color})]`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    active: true,
    class: {
      item: `text-[var(--ui-${color})] before:bg-[var(--ui-${color})]/10`,
      itemLeadingIcon: `text-[var(--ui-${color})]`
    }
  }))],
  defaultVariants: {
    size: 'md'
  }
})
