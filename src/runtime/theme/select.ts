import input from './input'
import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    root: () => undefined,
    base: () => 'relative group rounded-md inline-flex items-center text-strong disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    value: 'truncate pointer-events-none',
    placeholder: 'truncate text-faint',
    arrow: 'fill-bg stroke-default',
    content: 'max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto data-[state=closed]:pointer-events-none! flex flex-col',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    empty: 'text-center text-muted',
    label: 'font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted'
  },
  variants: {
    ...fieldGroupVariant,
    // No `root` slot here, so the color and the size tokens go on `base`
    color: () => colorVariant({ base: '' }),
    variant: (prev: typeof input.variants.variant) => ({
      ...prev,
      outline: {
        base: [prev.outline!.base, 'hover:bg-soft disabled:bg-default'].join(' ')
      },
      subtle: {
        base: [prev.subtle!.base, 'hover:bg-strong/75 disabled:bg-soft'].join(' ')
      }
    }),
    size: {
      xs: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.xs.root],
        content: '[--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-xs'
      },
      sm: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.sm.root],
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-xs'
      },
      md: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.md.root],
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-sm'
      },
      lg: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.lg.root],
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-sm'
      },
      xl: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.xl.root],
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-base gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-base'
      }
    },
    position: {
      'popper': {
        content: 'data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)]'
      },
      'item-aligned': {
        content: ''
      }
    },
    multiple: {
      true: ''
    }
  },
  defaultVariants: {
    position: 'popper'
  }
})
