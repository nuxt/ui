import { defineTheme } from '../utils/theme'

export default defineTheme({
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
    label: 'font-semibold text-strong px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    itemLeadingIcon: 'shrink-0 size-(--ui-control-icon)',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0 size-(--ui-control-icon)',
    itemTrailing: 'ms-auto inline-flex items-center gap-(--ui-control-gap)',
    itemTrailingIcon: 'shrink-0 size-(--ui-control-icon)',
    itemTrailingHighlightedIcon: 'shrink-0 text-faint hidden group-data-highlighted:inline-flex size-(--ui-control-icon)',
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
        root: '[--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        input: '[&>input]:h-10',
        empty: 'py-3 text-xs',
        label: 'text-[10px]/3',
        item: 'text-xs',
        itemTrailingKbds: 'gap-0.5'
      },
      sm: {
        root: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        input: '[&>input]:h-11',
        empty: 'py-4 text-xs',
        label: 'text-[10px]/3',
        item: 'text-xs',
        itemTrailingKbds: 'gap-0.5'
      },
      md: {
        root: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        input: '[&>input]:h-12',
        empty: 'py-6 text-sm',
        label: 'text-xs',
        item: 'text-sm',
        itemTrailingKbds: 'gap-0.5'
      },
      lg: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        input: '[&>input]:h-13',
        empty: 'py-7 text-sm',
        label: 'text-xs',
        item: 'text-sm',
        itemTrailingKbds: 'gap-0.5'
      },
      xl: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        input: '[&>input]:h-14',
        empty: 'py-8 text-base',
        label: 'text-sm',
        item: 'text-base',
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
