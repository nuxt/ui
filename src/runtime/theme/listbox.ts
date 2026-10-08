import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 ring ring-inset ring-default rounded-lg overflow-hidden outline-accent-focus has-focus-visible:outline-3 has-focus-visible:ring-accent',
    input: 'border-b border-default',
    content: 'relative overflow-y-auto flex-1 max-h-60 scroll-py-1 focus:outline-none',
    group: 'p-1 isolate',
    label: 'font-semibold text-strong px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    separator: '-mx-1 my-1 h-px bg-border',
    empty: 'text-center text-muted',
    loading: 'flex items-center justify-center text-muted',
    loadingIcon: 'animate-spin shrink-0 size-(--ui-control-icon)',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors size-(--ui-control-icon)',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0 size-(--ui-control-icon)',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0 size-(--ui-control-icon)'
  },
  variants: {
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        label: 'text-[10px]/3',
        empty: 'py-3 text-xs',
        loading: 'py-3',
        item: 'text-xs'
      },
      sm: {
        root: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        label: 'text-[10px]/3',
        empty: 'py-4 text-xs',
        loading: 'py-4',
        item: 'text-xs'
      },
      md: {
        root: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        label: 'text-xs',
        empty: 'py-6 text-sm',
        loading: 'py-6',
        item: 'text-sm'
      },
      lg: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        label: 'text-xs',
        empty: 'py-7 text-sm',
        loading: 'py-7',
        item: 'text-sm'
      },
      xl: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        label: 'text-sm',
        empty: 'py-8 text-base',
        loading: 'py-8',
        item: 'text-base',
        itemDescription: 'text-sm'
      }
    },
    color: colorVariant({ root: '' }),
    virtualize: {
      true: {
        content: 'p-1 isolate'
      },
      false: {
        content: 'divide-y divide-default'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed'
      }
    },
    highlight: {
      true: {
        root: 'ring ring-inset ring-accent'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
