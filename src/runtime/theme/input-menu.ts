import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    // With `multiple`, the disabled state is on the tags container
    root: (prev: string) => [prev, 'has-[>[data-disabled]]:cursor-not-allowed has-[>[data-disabled]]:opacity-(--ui-disabled-opacity)'],
    // The tags wrap in their own container, so the leading and the trailing stay
    // centered on the box whatever its number of lines
    tags: 'flex flex-wrap items-center flex-1 min-w-0 gap-(--ui-control-gap) px-(--ui-control-px) py-(--ui-control-py)',
    trailing: () => 'group flex items-center pe-(--ui-control-px) disabled:cursor-not-allowed focus:outline-none',
    trailingClear: 'p-0',
    arrow: 'fill-bg stroke-default',
    content: 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] w-(--reka-combobox-trigger-width) bg-overlay shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-combobox-content-transform-origin) pointer-events-auto flex flex-col cursor-default',
    viewport: 'relative scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    empty: 'text-center text-muted',
    label: 'font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity) text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    tagsItem: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-strong bg-soft text-default data-disabled:cursor-not-allowed',
    tagsItemText: 'truncate',
    tagsItemDelete: 'inline-flex items-center rounded-xs text-faint hover:text-default hover:bg-strong disabled:pointer-events-none transition-colors',
    tagsItemDeleteIcon: 'shrink-0'
  },
  variants: {
    // The input takes the focus, up to two levels down from the box
    variant: {
      outline: { root: () => 'bg-default ring ring-inset ring-strong outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width) has-[input:focus-visible]:ring-accent' },
      soft: { root: () => 'bg-tint hover:bg-soft has-[input:focus]:bg-soft has-[input:disabled]:bg-tint outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width)' },
      subtle: { root: () => 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width) has-[input:focus-visible]:ring-accent' },
      ghost: { root: () => 'bg-transparent hover:bg-soft has-[input:focus]:bg-soft has-[input:disabled]:bg-transparent dark:has-[input:disabled]:bg-transparent outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width)' }
    },
    // Next to a leading or a trailing, the padding of the container is the gap to it
    leading: {
      true: { tags: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { tags: 'pe-(--ui-control-gap)' }
    },
    virtualize: {
      true: {
        viewport: 'p-1 isolate'
      },
      false: {
        viewport: 'divide-y divide-default'
      }
    },
    // With `multiple`, the tags container has the padding and the input wraps
    // under the tags when it runs out of room
    multiple: {
      true: { base: 'p-0 min-w-auto' },
      false: ''
    },
    size: {
      xs: {
        label: 'p-1 text-[10px]/3 gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingChip: 'size-4',
        itemTrailingIcon: 'size-4',
        tagsItem: 'text-[10px]/3',
        tagsItemDeleteIcon: 'size-3',
        empty: 'p-2 text-xs'
      },
      sm: {
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingChip: 'size-4',
        itemTrailingIcon: 'size-4',
        tagsItem: 'text-[10px]/3',
        tagsItemDeleteIcon: 'size-3',
        empty: 'p-2.5 text-xs'
      },
      md: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailingIcon: 'size-5',
        tagsItem: 'text-xs',
        tagsItemDeleteIcon: 'size-3.5',
        empty: 'p-2.5 text-sm'
      },
      lg: {
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailingIcon: 'size-5',
        tagsItem: 'text-xs',
        tagsItemDeleteIcon: 'size-3.5',
        empty: 'p-3 text-sm'
      },
      xl: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingChip: 'size-6',
        itemTrailingIcon: 'size-6',
        tagsItem: 'text-sm',
        tagsItemDeleteIcon: 'size-4',
        empty: 'p-3 text-base'
      }
    }
  }
})
