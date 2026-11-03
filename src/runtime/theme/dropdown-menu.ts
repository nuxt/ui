import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    content: 'min-w-32 max-h-(--reka-dropdown-menu-content-available-height) bg-overlay shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col',
    filter: 'rounded-none border-b border-default',
    empty: 'text-center text-muted',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    arrow: 'fill-bg stroke-default',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity)',
    itemLeadingIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemLabelExternalIcon: 'inline-block size-3 align-top text-faint'
  },
  variants: {
    color: colorVariant({ item: '', label: '' }),
    active: {
      true: {
        item: 'text-accent before:bg-accent-soft',
        itemLeadingIcon: 'text-accent-default'
      },
      false: {
        item: 'text-accent-default data-highlighted:text-accent data-[state=open]:text-accent data-highlighted:before:bg-accent-tint data-[state=open]:before:bg-accent-tint transition-colors before:transition-colors',
        itemLeadingIcon: 'text-accent-faint group-data-highlighted:text-accent-default group-data-[state=open]:text-accent-default transition-colors'
      }
    },
    loading: {
      true: {
        itemLeadingIcon: 'animate-spin'
      }
    },
    size: {
      xs: {
        content: '[--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        empty: 'p-2 text-xs',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      sm: {
        content: '[--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        empty: 'p-2.5 text-xs',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      md: {
        content: '[--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        empty: 'p-2.5 text-sm',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-0.5'
      },
      lg: {
        content: '[--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        empty: 'p-3 text-sm',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-1'
      },
      xl: {
        content: '[--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        empty: 'p-3 text-base',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        itemTrailingKbds: 'gap-1'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
})
