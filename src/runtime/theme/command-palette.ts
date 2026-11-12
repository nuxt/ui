import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0',
    // A field as large as the highlight of an item, 1px inside the item: its padding
    // is theirs less that 1px, so its icon and text line up with them
    filter: 'mx-[calc(--spacing(1)+1px)] mt-[calc(--spacing(1)+1px)]',
    // The buttons take back the inset of the field and lose the same 1px, so they keep
    // its height and their icon sits where the search icon does
    close: '-me-1 p-[calc(var(--ui-control-py)-1px)]',
    back: '-ms-1 p-[calc(var(--ui-control-py)-1px)]',
    content: 'relative overflow-hidden flex flex-col',
    footer: 'p-1 border-t border-default',
    viewport: 'relative scroll-py-1 overflow-y-auto flex-1 focus:outline-none',
    group: 'p-1 isolate',
    empty: 'text-center text-muted',
    label: 'font-semibold text-strong',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity)',
    itemLeadingIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingHighlightedIcon: 'shrink-0 text-faint hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate space-x-1 text-faint',
    itemLabelBase: 'text-strong [&>mark]:text-primary [&>mark]:bg-primary/15',
    itemLabelPrefix: 'text-default',
    itemLabelSuffix: 'text-faint [&>mark]:text-primary [&>mark]:bg-primary/15',
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
        content: '[--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        filter: '[--ui-control-px:calc(var(--ui-control-py-xs)-1px)] [--ui-control-py:calc(var(--ui-control-py-xs)-1px-var(--ui-control-text-step,0px)/2)]',
        empty: 'py-3 text-xs',
        label: 'px-(--ui-control-py) py-[calc(var(--ui-control-py)-(var(--ui-control-text-xs--leading)-var(--ui-control-text-xs--line-height))/2)] text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--leading)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-xs--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailing: 'gap-(--ui-control-gap)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingHighlightedIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      sm: {
        content: '[--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        filter: '[--ui-control-px:calc(var(--ui-control-py-sm)-1px)] [--ui-control-py:calc(var(--ui-control-py-sm)-1px-var(--ui-control-text-step,0px)/2)]',
        empty: 'py-4 text-xs',
        label: 'px-(--ui-control-py) py-[calc(var(--ui-control-py)-(var(--ui-control-text-sm--leading)-var(--ui-control-text-sm--line-height))/2)] text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--leading)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-sm--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailing: 'gap-(--ui-control-gap)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingHighlightedIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      md: {
        content: '[--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        filter: '[--ui-control-px:calc(var(--ui-control-py-md)-1px)] [--ui-control-py:calc(var(--ui-control-py-md)-1px-var(--ui-control-text-step,0px)/2)]',
        empty: 'py-6 text-sm',
        label: 'px-(--ui-control-py) py-[calc(var(--ui-control-py)-(var(--ui-control-text-md--leading)-var(--ui-control-text-md--line-height))/2)] text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--leading)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-md--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailing: 'gap-(--ui-control-gap)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingHighlightedIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      lg: {
        content: '[--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        filter: '[--ui-control-px:calc(var(--ui-control-py-lg)-1px)] [--ui-control-py:calc(var(--ui-control-py-lg)-1px-var(--ui-control-text-step,0px)/2)]',
        empty: 'py-7 text-sm',
        label: 'px-(--ui-control-py) py-[calc(var(--ui-control-py)-(var(--ui-control-text-lg--leading)-var(--ui-control-text-lg--line-height))/2)] text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--leading)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-lg--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailing: 'gap-(--ui-control-gap)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingHighlightedIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      xl: {
        content: '[--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        filter: '[--ui-control-px:calc(var(--ui-control-py-xl)-1px)] [--ui-control-py:calc(var(--ui-control-py-xl)-1px)]',
        empty: 'py-8 text-base',
        label: 'px-(--ui-control-py) py-[calc(var(--ui-control-py)-(var(--ui-control-text-xl--leading)-var(--ui-control-text-xl--line-height))/2)] text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--leading)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-xl--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailing: 'gap-(--ui-control-gap)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingHighlightedIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      }
    },
    active: {
      true: {
        item: 'text-strong before:bg-soft',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: 'text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
        itemLeadingIcon: 'text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors'
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
