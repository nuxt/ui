import { colorVariant } from './color'
import { fieldGroupVariantWithHiddenInput } from './field-group'
import { defineTheme } from '../utils/theme'

// `base` is the box, the `<button>` of the trigger
export default defineTheme({
  slots: {
    base: 'group relative inline-flex items-center rounded-md text-strong disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity) transition-colors',
    // The invisible character gives the leading the baseline of the text, see `input.ts`
    leading: `flex items-center before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'ms-auto flex items-center',
    trailingIcon: 'shrink-0 text-faint',
    value: 'truncate pointer-events-none',
    placeholder: 'truncate text-faint',
    arrow: 'fill-bg stroke-default',
    content: 'max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-overlay shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto data-[state=closed]:pointer-events-none! flex flex-col',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1',
    group: 'p-1 isolate',
    label: 'font-semibold text-strong',
    separator: '-mx-1 my-1 h-px bg-border',
    item: 'group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity) text-default data-highlighted:not-data-disabled:text-strong data-highlighted:not-data-disabled:before:bg-tint transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-faint group-data-highlighted:not-group-data-disabled:text-default transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingChip: 'shrink-0',
    itemTrailing: 'ms-auto inline-flex gap-(--ui-control-gap) items-center',
    itemTrailingIcon: 'shrink-0',
    itemWrapper: 'flex-1 flex flex-col min-w-0',
    itemLabel: 'truncate',
    itemDescription: 'truncate text-muted'
  },
  variants: {
    ...fieldGroupVariantWithHiddenInput,
    variant: {
      outline: { base: 'bg-default hover:bg-soft disabled:bg-default ring ring-inset ring-strong outline-accent-focus focus-visible:outline-(length:--ui-focus-width) focus-visible:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint outline-accent-focus focus-visible:outline-(length:--ui-focus-width)' },
      subtle: { base: 'bg-soft hover:bg-strong/75 disabled:bg-soft ring ring-inset ring-strong outline-accent-focus focus-visible:outline-(length:--ui-focus-width) focus-visible:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus focus-visible:outline-(length:--ui-focus-width)' },
      none: { base: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ base: '' }),
    size: {
      xs: {
        content: '[--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        base: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--ui-control-text-xs)+var(--ui-control-text-step,0px))]/(--ui-control-text-xs--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xs)-0.125rem)]/[calc(var(--ui-control-text-xs--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        content: '[--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        base: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--ui-control-text-sm)+var(--ui-control-text-step,0px))]/(--ui-control-text-sm--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-sm)-0.125rem)]/[calc(var(--ui-control-text-sm--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        content: '[--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        base: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/(--ui-control-text-md--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-md)-0.125rem)]/[calc(var(--ui-control-text-md--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        content: '[--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        base: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/(--ui-control-text-lg--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-lg)-0.125rem)]/[calc(var(--ui-control-text-lg--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        content: '[--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        base: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        label: 'p-(--ui-control-py) text-[calc(var(--ui-control-text-xl)-0.125rem)]/[calc(var(--ui-control-text-xl--line-height)-0.25rem)] gap-(--ui-control-gap)',
        item: 'p-(--ui-control-py) text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        itemLeadingIcon: 'size-(--ui-control-icon-size)',
        itemLeadingChip: 'size-(--ui-control-icon-size)',
        itemTrailingIcon: 'size-(--ui-control-icon-size)'
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
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline',
    position: 'popper'
  }
})
