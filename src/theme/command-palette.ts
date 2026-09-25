export default {
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
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingHighlightedIcon: 'shrink-0 text-dimmed hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate space-x-1 text-dimmed',
    itemLabelBase: 'text-highlighted [&>mark]:text-primary [&>mark]:bg-primary/15',
    itemLabelPrefix: 'text-default',
    itemLabelSuffix: 'text-dimmed [&>mark]:text-primary [&>mark]:bg-primary/15',
    itemDescription: 'truncate text-muted [&>mark]:text-primary [&>mark]:bg-primary/15'
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
        itemLeadingChip: 'size-4',
        itemTrailing: 'gap-1',
        itemTrailingIcon: 'size-4',
        itemTrailingHighlightedIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5'
      },
      sm: {
        input: '[&>input]:h-11',
        empty: 'py-4 text-xs',
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingChip: 'size-4',
        itemTrailing: 'gap-1.5',
        itemTrailingIcon: 'size-4',
        itemTrailingHighlightedIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5'
      },
      md: {
        input: '[&>input]:h-12',
        empty: 'py-6 text-sm',
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailing: 'gap-1.5',
        itemTrailingIcon: 'size-5',
        itemTrailingHighlightedIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5'
      },
      lg: {
        input: '[&>input]:h-13',
        empty: 'py-7 text-sm',
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailing: 'gap-2',
        itemTrailingIcon: 'size-5',
        itemTrailingHighlightedIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5'
      },
      xl: {
        input: '[&>input]:h-14',
        empty: 'py-8 text-base',
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingChip: 'size-6',
        itemTrailing: 'gap-2',
        itemTrailingIcon: 'size-6',
        itemTrailingHighlightedIcon: 'size-6',
        itemTrailingKbds: 'gap-0.5'
      }
    },
    active: {
      true: {
        item: 'text-highlighted before:bg-elevated',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: 'text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50 transition-colors before:transition-colors',
        itemLeadingIcon: 'text-dimmed group-data-highlighted:not-group-data-disabled:text-default transition-colors'
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
}
