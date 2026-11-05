import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 ring ring-inset ring-default rounded-lg overflow-hidden outline-accent-focus has-focus-visible:outline-(length:--ui-focus-width) has-focus-visible:ring-accent',
    filter: 'rounded-none border-b border-default',
    content: 'relative overflow-y-auto flex-1 max-h-60 scroll-py-1 focus:outline-none',
    group: 'p-1 isolate',
    label: 'font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    empty: 'text-center text-muted',
    loading: 'flex items-center justify-center text-muted',
    loadingIcon: 'animate-spin shrink-0',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity) text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemTrailing: 'ms-auto inline-flex gap-(--ui-control-gap) items-center',
    itemTrailingIcon: 'shrink-0'
  },
  variants: {
    size: {
      xs: {
        content: '[--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--line-height)-0.25rem)] gap-(--ui-control-gap)',
        empty: 'py-3 text-xs',
        loading: 'py-3',
        loadingIcon: 'size-(--ui-control-icon-size)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-xs--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        content: '[--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--line-height)-0.25rem)] gap-(--ui-control-gap)',
        empty: 'py-4 text-xs',
        loading: 'py-4',
        loadingIcon: 'size-(--ui-control-icon-size)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-sm--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        content: '[--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--line-height)-0.25rem)] gap-(--ui-control-gap)',
        empty: 'py-6 text-sm',
        loading: 'py-6',
        loadingIcon: 'size-(--ui-control-icon-size)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-md--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        content: '[--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--line-height)-0.25rem)] gap-(--ui-control-gap)',
        empty: 'py-7 text-sm',
        loading: 'py-7',
        loadingIcon: 'size-(--ui-control-icon-size)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-lg--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        content: '[--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--line-height)-0.25rem)] gap-(--ui-control-gap)',
        empty: 'py-8 text-base',
        loading: 'py-8',
        loadingIcon: 'size-(--ui-control-icon-size)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
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
        root: 'opacity-(--ui-disabled-opacity) cursor-not-allowed'
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
