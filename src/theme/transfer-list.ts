import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-stretch gap-3 min-w-0',
    list: 'flex flex-col flex-1 basis-0 min-w-0 min-h-0 ring ring-inset ring-default rounded-lg overflow-hidden',
    header: 'flex items-center border-b border-default',
    headerCheckbox: 'shrink-0',
    headerLabel: 'flex-1 min-w-0 truncate font-medium text-highlighted',
    headerCount: 'shrink-0 tabular-nums text-muted',
    listbox: 'flex flex-col flex-1 min-h-0',
    input: 'border-b border-default',
    content: 'relative overflow-y-auto flex-1 h-60 p-1 isolate scroll-py-1 focus:outline-none',
    empty: 'flex items-center justify-center h-full text-center text-muted',
    controls: 'flex flex-col items-center justify-center gap-2 shrink-0',
    control: '',
    item: ['group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
    itemLeadingIcon: ['shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors'],
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemLeadingChip: 'shrink-0',
    itemLeadingChipSize: '',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0'
  },
  variants: {
    size: {
      xs: {
        header: 'px-2 py-1 gap-1.5 text-xs',
        empty: 'py-3 text-xs',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailingIcon: 'size-4'
      },
      sm: {
        header: 'px-2.5 py-1.5 gap-1.5 text-xs',
        empty: 'py-4 text-xs',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailingIcon: 'size-4'
      },
      md: {
        header: 'px-2.5 py-2 gap-2 text-sm',
        empty: 'py-6 text-sm',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailingIcon: 'size-5'
      },
      lg: {
        header: 'px-3 py-2 gap-2 text-sm',
        empty: 'py-7 text-sm',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailingIcon: 'size-5'
      },
      xl: {
        header: 'px-3 py-2.5 gap-2.5 text-base',
        empty: 'py-8 text-base',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemLeadingChip: 'size-6',
        itemLeadingChipSize: 'lg',
        itemTrailingIcon: 'size-6',
        itemDescription: 'text-sm'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        list: `outline-${color}/25 has-focus-visible:outline-3 has-focus-visible:ring-${color}`
      }])),
      neutral: {
        list: 'outline-inverted/25 has-focus-visible:outline-3 has-focus-visible:ring-inverted'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed'
      }
    },
    highlight: {
      true: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: {
      list: `ring ring-inset ring-${color}`
    }
  })), {
    color: 'neutral',
    highlight: true,
    class: {
      list: 'ring ring-inset ring-inverted'
    }
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
