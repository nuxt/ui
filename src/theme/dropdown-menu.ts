import { colorVariant, colors } from './color'

export default {
  slots: {
    content: 'min-w-32 max-h-(--reka-dropdown-menu-content-available-height) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col',
    input: 'border-b border-default',
    empty: 'text-center text-muted',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    arrow: 'fill-bg stroke-default',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-highlighted',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemTrailingKbdsSize: '',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemLabelExternalIcon: 'inline-block size-3 align-top text-dimmed'
  },
  variants: {
    color: colorVariant({ item: '', label: '' }),
    active: {
      true: {
        item: 'text-highlighted before:bg-elevated',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: 'text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50 transition-colors before:transition-colors',
        itemLeadingIcon: 'text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default transition-colors'
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
        empty: 'p-2 text-xs',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      sm: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        empty: 'p-2.5 text-xs',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      md: {
        label: 'p-1.5 text-sm gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        empty: 'p-2.5 text-sm',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'md'
      },
      lg: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-sm gap-2',
        empty: 'p-3 text-sm',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-1',
        itemTrailingKbdsSize: 'md'
      },
      xl: {
        label: 'p-2 text-base gap-2',
        item: 'p-2 text-base gap-2',
        empty: 'p-3 text-base',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemTrailingIcon: 'size-6',
        itemTrailingKbds: 'gap-1',
        itemTrailingKbdsSize: 'lg'
      }
    }
  },
  compoundVariants: [{
    color: [...colors],
    active: false,
    class: {
      item: 'text-accent-soft-foreground data-highlighted:text-accent data-highlighted:before:bg-accent-tint data-[state=open]:before:bg-accent-tint',
      itemLeadingIcon: 'text-accent-faint group-data-highlighted:text-accent-soft-foreground group-data-[state=open]:text-accent-soft-foreground'
    }
  }, {
    color: [...colors],
    active: true,
    class: {
      item: 'text-accent before:bg-accent-soft',
      itemLeadingIcon: 'text-accent-soft-foreground'
    }
  }],
  defaultVariants: {
    size: 'md'
  }
}
