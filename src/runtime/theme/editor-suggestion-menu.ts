import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    content: 'min-w-48 max-w-60 max-h-96 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-dropdown-menu-content-transform-origin) flex flex-col',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    label: 'w-full flex items-center font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0 flex items-center justify-center',
    itemLeadingAvatar: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    itemLabelExternalIcon: 'inline-block size-3 align-top text-faint'
  },
  variants: {
    size: {
      xs: {
        content: '[--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon) text-sm'
      },
      sm: {
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon) text-sm'
      },
      md: {
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon) text-base'
      },
      lg: {
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon) text-base'
      },
      xl: {
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-base gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon) text-xl'
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
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
