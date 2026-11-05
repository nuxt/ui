import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    // With `multiple`, the disabled state is on the tags container
    root: (prev: string) => [prev, 'has-[>[data-disabled]]:cursor-not-allowed has-[>[data-disabled]]:opacity-(--ui-disabled-opacity)'],
    // The tags wrap in their own container, so the leading and the trailing stay
    // centered on the box whatever its number of lines
    // The tags sit on the reading line, so their row gives back the difference,
    // and keeps the height of the field when it only holds the input
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
        content: '[--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-xs--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        tags: 'min-h-[calc(var(--ui-control-text-xs--line-height)+var(--ui-control-text-step,0px)+2*var(--ui-control-py))] py-[calc(var(--ui-control-py)-(var(--ui-control-text-xs--leading)-var(--ui-control-text-xs--line-height))/2)]',
        tagsItem: 'text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--leading)-0.25rem)]',
        tagsItemDeleteIcon: 'size-(--ui-control-text-xs)',
        empty: 'p-2 text-xs'
      },
      sm: {
        content: '[--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-sm--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        tags: 'min-h-[calc(var(--ui-control-text-sm--line-height)+var(--ui-control-text-step,0px)+2*var(--ui-control-py))] py-[calc(var(--ui-control-py)-(var(--ui-control-text-sm--leading)-var(--ui-control-text-sm--line-height))/2)]',
        tagsItem: 'text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--leading)-0.25rem)]',
        tagsItemDeleteIcon: 'size-(--ui-control-text-sm)',
        empty: 'p-2.5 text-xs'
      },
      md: {
        content: '[--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-md--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        tags: 'min-h-[calc(var(--ui-control-text-md--line-height)+var(--ui-control-text-step,0px)+2*var(--ui-control-py))] py-[calc(var(--ui-control-py)-(var(--ui-control-text-md--leading)-var(--ui-control-text-md--line-height))/2)]',
        tagsItem: 'text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--leading)-0.25rem)]',
        tagsItemDeleteIcon: 'size-(--ui-control-text-md)',
        empty: 'p-2.5 text-sm'
      },
      lg: {
        content: '[--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-lg--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        tags: 'min-h-[calc(var(--ui-control-text-lg--line-height)+var(--ui-control-text-step,0px)+2*var(--ui-control-py))] py-[calc(var(--ui-control-py)-(var(--ui-control-text-lg--leading)-var(--ui-control-text-lg--line-height))/2)]',
        tagsItem: 'text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--leading)-0.25rem)]',
        tagsItemDeleteIcon: 'size-(--ui-control-text-lg)',
        empty: 'p-3 text-sm'
      },
      xl: {
        content: '[--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        itemDescription: 'leading-(--ui-control-text-xl--leading)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)',
        tags: 'min-h-[calc(var(--ui-control-text-xl--line-height)+var(--ui-control-text-step,0px)+2*var(--ui-control-py))] py-[calc(var(--ui-control-py)-(var(--ui-control-text-xl--leading)-var(--ui-control-text-xl--line-height))/2)]',
        tagsItem: 'text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--leading)-0.25rem)]',
        tagsItemDeleteIcon: 'size-(--ui-control-text-xl)',
        empty: 'p-3 text-base'
      }
    }
  }
})
