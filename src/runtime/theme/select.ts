import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

// The trigger is a single `<button>`: `base` is the box, with the tokens, the
// padding and the gap of the size, and the leading and the trailing in its flow
export default defineTheme({
  slots: {
    base: 'group relative inline-flex items-center rounded-md text-strong disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    // The box sits on a line of text by its first item: an invisible character
    // gives the leading the baseline of the text, so an icon doesn't move the box
    leading: `flex items-center before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    // At the end of the box, whatever sits between the two
    trailing: 'ms-auto flex items-center',
    trailingIcon: 'shrink-0 text-faint',
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
    variant: {
      outline: { base: 'bg-default hover:bg-soft disabled:bg-default ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint outline-accent-focus focus-visible:outline-3' },
      subtle: { base: 'bg-soft hover:bg-strong/75 disabled:bg-soft ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus focus-visible:outline-3' },
      none: { base: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ base: '' }),
    size: {
      xs: {
        base: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        label: 'p-1 text-[10px]/3 gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingChip: 'size-4',
        itemTrailingIcon: 'size-4',
        empty: 'p-2 text-xs'
      },
      sm: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingChip: 'size-4',
        itemTrailingIcon: 'size-4',
        empty: 'p-2.5 text-xs'
      },
      md: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailingIcon: 'size-5',
        empty: 'p-2.5 text-sm'
      },
      lg: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingChip: 'size-5',
        itemTrailingIcon: 'size-5',
        empty: 'p-3 text-sm'
      },
      xl: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingChip: 'size-6',
        itemTrailingIcon: 'size-6',
        empty: 'p-3 text-base'
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
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    // The component turns it off on the trailing icon when the leading one is the loading icon
    loading: {
      true: {
        leadingIcon: 'animate-spin',
        trailingIcon: 'animate-spin'
      }
    },
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    }
  },
  compoundVariants: [{
    fixed: false,
    size: 'xs',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'sm',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'md',
    class: { base: 'md:text-sm' }
  }, {
    fixed: false,
    size: 'lg',
    class: { base: 'md:text-sm' }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline',
    position: 'popper'
  }
})
