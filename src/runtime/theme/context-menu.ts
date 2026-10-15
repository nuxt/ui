import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    content: 'min-w-32 max-h-(--reka-context-menu-content-available-height) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-context-menu-content-transform-origin) flex flex-col',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
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
        label: 'p-1 text-xs gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5'
      },
      sm: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemTrailingIcon: 'size-4',
        itemTrailingKbds: 'gap-0.5'
      },
      md: {
        label: 'p-1.5 text-sm gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-0.5'
      },
      lg: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemTrailingIcon: 'size-5',
        itemTrailingKbds: 'gap-1'
      },
      xl: {
        label: 'p-2 text-base gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemTrailingIcon: 'size-6',
        itemTrailingKbds: 'gap-1'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
})
