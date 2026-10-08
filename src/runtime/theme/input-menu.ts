import input from './input'
import { fieldGroupVariant, fieldGroupVariantWithRoot } from './field-group'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    base: () => 'rounded-md text-strong transition-colors',
    trailing: 'group absolute inset-y-0 inset-e-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none',
    trailingClear: 'p-0',
    arrow: 'fill-bg stroke-default',
    content: 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] w-(--reka-combobox-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_100ms_var(--ease-out)] origin-(--reka-combobox-content-transform-origin) pointer-events-auto flex flex-col',
    viewport: 'relative scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    empty: 'text-center text-muted',
    label: 'font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted',
    tagsItem: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-strong bg-soft text-default data-disabled:cursor-not-allowed data-disabled:opacity-75',
    tagsItemText: 'truncate',
    tagsItemDelete: 'inline-flex items-center rounded-xs text-faint hover:text-default hover:bg-strong disabled:pointer-events-none transition-colors',
    tagsItemDeleteIcon: 'shrink-0',
    tagsInput: 'flex-1 border-0 bg-transparent placeholder:text-faint focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
  },
  variants: {
    // `root` and `base` are the same element in `multiple` mode, so the
    // `group-*` rounding utilities inherited from `input` never match there.
    // Keep the `group` marker here and pick the right rounding in
    // `compoundVariants` depending on `multiple`.
    fieldGroup: {
      horizontal: () => ({ root: fieldGroupVariantWithRoot.fieldGroup.horizontal.root }),
      vertical: () => ({ root: fieldGroupVariantWithRoot.fieldGroup.vertical.root })
    },
    virtualize: {
      true: {
        viewport: 'p-1 isolate'
      },
      false: {
        viewport: 'divide-y divide-default'
      }
    },
    multiple: {
      true: {
        root: 'flex-wrap'
      },
      false: {
        base: 'w-full border-0 placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-75'
      }
    },
    size: {
      xs: {
        content: '[--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        tagsItem: 'text-[10px]/3',
        tagsItemDeleteIcon: 'size-3',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-xs'
      },
      sm: {
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-[10px]/3 gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        tagsItem: 'text-[10px]/3',
        tagsItemDeleteIcon: 'size-3',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-xs'
      },
      md: {
        content: '[--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        tagsItem: 'text-xs',
        tagsItemDeleteIcon: 'size-3.5',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-sm'
      },
      lg: {
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-xs gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        tagsItem: 'text-xs',
        tagsItemDeleteIcon: 'size-3.5',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-sm'
      },
      xl: {
        content: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        label: 'px-(--ui-control-px) py-(--ui-control-py) text-sm gap-(--ui-control-gap)',
        item: 'px-(--ui-control-px) py-(--ui-control-py) text-base gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon)',
        itemLeadingChip: 'size-(--ui-control-icon)',
        itemTrailingIcon: 'size-(--ui-control-icon)',
        tagsItem: 'text-sm',
        tagsItemDeleteIcon: 'size-4',
        empty: 'px-[calc(var(--ui-control-px)+(--spacing(1)))] py-[calc(var(--ui-control-py)+(--spacing(1)))] text-base'
      }
    }
  },
  compoundVariants: [{
    multiple: false,
    fieldGroup: 'horizontal',
    class: { base: fieldGroupVariantWithRoot.fieldGroup.horizontal.base }
  }, {
    multiple: false,
    fieldGroup: 'vertical',
    class: { base: fieldGroupVariantWithRoot.fieldGroup.vertical.base }
  }, {
    multiple: true,
    fieldGroup: 'horizontal',
    class: fieldGroupVariant.fieldGroup.horizontal
  }, {
    multiple: true,
    fieldGroup: 'vertical',
    class: fieldGroupVariant.fieldGroup.vertical
  }, {
    variant: 'soft',
    multiple: true,
    class: { base: 'has-focus:bg-soft has-focus-visible:outline-3' }
  }, {
    variant: 'ghost',
    multiple: true,
    class: { base: 'has-focus:bg-soft has-focus-visible:outline-3' }
  }, {
    multiple: true,
    variant: ['outline', 'subtle'],
    class: { base: 'has-focus-visible:outline-3 has-focus-visible:ring-accent' }
  }]
})
