import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 divide-y divide-default',
    input: '',
    close: '',
    back: 'p-0',
    content: 'relative overflow-hidden flex flex-col',
    footer: 'p-1',
    viewport: 'relative scroll-py-1 overflow-y-auto flex-1 focus:outline-none',
    group: 'p-1 isolate',
    empty: 'text-center text-muted',
    label: 'font-semibold text-highlighted',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemLeadingChip: 'shrink-0',
    itemLeadingChipSize: '',
    itemTrailing: 'ms-auto inline-flex items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingHighlightedIcon: 'shrink-0 text-dimmed hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemTrailingKbdsSize: '',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate space-x-1 text-dimmed',
    itemDescription: 'truncate text-muted',
    itemLabelBase: 'text-highlighted [&>mark]:text-inverted [&>mark]:bg-primary',
    itemLabelPrefix: 'text-default',
    itemLabelSuffix: 'text-dimmed [&>mark]:text-inverted [&>mark]:bg-primary'
  },
  variants: {
    virtualize: {
      true: {
        viewport: 'p-1 isolate'
      },
      false: {
        viewport: 'divide-y divide-default'
      }
    },
    size: {
      xs: {
        input: '[&>input]:h-10',
        empty: 'py-3 text-xs',
        label: 'p-1 text-[10px]/3 gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailing: 'gap-1',
        itemTrailingIcon: 'size-4',
        itemTrailingHighlightedIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      sm: {
        input: '[&>input]:h-11',
        empty: 'py-4 text-xs',
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailing: 'gap-1.5',
        itemTrailingIcon: 'size-4',
        itemTrailingHighlightedIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'sm'
      },
      md: {
        input: '[&>input]:h-12',
        empty: 'py-6 text-sm',
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailing: 'gap-1.5',
        itemTrailingIcon: 'size-5',
        itemTrailingHighlightedIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'md'
      },
      lg: {
        input: '[&>input]:h-13',
        empty: 'py-7 text-sm',
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailing: 'gap-2',
        itemTrailingIcon: 'size-5',
        itemTrailingHighlightedIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'md'
      },
      xl: {
        input: '[&>input]:h-14',
        empty: 'py-8 text-base',
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemLeadingChip: 'size-6',
        itemLeadingChipSize: 'lg',
        itemTrailing: 'gap-2',
        itemTrailingIcon: 'size-6',
        itemTrailingHighlightedIcon: 'size-6',
        itemTrailingKbds: 'gap-0.5',
        itemTrailingKbdsSize: 'lg'
      }
    },
    active: {
      true: {
        item: 'text-highlighted before:bg-elevated',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: ['text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
        itemLeadingIcon: ['text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors']
      }
    },
    loading: {
      true: {
        itemLeadingIcon: 'animate-spin'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
